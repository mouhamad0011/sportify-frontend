import { React, useState } from "react";
import "./App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");


  const handleFullname = (e) => {
    setFullname(e.target.value);
  };
  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handleEmail = (e) => {
    const email = e.target.value;
    const emailTest = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (email !== "" && emailTest.test(email)) {
      setEmail(email);
    } 
  };
  const handlePassword = (e) => {
    const password = e.target.value;
    const passwordTest =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (passwordTest.test(password)) {
      setPassword(password);
    } 
  };
  const handleRole = (e) => {
    if (e.target.checked) {
      const spanValue = e.target.nextElementSibling.textContent;
      setRole(spanValue);
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (
      role.trim() == "" ||
      fullname.trim() == "" ||
      username.trim() == "" 
    ) {
      return;
    } 
    else if(password.trim()==""){
      alert(
        "Your password should contain at least one capital letter,one small letter,one special character,numbers and a minimum of 8 characters"
      );
      return;
    }
    else if(email.trim()==""){
      alert("Invalid email address");
      return;
    }
    else {
      const newUser = {
        role: role,
        full_name: fullname,
        username: username,
        email: email,
        password: password,
        joining_date: new Date(),
      };
      try {
        const response = await axios.post(
          "http://localhost:5000/users/add",
          newUser,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;
        console.log(data);
        setRole("");
        setFullname("");
        setUsername("");
        setEmail("");
        setPassword("");
      } catch (error) {
        console.log("Error while registering", error);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:5000/users/getOneUserByEmailPassword/${loginEmail}/${loginPassword}`
      );
      const userData = response.data;
      const role = userData[0].role;
      console.log(role);

      if (role.toLowerCase() == "admin") {
        navigate(`/Admin/AllCoaches?adminName=${userData[0].full_name}`);
      } else if (role.toLowerCase() == "coach") {
        navigate(
          `/Coach/YourCourses?coachName=${userData[0].full_name}&coachId=${userData[0].user_id}`
        );
      } else if (role.toLowerCase() == "trainee") {
        navigate(
          `/Trainee/AllCourses?traineeName=${userData[0].full_name}&traineeId=${userData[0].user_id}`
        );
      }
    } catch (error) {
      console.error("Error while logging in:", error);
    }
  };

  return (
    <div className="body">
      <div className="login-main">
        <input type="checkbox" id="chk" aria-hidden="true" />
        <div className="signup">
          <form onSubmit={handleRegistration}>
            <label className="label" htmlFor="chk" aria-hidden="true">
              Register
            </label>
            <input
              className="input"
              type="text"
              name="fullname"
              placeholder="Full name"
              required="required"
              onChange={handleFullname}
            />
            <input
              className="input"
              type="text"
              name="username"
              placeholder="Username"
              required="required"
              onChange={handleUsername}
            />
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              required="required"
              onChange={handleEmail}
            />
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Password"
              required="required"
              onChange={handlePassword}
            />
            <div className="role">
              <input type="radio" name="role" onChange={handleRole} />
              <span>Coach</span>
              <input type="radio" name="role" onChange={handleRole} />
              <span>Trainee</span>
            </div>
            <button className="button" >Register</button>
          </form>
        </div>
        <div className="login">
          <form onSubmit={handleLogin}>
            <label className="label" htmlFor="chk" aria-hidden="true">
              Login
            </label>
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              required="required"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              className="input"
              type="password"
              name="pswd"
              placeholder="Password"
              required="required"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button className="button">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
