const jwt = require('jsonwebtoken');

function generateInviteToken(userId, chatRoomId) {
  return jwt.sign({ userId, chatRoomId }, process.env.JWT_SECRET, {
    expiresIn: '1h' // Token expires in 1 hour
  });
}

module.exports = generateInviteToken;
