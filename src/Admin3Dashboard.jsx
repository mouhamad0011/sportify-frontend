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

function Admin3Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminName = new URLSearchParams(location.search).get('adminName');
  const coachId = new URLSearchParams(location.search).get("adminId");
  const [CourseData, setCourseData] = useState([]);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [selectedCoach, setSelectedCoach] = useState('');
  const [bool, setBool] = useState(true);
  const [coachNames, setCoachNames] = useState([]);
  const [coachName, setCoachName] = useState('');
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);


  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}courses/getAllCoursesWithCoachName`)
      .then(response => {
        setCourseData(response.data);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });

    axios.get(`${process.env.REACT_APP_API_URL}users/getAllCoaches`)
      .then(response => {
        const names = response.data.map(coach => coach.full_name);
        setCoachNames(names);
      })
      .catch(error => {
        console.error('Error fetching coaches:', error);
      });
  }, [bool]);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (newCourseName.trim() === '' ||
      newCourseDescription.trim() === "" ||
      selectedCoach === ""
    ) {
      alert('Please fill in all required fields (Course Name).');
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}users/getOneUserByName/${selectedCoach}`);
      const userId = response.data[0].user_id;
      console.log('Fetched user ID:', userId);

      const newCourse = {
        course_name: newCourseName,
        description: newCourseDescription,
        coach_id: userId,
      };

      console.log('Adding new course:', newCourse);

      await axios.post(`${process.env.REACT_APP_API_URL}courses/add`, newCourse, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Course added successfully');
      setNewCourseName('');
      setNewCourseDescription('');
      setSelectedCoach('');
      setBool(!bool);
    } catch (error) {
      console.error('Error while adding Course:', error);
    }
  };

  const handleCourseDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}courses/delete/${id}`);
      setBool(!bool);
      setConfirmationVisible(false);
    } catch (error) {
      console.error('Error deleting Course:', error);
    }
  };

  const handleConfirm = () => {
    setConfirmationVisible(true);
  }

  function cancelAction() {
    setConfirmationVisible(false);
  }

  const { dispatch } = useAuthContext();
  const handleLogout = async () => {
    localStorage.removeItem('user');
    await dispatch({ type: 'LOGOUT' });
    navigate('/login');
    console.log("logout");
  }
  const [modal, setmodal] = useState(false);
  const toogleModal = () => {
    setmodal(!modal);
  };

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
          <li className="nav-item">
            <a className="nav-link" href="#" onClick={() => { navigate(`/Admin/AllTrainees?adminName=${adminName}&adminId=${coachId}`); }}>All trainees</a>
          </li>
          <li className="nav-item nav-item-active">
            <a className="nav-link" href="#" onClick={() => { navigate(`/Admin/AllCourses?adminName=${adminName}&adminId=${coachId}`); }}>All courses</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" onClick={() => { navigate(`/Admin/AllClasses?adminName=${adminName}&adminId=${coachId}`); }}>All classes</a>
          </li>
        </ul>
      </div>

      <br />

      <div className='scrollable-table'>
        <table className="container table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Course Name</th>
              <th scope="col">Description</th>
              <th scope="col">Coach Name</th>
              <th scope="col">Add/Delete</th>
            </tr>
          </thead>
          <tbody>
            {CourseData && CourseData.map((course) => (
              <tr key={course.course_id}>
                <th scope="row">{course.course_id}</th>
                <td>{course.course_name}</td>
                <td>{course.description}</td>
                <td><span className='welcome-name'>{course.full_name}</span></td>
                <td>
                  <img
                    src={bin}
                    alt="bin"
                    onClick={() => handleConfirm()}
                    style={{ cursor: 'pointer' }}
                  />
                  {isConfirmationVisible && (
                    <div className="popup-overlay">
                      <div className="popup-content">
                        <p>Are you sure?</p>
                        <div className="popup-btn">
                          <button className="d-button-submit" onClick={() => handleCourseDelete(course.course_id)}>OK</button>
                          <button className="d-button" onClick={cancelAction}>Cancel</button>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            <tr>
              <th scope="row"></th>
              <td>
                <input
                  type="text"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={newCourseDescription}
                  onChange={(e) => setNewCourseDescription(e.target.value)}
                />
              </td>
              <td>
                <select
                  name=""
                  id=""
                  value={selectedCoach}
                  onChange={(e) => setSelectedCoach(e.target.value)}
                >
                  <option value="" disabled>Select a Coach</option>
                  {coachNames.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <img src={add} alt="add" onClick={handleAddCourse} style={{ cursor: 'pointer' }} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin3Dashboard;
