import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router
// import './Style/Footer.css'

const Footer = () => {
    return (
        <footer className="footer bg-light text-dark py-4">
            <div className="container text-center">
                <div className="row">
                    {/* About Section */}
                    <div className="col-md-4 mb-3">
                        <h5 className='text-danger'> About TalkNexus</h5>
                        <p>
                            TalkNexus is your go-to platform for seamless communication and collaboration. Connect, share, and grow with us.
                        </p>
                    </div>
                    {/* Links Section */}
                    <div className="col-md-4 mb-3">
                        <h5 className='text-danger'>Quick Links</h5>
                        <ul className="list-unstyled ">
                            <li><Link to="/" className="text-dark">Home</Link></li>
                            <li><Link to="/about" className="text-dark">About Us</Link></li>
                            <li><Link to="/services" className="text-dark">Services</Link></li>
                            <li><Link to="/contact" className="text-dark">Contact</Link></li>
                            <li><Link to="/privacy" className="text-dark">Policy</Link></li>

                            <li><Link to="/term-conditions" className="text-dark">Term and Conditions</Link></li>

                        </ul>
                    </div>
                    {/* Contact Section */}
                    <div className="col-md-4 mb-3">
                        <h5 className='text-danger'>Contact Us</h5>
                        <p>Email: <a href="mailto:support@talknexus.com" className="text-light">support@talknexus.com</a></p>
                        <p>Phone: <a href="tel:+1234567890" className="text-light">+123 456 7890</a></p>
                        <p>Address: 123 TalkNexus St, Communication City, CC 12345</p>
                    </div>
                </div>
                <div className="mt-4">
                    <p className="mb-0">&copy; {new Date().getFullYear()} TalkNexus. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
