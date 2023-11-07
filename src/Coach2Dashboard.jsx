import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "./UseAuthContext";
import axios from "axios";
import "./Dashboards.css";
import "./bootstrap.min.css";
import logo from "./icons/logo.png";
import profile from "./icons/profile.png";
import logout from "./icons/logout.png";
import checked from "./icons/checked.png";
import unchecked from "./icons/unchecked.png";
import Profile from "./Profile";
import close from './icons/close.png';

function Coach2Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const coachName = new URLSearchParams(location.search).get("coachName");
  const coachId = new URLSearchParams(location.search).get("coachId");
  const [bool, setBool] = useState(true);
  const [tests, setTest] = useState([]);
  const [names, setNames] = useState([]);



  const toggleCheck = (e, id) => {
    axios.put(
      `${process.env.REACT_APP_API_URL}enrollement/update/${e.target.id}/${id}`
    )
      .then(() => {
        setNames([]);
      })
      .catch((error) => {
        console.error(error)
      })
    //console.log(response.data);
  };


  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}users/getUserId/${coachName}`)
      .then((response) => {
        const data = response.data;
        axios
          .get(
            `${process.env.REACT_APP_API_URL}classes/getClassCourseDateHour/${data[0].user_id}`
          )
          .then((response) => {
            const data = response.data;
            setTest(data);
            const requests = response.data.map((element) =>
              axios.get(
                `${process.env.REACT_APP_API_URL}classes/getClassNamesPresence/${element.class_id}`
              )
            );
            Promise.all(requests)
              .then((responses) => {
                responses.forEach((element) => {
                  setNames((prev) => [...prev, element.data]);
                  //console.log(element)
                });
              })
              .catch((error) => {
                console.log(error);
              });
            // response.data.forEach((element) => {
            //     axios.get(`${process.env.REACT_APP_API_URL}classes/getClassNamesPresence/${element.class_id}`)
            //         .then(response => {
            //             const data = response.data;

            //             setNames((prev) => [...prev, data]);
            //         })
            //         .catch(error => {
            //             console.error(error);
            //         });
            // });
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [bool]);

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
      <div className="header d-flex align-items-center justify-content-between p-3">
        <a href="/"><img className="header-logo" src={logo} alt="logo" /></a>
        <p className="h3 fw-bold m-0 welcome-name">Welcome {coachName}</p>
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
      {modal && <Profile coachId={coachId} />}
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
                navigate(`/Coach/YourCourses?coachName=${coachName}&coachId=${coachId}`);
              }}
            >
              Your courses
            </a>
          </li>
          <li className="nav-item nav-item-active">
            <a
              className="nav-link"
              href="#"
              onClick={() => {
                navigate(`/Coach/YourClasses?coachName=${coachName}&coachId=${coachId}`);
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
                navigate(`/Coach/Quizzes?coachName=${coachName}&coachId=${coachId}`);
              }}
            >
              Quizzes
            </a>
          </li>
        </ul>
      </div>
      <br />

      {tests.map((test, classIndex) => {
        const dateString = test.date;
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-GB');
        return (
          <div className="container" key={classIndex}>
            <br />
            <p className="classtableheader">
              Class {test.class_id}: {test.course_name} on {formattedDate}{" "}
              at {test.hour}
            </p>
            <p className="classtablesubheader">
              Trainees registered to Class {test.class_id}
            </p>
            <div className="scrollable-table">
              <table className="container table table-hover">
                <thead>
                  <tr>
                    <th scope="col">Trainee name</th>
                    <th scope="col">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {names.length > 0 &&
                    names[classIndex] &&
                    names[classIndex].map((name, traineeIndex) => (
                      <tr key={traineeIndex}>
                        <td scope="row"><span className="welcome-name">{name.full_name}</span></td>
                        <td>
                          {name.present ? (
                            <img
                              src={checked}
                              id={name.full_name}
                              onClick={(e) => {
                                toggleCheck(e, test.class_id);
                                setBool((prev) => !prev);
                              }}
                            />
                          ) : (
                            <img
                              src={unchecked}
                              id={name.full_name}
                              onClick={(e) => {
                                toggleCheck(e, test.class_id);
                                setBool((prev) => !prev);
                              }}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <br />
          </div>
        );
      })}
    </div>
  );
}

export default Coach2Dashboard;
