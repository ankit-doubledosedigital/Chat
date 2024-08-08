const express = require('express');
const app = express();
const port = 8080;

require('dotenv').config();
const connectDB = require('./db/dbConnection');

// Rest of your code


const cors = require('cors');

// Middleware
app.use(express.json());
// Enable Cors 
app.use(cors())














connectDB();


app.listen(port, () => {
    console.log('server is running port 8080')
})