import React, { useState, useEffect } from 'react';
import './App.css';
import './bootstrap.min.css';
import axios from 'axios';
import logo from './icons/logo.png';
import profile from './icons/profile.png';
import logout from './icons/logout.png';
import add from './icons/add.png';
import checked from './icons/checked.png';
import unchecked from './icons/unchecked.png';
import bin from './icons/bin.png';

function Trainee2Dashboard() {
  const [classData, setClassData] = useState([]);
  const [bool, setBool] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/enrollement/getEnrollementByTraineeId/2`)
      .then((response) => {
        setClassData(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [bool])

  const handleAttendance = (id) => {
    axios.put(`http://localhost:5000/enrollement/update/Mohammad Safa/1`)
      .then((response) => {
        console.log(response.data)
        setBool(!bool); 
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div className="dashboard">
      <div className='header d-flex align-items-center justify-content-between p-3'>
        <img className='header-logo' src={logo} alt='logo' />
        <p className='h3 fw-bold m-0'>Welcome trainee</p>
        <div className='profile-logout d-flex gap-3'>
          <img className='header-icon' src={profile} alt='profile' />
          <img className='header-icon' src={logout} alt='logout' />
        </div>
      </div>

      <br />

      <div className='container top-dashboard'>
        <p className='manage fw-bold font-italic fs-4'>MANAGE</p>
        <ul className="nav">
          <li className="nav-item">
            <a className="nav-link" aria-current="page" href="#">All courses</a>
          </li>
          <li className="nav-item nav-item-active">
            <a className="nav-link" href="#">Your classes</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Quizzes</a>
          </li>
        </ul>
      </div>

      <br />

      <table className="container table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Class</th>
            <th scope="col">Coach</th>
            <th scope="col">Date</th>
            <th scope="col">Hour</th>
            <th scope="col">Attendance</th>
          </tr>
        </thead>
        <tbody>
          {classData.map((course, index) => (
            <tr key={index}>
              <th scope="row">{course.class_id}</th>
              <td>{course.course_name}</td>
              <td>{course.full_name}</td>
              <td>{course.date}</td>
              <td>{course.hour}</td>
              <td>
                {course.present ? (
                  <img src={checked} alt="checked" onClick={handleAttendance} />
                ) : (
                  <img src={unchecked} alt="unchecked" onClick={handleAttendance} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Trainee2Dashboard;