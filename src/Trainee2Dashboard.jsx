import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import "./bootstrap.min.css";
import axios from "axios";
import logo from "./icons/logo.png";
import profile from "./icons/profile.png";
import logout from "./icons/logout.png";
import add from "./icons/add.png";
import checked from "./icons/checked.png";
import unchecked from "./icons/unchecked.png";
import close from "./icons/close.png";
import Profile from "./Profile";

function Trainee2Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const traineeName = new URLSearchParams(location.search).get("traineeName");
  const traineeId = new URLSearchParams(location.search).get("traineeId");
  const [classData, setClassData] = useState([]);
  const [bool, setBool] = useState(true);
  const [modal, setmodal] = useState(false);
  const toogleModal = () => {
    setmodal(!modal);
  };
  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/enrollement/getEnrollementByTraineeId/${traineeId}`
      )
      .then((response) => {
        setClassData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [bool]);

  const handleAttendance = (id) => {
    axios
      .put(`http://localhost:5000/enrollement/update/${traineeName}/${id}`)
      .then((response) => {
        //console.log(response.data)
        setBool(!bool);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="dashboard">
      <div className="header d-flex align-items-center justify-content-between p-3">
        <img className="header-logo" src={logo} alt="logo" />
        <p className="h3 fw-bold m-0">Welcome {traineeName}</p>
        <div className="profile-logout d-flex gap-3">
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
          <img className="header-icon" src={logout} alt="logout" />
        </div>
      </div>
      {modal && <Profile coachId={traineeId} />}
      <br />

      <div className="container top-dashboard">
        <p className="manage fw-bold font-italic fs-4">MANAGE</p>
        <ul className="nav">
          <li className="nav-item">
            <a
              className="nav-link"
              aria-current="page"
              href="#"
              onClick={() => {
                navigate(
                  `/Trainee/AllCourses?traineeName=${traineeName}&traineeId=${traineeId}`
                );
              }}
            >
              All courses
            </a>
          </li>
          <li className="nav-item nav-item-active">
            <a
              className="nav-link"
              href="#"
              onClick={() => {
                navigate(
                  `/Trainee/YourClasses?traineeName=${traineeName}&traineeId=${traineeId}`
                );
              }}
            >
              Your classes
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              href="#"
              onClick={() => {
                navigate(
                  `/Trainee/Quizzes?traineeName=${traineeName}&traineeId=${traineeId}`
                );
              }}
            >
              Quizzes
            </a>
          </li>
        </ul>
      </div>

      <br />

      <div className="scrollable-table">
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
            {classData.map((course, index) => {
              const dateString = course.date;
              const date = new Date(dateString);
              const formattedDate = date.toLocaleDateString("en-GB");
              return (
                <tr key={index}>
                  <th scope="row">{course.class_id}</th>
                  <td>{course.course_name}</td>
                  <td>{course.full_name}</td>
                  <td>{formattedDate}</td>
                  <td>{course.hour}</td>
                  <td>
                    {course.present ? (
                      <img
                        src={checked}
                        alt="checked"
                        onClick={() => handleAttendance(course.class_id)}
                      />
                    ) : (
                      <img
                        src={unchecked}
                        alt="unchecked"
                        onClick={() => handleAttendance(course.class_id)}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Trainee2Dashboard;
