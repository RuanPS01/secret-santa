import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Setup } from './pages/Setup';
import { Reveal } from './pages/Reveal';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/reveal" element={<Reveal />} />
      </Routes>
    </HashRouter>
  );
}

export default App;