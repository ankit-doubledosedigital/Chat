// models/userModel.js
const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const collectionSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100
  },
  password: {
    type: String,
    minlength: 6
  },
  photoUrl: {
    type: String,
  },
  uid: {
    type: String,
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to hash the password before saving the user
collectionSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// Method to compare passwords
collectionSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
module.exports = { collectionSchema, collectionName: "User" }


