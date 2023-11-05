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

function Admin4Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminName = new URLSearchParams(location.search).get('adminName');
  const [classData, setClassData] = useState([]);
  const [AllCourses, setAllCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [newClassDate, setNewClassDate] = useState('');
  const [newClassHour, setNewClassHour] = useState('');
  const [bool, setBool] = useState(true);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/classes/getAllClassesWithDetails')
      .then(response => {
        setClassData(response.data);
        console.log(response.data[0]);
      })
      .catch(error => {
        console.error('Error fetching classes:', error);
      });
    axios.get('http://localhost:5000/courses/getAll')
      .then(response => {
        const courses = response.data.map(course => course.course_name);
        setAllCourses(courses);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });
  }, [bool]);

  const handleDeleteClass = async (classId) => {
    await axios.delete(`http://localhost:5000/classes/delete/${classId}`)
      .then(() => {
        console.log("deleted successfully");
      })
      .catch((err) => {
        console.error(err);
      })
    setBool(!bool);
    setConfirmationVisible(false);
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (
      newClassDate.trim() === '' ||
      newClassHour.trim() === '' ||
      courseName.trim() === ''

    ) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/courses/getCourseIdByCourseName/${courseName}`);
      const courseId = response.data[0].course_id;
      console.log(courseId);
      const newClass = {
        course_id: courseId,
        date: newClassDate,
        hour: newClassHour
      }

      await axios.post('http://localhost:5000/classes/add', newClass, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setCourseName('');
      setNewClassDate('');
      setNewClassHour('');
      setBool((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirm = () => {
    setConfirmationVisible(true);
  }

  function cancelAction() {
    setConfirmationVisible(false);
  }

  return (
    <div className="dashboard">
      <div className='header d-flex align-items-center justify-content-between p-3'>
        <img className='header-logo' src={logo} alt='logo' />
        <p className='h3 fw-bold m-0 welcome-name'>Welcome {adminName}</p>
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
          <li className="nav-item">
            <a className="nav-link" href="#" onClick={() => { navigate(`/Admin/AllTrainees?adminName=${adminName}`); }}>All trainees</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" onClick={() => { navigate(`/Admin/AllCourses?adminName=${adminName}`); }}>All courses</a>
          </li>
          <li className="nav-item nav-item-active">
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
              <th scope="col">Course Name</th>
              <th scope="col">Coach Name</th>
              <th scope="col">Date</th>
              <th scope="col">Hour</th>
              <th scope="col">Drop</th>
            </tr>
          </thead>
          <tbody>
            {classData && classData.map((classs) => {
              const dateObject = new Date(classs.date).toLocaleDateString("en-GB");


              return (
                <tr key={classs.class_id}>
                  <th scope="row">{classs.class_id}</th>
                  <td>{classs.course_name}</td>
                  <td><span className='welcome-name'>{classs.full_name}</span></td>
                  <td>{dateObject}</td>
                  <td>{classs.hour}</td>
                  <td>
                    <img src={bin} alt="bin" onClick={() => handleConfirm()} style={{ cursor: 'pointer' }}
                    />
                    {isConfirmationVisible && (
                      <div className="popup-overlay">
                        <div className="popup-content">
                          <p>Are you sure?</p>
                          <div className="popup-btn">
                            <button className="d-button-submit" onClick={() => handleDeleteClass(classs.class_id)}>OK</button>
                            <button className="d-button" onClick={cancelAction}>Cancel</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            }
            )}
            <tr>
              <th scope="row">
              </th>
              <td>
                <select
                  name=""
                  id=""
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                >
                  <option value="" disabled>Select a course</option>
                  {AllCourses.map((course, index) => (
                    <option key={index} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </td>
              <td>

              </td>
              <td>
                <input
                  type="date"
                  value={newClassDate}
                  onChange={(e) => setNewClassDate(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={newClassHour}
                  onChange={(e) => setNewClassHour(e.target.value)}
                />
              </td>
              <td>
                <img src={add} alt="add" onClick={handleAddClass} style={{ cursor: 'pointer' }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin4Dashboard;
