// dao/userDao.js
const model = require('../models');



const bcrypt = require('bcrypt');

module.exports.createUser = async (userData) => {
  try {
    const user = new model.User(userData);


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

    const user = await model.User.findOne({ email });

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
module.exports.findUserGoogle = async (userData) => {
  try {
    const { user } = userData;

    // Log the sub value being searched

    // Find the user by the 'sub' value
    let uid = await model.User.findOne({ uid: user.sub });
    

    if (!uid) {
      // User not found, create a new user
      uid = new User({
        uid: user.sub,
        email: user.email,  // Assuming email is part of user object
        username: user.name,    // Assuming name is part of user object
        // Add other fields as necessary
      });

      // Save the new user
      await uid.save();
    } else {
      // Update last login if necessary
      uid.lastLogin = new Date();
      await uid.save();
    }

    // Return the user
    return uid;
  } catch (error) {
    console.error("Error in findUserGoogle:", error);
    throw new Error('Error finding or saving user');
  }
};


