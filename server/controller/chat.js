const { Configuration, OpenAIApi } = require('openai');
const messageDao = require("../dao/chats")
const groupsDao = require('../dao/groups')
const commonDao = require("../dao/common")
const commonHelper = require("../helper/common")
const mobileHelper = require("../helper/mobileApp.js")
const openAIController = require("../controller/openAI")
const uploadHelper = require("../helper/upload.js");
const mediaRecorderModel = require("../dao/media-recorder.js")
const mongoose = require('mongoose');
const authenticationDao = require("../dao/authenticate");
const bookMarkDao = require("../dao/bookMark");
const path = require("path");

module.exports.getChatsList = async function (req, res) {
    try {
        let referenceDateobj = {}
        let list = []
        let sortOrder = { createdAt: -1 }
        let clearState = req.query.clearChatStatus == 'true' ? req.query.clearStamp < req.query.referenceMsgCreatedAt : true
        if (req.query.type == 'newer') {
            referenceDateobj = {
                createdAt: { "$gte": new Date(req.query.referenceMsgCreatedAt) },
                _id: { "$ne": new mongoose.Types.ObjectId(req.query.referenceMsgOid) }
            }
            sortOrder.createdAt = 1
        } else if (req.query.type == 'older' && clearState) {
            referenceDateobj = {
                createdAt: { "$lte": new Date(req.query.referenceMsgCreatedAt) },
                _id: { "$ne": new mongoose.Types.ObjectId(req.query.referenceMsgOid) }
            }
        }
        if (req.query.clearChatStatus == 'true') {
            list = await messageDao.clearMessagesBeforeTimestamp(req.query.groupId,req.query.clearStamp, sortOrder)
        }
        else {
            list = await messageDao.getMessageList(req.query.groupId, referenceDateobj, sortOrder)
        }
        if (req.query.type != 'newer') list = list.reverse()

        for (let message of list) {
            if (message.media) {
                let url = await uploadHelper.generatePreSignedGetUrl(CONFIG.MEDIA_DATA + message.media.ThumbNil)
                message.url = url

            } else if (message.imgUrl) {
                let url = await uploadHelper.generatePreSignedGetUrl(message.imgUrl)
                message.url = url
            }
        }


        res.status(200).send({ message: "Fetched messages successully!", success: true, list });
    } catch (error) {
        console.log(error)
        res.status(500).send(error || 'Something went wrong');
    }
}
module.exports.checkTableInResponse = async function (apiResponse) {
    function extractTableText(response) {
        const lines = response.split('\n');
        let tableStart = -1;
        let tableEnd = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('|')) {
                if (tableStart === -1) {
                    tableStart = i;
                }
                tableEnd = i;
            }
        }
        return lines.slice(tableStart, tableEnd + 1).join('\n');
    }

    function parseTableText(tableText) {
        const lines = tableText.split('\n');
        const headers = lines[0].split('|').map(header => header.trim()).filter(header => header);
        const data = lines.slice(2).map(line => {
            const values = line.split('|').map(value => value.trim()).filter(value => value);
            let row = {};
            headers.forEach((header, index) => row[header] = values[index]);
            return row;
        });
        return data;
    }

    function generateTable(data) {
        let table = '<table>';
        table += '<tr>';
        for (const header in data[0]) {
            table += `<th>${header}</th>`;
        }
        table += '</tr>';
        data.forEach(row => {
            table += '<tr>';
            for (const cell in row) {
                table += `<td>${row[cell]}</td>`;
            }
            table += '</tr>';
        });
        table += '</table>';
        return table;
    }
    const tableText = extractTableText(apiResponse);
    const parsedData = parseTableText(tableText);
    const tableHtml = generateTable(parsedData);
    return tableHtml

}
module.exports.sendPrompt = async function (req, res) {
    try {
        let data = req.body.data
        if (data.reply?.chatType == 'poll') data.reply.message = "Poll"
        if (data.reply?.chatType == 'contactCard') data.reply.message = "Contact Card"
        data.invalidKey = false
        let firstWord = ''
        if (!data.groupId) {
            let group = await groupsDao.createGroup(req.body.data);
            data.groupId = group.id
        }
        await groupsDao.updateGroupDate(data.groupId)
        let saveMessage;
        let group = await groupsDao.fetchGroup(data);
        if (data.type != 'info') {
            firstWord = data.prompt.split(' ')[0];
        }


        if (data.type == "message") {
            data.isBot = false
            data.message = data.prompt
            saveMessage = await messageDao.addMessages(data)

        } else if (data.type == "info") {
            data.isBot = false
            if (data.chatInfo.infoType != 'removed' && data.chatInfo.infoType != 'leave') {
                let invitees = data.chatInfo.inviteeId
                for (let i = 0; i < invitees.length; i++) {
                    const messageData = { ...data };
                    messageData.chatInfo.inviteeId = invitees[i].uid
                    saveMessage = await messageDao.addMessages(messageData);
                }
            }
            else saveMessage = await messageDao.addMessages(data);
        }
        else if (data.type = "genie") {

            if (firstWord == '/genie' || firstWord == '/genie-image') {
                data.isBot = true
                if (req.body.headers['api-key'] && req.body.headers['api-key'] != "undefined") {
                    if (firstWord == '/genie') {
                        let message = data.prompt.trim().split("/genie")[1].trim()
                        let apiResponse = await openAIController.chatGPTResponse(message, req.body.headers['api-key'], group[0].message);
                        data.message = apiResponse?.message;
                        if (!apiResponse) {
                            data.message = "Uh-oh! Invalid or missing API key. Please provide a valid API key to proceed.\n\nGet your API key from https://platform.openai.com/account/api-keys.\n\nDon't forget to save your API key in the key menu from the top right menu."
                            data.invalidKey = true
                        }
                        if (data.message.includes('|--') && data.message) {
                            let table = await exports.checkTableInResponse(data.message)
                            data.message = table
                        }
                    } else if (firstWord == '/genie-image') {
                        let message = data.prompt.trim().split("/genie-image")[1].trim()
                        let apiResponse = await openAIController.dallEImage(message, req.body.headers['api-key'], group[0]._id);
                        if (apiResponse.status) {
                            data.imgUrl = apiResponse.imgUrl;
                            data.url = await uploadHelper.generatePreSignedGetUrl(apiResponse.imgUrl)
                        } else {
                            data.message = apiResponse.message;
                            data.invalidKey = true
                        }
                    }
                } else {
                    data.message = "Uh-oh! Invalid or missing API key. Please provide a valid API key to proceed.\n\nGet your API key from https://platform.openai.com/account/api-keys.\n\nDon't forget to save your API key in the key menu from the top right menu."
                    data.invalidKey = true
                }

            }
            else {
                data.message = "Uh-oh! Invalid or missing API key. Please provide a valid API key to proceed.\n\nGet your API key from https://platform.openai.com/account/api-keys.\n\nDon't forget to save your API key in the key menu from the top right menu."
                data.invalidKey = true
            }
            data.reply = null
            // data.message = "I can not help you with that"
            saveMessage = await messageDao.addMessages(data)
        }
        if (!data.isGroup) {
            await groupsDao.updateDeletedBy(data.groupId)
        }

        let resObj = {
            message: data.message,
            imgUrl: data.imgUrl,
            url: data.url,
            groupId: data.groupId,
            messageId: saveMessage._id,
            createdAt: saveMessage.createdAt,
            invalidKey: data.invalidKey,
            invitees: data.invitess,
            uid: group[0].uid,
            mentionUser: req.body.data.mentionedUserList,


        }
        if (data.reply?.chatType == 'poll') resObj.replyMessage = "Poll"
        if (data.reply?.chatType == 'contactCard') resObj.replyMessage = "Contact Card"

        if (firstWord == '/genie' || firstWord == '/genie-image') {
            resObj['isBot'] = true
        } else {
            resObj['isBot'] = false
        }
        //we save message id for showing it on notification...
        let message = JSON.parse(JSON.stringify(saveMessage))
        if (data.type != 'info') {
            await groupsDao.changeSortingDate(data.groupId)
            await mobileHelper.handleChatNotifications(data)
            let notification = await commonHelper.manageNotifications(group[0].uid, data, message);
            if (notification.length) {
                let result = await commonDao.createNotification(notification);
            }
            if (req.body.data.mentionedUserList.length) {
                let mentionNotification = await commonHelper.manageMentionNotifications(req.body.data.mentionedUserList, data, message);
                if (mentionNotification.length) {
                    let result = await commonDao.createNotification(mentionNotification);
                }
            }
        }
        if(req.body.data.mentionedUserList?.length){
         let mentionNotification = await commonHelper.manageMentionNotifications(req.body.data.mentionedUserList, data, message);
         if (mentionNotification.length) {
            let result = await commonDao.createNotification(mentionNotification);
        }
        }
        if(req.body.data.mentionAll?.length){
            let menationAll = await commonHelper.manageMentionAllNotifications(group[0].uid, data, message);
            if (menationAll.length) {
               let result = await commonDao.createNotification(menationAll);
           }
        }
        res.status(200).send(resObj);
    } catch (error) {
        console.error(error)
        res.status(500).send(error || 'Something went wrong');
    }
}

module.exports.createGroup = async function (req, res) {
    try {
        await messageDao.addGroup(req.body.body)
    } catch (error) {
        console.error(error)
        res.status(500).send(error || 'Something went wrong');
    }
}

module.exports.initialChatDetails = async function (req, res) {
    try {
        let messages = []
        req.query.groupId = new mongoose.Types.ObjectId(req.query.groupId)
        req.query.clearStamp = new Date(req.query.clearStamp)
        if (req.query.clearChatStatus == 'true') {
            messages = await messageDao.clearMessagesBeforeTimestamp(req.query.clearStamp, req.query.groupId, req.query.skipCount)
        }
        else {
            messages = await messageDao.fetchMessages(req.query.groupId, req.query.skipCount)
        }
        let uperLimits = 0
        let lowerLimits = 0
        if (messages && messages.length) {
            countOfMessagesBefore = await messageDao.countDocuments(req.query.groupId, req.query.skipCount, req.query.searchChatString, true, messages)
            uperLimits = countOfMessagesBefore + 1
            lowerLimits = countOfMessagesBefore - (messages.length - 1)
            if (lowerLimits == countOfMessagesBefore && req.query.searchChatString) {
                messages = []
            }
            messages = messages?.reverse()
        }
        for (let message of messages) {
            let user = message?.user?.photoURL?.split('_')
            if (user[0] == 'user') {
                let url = await uploadHelper.generatePreSignedGetUrl(CONFIG.CHAT_PROFILE + user[1])
                message.user.photoURL = url
            }
            let replyUser = message?.reply?.user?.photoURL?.split('_')


            if (replyUser && replyUser[0] == 'user') {
                let url = await uploadHelper.generatePreSignedGetUrl(CONFIG.CHAT_PROFILE + replyUser[1])
                message.reply.user.photoURL = url
            }

            let chatInfo = message.chatInfo?.user?.photoURL?.split('_')
            if (chatInfo && chatInfo[0] == 'user') {
                let url = await uploadHelper.generatePreSignedGetUrl(CONFIG.CHAT_PROFILE + chatInfo[1])
                message.chatInfo.user.photoURL = url
            }
            for (let j = 0; j <= message.react?.length; j++) {
                for (let k = 0; k <= message.react[j]?.userDetails?.length; k++) {
                    let invitees = message.react[j]?.userDetails[k]?.photoURL.split('_')
                    if (invitees && invitees[0] == 'user') {
                        let url = await uploadHelper.generatePreSignedGetUrl(CONFIG.CHAT_PROFILE + invitees[1])
                        message.react[j].userDetails[k].photoURL = url
                    }
                }
            }
            for (let j = 0; j <= message.mentionUserList?.length; j++) {
                    let invitees = message.mentionUserList[j]?.photoURL.split('_')
                    if (invitees && invitees[0] == 'user') {
                        let url = await uploadHelper.generatePreSignedGetUrl(CONFIG.CHAT_PROFILE + invitees[1])
                        message.mentionUserList[j].photoURL = url
                    }
            }
            if(message.chatType=='contactCard'){
                let user = message.cardUserDetails[0]?.photoURL.split('_')
                if (user && user[0] == 'user') {
                let url = await uploadHelper.generatePreSignedGetUrl(CONFIG.CHAT_PROFILE + user[1])
                message.cardUserDetails[0].photoURL = url
                }
            }
            if (message.media) {
                if (message.media.mediaType == 'doc') {
                    let url = await uploadHelper.generatePreSignedGetUrl(CONFIG.LEAD_MAGNET_PDF_PATH + message.media.templateId + `.pdf`)
                    message.url = url
                }
                if (message.media.mediaType == 'resume') {
                    let remotePath = path.join(CONFIG.RESUME_PDF_PATH, `${message.uid}`, `${message.media.mediaUrl}`)
                    let url = await uploadHelper.generatePreSignedGetUrl(remotePath)
                    message.url = url
                }
                if (message.media.mediaType == 'CoverLetter') {
                    let remotePath = path.join(CONFIG.COVER_PDF_PATH, `${message.uid}`, `${message.media.mediaUrl}`)
                    let url = await uploadHelper.generatePreSignedGetUrl(remotePath)
                    message.url = url
                }
                if (message.media.mediaType != 'doc' && message.media.mediaType != 'resume' && message.media.mediaType != 'CoverLetter') {
                    let url = await uploadHelper.generatePreSignedGetUrl(CONFIG.MEDIA_DATA + message.media.ThumbNil)
                    message.url = url;
                    if (message.media.templateId && message.media.mediaType == 'video') {
                        let templates = await mediaRecorderModel.getSingleTemplate(message.media.templateId)
                        templates = JSON.parse(JSON.stringify(templates));
                        let remoteHeaderPath = `${CONFIG.MEDIA_DATA + 'VideoTemplate/'}${templates.headerImgSrc}`;
                        let remoteFooterPath = `${CONFIG.MEDIA_DATA + 'VideoTemplate/'}${templates.footerImgSrc}`;

                        let headerUrl = await uploadHelper.generatePreSignedGetUrl(remoteHeaderPath);
                        let footerUrl = await uploadHelper.generatePreSignedGetUrl(remoteFooterPath);

                        message.media.headerUrl = headerUrl;
                        message.media.footerUrl = footerUrl;

                    }
                }

            } else if (message.imgUrl) {
                let url = await uploadHelper.generatePreSignedGetUrl(message.imgUrl)
                message.url = url
            }
            if (message?.reply?.media) {
                let url = await uploadHelper.generatePreSignedGetUrl(CONFIG.MEDIA_DATA + message?.reply.media.ThumbNil)
                message.reply.url = url
            }
            else if (message?.reply?.imgUrl) {
                let url = await uploadHelper.generatePreSignedGetUrl(message.reply.imgUrl)
                message.reply.url = url
            }
        }

        res.status(200).send({ message: "New thread created successfully!", messages: messages, uperLimits: uperLimits, lowerLimits: lowerLimits });
    } catch (error) {
        console.log(error);
        res.status(500).send(error || 'Something went wrong');
    }
}

module.exports.searchChatDetails = async function (req, res) {
    try {
        let messages = await messageDao.fetchMessagesBySearchKey(req.query.groupId, req.query.skipCount, req.query.searchChatString)
        let countOfMessagesBefore = 0
        let uperLimits = 0
        let lowerLimits = 0
        let messagesdata = []
        if (messages && messages.length) {
            let messagesBefore = await messageDao.fetchMessagesBySearchKey(req.query.groupId, req.query.skipCount, req.query.searchChatString, true, messages)
            countOfMessagesBefore = await messageDao.countDocuments(req.query.groupId, req.query.skipCount, req.query.searchChatString, true, messagesBefore)
            uperLimits = countOfMessagesBefore
            lowerLimits = countOfMessagesBefore - messagesBefore.length
            if ((messages.length + messagesBefore.length) < 8) {
                messagesdata = await messageDao.fetchMessagesBySearchKey(req.query.groupId, req.query.skipCount, req.query.searchChatString, true, messages, (8 - (messages.length + messagesBefore.length)))
            }
            messages = [...messagesdata, ...messages, ...messagesBefore]
            messages = messages?.reverse()

            messages = JSON.parse(JSON.stringify(messages))
            for (let i = 0; i < messages.length; i++) {
                const element = messages[i];
                if (element.media) {
                    if (element.media.mediaType != "video") {
                        continue;
                    }
                    let url = await uploadHelper.generatePreSignedGetUrl(CONFIG.MEDIA_DATA + element.media.ThumbNil)
                    messages[i].url = url
                }
            }
        }
        res.status(200).send({ message: "New thread created successfully!", messages: messages, countOfMessagesBefore: countOfMessagesBefore - messages.length, uperLimits: uperLimits, lowerLimits: lowerLimits });
    } catch (error) {
        console.log(error);
        res.status(500).send(error || 'Something went wrong');
    }
}

module.exports.searchUpChat = async function (req, res) {
    try {
        req.query.groupId = new mongoose.Types.ObjectId(req.query.groupId)
        let responseObj = { success: false, message: "Could not find any match!" }
        let totalMatch = ''
        if (req.query.clearStamp) {
            totalMatch = await messageDao.getMessageCountBySearchKeyAfterClearChat(req.query.text, req.query.groupId, req.query?.clearStamp)
        }
        else {
            totalMatch = await messageDao.getMessageCountBySearchKey(req.query.text, req.query.groupId)
        }
        if (totalMatch) {
            responseObj.totalMatch = totalMatch
            responseObj.currentMatchNo = req.query?.currentMatchNo ? (Number(req.query?.currentMatchNo)) : 1
            let skipNumber = responseObj.currentMatchNo - 1
            let targetMessage = await messageDao.getMessageBySearchKey(req.query.text.toLowerCase(), req.query.groupId, skipNumber)
            let leadingMessages = await messageDao.getMessagesAfterTimestamp(targetMessage[0]._id, targetMessage[0].createdAt, req.query.groupId, 8)
            let laggingMessages = await messageDao.getMessagesBeforeTimestamp(targetMessage[0]._id, targetMessage[0].createdAt, req.query.groupId, 8)
            responseObj['chats'] = [
                ...laggingMessages.reverse(),
                ...targetMessage,
                ...leadingMessages,
            ]
            responseObj['chats'] = JSON.parse(JSON.stringify(responseObj['chats']))
            for (let i = 0; i < responseObj['chats'].length; i++) {
                const element = responseObj['chats'][i];
                if (element.media) {
                    if (element.media.mediaType != "video") {
                        continue;
                    }
                    let url = await uploadHelper.generatePreSignedGetUrl(CONFIG.MEDIA_DATA + element.media.ThumbNil)
                    responseObj['chats'][i].url = url
                }
                else if (element?.imgUrl) {
                    let url = await uploadHelper.generatePreSignedGetUrl(element.imgUrl)
                    element.url = url
                }
                if (element?.reply?.media) {
                    let url = await uploadHelper.generatePreSignedGetUrl(CONFIG.MEDIA_DATA + element.reply.media.ThumbNil)
                    responseObj['chats'][i].reply.url = url
                }
                else if (element?.reply?.imgUrl) {
                    let url = await uploadHelper.generatePreSignedGetUrl(element.reply.imgUrl)
                    element.reply.url = url
                }
            }
            responseObj['target'] = targetMessage[0]
            responseObj.success = true;
            responseObj.message = 'Search data found'
        }
        res.status(200).send(responseObj);
    } catch (error) {
        console.log(error);
        res.status(500).send(error || 'Something went wrong');
    }
}


module.exports.getChatById = async function (req, res) {
    try {
        let message = await messageDao.findMessageById(req.query.messageId)
        message = JSON.parse(JSON.stringify(message))
        message.media.thumbnailGenerated = await uploadHelper.generatePreSignedGetUrl(CONFIG.MEDIA_DATA + message.media.ThumbNil)
        message.media.mediaUrlGenerated = await uploadHelper.generatePreSignedGetUrl(CONFIG.MEDIA_DATA + message.media.mediaUrl)
        res.status(200).send({ message, success: true })

    } catch (error) {
        console.log(error);
        res.status(500).send(error || 'Something went wrong');
    }
}

module.exports.deleteChatById = async function (req, res) {
    try {
        let singleMessage = await messageDao.findMessageById(req.body._id)
        let messages = await messageDao.deleteMessageById(req.body._id)
        let deleteBookMarkMessage = await messageDao.deleteBookMarkMessage(req.body._id)
        let deleteNotifications = await commonDao.deleteMessageNotifications(req.body._id);
        await groupsDao.updateGroupDate(req.body.groupId)
        if (singleMessage.imgUrl) {
            await uploadHelper.deleteFromS3(singleMessage.imgUrl)
            res.status(200).send({ message: "Image Deleted successfully!" });
        } else {
            res.status(200).send({ message: "Message Deleted successfully!" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error || 'Something went wrong');
    }
}
module.exports.deleteSelectedMessages = async function (req, res) {
    try {
        for (let i = 0; i < req.body._id.length; i++) {
            let selectedMessage = await messageDao.findMessageById(req.body._id[i])
            let deleteBookMarkMessage = await messageDao.deleteBookMarkMessage(req.body._id[i])
            let messages = await messageDao.deleteMessageById(req.body._id[i])
            let deleteNotifications = await commonDao.deleteMessageNotifications(req.body._id[i]);
            if (selectedMessage.imgUrl) {
                await uploadHelper.deleteFromS3(selectedMessage.imgUrl)
                res.status(200).send({ message: "Image Deleted successfully!" });
                return
            }
        }
        await groupsDao.updateGroupDate(req.body.groupId)

        // if (selectedMessage.imgUrl) {
        //     await uploadHelper.deleteFromS3(selectedMessage.imgUrl)
        //     res.status(200).send({ message: "Image Deleted successfully!" });
        // } else {
        //     res.status(200).send({ message: "Message Deleted successfully!" });
        // }
        res.status(200).send({ message: "Message deleted successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).send(error || 'Something went wrong');
    }
}

module.exports.deleteSelectedGroup = async function (req, res) {
    try {
        for (let i = 0; i < req.body._id.length; i++) {
            let remotePath = `Groups/${req.body._id[i]}/`
            await uploadHelper.deleteFolderFromS3(remotePath)
            await groupsDao.deleteSelectedGroup(req.body._id[i])
        }
        res.status(200).send({ message: "Group deleted successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).send(error || 'Something went wrong');
    }
}
module.exports.editMessage = async function (req, res) {
    try {
        let message = await messageDao.findMessageById(req.params.id)
        res.status(200).send(message);
    } catch (error) {
        console.log(error);
        res.status(500).send(error || 'Something went wrong');
    }
}
module.exports.updateMessage = async function (req, res) {
    try {
        let message = await messageDao.updateMessageById(req)
        await groupsDao.updateGroupDate(req.params.groupId)
        res.status(200).send(message);
    } catch (error) {
        console.log(error);
        res.status(500).send(error || 'Something went wrong');
    }
}
module.exports.getReplyMessageById = async function (req, res) {
    try {
        let targetMessage = await messageDao.findMessageById(req.query.messageId)
        if (targetMessage.length) {
            targetMessage = JSON.parse(JSON.stringify(...targetMessage))
            targetMessage._id = new mongoose.Types.ObjectId(targetMessage._id)
            targetMessage.groupId = new mongoose.Types.ObjectId(targetMessage.groupId)
            targetMessage.createdAt = new Date(targetMessage.createdAt)
            let leadingMessages = await messageDao.getMessagesAfterTimestamp(targetMessage._id, targetMessage.createdAt, targetMessage.groupId)
            let laggingMessages = await messageDao.getMessagesBeforeTimestamp(targetMessage._id, targetMessage.createdAt, targetMessage.groupId)
            let groupMessages = [...laggingMessages.reverse(), targetMessage, ...leadingMessages]
            groupMessages = JSON.parse(JSON.stringify(groupMessages))
            for (let message of groupMessages) {
                if (message.media) {
                    let url = await uploadHelper.generatePreSignedGetUrl(CONFIG.MEDIA_DATA + message.media.ThumbNil)
                    message.url = url

                } else if (message.imgUrl) {
                    let url = await uploadHelper.generatePreSignedGetUrl(message.imgUrl)
                    message.url = url
                }
                if (message?.reply?.media) {
                    let url = await uploadHelper.generatePreSignedGetUrl(CONFIG.MEDIA_DATA + message?.reply.media.ThumbNil)
                    message.reply.url = url
                }
                else if (message?.reply?.imgUrl) {
                    let url = await uploadHelper.generatePreSignedGetUrl(message.reply.imgUrl)
                    message.reply.url = url
                }
            }
            let responseObj = {
                target: targetMessage,
                messages: groupMessages,
                success: true
            }
            res.status(200).send(responseObj)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error || 'Something went wrong');
    }
}

module.exports.fetchAllMessages = async function (req, res) {
    try {
        let group = await groupsDao.fetchGroup(req.query)
        let clearStamp = group[0]?.clearStamp?.find(item => item.uid === req.query.uid);
        let date = clearStamp?.date
        let allMessages = ''
        if (date) {
            allMessages = await messageDao.fetchAllMessages(req.query.groupId);
            allMessages = allMessages.filter(item => item.createdAt > date)
        }
        else {
            allMessages = await messageDao.fetchAllMessages(req.query.groupId);
        }
        allMessages = allMessages.filter(item => item.isDeleted != true)
        res.status(200).send({ allMessages });
    }
    catch (err) { }
}
module.exports.blockUserFromGroup = async function (req, res) {
    try {
        if (req.body.blockedStatus) {
            await groupsDao.blockUser(req.body)
            await groupsDao.removeInvitee(req.body)
        }
        else await groupsDao.unblockUser(req.body)
        res.status(200).send({ message: "User Blocked", success: true })
    }
    catch (err) {
        console.log("###Error while blocking user!##", err)
        res.status(500).send({ message: MESSAGE.INTERNAL_SERVER_ERROR })
    }
}
module.exports.getBlockedUserList = async function (req, res) {
    try {
        let group = await groupsDao.getGroupById(req.body.data.groupId)
        let blockedUserList = [];
        for (let i = 0; i < group[0]?.blockedUsers?.length; i++) {
            let userData = await authenticationDao.getUserByUserId(group[0].blockedUsers[i]?.uid);
            blockedUserList.push(userData);
        }
        res.status(200).send({ blockedUserList }); // Sending blockedUserList as response
    } catch (err) {
        console.log("Error While Getting User list", err);
        res.status(500).send({ message: "INTERNAL_SERVER_ERROR" });
    }
}
module.exports.uploadAttachFile = async function ({ query, file, files }, res) {
    try {
        let videoGifFile = ''
        query.groupId = JSON.parse(query.groupId)
        let chatObj = {
            uid: query.uid,
            groupId: query.groupId._id,
            message: query.message,
            isBot: false,
            isUploaded: false
        }
        let message = await mediaRecorderModel.addMessages([chatObj])

        if (query.mediaType != 'image') {
            chatObj.media = {
                mediaUrl: query.fileName,
                mediaType: query.mediaType,
                ThumbNil: query.fileName,
                fileSize: query.fileSize,

            }
        }
        let paths = [
            { local: files[0].path, remote: CONFIG.MEDIA_DATA + query.thumbnailImgSrc },
            { local: files[0].path, remote: CONFIG.MEDIA_DATA + query.fileImgSrc },
        ]
        if (query.mediaType == 'video') {
            videoGifFile = await commonHelper.createGifFile(files[0].path)
            paths.push({ local: videoGifFile.path, remote: CONFIG.MEDIA_DATA + videoGifFile.fileName })
            chatObj.media.ThumbNil = videoGifFile.fileName

        }
        if (query.mediaType == 'image') {
            let remotePath = `Groups/${chatObj.groupId._id}/${new Date().getTime()}.png`
            let path = [
                { local: files[0].path, remote: remotePath },
                { local: files[0].path, remote: remotePath },
            ]
            let url = await uploadHelper.uploadMultipleFilesToAwsS3(path)
            chatObj.imgUrl = url[0].path
            chatObj.url = await uploadHelper.generatePreSignedGetUrl(url[0].path)
        }

        let url = await uploadHelper.uploadMultipleFilesToAwsS3(paths)
        chatObj.isUploaded = true
        if (query.mediaType == 'image') {
            message[0] = await messageDao.updateImageMessages(message[0]._id, chatObj)
        } else {
            message[0] = await messageDao.updateMediaMessages(message[0]._id, chatObj)
        }


        if (message[0].media) {
            let url = await uploadHelper.generatePreSignedGetUrl(CONFIG.MEDIA_DATA + message[0].media.ThumbNil)
            message = JSON.parse(JSON.stringify(message))
            message[0].url = url;
        }
        if (message[0].imgUrl) {
            let url = await uploadHelper.generatePreSignedGetUrl(message[0].imgUrl)
            message = JSON.parse(JSON.stringify(message))
            message[0].url = url;
        }
        if (message[0].isUploaded) {
            res.status(200).send({ message: message[0], chatObj: chatObj })
        } else {
            res.status(500).send({ message: 'Error while uploading file!' })
        }
        await groupsDao.changeSortingDate(query.groupId._id)
        let notification = await commonHelper.manageFileNotifications(query.groupId.uid, query.groupId, query.uid, query.groupId.message);
        await commonDao.createNotification(notification);
    } catch (error) {
        console.error(error)
        res.status(500).send(error || 'Something went wrong');
    }
}
module.exports.forwardMessage = async function ({ body }, res) {
    try {
        let message = ''
        let response = []
        for (let i = 0; i < body.groupIds.length; i++) {
            let chatObj = {
                uid: body.uid,
                groupId: body.groupIds[i]._id,
                message: body.forward.message,
                isBot: false,
                media: {
                    mediaUrl: body.forward.media?.mediaUrl,
                    mediaType: body.forward.media?.mediaType,
                    ThumbNil: body.forward.media?.ThumbNil,
                    fileSize: body.forward.media?.fileSize
                },
                forward: body.forward,
                imgUrl: body.forward.imgUrl,
            }
            message = await messageDao.addMessages(chatObj)
            await groupsDao.changeSortingDate(body.groupIds[i]._id)
            let notification = await commonHelper.manageForwardNotification(body.uid, body.groupIds[i]);
            await commonDao.createNotification(notification);
            response.push(message)
        }
        res.status(200).json({ mediaInfo: "mediaInfo", message: response });
    } catch (error) {
        console.log("File: Error", error)

    }
}
module.exports.reactMessage = async function (req, res) {
    try {
        let react = await messageDao.reactMessage(req.body)
        let notification = await commonHelper.manageReactNotification(req.body.data.uid, react.messageData.uid, react.messageData.groupId, react.messageData._id, req.body.data.reactedMessage);
        await commonDao.createNotification(notification);
        res.status(200).send(react);
    } catch (error) {
        console.log(error);
        res.status(500).send(error || 'Something went wrong');
    }
}
module.exports.createPoll = async function (req, res) {
    let data = req.body.data
    let chatObj = {
        uid: data.uid,
        groupId: data.groupId._id,
        message: '',
        isBot: false,
        isUploaded: false,
        type: 'poll',
        poll: data.pollData
    }
    let message = await messageDao.addMessages(chatObj)
    let notification = await commonHelper.manageFileNotifications(data.groupId.uid, data.groupId, data.uid, data.groupId.message);
    await commonDao.createNotification(notification);
    res.status(200).send({ message })
}

module.exports.updatePoll = async function (req, res) {
    let message = await messageDao.updatePoll(req.body.data)
    res.status(200).send({ message })
}
module.exports.getPollUserList = async function (req, res) {
    let user = await messageDao.getPollUserList(req.query.messageId, req.query.optionId)
    res.status(200).send({ user: user[0].pollUser })
}
module.exports.addToBookMark = async function (req, res) {
    let data = await bookMarkDao.addToBookMark(req.body.data)
    res.status(200).send({ message: "Message successfully added to the bookmark", data: data, success: true })
}
module.exports.getBookMarkMessage = async function (req, res) {
    let messages = await bookMarkDao.getBookMarkMessage(req.query.uid)
    for (let message of messages) {

        if (message.message.media) {
            if (message.message.media.mediaType == 'doc') {
                let url = await uploadHelper.generatePreSignedGetUrl(CONFIG.LEAD_MAGNET_PDF_PATH + message.message.media.templateId + `.pdf`)
                message.message.url = url
            }
            if (message.message.media.mediaType == 'resume') {
                let remotePath = path.join(CONFIG.RESUME_PDF_PATH, `${message.message.uid}`, `${message.message.media.mediaUrl}`)
                let url = await uploadHelper.generatePreSignedGetUrl(remotePath)
                message.message.url = url
            }
            if (message.message.media.mediaType == 'CoverLetter') {
                let remotePath = path.join(CONFIG.COVER_PDF_PATH, `${message.message.uid}`, `${message.message.media.mediaUrl}`)
                let url = await uploadHelper.generatePreSignedGetUrl(remotePath)
                message.message.url = url
            }
            if (message.message.media.mediaType != 'doc' && message.message.media.mediaType != 'resume' && message.message.media.mediaType != 'CoverLetter') {
                let url = await uploadHelper.generatePreSignedGetUrl(CONFIG.MEDIA_DATA + message.message.media.ThumbNil)
                message.message.url = url;
                if (message.message.media.templateId && message.message.media.mediaType == 'video') {
                    let templates = await mediaRecorderModel.getSingleTemplate(message.message.media.templateId)
                    templates = JSON.parse(JSON.stringify(templates));
                    let remoteHeaderPath = `${CONFIG.MEDIA_DATA + 'VideoTemplate/'}${templates.headerImgSrc}`;
                    let remoteFooterPath = `${CONFIG.MEDIA_DATA + 'VideoTemplate/'}${templates.footerImgSrc}`;

                    let headerUrl = await uploadHelper.generatePreSignedGetUrl(remoteHeaderPath);
                    let footerUrl = await uploadHelper.generatePreSignedGetUrl(remoteFooterPath);

                    message.message.media.headerUrl = headerUrl;
                    message.message.media.footerUrl = footerUrl;

                }
            }

        } else if (message.message.imgUrl) {
            let url = await uploadHelper.generatePreSignedGetUrl(message.message.imgUrl)
            message.message.url = url
        }
        if (message.message?.reply?.media) {
            let url = await uploadHelper.generatePreSignedGetUrl(CONFIG.MEDIA_DATA + message.message?.reply.media.ThumbNil)
            message.message.reply.url = url
        }
        else if (message.message?.reply?.imgUrl) {
            let url = await uploadHelper.generatePreSignedGetUrl(message.message.reply.imgUrl)
            message.message.reply.url = url
        }
    }
    res.status(200).send({ message: messages })
}
module.exports.removeFromBookMark = async function (req, res) {
    await bookMarkDao.removeFromBookMark(req.body)
    res.status(200).send({ message: "Message successfully deleted to the bookmark", success: true })
}

module.exports.shareContact = async function ({ body }, res) {
    try {
        let message = ''
        let response = []
        for (let i = 0; i < body.groupIds.length; i++) {
            let chatObj = {
                uid: body.uid,
                groupId: body.groupIds[i]._id,
                message: '',
                isBot: false,
                isUploaded: false,
                type: 'contactCard',
                cardUid: body.contact.uid
            }
            message = await messageDao.addMessages(chatObj)
            let notification = await commonHelper.manageForwardNotification(body.uid, body.groupIds[i]);
            await commonDao.createNotification(notification);
            response.push(message)
        }
        res.status(200).send({ message })
    } catch (error) {
        console.log("File: Error", error)

    }
}