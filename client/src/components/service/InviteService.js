import axios from 'axios';

const API_URL = 'http://localhost:5000';

const sendInvite = async (invitationCode, email) => {
  try {
    const inviteToken = generateInviteToken(); // Generate a unique token for the invite
    console.log("🚀 ~ sendInvite ~ inviteToken:", inviteToken);
    
    const response = await axios.post(`${API_URL}/invite/send-invite`, {
      inviteToken,
      invitationCode,
      email // Include email in the payload
    });

    console.log("🚀 ~ sendInvite ~ response:", response);
    return response.data;
  } catch (error) {
    console.error('Error sending invite:', error);
    throw error;
  }
};

// Optional: Generate a unique token for the invite (can be moved to utils)
const generateInviteToken = () => {
  return Math.random().toString(36); // Simple token generator
};

export default {
  sendInvite,
};
