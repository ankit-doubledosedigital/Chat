import React, { useState } from 'react';
import Register from './components/user/register';
import VerifyOtp from './components/user/VerifyOtp';

function App() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    return (
        <div className="App">
            {!otpSent ? (
                <Register setPhoneNumber={setPhoneNumber} setOtpSent={setOtpSent} />
            ) : (
                <VerifyOtp phoneNumber={phoneNumber} />
            )}
        </div>
    );
}

export default App;
