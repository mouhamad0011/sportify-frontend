import React from 'react';
import ReactDOM from 'react-dom/client';
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
import Profile from './Profile';
import { useAuthContext } from "./UseAuthContext";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  const { user } = useAuthContext();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Admin/AllCoaches" element={(user && user.user.role.toLowerCase() === "admin") ? <Admin1 /> : <Login />} />
        <Route path="/Admin/AllTrainees" element={(user && user.user.role.toLowerCase() === "admin") ? <Admin2 /> : <Login />} />
        <Route path="/Admin/AllCourses" element={(user && user.user.role.toLowerCase() === "admin") ? <Admin3 /> : <Login />} />
        <Route path="/Admin/AllClasses" element={(user && user.user.role.toLowerCase() === "admin") ? <Admin4 /> : <Login />} />
        <Route path="/Coach/YourCourses" element={(user && user.user.role.toLowerCase() === "coach") ? <Coach1 /> : <Login />} />
        <Route path="/Coach/YourClasses" element={(user && user.user.role.toLowerCase() === "coach") ? <Coach2 /> : <Login />} />
        <Route path="/Coach/Quizzes" element={(user && user.user.role.toLowerCase() === "coach") ? <Coach3 /> : <Login />} />
        <Route path="/Trainee/AllCourses" element={(user && user.user.role.toLowerCase() === "trainee") ? <Trainee1 /> : <Login />} />
        <Route path="/Trainee/YourClasses" element={(user && user.user.role.toLowerCase() === "trainee") ? <Trainee2 /> : <Login />} />
        <Route path="/Trainee/Quizzes" element={(user && user.user.role.toLowerCase() === "trainee") ? <Trainee3 /> : <Login />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;