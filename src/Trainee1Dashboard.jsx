import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "./UseAuthContext";
import axios from "axios";
import "./App.css";
import "./bootstrap.min.css";
import logo from "./icons/logo.png";
import profile from "./icons/profile.png";
import logout from "./icons/logout.png";
import close from "./icons/close.png";
import unchecked from "./icons/unchecked.png";
import checked from "./icons/checked.png";
import bin from "./icons/bin.png";
import Profile from "./Profile";

function Trainee1Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const traineeName = new URLSearchParams(location.search).get("traineeName");
  const traineeId = new URLSearchParams(location.search).get("traineeId");
  const [courseData, setCourseData] = useState([]);
  const [bool, setBool] = useState(true);
  const [classesData, setClassesData] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const addClassInEnrollement = (id) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}classes/getAllClassesByCourseId/${id}`)
      .then((response) => {
        response.data.forEach((element) => {
          const newEnrollement = {
            class_id: element.class_id,
            trainee_id: traineeId,
            present: 0,
          };
          axios.post(`${process.env.REACT_APP_API_URL}enrollement/add`, newEnrollement, {
            headers: {
              "Content-Type": "application/json",
            },
          });
        });
        setAllClasses([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteEnrollement = (id) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}classes/getAllClassesByCourseId/${id}`)
      .then((response) => {
        response.data.forEach((element) => {
          axios.delete(
            `${process.env.REACT_APP_API_URL}enrollement/delete/${element.class_id}/${traineeId}`
          );
        });
        setAllClasses([]);
        setCourseToDelete(null);
        setConfirmationVisible(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}courses/getAllCoursesWithCoachName`)
      .then((response) => {
        setCourseData(response.data);
        const requests = response.data.map((element) =>
          axios.get(
            `${process.env.REACT_APP_API_URL}enrollement/getEnrollementForAllClasses/${traineeId}/${element.course_id}`
          )
        );
        Promise.all(requests)
          .then((responses) => {
            responses.forEach((element) => {
              setAllClasses((prev) => [...prev, element.data]);
              // console.log(element.data);
            });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [bool]);
  const [modal, setmodal] = useState(false);
  const toogleModal = () => {
    setmodal(!modal);
  };

  const handleConfirm = (courseId) => {
    setCourseToDelete(courseId);
    setConfirmationVisible(true);
  }

  function cancelAction() {
    setConfirmationVisible(false);
  }
  const { dispatch } = useAuthContext();
 const handleLogout=async ()=>{
      localStorage.removeItem('user');
      await dispatch({ type: 'LOGOUT' });
      navigate('/login');
      console.log("logout");
 }

  return (
    <div className="dashboard">
      <div className="header d-flex align-items-center justify-content-between p-3">
        <img className="header-logo" src={logo} alt="logo" />
        <p className="h3 fw-bold m-0 welcome-name">Welcome {traineeName}</p>
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
          <img className="header-icon" src={logout} alt="logout" onClick={handleLogout} />
        </div>
      </div>
      {modal && <Profile coachId={traineeId} />}

      <br />

      <div className="container top-dashboard">
        <p className="manage fw-bold font-italic fs-4">MANAGE</p>
        <ul className="nav">
          <li className="nav-item nav-item-active">
            <a
              className="nav-link"
              aria-current="page"
              href="#"
              onClick={() => {
                navigate(`/Trainee/AllCourses?traineeName=${traineeName}&traineeId=${traineeId}`);
              }}
            >
              All courses
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              href="#"
              onClick={() => {
                navigate(`/Trainee/YourClasses?traineeName=${traineeName}&traineeId=${traineeId}`);
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
                navigate(`/Trainee/Quizzes?traineeName=${traineeName}&traineeId=${traineeId}`);
              }}
            >
              Quizzes
            </a>
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
              <th scope="col">Coach</th>
              <th scope="col">Description</th>
              <th scope="col">Register</th>
              <th scope="col">Drop</th>
            </tr>
          </thead>
          <tbody>
            {courseData.map((course, index) => (
              <tr key={index}>
                <th scope="row">{course.course_id}</th>
                <td>{course.course_name}</td>
                <td><span className="welcome-name">{course.full_name}</span></td>
                <td>{course.description}</td>
                <td>
                  {allClasses[index] && allClasses[index].length > 0 ? (
                    <img src={checked} />
                  ) : (
                    <img
                      src={unchecked}
                      alt="unchecked"
                      onClick={() => {
                        addClassInEnrollement(course.course_id);
                        setBool((prev) => !prev);

                      }}
                    />
                  )}
                </td>
                <td>
                  <img
                    src={bin}
                    alt="bin"
                    onClick={() => {
                      handleConfirm(course.course_id);
                      //  deleteEnrollement(course.course_id);
                      setBool(!bool);
                    }}
                  />
                  {isConfirmationVisible && courseToDelete === course.course_id && (
                    <div className="popup-overlay">
                      <div className="popup-content">
                        <p>Are you sure?</p>
                        <div className="popup-btn">
                          <button className="d-button-submit" onClick={() =>{ deleteEnrollement(course.course_id); setBool(!bool);}}>OK</button>
                          <button className="d-button" onClick={cancelAction}>Cancel</button>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Trainee1Dashboard;
