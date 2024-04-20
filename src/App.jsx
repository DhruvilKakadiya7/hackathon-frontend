import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Interview from './components/Interview/Interview';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Interview />}/> 
    </Routes>
  );
}

export default App;