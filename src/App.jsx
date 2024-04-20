import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Interview from './components/Interview/Interview';
import Demo from './components/demoPDF/Demo';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Interview />}/> 
      <Route path="/demo" element={<Demo/>}/>
    </Routes>
  );
}

export default App;