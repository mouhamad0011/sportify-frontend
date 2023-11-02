import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Dashboards.css";
import "./bootstrap.min.css";
import logo from "./icons/logo.png";
import profile from "./icons/profile.png";
import logout from "./icons/logout.png";
import close from "./icons/close.png";
import checked from "./icons/checked.png";
import bin from "./icons/bin.png";

function Coach1Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const coachName = new URLSearchParams(location.search).get("coachName");
  const coachId = new URLSearchParams(location.search).get("coachId");
  const [bool, setBool] = useState(true);
  const [courses, setCourses] = useState([]);
  const [userData, setUserData] = useState([]);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Cpassword, setCPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [bool1,setBool1]=useState(true);
  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/courses/getAllCoursesByCoachName/${coachName}`
      )
      .then((response) => {
        setCourses(response.data);
        //console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
    axios
      .get(`http://localhost:5000/users/getOneUserById/${coachId}`)
      .then((response) => {
        setUserData(response.data);
        //console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, [bool]);

  const [modal, setmodal] = useState(false);
  const toogleModal = () => {
    setmodal(!modal);
  };
  const [isEditable, setIsEditable] = useState(false);
  const handleEditing = () => {
    var x = prompt("enter your old password");
    if (x == userData[0].password) {
      setIsEditable(true);
    }
  };

  const saveProfile = () => {
    if (username.trim() != "") {
        console.log(username)
      axios
        .get(`http://localhost:5000/users/getUsersByUsername/${username}`)
        .then((res) => {
          if (res.data.length > 0){
           alert("Username already exists")
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    if (email.trim() != "") {
      axios
        .get(`http://localhost:5000/users/getUsersByEmail/${email}`)
        .then((res) => {
          if (res.data.length > 0) {
          alert("Email already exists")
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
   
      if (newpassword.trim() === Cpassword.trim()) {
        const updates = {
          username: username.trim() != "" ? username : userData[0].username,
          email: email.trim() != "" ? email : userData[0].email,
          password:
            newpassword.trim() != "" ? newpassword : userData[0].password,
        };
        axios
          .put(`http://localhost:5000/users/update/${coachId}`, updates, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            console.log(res);
            setUsername("");
            setEmail("");
            setNewPassword("");
            setCPassword("");
            setBool(!bool);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    
  };
  return (
    <div className="dashboard">
      <div className="header d-flex align-items-center justify-content-between p-3">
        <img className="header-logo" src={logo} alt="logo" />
        <p className="h3 fw-bold m-0">Welcome {coachName}</p>
        <div className="profile-logout d-flex gap-3">
          <img
            className="header-icon"
            src={profile}
            alt="profile"
            onClick={toogleModal}
          />
          <img className="header-icon" src={logout} alt="logout" />
        </div>
      </div>
      {modal && (
        <div className="popup d-flex flex-column">
          <img
            onClick={toogleModal}
            className="closebt"
            src={close}
            alt="close"
          />
          {!isEditable && <p class="text-center">YOUR PROFILE</p>}
          {isEditable && <p class="text-center">Edit field(s) you want</p>}

          <div class="row mb-3">
            <label for="colFormLabel" class=" col-sm-2 col-form-label ">
              Full name
            </label>
            <div class="col-sm-10 ">
              <input
                type="text"
                //class="form-control text-center"
                id="colFormLabel"
                placeholder={userData[0].full_name}
                onChange={(e) => setFullName(e.target.value)}
                readOnly
                style={{ color: "black" }}
              />
            </div>
          </div>
          <div class="row mb-3">
            <label for="colFormLabel" class="col-sm-2 col-form-label">
              Username
            </label>
            <div class="col-sm-10">
              {!isEditable && (
                <input
                  type="text"
                  // class="form-control text-center"
                  id="colFormLabel"
                  placeholder={userData[0].username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ color: "black" }}
                  readOnly
                />
              )}
              {isEditable && (
                <input
                  type="text"
                  // class="form-control text-center"
                  id="colFormLabel"
                  placeholder={userData[0].username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ color: "black" }}
                />
              )}
            </div>
          </div>
          <div class="row mb-3">
            <label for="colFormLabel" class="col-sm-2 col-form-label">
              Email
            </label>
            {!isEditable && (
              <div class="col-sm-10">
                <input
                  type="email"
                  //class="form-control text-center"
                  id="colFormLabel"
                  placeholder={userData[0].email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ color: "black" }}
                  readOnly
                />
              </div>
            )}
            {isEditable && (
              <div class="col-sm-10">
                <input
                  type="email"
                  //class="form-control text-center"
                  id="colFormLabel"
                  placeholder={userData[0].email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ color: "black" }}
                />
              </div>
            )}
          </div>
          {isEditable && (
            <div class="row mb-3">
              <label for="colFormLabel" class="col-sm-2 col-form-label">
                New Password
              </label>
              <div class="col-sm-10">
                <input
                  type="password"
                  //class="form-control text-center"
                  id="colFormLabel"
                  placeholder="enter new password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ color: "black" }}
                />
              </div>
            </div>
          )}
          {isEditable && (
            <div class="row mb-3">
              <label for="colFormLabel" class="col-sm-2 col-form-label">
                Confirm Password
              </label>

              <div class="col-sm-10">
                <input
                  type="password"
                  //class="form-control text-center"
                  id="colFormLabel"
                  placeholder="confirm your password"
                  onChange={(e) => setCPassword(e.target.value)}
                  style={{ color: "black" }}
                />
              </div>
            </div>
          )}

          <div className="popup-buttons d-flex justify-content-center">
            <button onClick={handleEditing}>EDIT</button>
            <button onClick={saveProfile}>SAVE</button>
          </div>
        </div>
      )}
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
          <li className="nav-item">
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

      <div className="scrollable-table">
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
