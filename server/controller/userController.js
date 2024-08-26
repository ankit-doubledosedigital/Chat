// controllers/userController.js
const userDao = require('../dao/userDao');
// Register 

module.exports.registerUser = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const user = await userDao.createUser({username, email, password} );

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
};
// login

module.exports.login = async (req, res) => {
    const {email, password} = req.body.data;
    try {
        const user = await userDao.findUser({email, password} );
        console.log("🚀 ~ module.exports.login= ~ user:", user)

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
};

// forget Password
