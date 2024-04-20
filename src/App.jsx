import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Interview from './components/Interview/Interview';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Interview />}/> 
      <Route path="/login" element={<Login />}/> 
      <Route path="/signup" element={<Signup />}/> 
    </Routes>
  );
}

export default App;