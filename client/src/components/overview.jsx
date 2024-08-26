import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Dashboard from './Dashboard';
import { Link } from 'react-router-dom';
// import heroimage from '../Assets/banner.png';
import './Style/overview.css';  // Import the CSS file for styling

const Overview = () => {
  return (
    <>
      <Dashboard />
      <div className="overview-page">
        <section className="hero-section1 text-center">
          {/* <img src={heroimage} className="hero-background" alt="hero" /> */}
          <div className="hero-content py-5">
            <Container>
              <h1 className="display-4">Welcome to TalkNexus</h1>
              <p className="lead">
                Your one-stop solution for seamless communication and collaboration.
              </p>
              <Button variant="primary" size="lg">
                <Link to="/chat">Get Started</Link>
              </Button>
            </Container>
          </div>
        </section>

        {/* Other sections */}
        <section className="features-section py-5 bg-light">
          <Container>
            <h2 className="text-center mb-4">Key Features</h2>
            <Row>
              <Col md={4} className="text-center">
                <i className="pi pi-comments display-4 mb-3"></i>
                <h4>Real-time Chat</h4>
                <p>Communicate instantly with your team or clients.</p>
              </Col>
              <Col md={4} className="text-center">
                <i className="pi pi-users display-4 mb-3"></i>
                <h4>User Profiles</h4>
                <p>Create and manage user profiles easily.</p>
              </Col>
              <Col md={4} className="text-center">
                <i className="pi pi-globe display-4 mb-3"></i>
                <h4>Global Access</h4>
                <p>Access your data from anywhere, anytime.</p>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="benefits-section py-5">
          <Container>
            <h2 className="text-center mb-4">Why Choose TalkNexus?</h2>
            <Row>
              <Col md={6}>
                <h5>Streamlined Communication</h5>
                <p>TalkNexus enables fast and secure communication within your organization, ensuring that everyone stays on the same page.</p>
              </Col>
              <Col md={6}>
                <h5>Customizable Features</h5>
                <p>Tailor the platform to meet your specific needs, whether you're a small team or a large enterprise.</p>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <h5>Scalable Solution</h5>
                <p>TalkNexus grows with your business, offering features and integrations that scale as your needs evolve.</p>
              </Col>
              <Col md={6}>
                <h5>Comprehensive Support</h5>
                <p>Our dedicated support team is here to assist you every step of the way, from onboarding to troubleshooting.</p>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="cta-section text-center py-5 bg-primary text-white">
          <Container>
            <h2>Ready to Get Started?</h2>
            <p className="lead">Join TalkNexus today and elevate your communication experience.</p>
            <Button variant="light" size="lg">Sign Up Now</Button>
          </Container>
        </section>
      </div>
    </>
  );
};

export default Overview;
