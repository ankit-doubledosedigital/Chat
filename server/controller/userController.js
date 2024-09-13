// controllers/userController.js
const userDao = require('../dao/userDao');
// Register 

module.exports.registerUser = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const user = await userDao.createUser({ username, email, password });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
};
// login

module.exports.login = async (req, res) => {
    const { email, password } = req.body.data;
    try {
        const user = await userDao.findUser({ email, password });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
};

// google login

module.exports.googleLogin = async (req, res) => {
    const { user } = req.body.data;
    console.log("🚀 ~ module.exports.googleLogin= ~ user:", user)

    try {
        const data = await userDao.findUserGoogle({ user });
        console.log("🚀 ~ module.exports.googleLogin= ~ data:", data)

        if (!data) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User logged in successfully', data });
    } catch (error) {
        console.error("Error in googleLogin:", error);
        res.status(500).json({ error: 'Error logging in user' });
    }
};



