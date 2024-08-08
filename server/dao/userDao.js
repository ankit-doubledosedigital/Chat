const User = require('../models/user');

const findUserByPhoneNumber = async (phoneNumber) => {
    return await User.findOne({ phoneNumber });
};

const createUser = async (phoneNumber, otp, otpExpiry) => {
    const user = new User({ phoneNumber, otp, otpExpiry });
    return await user.save();
};

const updateUserOtp = async (user, otp, otpExpiry) => {
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    return await user.save();
};

const clearUserOtp = async (user) => {
    user.otp = null;
    user.otpExpiry = null;
    return await user.save();
};

module.exports = {
    findUserByPhoneNumber,
    createUser,
    updateUserOtp,
    clearUserOtp,
};
