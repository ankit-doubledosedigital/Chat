import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

const Invite = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasCalled = useRef(false);  // Using useRef to track the function call

  // Get the 'token' query parameter from the URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const addGroup = async () => {
    if (hasCalled.current) return;  // Prevent further calls
    hasCalled.current = true;  // Set it to true after the first call

    try {
      const response = await axios.post(`${API_URL}/chat/addInvite`, {
        data: {
          uid: localStorage.getItem('userId'),
          token: token
        }
      });
      console.log("🚀 ~ addGroup ~ response:", response);

      if (response.data.isExist) {
        toast.warning('Already exists in the group');
      }
      navigate('/chat');

    } catch (error) {
      console.error("Error fetching groups:", error); // Log the error for debugging
    }
  };

  useEffect(() => {
    if (token) {
      addGroup();
    }
  }, [token]);

  return <div></div>;
};

export default Invite;
