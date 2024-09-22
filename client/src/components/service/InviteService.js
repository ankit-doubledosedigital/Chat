import axios from 'axios';

const API_URL = 'http://localhost:5000';

const sendInvite = async (link, email,name) => {
  try {
    
    const response = await axios.post(`${API_URL}/invite/send-invite`, {
      link,
      email, // Include email in the payload
      name
    });

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
