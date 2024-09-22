const express = require('express');
const http = require('http'); // Import the http module
const app = express();
const port = 5000;
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./db/dbConnection');
const userRoutes = require('./Routes/UserRoutes');

const cors = require('cors');

// Middleware
app.use(express.json());
// Enable Cors 
app.use(cors())

// Create an HTTP server and pass the Express app to it
const server = http.createServer(app);



// API Routes
app.use('/api', userRoutes);
app.use('/chat', require('./Routes/chat'));
app.use('/invite', require('./Routes/inviteRoute'));

// Connect to the database
connectDB();

// Start the HTTP server (not app.listen)
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
