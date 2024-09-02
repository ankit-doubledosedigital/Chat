const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the directory exists
const uploadDir = path.join(__dirname, '..', 'groupPhoto');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Setup multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});

// const imageUpload = multer({
//     storage: storage,
//     fileFilter: function (req, file, cb) {
//         if (file.mimetype.startsWith('image/')) {
//             cb(null, true);
//         } else {
//             cb(new Error('Invalid file type, only images are allowed!'), false);
//         }
//     }
// });

// Routes
router.post('/register', userController.registerUser);
router.post('/login', userController.login);
router.post('/signInGoogle', userController.googleLogin);


module.exports = router;
