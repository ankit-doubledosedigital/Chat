const express = require('express');
const app = express();
const port = 5000;
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./db/dbConnection');
const userRoutes = require('./Routes/UserRoutes');

// Rest of your code

// console.log(login)
const cors = require('cors');

// Middleware
app.use(express.json());
// Enable Cors 
app.use(cors())



app.use('/api', userRoutes);












connectDB();


app.listen(port, () => {
    console.log('server is running port 5000')
})