const model = require('../models')
const mongoose = require('mongoose')
// mongoose.set('debug', true);
module.exports.addMessages = async function (options) {
  return await model.messages.create({
    groupId: options.groupId,
    message: options.message,
    isBot: options.isBot,
    imgUrl: options.imgUrl,
    uid: options.uid,
    invalidKey: options.invalidKey,
    replyId: options.reply?options.reply._id:null,
    replyMessage: options.reply?options.reply.message:null,
    chatType:options.type,
    isUploaded:true,
    chatInfo:{
    inviteeId:options.chatInfo?.inviteeId,
    infoType:options.chatInfo?.infoType,
  },
  mentionUser:options.mentionedUserList,
  media:options.media,
  forwardId: options.forward?options.forward._id:null,
    poll:{
      question:options.poll?.question,
      option:options.poll?.option,
      dateTime:options.poll?.dateTime
    },
    contactCard:options.cardUid,
  });
};

module.exports.getMessageList = async function (groupId, referenceDateobj, sortOrder ) {
  const pipeline = [
    {
      $match: {
        groupId: new mongoose.Types.ObjectId(groupId),
        isDeleted: {$ne: true},
        ...referenceDateobj,
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "uid",
        foreignField: "uid",
        as: "user"
      }
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "messages",
        localField: "replyId",
        foreignField: "_id",
        as: "reply"
      }
    },
    {
      $unwind: {
        path: "$reply",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
       from: "users",
       localField: "reply.uid",
       foreignField: "uid",
       as: "reply.user" }
   },
   {
    $unwind: {
      path: "$reply.user",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
     from: "users",
     localField: "chatInfo.inviteeId",
     foreignField: "uid",
     as: "chatInfo.user" }
 },
 {
  $unwind: {
    path: "$chatInfo.user",
    preserveNullAndEmptyArrays: true
  }
},
{
  $unwind: {
    path: "$react",
    preserveNullAndEmptyArrays: true
  }
},
{
  $lookup: {
    from: "users",
    localField: "react.reactBy.uid",
    foreignField: "uid",
    as: "userDetails"
  }
},
{
  $addFields: {
    "react.userDetails": "$userDetails"
  }
},
{
  $lookup: {
    from: "users",
    localField: "mentionUser.uid",
    foreignField: "uid",
    as: "mentionUserList"
  }
},
{
  $lookup: {
    from: "users",
    localField: "contactCard",
    foreignField: "uid",
    as: "cardUserDetails"
  }
},
{
  $group: {
    _id: "$_id",
    react: {
      $push: "$react"
    },
    message: { $first: "$message" },
    uid: { $first: "$uid" },
    groupId: { $first: "$groupId" },
    isBot: { $first: "$isBot" },
    isEdited: { $first: "$isEdited" },
    isDeleted: { $first: "$isDeleted" },
    isUploaded: { $first: "$isUploaded" },
    invalidKey: { $first: "$invalidKey" },
    replyId: { $first: "$replyId" },
    replyMessage: { $first: "$replyMessage" },
    chatType: { $first: "$chatType" },
    forwardId: { $first: "$forwardId" },
    mentionUser: { $first: "$mentionUser" },
    mentionUserList: { $first: "$mentionUserList" },
    poll: { $first: "$poll" },
    createdAt: { $first: "$createdAt" },
    updatedAt: { $first: "$updatedAt" },
    user: { $first: "$user" },
    cardUserDetails: { $first: "$cardUserDetails" },
    reply: { $first: "$reply" },
  }

},

    // {
    //   $project: {
    //     "user.photoURL": 1,
    //     "user.fullName": 1,
    //     "_id": 1,
    //     "message": 1,
    //     "isBot": 1,
    //     "uid": 1,
    //     "imgUrl": 1,
    //     "createdAt": 1,
    //     "media": 1,
    //     "invalidKey": 1
    //   }
    // },
    { $sort: sortOrder },
    { $skip: 0 },
    { $limit: 8 }
  ]
  return await model.messages.aggregate(pipeline)
}


module.exports.fetchMessages = async function (groupId, skip) {
  const pipeline = [
    {
      $match: {
        groupId: new mongoose.Types.ObjectId(groupId),
        isDeleted: {$ne: true},
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "uid",
        foreignField: "uid",
        as: "user"
      }
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "messages",
        localField: "replyId",
        foreignField: "_id",
        as: "reply"
      }
    },
    {
      $unwind: {
        path: "$reply",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
       from: "users",
       localField: "reply.uid",
       foreignField: "uid",
       as: "reply.user" }
   },
   {
    $unwind: {
      path: "$reply.user",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
     from: "users",
     localField: "chatInfo.inviteeId",
     foreignField: "uid",
     as: "chatInfo.user" }
 },
 {
  $unwind: {
    path: "$chatInfo.user",
    preserveNullAndEmptyArrays: true
  }
},
{
  $unwind: {
    path: "$react",
    preserveNullAndEmptyArrays: true
  }
},
{
  $lookup: {
    from: "users",
    localField: "react.reactBy.uid",
    foreignField: "uid",
    as: "userDetails"
  }
},
{
  $addFields: {
    "react.userDetails": "$userDetails"
  }
},
{
  $lookup: {
    from: "users",
    localField: "mentionUser.uid",
    foreignField: "uid",
    as: "mentionUserList"
  }
},
{
  $lookup: {
    from: "users",
    localField: "contactCard",
    foreignField: "uid",
    as: "cardUserDetails"
  }
},
{
  $group: {
    _id: "$_id",
    react: {
      $push: "$react"
    },
    message: { $first: "$message" },
    uid: { $first: "$uid" },
    groupId: { $first: "$groupId" },
    isBot: { $first: "$isBot" },
    isEdited: { $first: "$isEdited" },
    isDeleted: { $first: "$isDeleted" },
    isUploaded: { $first: "$isUploaded" },
    invalidKey: { $first: "$invalidKey" },
    replyId: { $first: "$replyId" },
    replyMessage: { $first: "$replyMessage" },
    reply: { $first: "$reply" },
    chatType: { $first: "$chatType" },
    forwardId: { $first: "$forwardId" },
    mentionUser: { $first: "$mentionUser" },
    mentionUserList: { $first: "$mentionUserList" },
    cardUserDetails: { $first: "$cardUserDetails" },
    poll: { $first: "$poll" },
    createdAt: { $first: "$createdAt" },
    updatedAt: { $first: "$updatedAt" },
    user: { $first: "$user" },
    chatInfo: { $first: "$chatInfo" },
    imgUrl:{$first:'$imgUrl'},
    media:{$first:'$media'},
    chatInfo:{$first:'$chatInfo'},
  }

},
    // {
    //   $project: {
    //     "user.photoURL": 1,
    //     "user.fullName": 1,
    //     "_id": 1,
    //     "message": 1,
    //     "isBot": 1,
    //     "uid": 1,
    //     "imgUrl": 1,
    //     "createdAt": 1,
    //     "media": 1,
    //     "isEdited": 1 ,
    //     "invalidKey": 1,
    //     "replyId": 1,
    //     "reply.createdAt": 1,
    //     "reply.message": 1,
    //     "reply.imgUrl": 1,
    //     "reply.media": 1,
    //     "reply.user.fullName": 1,
        
    //   }
    // },
    { $sort: { createdAt: -1 } },
    { $skip: parseInt(skip) },
    { $limit: 20}
  ];
  return await model.messages.aggregate(pipeline)
}

module.exports.fetchMessagesBySearchKey = async function (groupId, skip, searchString, afterMessages, messages, limitvalue) {
  let messagesAfter = {}
  let searchStringCon = {}
  let limit = {
    $limit: 1
  }
  let project = {
    $project: {
      "user.photoURL": 1,
      "user.fullName": 1,
      "_id": 1,
      "message": 1,
      "isBot": 1,
      "uid": 1,
      "createdAt": -1,
      "invalidKey": 1
    }
  }
  let sort = {
    $sort: { createdAt: -1 }
  }
  if (limitvalue) {
    messagesAfter = {
      _id: { $gt: messages[0]._id }

    }
    limit = {
      $limit: limitvalue
    }
    project = {
      $project: {
        "user.photoURL": 1,
        "user.fullName": 1,
        "_id": 1,
        "message": 1,
        "isBot": 1,
        "uid": 1,
        "createdAt": 1,
        "invalidKey":1
      }
    }
    sort = {
      $sort: { createdAt: 1 }
    }
  } else if (afterMessages) {
    messagesAfter = {
      _id: { $lt: messages[0]._id }

    }
    limit = {
      $limit: 7
    }
    project = {
      $project: {
        "user.photoURL": 1,
        "user.fullName": 1,
        "_id": 1,
        "message": 1,
        "isBot": 1,
        "uid": 1,
        "createdAt": -1,
        "invalidKey":1

      }
    }
    sort = {
      $sort: { createdAt: -1 }
    }
  } else {
    searchStringCon = {
      message: { $regex: searchString, $options: "i" }
    }
    project = {
      $project: {
        "user.photoURL": 1,
        "user.fullName": 1,
        "_id": 1,
        "message": 1,
        "isBot": 1,
        "uid": 1,
        "createdAt": -1,
        "invalidKey":1

      }
    }
    sort = {
      $sort: { createdAt: -1 }
    }
  }
  const pipeline = [
    {
      $match: {
        ...messagesAfter,
        ...searchStringCon,
        groupId: new mongoose.Types.ObjectId(groupId),
        isDeleted: {$ne: true},

      }
    },
    {
      $lookup: {
        from: "users",
        localField: "uid",
        foreignField: "uid",
        as: "user"
      }
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      ...project
    },
    { ...sort },

    { ...limit }
  ];
  return await model.messages.aggregate(pipeline)
}


module.exports.fetchUpDownMessagesBySearchKey = async function (groupId, skip, searchString, id, data) {
  let idCon = {}
  let sortCon = {}
  if (data.upDownKey == 'true') {
    idCon = { _id: { $lt: new mongoose.Types.ObjectId(id) } }
    sortCon = {
      $sort: { createdAt: -1 }
    }
  } else {
    idCon = { _id: { $gt: new mongoose.Types.ObjectId(id) } }
    sortCon = {
      $sort: { createdAt: 1 }
    }
  }

  const pipeline = [
    {
      $match: {
        ...idCon,
        isDeleted: {$ne: true},
        message: { $regex: searchString, $options: "i" },
        groupId: new mongoose.Types.ObjectId(groupId),
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "uid",
        foreignField: "uid",
        as: "user"
      }
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true
      }
    },{
      $lookup: {
        from: "messages",
        localField: "replyId",
        foreignField: "_id",
        as: "reply"
      }
    },
    {
      $unwind: {
        path: "$reply",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
       from: "users",
       localField: "reply.uid",
       foreignField: "uid",
       as: "reply.user" }
   },
   {
    $unwind: {
      path: "$reply.user",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $unwind: {
      path: "$react",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "react.reactBy.uid",
      foreignField: "uid",
      as: "userDetails"
    }
  },
  {
    $addFields: {
      "react.userDetails": "$userDetails"
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "mentionUser.uid",
      foreignField: "uid",
      as: "mentionUserList"
    }
  },
  {
    $group: {
      _id: "$_id",
      react: {
        $push: "$react"
      },
      message: { $first: "$message" },
      uid: { $first: "$uid" },
      groupId: { $first: "$groupId" },
      isBot: { $first: "$isBot" },
      isEdited: { $first: "$isEdited" },
      isDeleted: { $first: "$isDeleted" },
      isUploaded: { $first: "$isUploaded" },
      invalidKey: { $first: "$invalidKey" },
      replyId: { $first: "$replyId" },
      replyMessage: { $first: "$replyMessage" },
      chatType: { $first: "$chatType" },
      forwardId: { $first: "$forwardId" },
      mentionUser: { $first: "$mentionUser" },
      mentionUserList: { $first: "$mentionUserList" },
      poll: { $first: "$poll" },
      createdAt: { $first: "$createdAt" },
      updatedAt: { $first: "$updatedAt" },
      user: { $first: "$user" },
    }
  
  },  
    // {
    //   $project: {
    //     "user.photoURL": 1,
    //     "user.fullName": 1,
    //     "_id": 1,
    //     "message": 1,
    //     "isBot": 1,
    //     "uid": 1,
    //     "createdAt": 1,
    //     "invalidKey":1

    //   }
    // },
    { ...sortCon },
    { $limit: 1 }
  ];
  return await model.messages.aggregate(pipeline)
}

module.exports.countDocuments = async function (groupId, skip, searchString, afterMessages, messages) {
  return await model.messages.countDocuments({
    _id: { $gt: messages[messages.length - 1]._id },
    groupId: groupId,
    isDeleted: {$ne: true},
  })
}


module.exports.deleteMessageById = async function (id) {
  // return await model.messages.deleteOne({ _id: id });
  return await model.messages.updateOne({ _id: id },{isDeleted: true });
};
module.exports.deleteBookMarkMessage = async function (id) {
  return await model.bookMark.deleteOne({ 'message._id': id });
};
module.exports.findMessageById = async function (id) {
  const pipeline = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
        isDeleted: {$ne: true}
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "uid",
        foreignField: "uid",
        as: "user"
      }
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "messages",
        localField: "replyId",
        foreignField: "_id",
        as: "reply"
      }
    },
    {
      $unwind: {
        path: "$reply",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
       from: "users",
       localField: "reply.uid",
       foreignField: "uid",
       as: "reply.user" }
   },
   {
    $unwind: {
      path: "$reply.user",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
     from: "users",
     localField: "chatInfo.inviteeId",
     foreignField: "uid",
     as: "chatInfo.user" }
 },
 {
  $unwind: {
    path: "$chatInfo.user",
    preserveNullAndEmptyArrays: true
  }
},
{
  $unwind: {
    path: "$react",
    preserveNullAndEmptyArrays: true
  }
},
{
  $lookup: {
    from: "users",
    localField: "react.reactBy.uid",
    foreignField: "uid",
    as: "userDetails"
  }
},
{
  $addFields: {
    "react.userDetails": "$userDetails"
  }
},
{
  $lookup: {
    from: "users",
    localField: "mentionUser.uid",
    foreignField: "uid",
    as: "mentionUserList"
  }
},
{
  $group: {
    _id: "$_id",
    react: {
      $push: "$react"
    },
    message: { $first: "$message" },
    uid: { $first: "$uid" },
    groupId: { $first: "$groupId" },
    isBot: { $first: "$isBot" },
    isEdited: { $first: "$isEdited" },
    isDeleted: { $first: "$isDeleted" },
    isUploaded: { $first: "$isUploaded" },
    invalidKey: { $first: "$invalidKey" },
    replyId: { $first: "$replyId" },
    replyMessage: { $first: "$replyMessage" },
    chatType: { $first: "$chatType" },
    forwardId: { $first: "$forwardId" },
    mentionUser: { $first: "$mentionUser" },
    mentionUserList: { $first: "$mentionUserList" },
    poll: { $first: "$poll" },
    createdAt: { $first: "$createdAt" },
    updatedAt: { $first: "$updatedAt" },
    user: { $first: "$user" },
  }

},
  ];
  return await model.messages.aggregate(pipeline)
};

module.exports.updateMessageById = async function (req) {
  return await model.messages.updateOne({ _id: req.params.id },{
    message: req.body.data.message,
    isEdited: req.body.data.isEdited
  });
};
module.exports.updateMediaMessages = async function (id,ObjData) {
  return await model.messages.findOneAndUpdate({ _id: id },{$set:{'media': ObjData.media,isUploaded:ObjData.isUploaded}},{ new: true });
};

module.exports.updateImageMessages = async function (id,ObjData) {
  return await model.messages.findOneAndUpdate({ _id: id },{$set:{isUploaded:ObjData.isUploaded,url : ObjData.imgUrl,imgUrl: ObjData.imgUrl}},{ new: true });
};

module.exports.reactMessage = async function (req) {
  const messageId = req.data._id;
  const uid = req.data.uid;
  const reactId = req.data.reactId;
  const reactedMessage = req.data.reactedMessage;

  if (reactId) {
    await model.messages.updateOne(
      { _id: messageId },
      { $pull: { 'react.$[].reactBy': { uid: uid } } }
    );

    const message = await model.messages.findOne(
      { _id: messageId, 'react.reactId': reactId }
    );

    if (message) {
      await model.messages.updateOne(
        { _id: messageId, 'react.reactId': reactId },
        { $addToSet: { 'react.$.reactBy': { uid: uid } } }
      );
    } else {
      await model.messages.updateOne(
        { _id: messageId },
        {
          $addToSet: {
            react: {
              reactId: reactId,
              reactMessage: reactedMessage,
              reactBy: [{ uid: uid }]
            }
          }
        }
      );
    }
  } else {
    await model.messages.updateOne(
      { _id: messageId },
      { $pull: { 'react.$[].reactBy': { uid: uid } } }
    );
  }

  const newMessage = await model.messages.findOne(new mongoose.Types.ObjectId(messageId));
  const newReacts = newMessage.react.filter(reaction => reaction.reactBy.length > 0);
  const messageData = await model.messages.findOneAndUpdate(
    { _id: messageId },
    { $set: { react: newReacts } },
    { new: true }
  );

  return { newReacts: newReacts, messageData: messageData };
};

module.exports.getMessageBySearchKey = async (searchKey, groupId, skip)=>{
  let pipeline = [
    { $match: {
      groupId: groupId,
      isDeleted: {$ne: true},
      message: { $regex: searchKey, $options: "i" }
    } },
    { $sort: { createdAt: -1 } },
    { $skip: skip?skip:0 },
    { $limit: 1 },
    { $lookup: {
      from: "users",
      localField: "uid",
      foreignField: "uid",
      as: "user"
    } },
    { $unwind: {
      path: "$user",
      preserveNullAndEmptyArrays: true
    } },
    {
      $lookup: {
        from: "messages",
        localField: "replyId",
        foreignField: "_id",
        as: "reply"
      }
    },
    {
      $unwind: {
        path: "$reply",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
       from: "users",
       localField: "reply.uid",
       foreignField: "uid",
       as: "reply.user" }
   },
   {
    $unwind: {
      path: "$reply.user",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
     from: "users",
     localField: "chatInfo.inviteeId",
     foreignField: "uid",
     as: "chatInfo.user" }
 },
 {
  $unwind: {
    path: "$chatInfo.user",
    preserveNullAndEmptyArrays: true
  }
},
{
  $lookup: {
    from: "users",
    localField: "react.reactBy",
    foreignField: "uid",
    as: "react.reactBy"
  }
},
    // { $project: {
    //   "user.photoURL": 1,
    //   "user.fullName": 1,
    //   "_id": 1,
    //   "message": 1,
    //   "isBot": 1,
    //   "uid": 1,
    //   "imgUrl": 1,
    //   "createdAt": 1,
    //   "media": 1,
    //   "invalidKey":1

    // } },
  ]
  return model.messages.aggregate(pipeline)
}

module.exports.getMessageCountBySearchKey = async(searchKey, groupId)=>{
  return model.messages.countDocuments({
    groupId: groupId,
    isDeleted: {$ne: true},
    message: { $regex: searchKey, $options: "i" }
  })
}
module.exports.getMessageCountBySearchKeyAfterClearChat = async (searchKey, groupId, clearStamp) => {
  return model.messages.countDocuments({
    groupId: groupId,
    isDeleted: { $ne: true },
    message: { $regex: searchKey, $options: "i" },
    createdAt: { $gt: clearStamp } // Add this condition to filter messages based on clearStamp date
  });
};

module.exports.getMessagesAfterTimestamp = async ( messageOid, dateObj, groupId, limit ) => {
  return await model.messages.aggregate([
    { $match: {
      groupId: groupId,
      _id: { $ne: messageOid },
      createdAt: { $gte: dateObj },
      isDeleted: {$ne: true},
    } },
    { $sort: { createdAt: 1 } },
    // { $limit: limit||8 },
    { $lookup: {
      from: "users",
      localField: "uid",
      foreignField: "uid",
      as: "user"
    } },
    { $unwind: {
      path: "$user",
      preserveNullAndEmptyArrays: true
    } },
    {
      $lookup: {
        from: "messages",
        localField: "replyId",
        foreignField: "_id",
        as: "reply"
      }
    },
    {
      $unwind: {
        path: "$reply",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
       from: "users",
       localField: "reply.uid",
       foreignField: "uid",
       as: "reply.user" }
   },
   {
    $unwind: {
      path: "$reply.user",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
     from: "users",
     localField: "chatInfo.inviteeId",
     foreignField: "uid",
     as: "chatInfo.user" }
 },
 {
  $unwind: {
    path: "$chatInfo.user",
    preserveNullAndEmptyArrays: true
  }
},
{
  $lookup: {
    from: "users",
    localField: "react.reactBy",
    foreignField: "uid",
    as: "react.reactBy"
  }
},

    {
      $project: {
        "userDeatils": 0,
    }
  }
    //   $project: {
    //     "user.photoURL": 1,
    //     "user.fullName": 1,
    //     "_id": 1,
    //     "message": 1,
    //     "isBot": 1,
    //     "uid": 1,
    //     "imgUrl": 1,
    //     "createdAt": 1,
    //     "media": 1,
    //     "isEdited": 1 ,
    //     "invalidKey": 1,
    //     "replyId": 1,
    //     "reply.createdAt": 1,
    //     "reply.message": 1,
    //     "reply.imgUrl": 1,
    //     "reply.media": 1,
    //     "reply.user.fullName": 1,
        
    //   }
    // },
  ])
}
module.exports.getMessagesBeforeTimestamp = async ( messageOid, dateObj, groupId, limit )=>{
  return await model.messages.aggregate([
    { $match: {
      groupId: groupId,
      _id: { $ne: messageOid },
      isDeleted: {$ne: true},
      createdAt: { $lte: dateObj
    } } },
    { $sort: { createdAt: -1 } },
    // { $limit: limit||8 },
    { $lookup: {
      from: "users",
      localField: "uid",
      foreignField: "uid",
      as: "user"
    } },
    { $unwind: {
      path: "$user",
      preserveNullAndEmptyArrays: true
    } },
    {
      $lookup: {
        from: "messages",
        localField: "replyId",
        foreignField: "_id",
        as: "reply"
      }
    },
    {
      $unwind: {
        path: "$reply",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
       from: "users",
       localField: "reply.uid",
       foreignField: "uid",
       as: "reply.user" }
   },
   {
    $unwind: {
      path: "$reply.user",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
     from: "users",
     localField: "chatInfo.inviteeId",
     foreignField: "uid",
     as: "chatInfo.user" }
 },
 {
  $unwind: {
    path: "$chatInfo.user",
    preserveNullAndEmptyArrays: true
  }
},
{
  $lookup: {
    from: "users",
    localField: "react.reactBy",
    foreignField: "uid",
    as: "react.reactBy"
  }
},
    // {
    //   $project: {
    //     "user.photoURL": 1,
    //     "user.fullName": 1,
    //     "_id": 1,
    //     "message": 1,
    //     "isBot": 1,
    //     "uid": 1,
    //     "imgUrl": 1,
    //     "createdAt": 1,
    //     "media": 1,
    //     "isEdited": 1 ,
    //     "invalidKey": 1,
    //     "replyId": 1,
    //     "reply.createdAt": 1,
    //     "reply.message": 1,
    //     "reply.imgUrl": 1,
    //     "reply.media": 1,
    //     "reply.user.fullName": 1,
        
    //   }
    // },
  ])
}

module.exports.clearMessagesBeforeTimestamp = async (dateObj, groupId) => {
  return await model.messages.aggregate([
    { $match: {
      groupId: groupId,
      isDeleted: {$ne: true},
      createdAt: { $gte: dateObj} 
  } },
  {
    $lookup: {
      from: "users",
      localField: "uid",
      foreignField: "uid",
      as: "user"
    }
  },
  {
    $unwind: {
      path: "$user",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
      from: "messages",
      localField: "replyId",
      foreignField: "_id",
      as: "reply"
    }
  },
  {
    $unwind: {
      path: "$reply",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
     from: "users",
     localField: "reply.uid",
     foreignField: "uid",
     as: "reply.user" }
 },
 {
  $unwind: {
    path: "$reply.user",
    preserveNullAndEmptyArrays: true
  }
},
{
  $lookup: {
   from: "users",
   localField: "chatInfo.inviteeId",
   foreignField: "uid",
   as: "chatInfo.user" }
},
{
$unwind: {
  path: "$chatInfo.user",
  preserveNullAndEmptyArrays: true
}
},
{
  $unwind: {
    path: "$react",
    preserveNullAndEmptyArrays: true
  }
},
{
  $lookup: {
    from: "users",
    localField: "react.reactBy.uid",
    foreignField: "uid",
    as: "userDetails"
  }
},
{
  $addFields: {
    "react.userDetails": "$userDetails"
  }
},
{
  $lookup: {
    from: "users",
    localField: "mentionUser.uid",
    foreignField: "uid",
    as: "mentionUserList"
  }
},
{
  $lookup: {
    from: "users",
    localField: "contactCard",
    foreignField: "uid",
    as: "cardUserDetails"
  }
},
{
  $group: {
    _id: "$_id",
    react: {
      $push: "$react"
    },
    message: { $first: "$message" },
    uid: { $first: "$uid" },
    groupId: { $first: "$groupId" },
    isBot: { $first: "$isBot" },
    isEdited: { $first: "$isEdited" },
    isDeleted: { $first: "$isDeleted" },
    isUploaded: { $first: "$isUploaded" },
    invalidKey: { $first: "$invalidKey" },
    replyId: { $first: "$replyId" },
    replyMessage: { $first: "$replyMessage" },
    reply: { $first: "$reply" },
    chatType: { $first: "$chatType" },
    forwardId: { $first: "$forwardId" },
    mentionUser: { $first: "$mentionUser" },
    mentionUserList: { $first: "$mentionUserList" },
    cardUserDetails: { $first: "$cardUserDetails" },
    poll: { $first: "$poll" },
    createdAt: { $first: "$createdAt" },
    updatedAt: { $first: "$updatedAt" },
    user: { $first: "$user" },
    chatInfo: { $first: "$chatInfo" },
    imgUrl:{$first:'$imgUrl'},
    media:{$first:'$media'},
    chatInfo:{$first:'$chatInfo'},
  }

},

  // {
  //   $project: {
  //     "user.photoURL": 1,
  //     "user.fullName": 1,
  //     "_id": 1,
  //     "message": 1,
  //     "isBot": 1,
  //     "uid": 1,
  //     "imgUrl": 1,
  //     "createdAt": 1,
  //     "media": 1,
  //     "isEdited": 1 ,
  //     "invalidKey": 1,
  //     "replyId": 1,
  //     "reply.createdAt": 1,
  //     "reply.message": 1,
  //     "reply.imgUrl": 1,
  //     "reply.media": 1,
  //     "reply.user.fullName": 1,
      
  //   }
  // },
  { $sort: { createdAt: -1 } },
  { $limit: 20 }
  ])
}
module.exports.fetchAllMessages = async(groupId)=> {
 return await model.messages.aggregate([
  {$match:{
        groupId: new mongoose.Types.ObjectId(groupId)
  }
  }
 ])
}

module.exports.updatePoll = async function(data) {
  const { messageId, optionId, uid } = data;

  const option = await model.messages.findOne(
    { _id:messageId, 'poll.option._id': optionId},
    { 'poll.option.$': 1 }
  );
  if(option.poll.option[0].uid.includes(uid)){
    await model.messages.updateOne(
          { _id: data.messageId, 'poll.option.uid': data.uid },
          {
            $pull: { 'poll.option.$.uid': data.uid }
          }
        );
    return;
  }
  const message = await model.messages.findOne({ _id: messageId, 'poll.option.uid': uid });

  if (message) {
    await model.messages.updateOne(
      { _id: messageId, 'poll.option.uid': uid },
      { $pull: { 'poll.option.$.uid': uid } }
    );

    return await model.messages.updateOne(
      { _id: messageId, 'poll.option._id': optionId },
      { $push: { 'poll.option.$.uid': uid } }
    );
  } else {
    return await model.messages.updateOne(
      { _id: messageId, 'poll.option._id': optionId },
      { $push: { 'poll.option.$.uid': uid } }
    );
  }
};

module.exports.getPollUserList = async (messageId, optionId) => {
  const pipeline = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(messageId),
        isDeleted: { $ne: true },
      },
    },
    {
      $unwind: "$poll.option", 
    },
    {
      $match: {
        "poll.option._id": new mongoose.Types.ObjectId(optionId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "poll.option.uid",
        foreignField: "uid",
        as: "pollUser",
      },
    },
    {
      $project: {
        pollUser: 1,
      },
    },
  ];
  return await model.messages.aggregate(pipeline);
};
