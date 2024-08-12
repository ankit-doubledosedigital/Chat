import React, { useState } from 'react';
import './Style/Register.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link } from 'react-router-dom';
import registerImage from '../Assets/register.png';
import 'react-toastify/dist/ReactToastify.css';

const Registration = () => {
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value
    });
  };

  const validate = () => {
    const errors = {};
    if (!registerData.username) errors.username = 'Username is required';
    if (!registerData.email) errors.email = 'Email is required';
    if (!registerData.password) errors.password = 'Password is required';
    if (registerData.password !== registerData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post('http://localhost:8080/register', registerData);
        console.log(response.data);
        toast.success('Registration Successful!');
        setRegisterData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      } catch (error) {
        console.log(error);
        toast.error('Registration Failed');
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="register-image-container">
          <img src={registerImage} alt="Register" className="register-image" />
        </div>
        <div className="register-form-container">
          <form onSubmit={handleRegisterSubmit} className="register-form">
            <h1>Registration Form</h1>
            <div>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={registerData.username}
                onChange={handleRegisterChange}
              />
              {errors.username && <span className="form-error">{errors.username}</span>}
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>
            <div>
              <label>Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
              />
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>
            <button type="submit">Register</button>
            <p>
              Already Registered? <Link className='link' to='/'>Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
