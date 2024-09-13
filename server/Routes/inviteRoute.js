const express = require('express');
const InviteController = require('../controller/inviteController');
const router = express.Router();

// Route to send chat invite
router.post('/send-invite', InviteController.sendInvite);

// Route to get invite details
router.get('/invite/:token', InviteController.getInvite);

// Route to update invite status
router.patch('/invite/:token/status', InviteController.updateInviteStatus);

module.exports = router;
