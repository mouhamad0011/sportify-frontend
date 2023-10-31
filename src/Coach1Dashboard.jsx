import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Dashboards.css';
import './bootstrap.min.css';
import logo from './icons/logo.png';
import profile from './icons/profile.png';
import logout from './icons/logout.png';
import checked from './icons/checked.png';
import bin from './icons/bin.png';

function Coach1Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const coachName = new URLSearchParams(location.search).get('coachName');
    const [bool, serBool] = useState(true);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/courses/getAllCoursesByCoachName/${coachName}`)
            .then(response => {
                setCourses(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
            });

    }, [bool]);

    return (
        <div className="dashboard">
            <div className='header d-flex align-items-center justify-content-between p-3'>
                <img className='header-logo' src={logo} alt='logo' />
                <p className='h3 fw-bold m-0'>Welcome {coachName}</p>
                <div className='profile-logout d-flex gap-3'>
                    <img className='header-icon' src={profile} alt='profile' />
                    <img className='header-icon' src={logout} alt='logout' />
                </div>
            </div>

            <br />

            <div className='container top-dashboard'>
                <p className='manage fw-bold font-italic fs-4'>MANAGE</p>
                <ul className="nav">
                    <li className="nav-item nav-item-active">
                        <a className="nav-link" aria-current="page" href="#" onClick={() => { navigate(`/Coach/YourCourses?coachName=${coachName}`); }}>Your courses</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#" onClick={() => { navigate(`/Coach/YourClasses?coachName=${coachName}`); }}>Your classes</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#" onClick={() => { navigate(`/Coach/Quizzes?coachName=${coachName}`); }}>Quizzes</a>
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
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course, index) => (
                            <tr key={course.course_id}>
                                <th scope="row">{course.course_id}</th>
                                <td>{course.course_name}</td>
                                <td>{course.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
            );
}

            export default Coach1Dashboard;
