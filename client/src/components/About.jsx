import React from 'react';
import '../components/Style/AboutPage.css'; // Assuming you will use a CSS file for styling

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container">
        <h1>About TalkNexus</h1>
        <p>
          Welcome to <strong>TalkNexus</strong>! We're a vibrant platform focused on connecting individuals 
          and groups through meaningful conversations. Whether you're joining a chat group or engaging in 
          one-on-one discussions, TalkNexus provides a secure and intuitive platform for all your communication needs.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to create a space where people can connect, collaborate, and communicate effectively. 
          We believe in empowering users with features like group creation, personal chat invitations, and more.
        </p>

        <h2>Features</h2>
        <ul>
          <li>Create and manage chat groups</li>
          <li>Invite friends for one-on-one chats</li>
          <li>Personalize your profile and chat experience</li>
          <li>Delete or archive conversations with ease</li>
        </ul>

        <h2>Why TalkNexus?</h2>
        <p>
          At TalkNexus, we prioritize your privacy and security. Our platform is built using modern technologies, 
          ensuring that your data is secure while providing you with a smooth user experience. 
          We're constantly working to improve and bring you new features!
        </p>

        <h2>Get in Touch</h2>
        <p>
          Have any questions or feedback? Feel free to reach out to us at:
          <br/>
          Email: support@talknexus.com
          <br/>
          Phone: +91-1234567890
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
