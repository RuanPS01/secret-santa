import {
  doc,
  collection,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
  DocumentData,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface IParticipant {
  id: string;
  name: string;
  password?: string;
  assignedTo?: string;
  hasSetPassword: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISecretSanta {
  id: string;
  name: string;
  participants: IParticipant[];
  createdAt: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = "secret-santas";

const fromFirestore = (data: DocumentData): ISecretSanta => {
  return {
    ...data,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
    participants:
      data.participants?.map((p: any) => ({
        ...p,
        createdAt: p.createdAt?.toDate(),
        updatedAt: p.updatedAt?.toDate(),
      })) || [],
  } as ISecretSanta;
};

const toFirestore = (data: Partial<ISecretSanta>) => {
  const result: any = { ...data };
  if (data.createdAt) {
    result.createdAt = Timestamp.fromDate(data.createdAt);
  }
  if (data.updatedAt) {
    result.updatedAt = Timestamp.fromDate(data.updatedAt);
  }
  if (data.participants) {
    result.participants = data.participants.map((p) => ({
      ...p,
      createdAt: p.createdAt ? Timestamp.fromDate(p.createdAt) : null,
      updatedAt: p.updatedAt ? Timestamp.fromDate(p.updatedAt) : null,
    }));
  }
  return result;
};

export class SecretSantaModel {
  static async findAll(): Promise<ISecretSanta[]> {
    const collectionRef = collection(db, COLLECTION_NAME);
    const querySnapshot = await getDocs(collectionRef);
    const draws: ISecretSanta[] = [];

    querySnapshot.forEach((doc) => {
      draws.push(fromFirestore(doc.data()));
    });

    return draws;
  }
  static async create(
    data: Omit<ISecretSanta, "createdAt">
  ): Promise<ISecretSanta> {
    const now = new Date();
    const documentData: ISecretSanta = {
      ...data,
      participants: data.participants || [],
      createdAt: now,
      updatedAt: now,
    };

    const docRef = doc(db, COLLECTION_NAME, data.id);
    await setDoc(docRef, toFirestore(documentData));

    return documentData;
  }

  static async findOne(
    filter: Partial<ISecretSanta>
  ): Promise<ISecretSanta | null> {
    // Se temos um ID, usamos getDoc
    if ("id" in filter) {
      const docRef = doc(db, COLLECTION_NAME, filter.id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return fromFirestore(docSnap.data());
    }

    // Caso contrário, fazemos uma query
    const q = query(
      collection(db, COLLECTION_NAME),
      where("id", "==", filter.id)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;
    return fromFirestore(querySnapshot.docs[0].data());
  }

  static async findOneAndUpdate(
    filter: { id: string },
    update: any,
    options: { new?: boolean } = { new: true }
  ) {
    const docRef = doc(db, COLLECTION_NAME, filter.id);
    const now = new Date();

    // Primeiro obtemos o documento atual
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const currentData = fromFirestore(docSnap.data());
    let updateData: any = { updatedAt: Timestamp.fromDate(now) };

    // Processando $push
    if (update.$push?.participants) {
      updateData.participants = arrayUnion(
        toFirestore({ participants: [update.$push.participants] })
          .participants[0]
      );
    }

    // Processando $set
    if (update.$set) {
      const setData = toFirestore(update.$set);
      updateData = { ...updateData, ...setData };
    }

    // Processando $pull
    if (update.$pull?.participants) {
      const participant = update.$pull.participants;
      const updatedParticipants = currentData.participants.filter(
        (p) => p.id !== participant.id
      );
      updateData.participants = updatedParticipants.map(
        (p) => toFirestore({ participants: [p] }).participants[0]
      );
    }

    await updateDoc(docRef, updateData);

    if (options.new) {
      const newDocSnap = await getDoc(docRef);
      return fromFirestore(newDocSnap.data());
    }

    return currentData;
  }

  static async addParticipant(
    secretSantaId: string,
    participant: Omit<IParticipant, "createdAt">
  ) {
    const now = new Date();
    const participantWithTimestamps = {
      ...participant,
      createdAt: now,
      updatedAt: now,
    };

    return this.findOneAndUpdate(
      { id: secretSantaId },
      { $push: { participants: participantWithTimestamps } }
    );
  }

  static async updateParticipant(
    secretSantaId: string,
    participantId: string,
    data: Partial<IParticipant>
  ) {
    const docRef = doc(db, COLLECTION_NAME, secretSantaId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Secret Santa not found");
    }

    const now = new Date();
    const secretSanta = fromFirestore(docSnap.data());
    const updatedParticipants = secretSanta.participants.map((p) =>
      p.id === participantId ? { ...p, ...data, updatedAt: now } : p
    );

    await updateDoc(docRef, {
      participants: updatedParticipants.map(
        (p) => toFirestore({ participants: [p] }).participants[0]
      ),
      updatedAt: Timestamp.fromDate(now),
    });

    return { modifiedCount: 1 }; // Para compatibilidade com MongoDB
  }
}

// Funções de compatibilidade
export async function connectDB() {
  return Promise.resolve();
}

export async function disconnectDB() {
  return Promise.resolve();
}

export async function setupIndexes() {
  return Promise.resolve();
}
