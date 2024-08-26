import React, {  useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import './Style/Profile.css'
// import user from '../path_to_user_image'; // Replace with the correct path to the user image

const Profile = () => {
  // const [rewards, setRewards] = useState('');
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');
  const userId = localStorage.getItem('userId');

  const clearCacheLogout = () => {
    // Clear local storage
    localStorage.clear();

    // Clear session storage
    sessionStorage.clear();
  };

  useEffect(() => {
    // Fetch user data
    axios.get('http://localhost:8080/login/getData', {
      params: { userId }
    })
    // .then(response => {
    //   setRewards(response.data.user.rewards);
    // })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, [userId]); // The effect runs when the component mounts and when userId changes

  return (
    <>
      <Dashboard />
      <div className="dashboard">
        <h2>User Profile</h2>
        {/* <img src={user} alt="user" /> */}
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              {/* <th>Reward Points</th> */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{email}</td>
              <td>{name}</td>
              {/* <td>{rewards}</td> */}
            </tr>
          </tbody>
        </table>
        <button>
          <Link to="/" onClick={clearCacheLogout} style={{ color: 'inherit', textDecoration: 'none' }}>
            Logout
          </Link>
        </button>
      </div>
    </>
  );
};

export default Profile;
