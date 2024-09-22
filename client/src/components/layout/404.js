import React from 'react';
// import { useHistory } from 'react-router-dom'; // Import useHistory for navigation

const NotFound = () => {
//   const history = useHistory();

//   const goToHome = () => {
//     // history.push('/'); // Use history.push to navigate to the home page
//   };

  return (
    <div className="bg-back">
      <div className="index-img"></div>
      <div className="container-xxl h-100 d-flex position-relative z-index-1">
        <div className="d-flex justify-content-center align-items-center flex-column w-100 page-not-found-section">
          <div className="white-card-magnet text-center d-flex flex-column">
            <h1 className="mx-auto">
              4<img src="../../../assets/images/logo-icon.svg" width="80" alt="Logo" />4
            </h1>
            <h2>Page not found</h2>
            <p>Sorry! We couldn't find the page you're looking for.</p>
            {/* <button onClick={goToHome} className="btn btn-primary">
              Back To Home
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
