import React, { useState } from 'react';
import axios from 'axios';

import { InputOtp } from 'primereact/inputotp';
        

const VerifyOtp = ({ phoneNumber }) => {
    const [otp, setOtp] = useState('');

    const handleVerify = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
                phoneNumber,
                otp,
            });
            alert(res.data.message);
        } catch (error) {
            alert('Failed to verify OTP');
        }
    };

    return (
        <div>
            <h2>Verify OTP</h2>
            {/* <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
            /> */}
            <InputOtp 
            type="text"
            value={otp} 
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"

             mask/>

            
            <button onClick={handleVerify}>Verify OTP</button>
        </div>
    );
};

export default VerifyOtp;



        