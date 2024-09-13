        const express = require('express');
        const app = express();
        const port = 5000;
        const dotenv = require('dotenv');
        dotenv.config();

        const connectDB = require('./db/dbConnection');
        const userRoutes = require('./Routes/UserRoutes');
    


        // console.log(login)
        const cors = require('cors');

        // Middleware
        app.use(express.json());
        // Enable Cors 
        app.use(cors())



        app.use('/api', userRoutes);
        app.use('/chat', require('./Routes/chat') );

        app.use('/invite', require('./Routes/inviteRoute'));

    

      











        connectDB();


        app.listen(port, () => {
            console.log('server is running port 5000')
        })