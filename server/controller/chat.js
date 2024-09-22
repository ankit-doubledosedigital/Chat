const { uuid } = require('uuidv4');
const groupDao = require('../dao/group');
const message = require('../models/message');
const fs = require('fs').promises;

module.exports.handleGroupChat = async (req, res) => {
    try {
        // Read the file and convert it to a base64 string
        const fileData = await fs.readFile(req.file.path);
        const base64URL = `data:${req.file.mimetype};base64,${fileData.toString('base64')}`;

        // Set the base64 URL in the query
        req.query.url = base64URL;


        // Save the group chat with the base64 image URL
        const newGroupChat = await groupDao.createGroupChat(req.query);

        res.status(201).json({ message: 'Create Group Chat', newGroupChat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating Group Chat' });
    }
};

module.exports.fetchGroups = async (req, res) => {
    try {
        const groups = await groupDao.fetchGroups(req.query);

        res.status(201).json({ message: 'Create Group Chat', groups: groups });
    } catch (error) {
        res.status(500).json({ error: 'Error Group Chat' });
    }
};


module.exports.deleteGroup = async (req, res) => {
    try {
        const groups = await groupDao.deleteGroup(req.query);

        res.status(200).json({ message: 'Group deleted successfully', groups });
    } catch (error) {
        console.error("Error in deleteGroup:", error); // Log the error for debugging

        res.status(500).json({ error: 'Error deleting group' });
    }
};

module.exports.updateGroup = async (req, res) => {
    try {
        const groups = await groupDao.updateGroup(req.body);


        res.status(200).json({ message: 'Group updated successfully', groups });
    } catch (error) {
        console.error("Error in deleteGroup:", error); // Log the error for debugging

        // Send a response with a 500 status code for any errors
        res.status(500).json({ error: 'Error update group' });
    }
};


module.exports.addInvite = async function (req, res) {
    try {
        let responseObj = { success: true, message: "MESSAGE.INVITE_ACCEPTED" }
        let group = await groupDao.getGroupByCode(req.body.data.token)
        if (group.invitees.find(obj => obj.uid == req.body.data.uid)) {
            responseObj = { success: true, isExist: true, message: "MESSAGE.INVITE_ACCEPTED", group: group }
        } else {

            await groupDao.verifyInvitation(req.body.data)
            responseObj = { success: true, message: "MESSAGE.INVITE_ACCEPTED", group: group }
        }

        res.status(200).send(responseObj)
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Unable to accept invitation' });
    }
}


module.exports.sendMessage = async (req, res) => {
    try {




        const sendMessage = await groupDao.sendMessage(req.body.data);

        console.log("🚀 ~ module.exports.sendMessage= ~ sendMessage:", sendMessage)


        res.status(201).json({ message: 'Create Group Chat',message: sendMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating Group Chat' });
    }
};


module.exports.fetchMessage = async (req, res) => {
    try {
        const fetchMessage = await groupDao.fetchMessage(req.query);
        
        res.status(201).json({ message: 'Message fetched', message: fetchMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating Group Chat' });
    }
};