import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './Login';
import Admin1 from './Admin1Dashboard';
import Admin2 from './Admin2Dashboard';
import Admin3 from './Admin3Dashboard';
import Admin4 from './Admin4Dashboard';
import Coach1 from './Coach1Dashboard';
import Coach2 from './Coach2Dashboard';
import Coach3 from './Coach3Dashboard';
import Trainee1 from './Trainee1Dashboard';
import Trainee2 from './Trainee2Dashboard';
import Trainee3 from './Trainee3Dashboard';
import Homepage from './Homepage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homepage/>} />
      <Route path="/Login" element={<Login/>} />
      <Route path="/Admin/AllCoaches" element={<Admin1/>} />
      <Route path="/Admin/AllTrainees" element={<Admin2/>} />
      <Route path="/Admin/AllCourses" element={<Admin3/>} />
      <Route path="/Admin/AllClasses" element={<Admin4/>} />
      <Route path="/Coach/YourCourses" element={<Coach1/>} />
      <Route path="/Coach/YourClasses" element={<Coach2/>} />
      <Route path="/Coach/Quizzes" element={<Coach3/>} />
      <Route path="/Trainee/AllCourses" element={<Trainee1/>} />
      <Route path="/Trainee/YourClasses" element={<Trainee2/>} />
      <Route path="/Trainee/Quizzes" element={<Trainee3/>} />
    </Routes>
  </BrowserRouter>
);
