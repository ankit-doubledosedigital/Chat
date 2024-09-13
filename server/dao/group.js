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
    console.log("🚀 ~ module.exports.fetchGroups= ~ options:", options)
    try {
       const data= await model.chatRoom.find({uid:options.uid})
       console.log("🚀 ~ module.exports.fetchGroups= ~ data:", data)
       
       return data;

    } catch (error) {
      console.error('Error creating Group:', error);
      throw new Error('Error creating Group');
    }
  };


  //  delete

  module.exports.deleteGroup = async (options) => {
    try {
      return await model.chatRoom.deleteOne({_id:options._id})
      
    } 
    
    catch (error) {
      // console.log("🚀 ~ module.exports.deleteGroup ~ uid:", uid)
      console.error('Error not delete Group:', error);
      throw new Error('Error creating Group');
    }
  };

  // update group
  module.exports.updateGroup = async (options) => {
    try {
      return await model.chatRoom.updateOne({ _id: options._id },{$set:{name:options.name}});
    } catch (error) {
      console.error('Error updating Group:', error);
      throw new Error('Error updating Group');
    }
  };
  



