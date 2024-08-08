const userDao = require('../dao/userDao');
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const requestOtp = async (req, res) => {
    const { phoneNumber } = req.body;

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    let user = await userDao.findUserByPhoneNumber(phoneNumber);

    if (!user) {
        await userDao.createUser(phoneNumber, otp, otpExpiry);
    } else {
        await userDao.updateUserOtp(user, otp, otpExpiry);
    }

    client.messages
        .create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        })
        .then(() => res.status(200).json({ message: 'OTP sent' }))
        .catch(err => res.status(500).json({ error: 'Failed to send OTP' }));
};

const verifyOtp = async (req, res) => {
    const { phoneNumber, otp } = req.body;

    const user = await userDao.findUserByPhoneNumber(phoneNumber);

    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpiry < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    await userDao.clearUserOtp(user);

    res.status(200).json({ message: 'OTP verified successfully' });
};

module.exports = {
    requestOtp,
    verifyOtp,
};
