import React, { useState } from "react";
import "./App.css";
import "./bootstrap.min.css";
import logo from './icons/logo.png';
import profile from "./icons/profile.png";
import logout from "./icons/logout.png";

function Trainee3Dashboard() {
  const [quizData, setQuizData] = useState([
    {
      title: "Course: Basketball 3",
      questions: [
        { question: "How old are you?", choices: ["30-35", "35-40", "40-45"] },
        {
          question: "What sports do you play?",
          choices: ["Football", "Basketball", "Tennis"],
        },
        {
          question: "What sports do you practice?",
          choices: ["Swimming", "Volley", "Ping-Pong"],
        },
      ],
    },
    {
      title: "Course: Football 101",
      questions: [
        {
          question: "What's your favorite position?",
          choices: ["Striker", "Midfielder", "Defender"],
        },
        {
          question: "Favorite football team?",
          choices: ["Real Madrid", "Barcelona", "Manchester United"],
        },
        {
          question: "Preferred playing surface?",
          choices: ["Grass", "Artificial Turf", "Indoor"],
        },
      ],
    },
    {
      title: "Course: Tennis Basics",
      questions: [
        {
          question: "What type of racket do you use?",
          choices: ["Babolat", "Wilson", "Head"],
        },
        {
          question: "Favorite Grand Slam event?",
          choices: ["Wimbledon", "US Open", "French Open"],
        },
        { question: "Singles or Doubles?", choices: ["Singles", "Doubles"] },
      ],
    },
  ]);

  const [correctAnswers, setCorrectAnswers] = useState(
    Array(quizData[0].questions.length).fill(null)
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleCorrectAnswer = (e, questionIndex) => {
    if (!quizSubmitted) {
      const updatedCorrectAnswers = [...correctAnswers];
      updatedCorrectAnswers[questionIndex] = e.target.value;
      setCorrectAnswers(updatedCorrectAnswers);
    }
  };

  const handleSubmitQuiz = () => {
    if (!quizSubmitted) {
      setQuizSubmitted(true);
      console.log("Selected answers:", correctAnswers);
    }
  };

  const handleSelectCourse = (courseTitle) => {
    setSelectedCourse(courseTitle);
  };

  return (
    <div className="dashboard">
      <div className="header d-flex align-items-center justify-content-between p-3">
        <img className="header-logo" src={logo} alt="logo" />
        <p className="h3 fw-bold m-0">Welcome Trainee</p>
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
            <a className="nav-link" aria-current="page" href="#">
              All courses
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Your classes
            </a>
          </li>
          <li className="nav-item nav-item-active">
            <a className="nav-link" href="#">
              Quizzes
            </a>
          </li>
        </ul>
      </div>
      <br />
      <div className="container">
        {quizData.map((course, courseIndex) => (
          <div key={courseIndex}>
            <h2>{course.title}</h2>
            {quizSubmitted ? (
              <p>You have already submitted the quiz.</p>
            ) : (
              <button onClick={() => handleSelectCourse(course.title)}>
                Take Quiz
              </button>
            )}
            {selectedCourse === course.title && !quizSubmitted ? (
              <table className="container table table-hover">
                <thead>
                  <tr>
                    <th scope="col">Questions</th>
                    <th scope="col">Answers</th>
                  </tr>
                </thead>
                <tbody>
                  {course.questions.map((question, questionIndex) => (
                    <tr key={questionIndex}>
                      <th scope="row">{question.question}</th>
                      <td>
                        {question.choices.map((choice, choiceIndex) => (
                          <div key={choiceIndex}>
                            <input
                              type="radio"
                              id={`choice${choiceIndex}`}
                              name={`answer${questionIndex}`}
                              value={choice}
                              onChange={(e) =>
                                handleCorrectAnswer(e, questionIndex)
                              }
                              disabled={quizSubmitted}
                            />
                            <label htmlFor={`choice${choiceIndex}`}>
                              {choice}
                            </label>
                            <br />
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                  <button onClick={() => handleSubmitQuiz()}>
                    Submit Quiz
                  </button>
                </tbody>
              </table>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
export default Trainee3Dashboard;
