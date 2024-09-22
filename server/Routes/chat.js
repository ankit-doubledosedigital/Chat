const express = require('express');
const router = express.Router();
const chatController = require('../controller/chat');

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadPath = path.join(__dirname, '../temporary/upload/groupProfilePicture');
const upload = multer({ dest: uploadPath,
    limits: { fieldSize: 25 * 1024 * 1024 }, // 25MB limit
   });

// Route for creating a group chat with image upload
// router.post('/createGroup', chatController.handleGroupChat);
router.post('/createGroup',[upload.single('file')], chatController.handleGroupChat);

router.get('/fetchGroups', chatController.fetchGroups);
router.delete('/deleteGroup', chatController.deleteGroup);
router.put('/updateGroup', chatController.updateGroup);
router.post('/addInvite', chatController.addInvite);
router.post('/sendMessage', chatController.sendMessage);
router.get('/fetchMessage', chatController.fetchMessage);








module.exports = router;
