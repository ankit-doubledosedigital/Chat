const transporter = require('../config/emailConfig');
const Invite = require('../models'); // Added correct model import
const crypto = require('crypto'); // Added to generate a unique invite token

class InviteDAO {
    static async createInvite(email,name,link ) {
        
        
        try {
           

           
            const mailOptions = {
                from: 'moreinfotalknexus@gmail.com',
                to: email,
                subject: `Invitation to Join`,
                html: `
                    <p>You have been invited to join the chat room Name <b>${name}<b>.</p>
                    <p>Click the link below to accept the invitation:</p>
                    <a href=${link}>Join Chat</a>
                    <p>This invitation will expire in 1 hour.</p>
                `,
                // attachments: [
                //     {
                //       filename: 'logo.png', //! Name of the file as we want it to appear in the email
                //       path: path.join(CONFIG.EMAIL_IMAGE_PATH, 'email', 'logo.png' ), //! Path of image
                //       cid: 'logo',
                //     },
                //     {
                //         filename: 'youtube.png', //! Name of the file as we want it to appear in the email
                //         path: path.join(CONFIG.EMAIL_IMAGE_PATH, 'email', 'youtube.png' ), //! Path of image
                //         cid: 'youtube',
                //     },
                //     {
                //         filename: 'facebook.png', //! Name of the file as we want it to appear in the email
                //         path: path.join(CONFIG.EMAIL_IMAGE_PATH, 'email', 'facebook.png' ), //! Path of image
                //         cid: 'facebook',
                //     },
                //     {
                //         filename: 'twitter.png', //! Name of the file as we want it to appear in the email
                //         path: path.join(CONFIG.EMAIL_IMAGE_PATH, 'email', 'twitter.png' ), //! Path of image
                //         cid: 'twitter',
                //     },
                //     {
                //         filename: 'linkedIn.png', //! Name of the file as we want it to appear in the email
                //         path: path.join(CONFIG.EMAIL_IMAGE_PATH, 'email', 'lin.png' ), //! Path of image
                //         cid: 'linkedIn',
                //     },
                //     {
                //         filename: 'instagram.png', //! Name of the file as we want it to appear in the email
                //         path: path.join(CONFIG.EMAIL_IMAGE_PATH, 'email', 'insta.png' ), //! Path of image
                //         cid: 'instagram',
                //     },
                //     // Attachment files . . .
                //     ...content
                //   ]
            };

            // Send the email
            // await transporter.sendMail(mailOptions);
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('🙉 Error sending email:', error);
                } else {
                    console.log('🙉 Email sent:', mailOptions.to,info.response);
                }
        
    
                transporter.close();
            });

            return { success: true, message: 'Invitation sent successfully.' };
        } catch (error) {
            console.error("Error creating invite:", error);
            return { success: false, message: 'Failed to send the invitation.' };
        }
    }

    static async getInviteByToken(invitationCode) {
        try {
            // Find the invite by invitation code (token)
            const invite = await Invite.findOne({ invitationCode });
            return invite;
        } catch (error) {
            console.error("Error retrieving invite:", error);
            return null;
        }
    }

    static async updateInviteStatus(invitationCode, status) {
        try {
            // Find the invite and update its status
            const updatedInvite = await Invite.findOneAndUpdate(
                { invitationCode },
                { status },
                { new: true }
            );
            return updatedInvite;
        } catch (error) {
            console.error("Error updating invite status:", error);
            return null;
        }
    }
}

module.exports = InviteDAO;
