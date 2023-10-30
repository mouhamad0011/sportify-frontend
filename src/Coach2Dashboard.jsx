import React, { useState ,useEffect} from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import axios from 'axios';
import './Dashboards.css';
import './bootstrap.min.css';
import logo from './icons/logo.png';
import profile from './icons/profile.png';
import logout from './icons/logout.png';
import checked from './icons/checked.png';
import unchecked from './icons/unchecked.png';

function Coach2Dashboard() {
    const navigate=useNavigate();
    const location = useLocation();
    const coachName = new URLSearchParams(location.search).get('coachName');
    const [bool,setBool]=useState(true);
    const [tests,setTest]=useState([]);
    const [names,setNames]=useState([]);
    
    useEffect(() => {
      axios.get(`http://localhost:5000/users/getUserId/${coachName}`)
      .then(response => {
        const data = response.data;
        axios.get(`http://localhost:5000/classes/getClassCourseDateHour/${data[0].user_id}`)
          .then(response => {
            const data = response.data;
            setTest(data);
            response.data.forEach((element) => {
                axios.get(`http://localhost:5000/classes/getClassNamesPresence/${element.class_id}`)
                .then(response => {
                  const data = response.data;
                  //console.log(data)
                  //setQuiz((prev)=>[...prev,response.data[0]]);
                  setNames((prev)=>[...prev,data]);
                })
                .catch(error => {
                  console.error(error);
                });
            });
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
        
      }, [bool]);

    const toggleCheck = async (e,id) => {
     const response= await axios.put(`http://localhost:5000/enrollement/update/${e.target.name}/${id}`);
    //    setBool(!bool);
       console.log(response.data);
    };

    return (
        <div className="dashboard">
            <div className='header d-flex align-items-center justify-content-between p-3'>
                <img className='header-logo' src={logo} alt='logo' />
                <p className='h3 fw-bold m-0'>Welcome {coachName}</p>
                <div className='profile-logout d-flex gap-3'>
                    <img className='header-icon' src={profile} alt='profile' />
                    <img className='header-icon' src={logout} alt='logout' />
                </div>
            </div>
            <br />

            <div className='container top-dashboard'>
                <p className='manage fw-bold font-italic fs-4'>MANAGE</p>
                <ul className="nav">
                    <li className="nav-item">
                        <a className="nav-link" aria-current="page" href="#" onClick={()=>{navigate(`/Coach/YourCourses?coachName=${coachName}`);}}>Your courses</a>
                    </li>
                    <li className="nav-item nav-item-active">
                        <a className="nav-link" href="#" onClick={()=>{navigate(`/Coach/YourClasses?coachName=${coachName}`);}} >Your classes</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#" onClick={()=>{navigate(`/Coach/Quizzes?coachName=${coachName}`);}}>Quizzes</a>
                    </li>
                </ul>
            </div>
            <br />

            {tests.map((test, classIndex) =>{
                
                const dateObject = new Date(test.date);
                const day = dateObject.getUTCDate();
                const month = dateObject.getUTCMonth() + 1;
                const year = dateObject.getUTCFullYear();
                return  (
                <div className='container' key={classIndex}>
                     <br />
                    <p className='classtableheader'>Class {test.class_id}: {test.course_name} on {day} 
                     /{month}/{year} at {test.hour}
                    </p>
                    <p className='classtablesubheader'>Trainees registered to Class {test.class_id}</p>
                    <table className="container table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Trainee name</th>
                                <th scope="col">Attendance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {names.length>0 && names[classIndex] && names[classIndex].map((name, traineeIndex) => (
                                <tr key={traineeIndex}>
                                    <th scope="row">{name.full_name}</th>
                                    <td>
                                        {name.present
                                                      ? <input name={name.full_name} type="checkbox" checked onChange={(e)=>{toggleCheck(e,test.class_id)}}/>
                                                      : <input name={name.full_name} type="checkbox" onChange={(e)=>{toggleCheck(e,test.class_id)}} />
                                        }
                                    </td>
                                  
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <br />
                </div>
            );
                            })}
        </div>
    );
}

export default Coach2Dashboard;
