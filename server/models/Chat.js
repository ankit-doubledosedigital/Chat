const mongoose = require("mongoose");

let collectionSchema = new mongoose.Schema(
    [{
        uid: { type: String },
        name: { type: String },
        pinUsers: [{ type: String }],
        sortingBy:{type:Date},
        deletedBy:[{ type: String }],
        profilePhoto: {type: String},
        isGroup: {type: Boolean},
        contactUid: { type: String },
        invitees: [
            {
                uid: { type: String },
                readOnly: { type: Boolean, default: true }
            }
        ],
        clearStamp:[
            {
                uid:{type:String},
                date:{type:Date}
            }
        ],
        seenMessage: [
            {
                uid: { type: String }, 
                messageId : { type: String },
                date:{type:Date},
            }
        ],
        invitationCode: { type: String },
        

        isMute: [{ type: String }],
    }], { timestamps: true }
)
module.exports = { collectionSchema, collectionName: "chatRoom" }
