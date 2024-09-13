const transporter = require('../config/emailConfig');
const Invite = require('../models/');

class InviteDAO {
    static async createInvite(email, chatRoomName, inviteToken) {
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        const invite = new Invite({

            invitationCode,

        });

        await invite.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Invitation to Join ${chatRoomName}`,
            html: `
        <p>You have been invited to join the chat room <b>${chatRoomName}</b>.</p>
        <p>Click the link below to accept the invitation:</p>
        <a href="https://your-app.com/join-chat?token=${inviteToken}">Join Chat</a>
      `,
        };

        return transporter.sendMail(mailOptions);
    }

    static async getInviteByToken(invitationCode) {
        return Invite.findOne({ invitationCode });
    }

    static async updateInviteStatus(invitationCode, status) {
        return Invite.findOneAndUpdate({ invitationCode }, { status }, { new: true });
    }
}

module.exports = InviteDAO;
