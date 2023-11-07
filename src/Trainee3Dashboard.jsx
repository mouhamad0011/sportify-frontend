import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "./UseAuthContext";
import axios from "axios";
import "./App.css";
import "./bootstrap.min.css";
import logo from "./icons/logo.png";
import profile from "./icons/profile.png";
import logout from "./icons/logout.png";
import Profile from "./Profile";
import close from "./icons/close.png";

function Trainee3Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const traineeName = new URLSearchParams(location.search).get("traineeName");
  const traineeId = new URLSearchParams(location.search).get("traineeId");
  const [bool, setBool] = useState(true);
  const [quizData, setQuizData] = useState([]);
  const [counter, setCounter] = useState(0);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}courses/getAllCoursesByTraineeId/${traineeId}`
      )
      .then((response) => {
        console.log(response.data);
        setQuizData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [bool]);

  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(false);

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    setSelectedCourse(false);
    setConfirmationVisible(false);
  };

  const handleSelectCourse = () => {
    setSelectedCourse(true);
  };

  const [modal, setmodal] = useState(false);
  const toogleModal = () => {
    setmodal(!modal);
  };

  const { dispatch } = useAuthContext();
 const handleLogout=async ()=>{
      localStorage.removeItem('user');
      await dispatch({ type: 'LOGOUT' });
      navigate('/login');
      console.log("logout");
 }
  var currentDate = new Date();

  function compareDates(date1, date2) {
    const parts1 = date1.split('/');
    const parts2 = date2.split('/');

    const day1 = parseInt(parts1[0], 10);
    const month1 = parseInt(parts1[1], 10) - 1;
    const year1 = parseInt(parts1[2], 10);

    const day2 = parseInt(parts2[0], 10);
    const month2 = parseInt(parts2[1], 10) - 1;
    const year2 = parseInt(parts2[2], 10);

    const dateObject1 = new Date(year1, month1, day1);
    const dateObject2 = new Date(year2, month2, day2);

    if (dateObject1.getTime() === dateObject2.getTime() || dateObject1.getTime() >= dateObject2.getTime()) {
      return true;
    } else {
      return false;
    }
  }

  const date1 = "03/11/2023";
  const date2 = "04/11/2023";

  const comparisonResult = compareDates(date1, date2);
  console.log(comparisonResult);

  const handleConfirm = () => {
    setConfirmationVisible(true);
  }

  function cancelAction() {
    setConfirmationVisible(false);
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
          <img className="header-icon" src={logout} alt="logout" onClick={handleLogout}/>
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
          <li className="nav-item">
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
          <li className="nav-item nav-item-active">
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
      <div className="container">
        {quizData.map((course, courseIndex) => {
          const questions = course.questions.split(";");
          const choices = course.choices
            .split(";")
            .map((choice) => choice.split(","));
          const dateString = course.date;
          const datee = new Date(dateString);
          const formattedDate = datee.toLocaleDateString("en-GB");
          const correct_answers = course.correct_answers.split(";");
          const date = course.date.substring(0, 10).split("-");
          const targetDate = new Date(date[0], date[1] - 1, date[2]);
          const test =
            date[0] + "-" + date[1] + "-" + date[2] + "T" + course.hour + ":00";
          const initialTime = new Date(test);
          const first = new Date(test);
          initialTime.setMinutes(initialTime.getMinutes() + 30);
          {
            if (compareDates(formattedDate, currentDate.toLocaleDateString("en-GB"))) {
              console.log(formattedDate);
              return (
                <div key={courseIndex}>
                  <h2 className="classtableheader">{course.course_name}</h2>
                  <h3 className="classtablesubheader">
                    Quiz on {formattedDate} at {course.hour}
                  </h3>
                  {/* {quizSubmitted ? (
                    <p>You have already submitted the quiz.</p>
                  ) : (
                    <button
                      className="d-button"
                      onClick={() => handleSelectCourse}
                    >
                      Take Quiz
                    </button>
                  )} */}
                  {currentDate.toLocaleTimeString() <
                    initialTime.toLocaleTimeString() &&
                    currentDate.toLocaleTimeString() >
                    first.toLocaleTimeString() && (
                      <div className="scrollable-table">
                        <table className="container table table-hover">
                          <thead>
                            <tr>
                              <th scope="col">Questions</th>
                              <th scope="col">Answers</th>
                            </tr>
                          </thead>
                          <tbody>
                            {questions.map((question, questionIndex) => {
                              return (
                                <tr key={questionIndex}>
                                  <th scope="row" style={{ fontWeight: "400" }}>{question}</th>
                                  <td>
                                    {choices[questionIndex].map(
                                      (choice, choiceIndex) => (
                                        <div key={choiceIndex}>
                                          <input
                                            type="radio"
                                            id={`choice${choiceIndex}`}
                                            name={`answer${questionIndex}`}
                                            value={choice}
                                            onClick={() => {
                                              if (
                                                choice ==
                                                correct_answers[questionIndex]
                                              )
                                                setCounter((prev) => prev + 1);
                                            }}
                                          />
                                          <label
                                            htmlFor={`choice${choiceIndex}`}
                                            style={{ color: "#262D5A", margin: "0 0 7px 7px" }}
                                          >
                                            {choice}
                                          </label>
                                          <br />
                                        </div>
                                      )
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                            {quizSubmitted ? (
                              <p className="mt-3">Quiz submitted successfully!</p>
                            ) : (
                              <button
                                className="d-button-submit mt-3"
                                onClick={() => handleConfirm()}
                              >
                                Submit Quiz
                              </button>
                            )}
                            {isConfirmationVisible && (
                              <div className="popup-overlay">
                                <div className="popup-content">
                                  <p>Are you sure?</p>
                                  <div className="popup-btn">
                                    <button className="d-button-submit"
                                      onClick={() => {
                                        setCounter(0);
                                        handleSubmitQuiz();
                                        alert(
                                          "Your result is: " +
                                          counter +
                                          "/" +
                                          questions.length
                                        );
                                      }}>OK</button>
                                    <button className="d-button" onClick={cancelAction}>Cancel</button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                </div>
              );
            } else {
              return (
                <div>
                  <h2 className="classtableheader">{course.course_name}</h2>
                  <h3 className="classtablesubheader">
                    Oops, this quiz was taken{" "}
                    {Math.abs(
                      Math.ceil((datee - currentDate) / (1000 * 3600 * 24))
                    )}{" "}
                    days ago
                    <br />
                    Kindly refer to coach <span className="welcome-name">{course.coach}</span>.
                  </h3>
                </div>
              );
            }
          }
        })}
      </div>
    </div>
  );
}
export default Trainee3Dashboard;
