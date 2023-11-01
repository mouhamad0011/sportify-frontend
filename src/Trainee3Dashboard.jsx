import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./App.css";
import "./bootstrap.min.css";
import logo from "./icons/logo.png";
import profile from "./icons/profile.png";
import logout from "./icons/logout.png";

function Trainee3Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const traineeName = new URLSearchParams(location.search).get("traineeName");
  const traineeId = new URLSearchParams(location.search).get("traineeId");
  const [bool, setBool] = useState(true);
  const [quizData, setQuizData] = useState([]);
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/courses/getAllCoursesByTraineeId/${traineeId}`
      )
      .then((response) => {
        //console.log(response.data);
        setQuizData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [bool]);

  // const [correctAnswers, setCorrectAnswers] = useState(
  //   Array(quizData[0].questions.length).fill(null)
  // );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleSubmitQuiz = () => {
    if (!quizSubmitted) {
      setQuizSubmitted(true);
    }
  };

  const handleSelectCourse = (courseTitle) => {
    setSelectedCourse(courseTitle);
  };


var currentDate = new Date();
console.log(currentDate.toLocaleTimeString())
// const initialTime = new Date(currentDate);
// initialTime.setMinutes(initialTime.getMinutes() + 30);
// console.log(initialTime.toLocaleTimeString());


   
  // var currentTime = currentDate.toLocaleTimeString();
  // console.log(currentTime)
  //  var targetDate = new Date(2023, 10,3);

  //  console.log(Math.floor((targetDate.getTime()-currentDate.getTime())/(1000 * 60 * 60 * 24)))

  return (
    <div className="dashboard">
      <div className="header d-flex align-items-center justify-content-between p-3">
        <img className="header-logo" src={logo} alt="logo" />
        <p className="h3 fw-bold m-0">Welcome {traineeName}</p>
        <div className="profile-logout d-flex gap-3">
          <img className="header-icon" src={profile} alt="profile" />
          <img className="header-icon" src={logout} alt="logout" />
        </div>
      </div>
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
          const correct_answers = course.correct_answers.split(";");
          const date = course.date.substring(0, 10).split("-");
          const targetDate = new Date(date[0], date[1] - 1, date[2]);
          const test=date[0]+"-"+date[1]+"-"+date[2]+"T"+course.hour+":00";
          const initialTime = new Date(test);
          const first=new Date(test);
          initialTime.setMinutes(initialTime.getMinutes() + 30);
          {
            if (targetDate.getTime() < currentDate.getTime() ) {
              return (
                <div key={courseIndex}>
                  <h2>{course.course_name}</h2>
                  <h3>{test}</h3>
                  {quizSubmitted ? (
              <p>You have already submitted the quiz.</p>
            ) : (
              <button onClick={() => handleSelectCourse(course.course_name)}>
                Take Quiz
              </button>
            )}
                  {selectedCourse && currentDate.toLocaleTimeString()<initialTime.toLocaleTimeString() && currentDate.toLocaleTimeString()>first.toLocaleTimeString() &&
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
                              <th scope="row">{question}</th>
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
                                        style={{ color: "#262D5A" }}
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
                        <button
                          onClick={() => {
                            alert(
                              "Your result is: " +
                                counter +
                                "/" +
                                questions.length
                            );
                            setCounter(0);
                          }}
                        >
                          Submit Quiz
                        </button>
                      </tbody>
                    </table>
                  </div>
                 
                  }
                  
                </div>
              );
            } else {
              return(
              <div>
              <h2>{course.course_name}</h2>
              <h3>quiz passed about {Math.abs(Math.floor((targetDate.getTime()-currentDate.getTime())/(1000 * 60 * 60 * 24)))} days ago<br/> 
              refer to your coach {course.coach}</h3>
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
