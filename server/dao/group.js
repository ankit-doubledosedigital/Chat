const model = require('../models');
const { v4: uuidv4 } = require('uuid');
const message = require('../models/message');
const mongoose = require('mongoose')


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

 
  module.exports.fetchGroups = async function (options) {
    try {
      const pipeline = [
        {
          $match: {
            $or: [
              { uid: options.uid },
              { invitees: { $elemMatch: { uid: options.uid } } }
            ]
          }
        },
        {
          $unwind: {
            path: "$invitees",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "users",
            let: { "inviteeId": { $toObjectId: "$invitees.uid" } },  // Convert invitees.uid to ObjectId
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$inviteeId"]  // Match _id with inviteeId
                  }
                }
              },
              {
                $project: {
                  username: 1,
                  photoUrl: 1,
                  email: 1,
                  uid: 1
                }
              }
            ],
            as: "invitees"
          }
        },
        {
          $unwind: {
            path: "$seenMessage",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            "seenMessage.uidAsObjectId": { $toObjectId: "$seenMessage.uid" }  // Convert seenMessage.uid to ObjectId
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "seenMessage.uidAsObjectId",  // Use the converted ObjectId field
            foreignField: "_id",
            pipeline: [{ $project: { username: 1, photoUrl: 1, email: 1, uid: 1 } }],
            as: "userDetails"
          }
        },
        {
          $unwind: {
            path: "$userDetails",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            "seenMessage.userDetails": "$userDetails"
          }
        },
        {
          $group: {
            _id: { _id: "$_id" },
            seenMessages: { $push: "$seenMessage" },
            otherFields: { $first: "$$ROOT" }
          }
        },
        {
          $replaceRoot: {
            newRoot: "$otherFields"
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $project: {
            "invitees.photoUrl": 1,
            "invitees.email": 1,
            "invitees.uid": 1,
            "invitees.username": 1,
            "uid": 1,
            "name": 1,
            "_id": 1,
            "invitationCode": 1,
            "profilePhoto": 1,
            "seenMessage": 1
          }
        }
      ];
  
      return await model.chatRoom.aggregate(pipeline);
    } catch (error) {
      console.error("Error fetching groups:", error);
      throw new Error("Failed to fetch groups. Please try again later.");
    }
  };
  
  
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
  
  module.exports.verifyInvitation = async function (options) {
    console.log("🚀 ~ options:", options)
    return await model.chatRoom.findOneAndUpdate(
        { invitationCode: options.token, "invitees.uid": { $ne: options.uid }, uid: { $ne: options.uid } },
        { $push: { invitees: { uid: options.uid, readOnly: false }, seenMessage: { uid: options.uid, messageId: null,date:new Date() } }},
    )
}
module.exports.getGroupByCode = async function (token) {
  return await model.chatRoom.findOne(
      { invitationCode:token},
  )
}





module.exports.sendMessage = async (options) => {
  try {
    const group = await model.messages.create({
      uid: options.uid,
      message:options.message,
      groupId:options.groupId,

      
    });
    return group;
  } catch (error) {
    console.error('Error creating Group:', error);
    throw new Error('Error creating Group');
  }
};


module.exports.fetchMessage = async (options) => {
  try {
    const pipeline = [
      {
        $match: {
          groupId: new mongoose.Types.ObjectId(options.groupId),
          isDeleted: {$ne: true},
        }
      },
      {
        $addFields: {
          "uid": { $toObjectId: "$uid" }  // Convert seenMessage.uid to ObjectId
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "uid",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true
        }
      },
      // { $sort: { createdAt: -1 } },
      // { $skip: parseInt(skip) },
      // { $limit: 20}
    ];
  return await model.messages.aggregate(pipeline)    
  } catch (error) {
    console.error('Error creating Group:', error);
    throw new Error('Error creating Group');
  }
};