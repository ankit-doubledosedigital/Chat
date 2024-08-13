// dao/userDao.js
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

module.exports.createUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    console.log(error)
    throw new Error('Error creating user');
  }
   
};


module.exports.findUser = async (userData) => {
  try {
    const { email, password } = userData;
    
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return user;
  } catch (error) {
    console.error(error);
    throw new Error('Error finding user');
  }
};
