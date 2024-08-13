import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // Optional: Choose a theme
import 'primereact/resources/primereact.min.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Core CSS for PrimeReact
import 'primeicons/primeicons.css';  
// Component
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Homepage from './components/Homepage';
import Footer from './components/Footer';
import PrivacyPolicy from './components/Policy/Policy';
import TermsAndConditions from './components/Policy/Term-Condition';
import Chat from './components/Chat/chat';

// Toasty
import { ToastContainer } from 'react-toastify';

function App() {
 

  return (
    <Router>
      <div>
      <ToastContainer />
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/term-conditions" element={<TermsAndConditions />} />
          <Route path="/chat" element={<Chat />} />





         
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
