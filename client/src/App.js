import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // Optional: Choose a theme
import 'primereact/resources/primereact.min.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
                 // Core CSS for PrimeReact
import 'primeicons/primeicons.css';  
import Homepage from './components/Homepage';
import Footer from './components/Footer';
import PrivacyPolicy from './components/Policy/Policy';
import TermsAndConditions from './components/Policy/Term-Condition';

function App() {
 

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/term-conditions" element={<TermsAndConditions />} />




         
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
