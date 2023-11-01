import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Dashboards.css';
import './bootstrap.min.css';
import logo from './icons/logo.png';
import profile from './icons/profile.png';
import logout from './icons/logout.png';
import add from './icons/add.png';
import checked from './icons/checked.png';
import bin from './icons/bin.png';

function Admin2Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminName = new URLSearchParams(location.search).get('adminName');
  const [traineeData, setTraineeData] = useState([]);
  const [newTraineeName, setNewTraineeName] = useState('');
  const [newTraineeUsername, setNewTraineeUsername] = useState('');
  const [newTraineeEmail, setNewTraineeEmail] = useState('');
  const [newTraineePassword, setNewTraineePassword] = useState('');
  const [newTraineeDate, setNewTraineeDate] = useState('');
  const [bool, setBool] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/users/getAllTrainees')
      .then(response => {
        const data = [response.data]
        setTraineeData(data[0]);
        console.log(data[0]);
      })
      .catch(error => {
        console.error(error);
      });
  }, [bool]);


  const handleAddTrainee = async (e) => {
    e.preventDefault();
    const emailTest = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const passwordTest = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // Ensure that the required fields are not empty
    if (
      newTraineeName.trim() === '' ||
      newTraineeUsername.trim() === '' ||
      newTraineePassword.trim() === '' ||
      newTraineeEmail.trim() === '' ||
      newTraineeDate.trim() === ''
    ) {
      alert('Please fill in all required fields (trainee Name, Username, Password, Email, Date).');
      return;
    }
    else if (!emailTest.test(newTraineeEmail)) {
      alert('Email does not exist');
      return;
    }
    else if (!passwordTest.test(newTraineePassword)) {
      alert('Your password should contain at least: one capital letter,one small letter,\n one digit,one symbol,and a minimum of eight characters');
      return;
    }
    const newTrainee = {
      role: 'trainee',
      full_name: newTraineeName,
      username: newTraineeUsername,
      email: newTraineeEmail,
      password: newTraineePassword,
      joining_date: newTraineeDate
    };
    try {
      const response = await axios.post('http://localhost:5000/users/add', newTrainee, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = response.data;
      console.log(data);
      setNewTraineeName('');
      setNewTraineeUsername('');
      setNewTraineeEmail('');
      setNewTraineePassword('');
      setNewTraineeDate('');
      setBool(!bool);
    } catch (error) {
      console.log("Error while adding trainee", error);
    }

  };

  const handleTraineeDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/delete/${id}`);
      setBool(!bool);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard">
      <div className='header d-flex align-items-center justify-content-between p-3'>
        <img className='header-logo' src={logo} alt='logo' />
        <p className='h3 fw-bold m-0'>Welcome {adminName}</p>
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
            <a className="nav-link" aria-current="page" href="#" onClick={() => { navigate(`/Admin/AllCoaches?adminName=${adminName}`); }}>All coaches</a>
          </li>
          <li className="nav-item nav-item-active">
            <a className="nav-link" href="#" onClick={() => { navigate(`/Admin/AllTrainees?adminName=${adminName}`); }}>All trainees</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" onClick={() => { navigate(`/Admin/AllCourses?adminName=${adminName}`); }}>All courses</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" onClick={() => { navigate(`/Admin/AllClasses?adminName=${adminName}`); }}>All classes</a>
          </li>
        </ul>
      </div>

      <br />

      <div className='scrollable-table'>
        <table className="container table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Trainee Name</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Password</th>
              <th scope="col">Joining Date</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {traineeData && traineeData.map((trainee) => {
              const dateObject = new Date(trainee.joining_date);
              const day = dateObject.getUTCDate();
              const month = dateObject.getUTCMonth() + 1;
              const year = dateObject.getUTCFullYear();
              return (
                <tr key={trainee.user_id}>
                  <th scope="row">{trainee.user_id}</th>
                  <td>{trainee.full_name}</td>
                  <td>{trainee.username}</td>
                  <td>{trainee.email}</td>
                  <td>{trainee.password}</td>
                  <td>{day}/{month}/{year}</td>
                  <td>
                    <img src={bin} alt="bin" onClick={() => handleTraineeDelete(trainee.user_id)} style={{ cursor: 'pointer' }}
                    />
                  </td>
                </tr>
              );
            })}
            <tr>
              <th scope="row">
              </th>
              <td>
                <input
                  type="text"
                  value={newTraineeName}
                  onChange={(e) => setNewTraineeName(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={newTraineeUsername}
                  onChange={(e) => setNewTraineeUsername(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={newTraineeEmail}
                  onChange={(e) => setNewTraineeEmail(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={newTraineePassword}
                  onChange={(e) => setNewTraineePassword(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="date"
                  value={newTraineeDate}
                  onChange={(e) => setNewTraineeDate(e.target.value)}
                />
              </td>
              <td>
                <img src={add} alt="add" onClick={handleAddTrainee} style={{ cursor: 'pointer' }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin2Dashboard;
