import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ setPhoneNumber, setOtpSent }) => {
    const [phone, setPhone] = useState('');

    const handleRegister = async () => {
        try {
            const res = await axios.post('http://localhost:5000/auth/', {
                
                phoneNumber: phone,
            });
            console.log("🚀 ~ handleRegister ~ res:", res)
            setPhoneNumber(phone);
            setOtpSent(true);
            alert(res.data.message);
        } catch (error) {
            alert('Failed to send OTP');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your mobile number"
            />
            <button onClick={handleRegister}>Request OTP</button>
        </div>
    );
};

export default Register;
