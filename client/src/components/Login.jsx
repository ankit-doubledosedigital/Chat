import React, { useState } from 'react';
import axios from 'axios';
import './Style/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import loginImage from '../Assets/login.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn, faTwitter } from '@fortawesome/free-brands-svg-icons';
// Import toastify css file
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/login', formData);
      if (response.data) {
        toast.success('Login successful');
        localStorage.setItem('name', response.data.user.username);
        localStorage.setItem('email', response.data.user.email);
        localStorage.setItem('userId', response.data.user._id);
        navigate('/home'); // Navigate to the desired page on successful login
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Login failed');
    }
  };

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
              value={formData.email}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              autoComplete="current-password"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="login-button">Login</button>7
            <Link to="/register" className="signup-button">Sign up</Link>
            
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
