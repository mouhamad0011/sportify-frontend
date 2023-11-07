import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from "./UseAuthContext";
import axios from 'axios';
import './Dashboards.css';
import './bootstrap.min.css';
import logo from './icons/logo.png';
import profile from './icons/profile.png';
import logout from './icons/logout.png';
import add from './icons/add.png';
import checked from './icons/checked.png';
import bin from './icons/bin.png';
import close from "./icons/close.png";
import Profile from "./Profile";

function Admin2Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminName = new URLSearchParams(location.search).get('adminName');
  const coachId = new URLSearchParams(location.search).get("adminId");
  const [traineeData, setTraineeData] = useState([]);
  const [newTraineeName, setNewTraineeName] = useState('');
  const [newTraineeUsername, setNewTraineeUsername] = useState('');
  const [newTraineeEmail, setNewTraineeEmail] = useState('');
  const [newTraineePassword, setNewTraineePassword] = useState('');
  const [newTraineeDate, setNewTraineeDate] = useState('');
  const [bool, setBool] = useState(true);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}users/getAllTrainees`)
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
      const response = await axios.post(`${process.env.REACT_APP_API_URL}users/add`, newTrainee, {
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
      await axios.delete(`${process.env.REACT_APP_API_URL}users/delete/${id}`);
      setBool(!bool);
      setConfirmationVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirm = () => {
    setConfirmationVisible(true);
  }

  function cancelAction() {
    setConfirmationVisible(false);
  }
  const [modal, setmodal] = useState(false);
  const toogleModal = () => {
    setmodal(!modal);
  };

  const { dispatch } = useAuthContext();
  const handleLogout = async () => {
    localStorage.removeItem('user');
    await dispatch({ type: 'LOGOUT' });
    navigate('/login');
    console.log("logout");
  }

  return (
    <div className="dashboard">
      <div className='header d-flex align-items-center justify-content-between p-3'>
        <a href="/"><img className="header-logo" src={logo} alt="logo" /></a>
        <p className='h3 fw-bold m-0 welcome-name'>Welcome {adminName}</p>
        <div className='profile-logout d-flex gap-3'>
          {!modal ? (
            <img
              className="header-icon"
              src={profile}
              alt="profile"
              onClick={toogleModal}
            />
          ) : (
            <img
              onClick={toogleModal}
              className="header-icon"
              src={close}
              alt="close"
            />
          )}
          <img className="header-icon" src={logout} alt="logout" onClick={handleLogout} />
        </div>
      </div>
      {modal && <Profile coachId={coachId} />}

      <br />

      <div className='container top-dashboard'>
        <p className='manage fw-bold font-italic fs-4'>MANAGE</p>
        <ul className="nav">
          <li className="nav-item">
            <a className="nav-link" aria-current="page" href="#" onClick={() => { navigate(`/Admin/AllCoaches?adminName=${adminName}&adminId=${coachId}`); }}>All coaches</a>
          </li>
          <li className="nav-item nav-item-active">
            <a className="nav-link" href="#" onClick={() => { navigate(`/Admin/AllTrainees?adminName=${adminName}&adminId=${coachId}`); }}>All trainees</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" onClick={() => { navigate(`/Admin/AllCourses?adminName=${adminName}&adminId=${coachId}`); }}>All courses</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" onClick={() => { navigate(`/Admin/AllClasses?adminName=${adminName}&adminId=${coachId}`); }}>All classes</a>
          </li>
        </ul>
      </div>

      <br />

      <div className='scrollable-table container'>
        <table className="container table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Trainee Name</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Password</th>
              <th scope="col">Joining Date</th>
              <th scope="col">Add/Delete</th>
            </tr>
          </thead>
          <tbody>
            {traineeData && traineeData.map((trainee) => {
              const date = new Date(trainee.joining_date).toLocaleDateString("en-GB")
              return (
                <tr key={trainee.user_id}>
                  <th scope="row">{trainee.user_id}</th>
                  <td><span className='welcome-name'>{trainee.full_name}</span></td>
                  <td>{trainee.username}</td>
                  <td>{trainee.email}</td>
                  <td>********</td>
                  <td>{date}</td>
                  <td>
                    <img src={bin} alt="bin" onClick={() => handleConfirm()} style={{ cursor: 'pointer' }}
                    />
                    {isConfirmationVisible && (
                      <div className="popup-overlay">
                        <div className="popup-content">
                          <p>Are you sure?</p>
                          <div className="popup-btn">
                            <button className="d-button-submit" onClick={() => handleTraineeDelete(trainee.user_id)}>OK</button>
                            <button className="d-button" onClick={cancelAction}>Cancel</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            <tr>
              <th scope="row">
              </th>
              <td>
                <input
                  className='admin-input'
                  type="text"
                  value={newTraineeName}
                  onChange={(e) => setNewTraineeName(e.target.value)}
                />
              </td>
              <td>
                <input
                  className='admin-input'
                  type="text"
                  value={newTraineeUsername}
                  onChange={(e) => setNewTraineeUsername(e.target.value)}
                />
              </td>
              <td>
                <input
                  className='admin-input'
                  type="text"
                  value={newTraineeEmail}
                  onChange={(e) => setNewTraineeEmail(e.target.value)}
                />
              </td>
              <td>
                <input
                  className='admin-input'
                  type="text"
                  value={newTraineePassword}
                  onChange={(e) => setNewTraineePassword(e.target.value)}
                />
              </td>
              <td>
                <input
                  className='admin-input'
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
