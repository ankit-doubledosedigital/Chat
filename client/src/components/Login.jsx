import React, { useState } from 'react';
import axios from 'axios';
import './Style/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import loginImage from '../components/Assets/login.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn, faTwitter } from '@fortawesome/free-brands-svg-icons';
// Import toastify css file
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Google Login
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:5000/api/login', {
        data: {
          email: email,
          password: password,

        }
      });
      if (response.data) {
        toast.success('Login successful');
        localStorage.setItem('name', response.data.user.username);
        localStorage.setItem('email', response.data.user.email);
        localStorage.setItem('userId', response.data.user._id);
        // localStorage.setItem('picture', response.data.user.picture);


        navigate('/chat'); // Navigate to the desired page on successful login
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Login failed');
    }
  };

  const signInWithGoogle = async (credentialResponse) =>{
    try{
    let user =jwtDecode(credentialResponse.credential)
    localStorage.setItem('token',credentialResponse.credential)
    const response = await axios.post('http://localhost:5000/api/signInGoogle', {
      data: {
          user : user
      }
    });
    if (response.data) {
      toast.success('Login successful');
      localStorage.setItem('name', response.data.data.username);
      localStorage.setItem('email', response.data.data.email);
      localStorage.setItem('userId', response.data.data._id);
      localStorage.setItem('pictures', response.data.data.photoUrl);
      


      navigate('/chat'); // Navigate to the desired page on successful login
    } else {
      toast.error(response.data.message);
    }
  }     catch (error) {
    console.error(error);
    toast.error('Login failed');

  }
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-image-container">
          <img src={loginImage} alt="Login" className="login-image" />
        </div>
        <form onSubmit={handleLoginSubmit} className="login-form">
          <div className="form-header">
            <h1>Hello, welcome!</h1>
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              autoComplete="current-password"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="login-button">Login</button>
            <Link to="/register" className="signup-button">Sign up</Link>
            <Link to="/reset-password">Forgot your password?</Link>

            <div id="signInButton">
              <GoogleLogin
                onSuccess={credentialResponse => {
                  signInWithGoogle(credentialResponse); 
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
              />;
            </div>


          </div>
          <div className="social-media">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-media-icon">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-media-icon">
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="social-media-icon">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
