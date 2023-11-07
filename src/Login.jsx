import { React, useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./UseAuthContext";

function Login() {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { dispatch } = useAuthContext();
  const [span,setSpan]=useState("");
  const [loginSpan,setLoginSpan]=useState('');
  const [bool,setBool]=useState(true);
  const [passwordColor,setPasswordColor]=useState("");
  const [emailColor,setEmailColor]=useState("");
  

  useEffect(()=>{

  },[bool])
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
      setPasswordColor("#C23640");
      alert(
        "Password should be minimum 8 characters and contain 1 lowercase, 1 uppercase, 1 digit and 1 special character."
      );
      return;
    }
    else if(email.trim()==""){
      setEmailColor("#C23640");
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
          `${process.env.REACT_APP_API_URL}users/add`,
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
        setSpan("You have registered successfully!Login now");
        setPasswordColor("");
        setEmailColor('');
        //window.location.reload(false);
      } catch (error) {
        setSpan("Failed to register");
        console.log("Error while registering", error);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
       `${process.env.REACT_APP_API_URL}users/getOneUserByEmailPassword/${loginEmail}/${loginPassword}`
      );
      const userData = response.data;
      const role = response.data.user.role;
      console.log(response.data)
      
      localStorage.setItem('user', JSON.stringify(userData));
          dispatch({ type: 'LOGIN', payload: userData });

      if (role.toLowerCase() == "admin") {
        navigate(`/Admin/AllCoaches?adminName=${userData.user.full_name}&adminId=${userData.user.user_id}`);
      } else if (role.toLowerCase() == "coach") {
        navigate(
          `/Coach/YourCourses?coachName=${userData.user.full_name}&coachId=${userData.user.user_id}`
        );
      } else if (role.toLowerCase() == "trainee") {
        navigate(
          `/Trainee/AllCourses?traineeName=${userData.user.full_name}&traineeId=${userData.user.user_id}`
        );
      }
    } catch (error) {
      setLoginSpan("Incorrect email or password!");
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
            
            <div className="d-flex justify-content-center">
            <span style={{color:"white",textAlign:"center",fontStyle:"italic"}}>{span}</span>
            </div>
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
              style={emailColor!="" ? {border:`3px solid ${emailColor}`}:{border:"none"}}
              onChange={handleEmail}
            />
            
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Password"
              required="required"
              style={passwordColor!="" ? {border:`3px solid ${passwordColor}`}:{border:"none"}}
              onChange={handlePassword}
            />
            
        
            <div className="role">
              <input type="radio" name="role" onChange={handleRole}  />
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
            {
              loginSpan!=""&&
              <div className="d-flex justify-content-center">
                <span style={{color:"#C23640",textAlign:"center",fontStyle:"italic"}}>{loginSpan}</span>
              </div>
            }
            <button className="button">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
