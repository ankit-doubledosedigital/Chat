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

    let existingUser = await model.User.findOne({ uid: user.sub });

    if (!existingUser) {
      // User not found, create a new user
      const newUser = new model.User({
        uid: user.sub,
        email: user.email,  // Assuming email is part of user object
        username: user.name, // Assuming name is part of user object
        photoUrl: user.picture,
        // Add other fields as necessary
      });

      // Save the new user
      await newUser.save();
      return newUser;
    } else {
      // User found, update the last login
      existingUser.lastLogin = new Date();
      await existingUser.save();
      return existingUser;
    }
  } catch (error) {
    console.error("Error in findUserGoogle:", error);
    throw new Error('Error finding or saving user');
  }
};



