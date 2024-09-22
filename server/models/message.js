const mongoose = require("mongoose");

let collectionSchema = new mongoose.Schema(
    [{
        uid: { type: String, ref: 'user' },
        groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'chatRoom' },
        message: { type: String },
        isEdited: { type: Boolean, default:false },
        isDeleted:{ type: Boolean, default:false }, 
        isUploaded: {type:Boolean},
        imgUrl: { type: String },
        invalidKey:  { type: Boolean, default: false },
        replyId:{ type: mongoose.Schema.Types.ObjectId, ref: 'messages' },
        replyMessage: { type: String },
        media : {
            mediaUrl : { type: String },
            mediaType : { type: String },
            templateId: { type: mongoose.Types.ObjectId  },
            ThumbNil : { type: String },
            prebuilt : {type: Boolean},
            fileSize: {type:String},
        },
        chatType:{type:String},
        chatInfo:{
            inviteeId:{type:String},
            infoType:{type:String},
        },
        forwardId:{type:mongoose.Schema.Types.ObjectId, ref:'messgaes'},
        react:[
            {
            reactBy:[{
                uid:{type:String}
            }],
            reactId:{type:String},
            reactMessage:{type:String}
        }
    ],
        mentionUser: [
            {
                uid:{type:String},
                name:{type:String}
            }
        ],
        poll:{
            question :{type:String},
            option:[{
                text:{type:String},
                uid:[{ type: String }],
            }],
            dateTime:{type:Date}
        },
        contactCard:{type:String}
    }], { timestamps: true }
)
module.exports = { collectionSchema, collectionName: "messages" }