import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Dashboards.css";
import "./bootstrap.min.css";
import logo from "./icons/logo.png";
import profile from "./icons/profile.png";
import logout from "./icons/logout.png";

function Coach3Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const coachName = new URLSearchParams(location.search).get("coachName");
  const [quiz, setQuiz] = useState([]);
  const [bool, setBool] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [choices, setChoices] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newQuestions, setNewQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newChoices, setNewChoices] = useState("");
  const [newCorrectAnswer, setNewCorrectAnswer] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/courses/getAllCoursesBycoachName/${coachName}`
      )
      .then((response) => {
        setCourses(response.data);
        response.data.forEach((element) => {
          axios
            .get(`http://localhost:5000/QA/get/${element.course_id}`)
            .then((response) => {
              setQuiz((prev) => [...prev, response.data[0]]);
              response.data[0] &&
                setQuestions((prev) => [
                  ...prev,
                  response.data[0].questions.split(";"),
                ]);
              response.data[0] &&
                setChoices((prev) => [
                  ...prev,
                  response.data[0].choices
                    .split(";")
                    .map((choice) => choice.split(",")),
                ]);
              response.data[0] &&
                setAnswers((prev) => [
                  ...prev,
                  response.data[0].correct_answers.split(";"),
                ]);
            })
            .catch((error) => {
              console.error(error);
            });
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [bool]);

  const addQuiz = (courseIndex) => {
    setSelectedCourse(courseIndex);
  };

  const addQuestion = (courseIndex) => {
    if (newQuestions.length < 7) {
      setNewQuestions((prevQuestions) => {
        const newQuestion = {
          question: `${newQuestions.length + 1}-`,
          choices: ["", "", ""],
          correctAnswer: -1,
        };
        return [...prevQuestions, newQuestion];
      });
    } else {
      alert("You have reached the maximum limit of questions.");
    }
  };

  const handleNewQuestionChange = (questionIndex, event) => {
    const { name, value } = event.target;
    setNewQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex][name] = value;
      if (name === "correctAnswer") {
        updatedQuestions[questionIndex][name] = parseInt(value, 10);
      }
      return updatedQuestions;
    });
  };

  const addQuizzes = () => {
    newQuestions.forEach((question, index) => {
      var choice = "";
      if (question.correct_answer == 1) {
        choice = question.choice1;
      } else if (question.correct_answer == 2) {
        choice = question.choice2;
      } else if (question.correct_answer == 3) {
        choice = question.choice3;
      }
      const isLastQuestion = index === newQuestions.length - 1;
      setNewQuestion(
        (prev) => `${prev}${question.question}${isLastQuestion ? "" : ";"}`
      );
      setNewChoices(
        (prev) =>
          `${prev}${question.choice1},${question.choice2},${question.choice3}${isLastQuestion ? "" : ";"
          }`
      );
      setNewCorrectAnswer(
        (prev) => `${prev}${choice}${isLastQuestion ? "" : ";"}`
      );
    });
    setConfirmationVisible(true);
  };
  function cancelAction() {
    setConfirmationVisible(false);
  }

  const submitQuiz = (id) => {
    const newQuiz = {
      course_id: id,
      date,
      hour,
    };
    axios
      .post(`http://localhost:5000/quizzes/add`, newQuiz, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data.insertId);
        const newQA = {
          quiz_id: response.data.insertId,
          questions: newQuestion,
          choices: newChoices,
          correct_answers: newCorrectAnswer,
        };
        axios
          .post(`http://localhost:5000/QA/add`, newQA, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then(() => {
            console.log("QA added successfully");
            setBool((prev)=>!prev);
          })
          .catch((error) => {
            console.error(error);
          });
       
      })
      .catch((error) => {
        console.error(error);
      });
    setConfirmationVisible(false);
  };

  setTimeout(() => {
    console.log(choices)
  }, 6000);

  return (
    <div className="dashboard">
      <div className="header d-flex align-items-center justify-content-between p-3">
        <img className="header-logo" src={logo} alt="logo" />
        <p className="h3 fw-bold m-0">Welcome {coachName}</p>
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
                navigate(`/Coach/YourCourses?coachName=${coachName}`);
              }}
            >
              Your courses
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              href="#"
              onClick={() => {
                navigate(`/Coach/YourClasses?coachName=${coachName}`);
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
                navigate(`/Coach/Quizzes?coachName=${coachName}`);
              }}
            >
              Quizzes
            </a>
          </li>
        </ul>
      </div>
      <br />

      {courses.length > 0 &&
        courses.map((course, courseIndex) => {
          // const dateObject = new Date(quiz[courseIndex].date);
          // const day = dateObject.getUTCDate();
          // const month = dateObject.getUTCMonth() + 1;
          // const year = dateObject.getUTCFullYear();
          return (
            <div className="container" key={courseIndex}>
              <br />
              <p className="classtableheader">{course.course_name}</p>

              {quiz.length > 0 && quiz[courseIndex] ? (
                <div>
                  <button
                    style={{
                      padding: "10px",
                      backgroundColor: "white",
                      border: "1px solid #262D5A",
                      fontWeight: "bold",
                      cursor: "auto",
                    }}
                  >

                    Quiz on {quiz[courseIndex].date.substring(0,10)} at {quiz[courseIndex].hour}
                  </button>
                  <div className='scrollable-table'>
                    <table className="container table table-hover">
                      <thead>
                        <tr>
                          <th scope="col">Questions</th>
                          <th scope="col">Answers</th>
                        </tr>
                      </thead>
                      <tbody>
                        {questions.length > 0 &&
                          questions[courseIndex] &&
                          questions[courseIndex].map(
                            (question, questionIndex) => (
                              <tr key={questionIndex}>
                                <td>{question}</td>
                                <td>
                                  {choices.length > 0 && choices[courseIndex] &&
                                    choices[courseIndex][questionIndex].map(
                                      (choice, choiceIndex) => (
                                        <div key={choiceIndex}>
                                          <input type="radio" value={choice} />
                                          <label style={{color:"#262D5A"}}>{choice}</label>
                                          <br />
                                        </div>
                                      )
                                    )}
                                </td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </table></div>
                  {" "}
                </div>
              ) : (
                <div>
                  <button onClick={() => addQuiz(courseIndex)}>ADD QUIZ</button>
                  {selectedCourse === courseIndex && (
                    <div>
                      <br />
                      Choose a date{" "}
                      <input
                        type="date"
                        onChange={(e) => {
                          setDate(e.target.value);
                        }}
                      />
                      <br />
                      <br />
                      Choose an hour{" "}
                      <input
                        type="time"
                        onChange={(e) => {
                          setHour(e.target.value);
                        }}
                      />
                      <div className='scrollable-table'>
                        <table className="newquiz container table">
                          <thead>
                            <tr>
                              <th scope="col">Questions</th>
                              <th scope="col">Answers</th>
                            </tr>
                          </thead>
                          <tbody>
                            {newQuestions.map((newQuestion, newQuestionIndex) => (
                              <tr key={newQuestionIndex}>
                                <td>
                                  <input
                                    style={{ width: "350px" }}
                                    type="text"
                                    placeholder="Type the question here"
                                    name={`question`}
                                    value={newQuestion.question}
                                    onChange={(event) =>
                                      handleNewQuestionChange(
                                        newQuestionIndex,
                                        event
                                      )
                                    }
                                  />
                                </td>
                                <td className="question-answers">
                                  <div className="d-flex">
                                    <input
                                      type="radio"
                                      name={`correct_answer`}
                                      value={1}
                                      onChange={(event) =>
                                        handleNewQuestionChange(
                                          newQuestionIndex,
                                          event
                                        )
                                      }
                                    />
                                    <input
                                      type="text"
                                      placeholder="Type a choice 1"
                                      name={`choice1`}
                                      //value={newQuestion.choices[0]}
                                      onChange={(event) =>
                                        handleNewQuestionChange(
                                          newQuestionIndex,
                                          event
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="d-flex">
                                    <input
                                      type="radio"
                                      name={`correct_answer`}
                                      value={2}
                                      onChange={(event) =>
                                        handleNewQuestionChange(
                                          newQuestionIndex,
                                          event
                                        )
                                      }
                                    />
                                    <input
                                      type="text"
                                      placeholder="Type a choice 2"
                                      name={`choice2`}
                                      //value={newQuestion.choices[1]}
                                      onChange={(event) =>
                                        handleNewQuestionChange(
                                          newQuestionIndex,
                                          event
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="d-flex">
                                    <input
                                      type="radio"
                                      name={`correct_answer`}
                                      value={3}
                                      onChange={(event) =>
                                        handleNewQuestionChange(
                                          newQuestionIndex,
                                          event
                                        )
                                      }
                                    />
                                    <input
                                      type="text"
                                      placeholder="Type a choice 3"
                                      name={`choice3`}
                                      // value={newQuestion.choices[2]}
                                      onChange={(event) =>
                                        handleNewQuestionChange(
                                          newQuestionIndex,
                                          event
                                        )
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <button onClick={() => addQuestion(courseIndex)}>
                        Add question
                      </button>
                      <br />
                      <button onClick={addQuizzes}>submit quiz</button>
                      {isConfirmationVisible && (
                        <div className="popup-overlay">
                          <div className="popup-content">
                            <p>Are you sure?</p>
                            <button onClick={() => {
                              submitQuiz(course.course_id);
                            }}>OK</button>
                            <button onClick={cancelAction}>Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              <br />
            </div>
          );
        })}
    </div>
  );
}

export default Coach3Dashboard;
