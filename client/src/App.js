import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // Optional: Choose a theme
import 'primereact/resources/primereact.min.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Core CSS for PrimeReact
import 'primeicons/primeicons.css';  
// Components
import Navbar from './components/Navbar.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Homepage from './components/Homepage.jsx';
import Footer from './components/Footer.jsx';
import PrivacyPolicy from './components/Policy/Policy.jsx';
import TermsAndConditions from './components/Policy/Term-Condition.jsx';
import Chat from './components/Chat/chat.js';
import Profile from './components/Profile.jsx';
import Overview from './components/overview.jsx';
import AboutPage from './components/About.jsx';
import Invite from './components/autheniticate/invite.jsx';
import NotFound from './components/layout/404.js';

// Toasty
import { ToastContainer } from 'react-toastify';

// Main Component
const Main = () => {
  const location = useLocation();
  
  // Determine if the navbar should be hidden
  const hideNavbar = ['/chat', '/overview', '/profile'].includes(location.pathname) || location.pathname === '/404';

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/term-conditions" element={<TermsAndConditions />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/invite" element={<Invite />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
};

// App Component
const App = () => (
  <BrowserRouter>
    <Main />
  </BrowserRouter>
);

export default App;
