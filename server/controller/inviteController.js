const InviteDAO = require('../dao/inviteDAO');

class InviteController {
  static async sendInvite(req, res) {
    const { invitationCode} = req.body;

    try {
      await InviteDAO.createInvite(invitationCode);
      res.status(200).send('Invite sent and saved successfully');
    } catch (error) {
      console.error('Error sending invite:', error);
      res.status(500).send('Error sending invite');
    }
  }

  static async getInvite(req, res) {
    const { token } = req.params;

    try {
      const invite = await InviteDAO.getInviteByToken(token);
      if (invite) {
        res.status(200).json(invite);
      } else {
        res.status(404).send('Invite not found');
      }
    } catch (error) {
      console.error('Error retrieving invite:', error);
      res.status(500).send('Error retrieving invite');
    }
  }

  static async updateInviteStatus(req, res) {
    const { token } = req.params;
    const { status } = req.body;

    try {
      const invite = await InviteDAO.updateInviteStatus(token, status);
      if (invite) {
        res.status(200).json(invite);
      } else {
        res.status(404).send('Invite not found');
      }
    } catch (error) {
      console.error('Error updating invite status:', error);
      res.status(500).send('Error updating invite status');
    }
  }
}

module.exports = InviteController;
