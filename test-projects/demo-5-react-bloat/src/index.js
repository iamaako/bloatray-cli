// Only using react, react-dom, react-router-dom, and clsx
// Everything else (framer-motion, react-icons, react-hook-form, etc.) is bloat
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import clsx from 'clsx';

function App() {
  const isActive = true;
  return (
    <BrowserRouter>
      <div className={clsx('app', { active: isActive })}>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/about" element={<h1>About</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
