// ResetPasswordRequest.js

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { token } = useParams();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/reset-password/${token}', { email,password });
      toast.success(response.data.message);
      navigate('/login');
    } catch (error) {
      console.error(error);
      toast.error('Failed to send reset password email');
    }
  };

  return (
    <div className="reset-password-request">
      <form onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Request Reset Link</button>
      </form>
    </div>
  );
};

export default ResetPasswordRequest;
