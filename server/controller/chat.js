const { uuid } = require('uuidv4');
const groupDao = require('../dao/group');

// Create Group chat
module.exports.handleGroupChat = async (req, res) => {
    try {
        console.log("req",req.query)
        const newGroupChat = await groupDao.createGroupChat(req.query);

        res.status(201).json({ message: 'Create Group Chat', newGroupChat });
    } catch (error) {
        res.status(500).json({ error: 'Error Group Chat' });
    }
};

module.exports.fetchGroups = async (req, res) => {
    try {
        // console.log("req",req.query)
        const groups = await groupDao.fetchGroups(req.query);
        // console.log("🚀 ~ module.exports.fetchGroups= ~ groups:", groups)
        res.status(201).json({ message: 'Create Group Chat', groups:groups });
    } catch (error) {
        res.status(500).json({ error: 'Error Group Chat' });
    }
};


    module.exports.deleteGroup = async (req, res) => {
    try {
        const groups = await groupDao.deleteGroup(req.query);

        // Log for debugging purposes
        console.log("🚀 ~ module.exports.deleteGroup ~ req.query:", req.query);
        console.log("🚀 ~ module.exports.deleteGroups ~ groups:", groups);

        // Respond with a success message and updated groups list
        res.status(200).json({ message: 'Group deleted successfully', groups });
    } catch (error) {
        console.error("Error in deleteGroup:", error); // Log the error for debugging

        // Send a response with a 500 status code for any errors
        res.status(500).json({ error: 'Error deleting group' });
    }
};