import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../components/Assets/TalkNexus.png';

const Navbar = () => {
  return (
    <>
    
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className="row w-100 align-items-center">
            <div className="col-md-6 d-flex justify-content-start">
              <Link to="/" className="navbar-brand d-flex align-items-center">
                <img src={logo} alt="TalkNexus Logo" style={{ height: '40px', marginRight: '10px' }} />
                <h1 className="h4 m-0">TalkNexus</h1>
              </Link>
            </div>
            <div className="col-md-6 d-flex justify-content-end">
              <button className="btn btn-primary">
                <Link to="/Login" className="text-white text-decoration-none">Login</Link>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* "What We Can Do" Section */}
      
      
    
    </>
    
  );
}

export default Navbar;
