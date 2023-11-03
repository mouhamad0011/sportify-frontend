import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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


  const addClassInEnrollement = (id) => {
    axios
      .get(`http://localhost:5000/classes/getAllClassesByCourseId/${id}`)
      .then((response) => {
        response.data.forEach((element) => {
          const newEnrollement = {
            class_id: element.class_id,
            trainee_id: traineeId,
            present: 0,
          };
          axios.post(`http://localhost:5000/enrollement/add`, newEnrollement, {
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
      .get(`http://localhost:5000/classes/getAllClassesByCourseId/${id}`)
      .then((response) => {
        response.data.forEach((element) => {
          axios.delete(
            `http://localhost:5000/enrollement/delete/${element.class_id}/${traineeId}`
          );
        });
        setAllClasses([]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/courses/getAllCoursesWithCoachName`)
      .then((response) => {
        setCourseData(response.data);
        const requests = response.data.map((element) =>
          axios.get(
            `http://localhost:5000/enrollement/getEnrollementForAllClasses/${traineeId}/${element.course_id}`
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
    setmodal(true);
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
      {modal && <Profile coachId={traineeId}/>}

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
                <td>{course.full_name}</td>
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
                      deleteEnrollement(course.course_id);
                      setBool((prev) => !prev);
                    }}
                  />
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
