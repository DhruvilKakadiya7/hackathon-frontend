import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Interview from './components/Interview/Interview';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />}/> 
      <Route path="/dashboard" element={<Dashboard />}/> 
      <Route path="/signup" element={<Signup />}/> 
      <Route path="/interview" element={<Interview />}/> 
    </Routes>
  );
}

export default App;