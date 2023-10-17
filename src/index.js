import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './Login';
import Admin1 from './Admin1Dashboard';
import Admin2 from './Admin2Dashboard';
import Admin3 from './Admin3Dashboard';
import Admin4 from './Admin4Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/Admin/AllCoaches" element={<Admin1/>} />
      <Route path="/Admin/AllTrainees" element={<Admin2/>} />
      <Route path="/Admin/AllCourses" element={<Admin3/>} />
      <Route path="/Admin/AllClasses" element={<Admin4/>} />
    </Routes>
  </BrowserRouter>
);
