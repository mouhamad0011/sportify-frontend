import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboards.css";
import "./bootstrap.min.css";
import close from "./icons/close.png";
import bcrypt from 'bcryptjs';

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
      .get(`${process.env.REACT_APP_API_URL}users/getOneUserById/${coachId}`)
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
  const handleEditing = async () => {
    var x = prompt("Enter your old password");
    const match = await bcrypt.compare(x, userData[0].password)
    if (match) {
      setIsEditable(true);
    }
  };

  const saveProfile = () => {
    if (username.trim() !== "" && email.trim() !== "") {
      axios
        .get(`${process.env.REACT_APP_API_URL}users/getUsersByUsername/${username}`)
        .then((res) => {
          if (res.data.length > 0) {
            alert("This username is already taken.");
          } else {
            axios
              .get(`${process.env.REACT_APP_API_URL}users/getUsersByEmail/${email}`)
              .then((res) => {
                if (res.data.length > 0) {
                  alert("An account with this email already exists.");
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
    } else if (username.trim() !== "") {
      axios
        .get(`${process.env.REACT_APP_API_URL}users/getUsersByUsername/${username}`)
        .then((res) => {
          if (res.data.length > 0) {
            alert("This username is already taken.");
          }
          else {
            updateProfile();
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
    else if (email.trim() !== "") {
      axios
        .get(`${process.env.REACT_APP_API_URL}users/getUsersByEmail/${email}`)
        .then((res) => {
          if (res.data.length > 0) {
            alert("An account with this email already exists.");
          }
          else {
            updateProfile();
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
    else {
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
        .put(`${process.env.REACT_APP_API_URL}users/update/${coachId}`, updates, {
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
    userData[0] && modal && (
      <div className="popup d-flex flex-column">
        {!isEditable && <p className="text-center">YOUR PROFILE</p>}
        {isEditable && <p className="text-center">Edit the field(s) of your choice</p>}

        <div className="d-flex justify-content-end align-items-end">
          <label>Full name</label>
          <input
            type="text"
            placeholder={userData[0].full_name}
            onChange={(e) => setFullName(e.target.value)}
            readOnly
            className="regular-placeholder"
          />
        </div>

        <div className="d-flex justify-content-end align-items-end">
          <label>Username</label>
          {!isEditable && (
            <input
              type="text"
              placeholder={userData[0].username}
              onChange={(e) => setUsername(e.target.value)}
              readOnly
            />
          )}
          {isEditable && (
            <input
              type="text"
              placeholder={userData[0].username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
        </div>

        <div className="d-flex justify-content-end align-items-end">
          <label>Email</label>
          {!isEditable && (
            <input
              type="email"
              placeholder={userData[0].email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly
            />
          )}
          {isEditable && (
            <input
              type="email"
              placeholder={userData[0].email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
        </div>

        {isEditable && (
          <div className="d-flex justify-content-end align-items-end">
            <label>New password</label>
            <input
              type="password"
              placeholder="Enter new password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        )}

        {isEditable && (
          <div className="d-flex justify-content-end align-items-end">
            <label>Confirm password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              onChange={(e) => setCPassword(e.target.value)}
            />
          </div>
        )}

        <div className="popup-buttons d-flex justify-content-center">
          {!isEditable ?
          <button onClick={handleEditing}>EDIT</button>
          :
          <button onClick={saveProfile}>SAVE</button>
          }
        </div>
      </div>
    )
  );
}
export default Profile;
