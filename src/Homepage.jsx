import React, { useEffect, useState } from 'react';
import { useNavigate} from "react-router-dom";
import './homepage.css';
import './bootstrap.min.css';
import logo from './icons/logo.png';
import logout from './icons/logout.png';
import facebook from './icons/facebook.png';
import instagram from './icons/instagram.png';
import linkedin from './icons/linkedin.png';
import phone from './icons/phone.png';
import mail from './icons/mail.png';
import location from './icons/location.png';
import football from './images/football2.jpeg';
import tennis from './images/tennis1.jpg';
import basketball from './images/basketball1.jpg';
import swimming from './images/natation1.jpg';
import karate from './images/karate1.jpg';
import football2 from './images/football1.jpg';
import musculation from './images/musculation1.jpg';
import stadium from './images/schoolacademy.jpg';
import badminton from './images/badminton1.jpeg';
import climbing from './images/climbing1.png';

function Homepage() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className='homepage'>

            <div className="container-fluid h-header d-flex align-items-center justify-content-between">
                <a href="/"><img className="h-logo" src={logo} alt="logo" /></a>
                <ul className="h-menu-list d-flex">
                    <li><a href="/">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#gallery">Gallery</a></li>
                    <li ><a href="#contact">Contact</a></li>
                </ul>

                <div className='h-responsive-menu d-flex'>
                    <p className="h-login" onClick={()=>{navigate('/Login')}}>Log in</p>

                    <button className={isMenuOpen ? 'h-burger-menu active' : 'h-burger-menu'} type="button" onClick={toggleMenu}>
                        <i className={`burger-menu-bars ${isMenuOpen ? 'active' : ''}`} aria-hidden="true"></i>
                    </button>
                    <ul className={`menu-list ${isMenuOpen ? 'active' : ''}`}>
                        <li><a href="/">Home</a></li>
                        <li><a href="/#about">About</a></li>
                        <li><a href="/#gallery">Gallery</a></li>
                        <li><a href="/#contact">Contact</a></li>
                    </ul>
                </div>
            </div>

            <div className='container-fluid h-announce text-center'>Congratulations to the Sportify students who have been selected as volunteers for the Paris 2024 Olympic Games!</div>

            <div className='container-fluid h-hero'>
                <p>The Path to Athletic Excellence Starts at Sportify</p>
            </div>

            <div className='container-fluid h-quote text-center'>
                <p className='font-italic fw-bold'>“ Yesterday a dream, <br />today a plan,<br />tomorrow a reality ”</p>
            </div>

            <div className='container h-welcome' id='about'>
                <p>Welcome to</p>
                <h4>SPORTIFY</h4>
                <div className='row'>
                    <div className='h-wlc col-lg-6 col-sm-6'>
                        <p>
                            Our academy was founded by sports enthusiasts with a vision to disrupt traditionally
                            models of sports education and equip students with the skills they need for the future.
                            Encouraging a growth mindset, where students are open to learning, adapting, and continuously improving
                            their skills. Sports is our passion.
                        </p>
                    </div>
                    <div className='h-wlc col-lg-6 col-sm-6'>
                        <p className='h-wlc-para2'>
                            We are a community that celebrates diversity, inclusivity, and a shared love for
                            sports. With state-of-the-art facilities and a team of dedicated professionals, we provide an environment that encourages personal
                            growth, fosters resilience, and promotes a strong sense of belonging.
                        </p>
                    </div>
                </div>
            </div>

            <div className='container' id='gallery'>
                <h4 className='h-gallery-title'>GALLERY</h4>
                <div className='row h-gallery'>

                    <div className='col-lg-4 col-md-12 mb-4 mb-lg-0 h-gallery-size lateral-columns'>
                        <div className='gallery-img-wrap'>
                            <div className='gallery-img-container'>
                                <img src={basketball} className='w-100 shadow-1-strong mb-4' alt='basketball' />
                                <p className='h-gallery-text lateral-text'>Basketball</p>
                            </div>
                        </div>
                        <div className='gallery-img-wrap'>
                            <div className='gallery-img-container'>
                                <img src={karate} className='w-100 shadow-1-strong mb-4' alt='karate' />
                                <p className='h-gallery-text lateral-text'>Karate</p>
                            </div>
                        </div>
                        <div className='gallery-img-wrap'>
                            <div className='gallery-img-container'>
                                <img src={climbing} className='w-100 shadow-1-strong mb-4' alt='climbing' />
                                <p className='h-gallery-text lateral-text'>Climbing</p>
                            </div>
                        </div>
                    </div>

                    <div className='col-lg-4 col-md-12 mb-4 mb-lg-0 h-gallery-size middle-column'>
                        <div className='gallery-img-wrap'>
                            <div className='gallery-img-container'>
                                <img src={stadium} className='w-100 shadow-1-strong mb-4' alt='stadium' />
                                <p className='h-gallery-text middle-text'>Athletism</p>
                            </div>
                        </div>
                        <div className='gallery-img-wrap'>
                            <div className='gallery-img-container'>
                                <img src={swimming} className='w-100 shadow-1-strong mb-4' alt='swimming' />
                                <p className='h-gallery-text middle-text'>Swimming</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-4 mb-4 mb-lg-0 h-gallery-size lateral-columns lateral-columns-right'>
                        <div className='gallery-img-wrap'>
                            <div className='gallery-img-container'>
                                <img src={football} className='w-100 shadow-1-strong mb-4' alt='football' />
                                <p className='h-gallery-text lateral-text'>Football</p>
                            </div>
                        </div>
                        <div className='gallery-img-wrap'>
                            <div className='gallery-img-container'>
                                <img src={musculation} className='w-100 shadow-1-strong mb-4' alt='musculation' />
                                <p className='h-gallery-text lateral-text'>Fitness</p>
                            </div>
                        </div>
                        <div className='gallery-img-wrap'>
                            <div className='gallery-img-container'>
                                <img src={badminton} className='test w-100 shadow-1-strong mb-4' alt='badminton' />
                                <p className='h-gallery-text lateral-text'>Badminton</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-footer">
                <div className="container h-footer-in">
                    <div className="row">
                        <div className="col-md-6 col-sm-6 footer-left">
                            <p className='form-title' id='contact'>Let's talk</p>
                            <p className='form-subtitle'>Ask your questions or leave us a message</p>
                            <form className='footer-left'>
                                <div className="row footer-left">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="name">Name</label>
                                            <input
                                                type="text"
                                                className="h-input"
                                                id="name"
                                                name="name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input
                                                type="email"
                                                className="h-input"
                                                id="email"
                                                name="email"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        className="h-input"
                                        id="message"
                                        name="message"
                                        rows="2"
                                        required
                                    />
                                </div>

                                <button type="submit" className="form-submit">
                                    Submit
                                </button>
                            </form>
                        </div>

                        <div className="col-md-6 col-sm-6">
                            <div className='h-footer-right d-flex justify-content-center '>
                                <div className="contact-info d-flex">
                                    <img src={phone} alt="phone" />
                                    <p>+961 81 000000</p>
                                </div>
                                <div className="contact-info d-flex">
                                    <img src={mail} alt="mail" />
                                    <p>info@sportify.com</p>
                                </div>
                                <div className="contact-info d-flex">
                                    <img src={location} alt="location" />
                                    <p>Beirut, Lebanon</p>
                                </div>

                                <div className="h-social-media">
                                    <p className="social-media-title">Follow us</p>
                                    <div className="social-media d-flex">
                                        <img src={facebook} alt="Facebook" />
                                        <img src={instagram} alt="Instagram" />
                                        <img src={linkedin} alt="Linked In" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p className='copyright'>© 2023 All rights reserved.</p>
            </div>
        </div >
    );
}

export default Homepage;
