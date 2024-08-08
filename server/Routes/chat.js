const express = require('express');
const router = express.Router();
const chatController = require("../controller/chats.js")
const multer = require('multer');
const path = require("path");
const uploadPath = path.join(__dirname, '../temporary/upload/images');
const upload = multer({ dest: uploadPath });


router.get("/", chatController.getChatsList);
router.post('/prompt', chatController.sendPrompt);
// router.post('/group', chatController.createGroup);
router.get('/chat', chatController.initialChatDetails);
router.get('/searchChat', chatController.searchChatDetails);
router.get('/searchUpChat', chatController.searchUpChat);
router.get('/message', chatController.getChatById);
router.delete('/message', chatController.deleteChatById);
router.get('/edit-message/:id', chatController.editMessage);
router.put('/update-message/:id', chatController.updateMessage);
router.delete('/selectmessage', chatController.deleteSelectedMessages);
router.delete('/selectGroup', chatController.deleteSelectedGroup);
router.get('/fetchAllmessages', chatController.fetchAllMessages);
router.put('/block-user-group', chatController.blockUserFromGroup)
router.post('/getBlockUserList',chatController.getBlockedUserList)
router.post('/attachFile', [upload.array('file')], chatController.uploadAttachFile);
router.get('/reply-message', chatController.getReplyMessageById);
router.post('/forwardMessage', chatController.forwardMessage);
router.put('/reactMessage', chatController.reactMessage);
router.put('/removeReactMessage', chatController.reactMessage);
router.post('/createPoll', chatController.createPoll);
router.put('/updatePoll', chatController.updatePoll);
router.get('/getPollUserList', chatController.getPollUserList);
router.post('/addToBookMark', chatController.addToBookMark);
router.get('/getBookMarkMessage', chatController.getBookMarkMessage);
router.delete('/removeFromBookMark', chatController.removeFromBookMark);
router.post('/shareContact', chatController.shareContact);








module.exports = router;