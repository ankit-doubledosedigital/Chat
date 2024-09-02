const model = require('../models');
const { v4: uuidv4 } = require('uuid');

//  Create-Group-Chat\

module.exports.createGroupChat = async (options) => {
    try {
      const group = await model.chatRoom.create({
        uid: options.uid,
        name: options?.name || 'Untitled Chat',
        invitationCode: uuidv4(),
        sortingBy: new Date(),
        isGroup: true,
        profilePhoto: options?.url || '',
        seenMessage: {
          uid: options.uid,
          messageId: null,
          date: new Date(),
        },
      });
      return group;
    } catch (error) {
      console.error('Error creating Group:', error);
      throw new Error('Error creating Group');
    }
  };

  // fetch 

  module.exports.fetchGroups = async (options) => {
    try {
      return await model.chatRoom.find({uid:options.uid})
    } catch (error) {
      console.error('Error creating Group:', error);
      throw new Error('Error creating Group');
    }
  };


  //  delete

  module.exports.deleteGroup = async (options) => {
    try {
      return await model.chatRoom.deleteOne({uid:options.uid})
      
    } 
    
    catch (error) {
      // console.log("🚀 ~ module.exports.deleteGroup ~ uid:", uid)
      console.error('Error not delete Group:', error);
      throw new Error('Error creating Group');
    }
  };


