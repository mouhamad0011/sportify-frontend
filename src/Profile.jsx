import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Dashboards.css";
import "./bootstrap.min.css";
import close from "./icons/close.png";
function Profile(props) {
  const [bool, setBool] = useState(true);
  const [userData, setUserData] = useState([]);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Cpassword, setCPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const { coachId } = props;

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/getOneUserById/${coachId}`)
      .then((response) => {
        setUserData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, [bool]);
  const [modal, setmodal] = useState(true);
  const toogleModal = () => {
    setmodal(false);
  }
  const [isEditable, setIsEditable] = useState(false);
  const handleEditing = () => {
    var x = prompt("enter your old password");
    if (x == userData[0].password) {
      setIsEditable(true);
    }
  };
  const saveProfile = () => {
    if (username.trim() !== "" && email.trim() !== "") {
      axios
        .get(`http://localhost:5000/users/getUsersByUsername/${username}`)
        .then((res) => {
          if (res.data.length > 0) {
            alert("Username already exists");
          } else {
            axios
              .get(`http://localhost:5000/users/getUsersByEmail/${email}`)
              .then((res) => {
                if (res.data.length > 0) {
                  alert("Email already exists");
                } else {
                  updateProfile();
                }
              })
              .catch((error) => {
                console.error(error);
              });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else if(username.trim() !== "") {
        axios
        .get(`http://localhost:5000/users/getUsersByUsername/${username}`)
        .then((res) => {
          if (res.data.length > 0) {
            alert("Username already exists");
          }
          else{
            updateProfile();
          }
        })
        .catch((error)=>{
            console.error(error)
        })
        
    }
    else if(email.trim() !== "") {
        axios
        .get(`http://localhost:5000/users/getUsersByEmail/${email}`)
        .then((res) => {
          if (res.data.length > 0) {
            alert("Email already exists");
          }
          else{
            updateProfile();
          }
        })
        .catch((error)=>{
            console.error(error)
        }) 
    }
    else{
        updateProfile();
    }
  };

  const updateProfile = () => {
    if (newpassword.trim() === Cpassword.trim()) {
      const updates = {
        username: username.trim() || userData[0].username,
        email: email.trim() || userData[0].email,
        password: newpassword.trim() || userData[0].password,
      };
      axios
        .put(`http://localhost:5000/users/update/${coachId}`, updates, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setUsername("");
          setEmail("");
          setNewPassword("");
          setCPassword("");
          setIsEditable(!isEditable)
          setBool(!bool);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("New password and confirm password do not match.");
    }
  };

  return (
    userData[0] && modal &&(
    <div className="popup d-flex flex-column">
      {!isEditable && <p className="text-center">YOUR PROFILE</p>}
      {isEditable && <p className="text-center">Edit field(s) you want</p>}

      <div className="row mb-3">
        <label htmlFor="colFormLabel" className=" col-sm-2 col-form-label ">
          Full name
        </label>
        <div className="col-sm-10 ">
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
      <div className="row mb-3">
        <label htmlFor="colFormLabel" className="col-sm-2 col-form-label">
          Username
        </label>
        <div className="col-sm-10">
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
      <div className="row mb-3">
        <label htmlFor="colFormLabel" className="col-sm-2 col-form-label">
          Email
        </label>
        {!isEditable && (
          <div className="col-sm-10">
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
          <div className="col-sm-10">
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
        <div className="row mb-3">
          <label htmlFor="colFormLabel" className="col-sm-2 col-form-label">
            New Password
          </label>
          <div className="col-sm-10">
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
        <div className="row mb-3">
          <label htmlFor="colFormLabel" className="col-sm-2 col-form-label">
            Confirm Password
          </label>

          <div className="col-sm-10">
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
    )
  );
}
export default Profile;
