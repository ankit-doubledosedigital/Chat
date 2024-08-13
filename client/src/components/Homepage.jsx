import React from 'react';
import bannerImage from '../Assets/banner.png';
import androidIcon from '../Assets/android-icon.png';
import iosIcon from '../Assets/ios-icon.png';
import macIcon from '../Assets/ios-icon.png'; // Corrected path
import windowsIcon from '../Assets/windows-icon.png';
import linuxIcon from '../Assets/linux-icon.png';
import './Style/Homepage.css';
import { Row, Col, Card, Button } from 'react-bootstrap';

const features = [
  {
    title: 'Chat Circles',
    description: 'Engage in vibrant, interactive discussions with like-minded individuals in customizable chat environments.',
  },
  {
    title: 'Real-time Collaboration',
    description: 'Work together with your team in real-time with seamless file sharing and communication tools.',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Get insights into your project’s progress with our comprehensive analytics dashboard.',
  },
  // Add more features as needed
];

function Homepage() {
  return (
    <>
      {/* Hero Section */}
      <div className="container-fluid text-black hero-section d-flex align-items-center justify-content-center">
        <header className="row content-width mx-auto">
          <div className="col-md-6 mb-4 mb-md-0">
            <h1 className="h1 display-4 fw-bold">Collaboration Simplified</h1>
            <p className="lead my-4 text-secondary">
              Break free from the abstract. In publishing, graphic design, and beyond,
              our platform turns ideas into reality. Replace limits with seamless innovation.
            </p>
            <div className="d-flex gap-3">
              <button className="btn btn-primary btn-lg">Get Started</button>
              <button className="btn btn-outline-primary btn-lg">How it Works</button>
            </div>
          </div>
          <div className="col-md-6 d-flex justify-content-center justify-content-md-end">
            <img src={bannerImage} alt="Collaboration illustration" className="img-fluid rounded banner-image" />
          </div>
        </header>
      </div>

      {/* Features Section */}
      <section className="container my-5 content-width feature-section ">
        <h2 className="h1 text-center mt-10 ">What We Can Do</h2>
        <div className="row text-center">
          {features.map((feature, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card shadow-sm border-0 feature-card">
                <div className="card-body">
                  <h5 className="card-title text-secondary">{feature.title}</h5>
                  <p className="card-text text-muted">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Download Section */}
      <section className="container my-5 mt-3 content-width download-section">
        <h2 className="text-center mb-4 h1">Download Now</h2>
        <p className="text-center mb-4 text-muted">
          Experience BeGenieUs on your preferred operating system. Download now for a seamless experience.
        </p>
        <div className="row text-center justify-content-center">
          <div className="col-md-2 mb-4">
            <a href="#android" className="d-block">
              <img src={androidIcon} alt="Android" className="img-fluid mb-2 os-icon" />
              <h5 className="text-secondary">Android</h5>
            </a>
          </div>
          <div className="col-md-2 mb-4">
            <a href="#ios" className="d-block">
              <img src={iosIcon} alt="iOS" className="img-fluid mb-2 os-icon" />
              <h5 className="text-secondary">iOS</h5>
            </a>
          </div>
          <div className="col-md-2 mb-4">
            <a href="#mac" className="d-block">
              <img src={macIcon} alt="macOS" className="img-fluid mb-2 os-icon" />
              <h5 className="text-secondary">macOS</h5>
            </a>
          </div>
          <div className="col-md-2 mb-4">
            <a href="#windows" className="d-block">
              <img src={windowsIcon} alt="Windows" className="img-fluid mb-2 os-icon" />
              <h5 className="text-secondary">Windows</h5>
            </a>
          </div>
          <div className="col-md-2 mb-4">
            <a href="#linux" className="d-block">
              <img src={linuxIcon} alt="Linux" className="img-fluid mb-2 os-icon" />
              <h5 className="text-secondary">Linux</h5>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section (Bootstrap) */}
      <section className="container my-5">
        <h2 className="text-center mb-4 h1">Our Features</h2>
        <Row>
          {features.map((feature, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{feature.title}</Card.Title>
                  <Card.Text>{feature.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Pricing Plans Section */}
      <section className="container my-5 mt-3 content-width price-section">
        <div className="surface-0">
          <div className="text-900 font-bold text-6xl mb-4 text-center">
            <h1 className='h1'>Pricing Plans</h1>
          </div>
          <div className="text-700 text-xl mb-6 text-center line-height-3">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos.
          </div>
          <div className="d-flex justify-content-center flex-wrap">
            {/* Basic Plan */}
            <div className="card p-4 m-3" style={{ maxWidth: '320px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              <div className="card-body text-center">
                <h2 className="text-900 font-medium text-xl mb-2">Basic</h2>
                <p className="text-600 mb-4">Plan description</p>
                <div className="d-flex justify-content-center align-items-center mb-4">
                  <span className="font-bold text-2xl text-900">$9</span>
                  <span className="ml-2 font-medium text-600">per month</span>
                </div>
                <ul className="list-unstyled mb-4">
                  <li className="d-flex align-items-center mb-2">
                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                    <span>Arcu vitae elementum</span>
                  </li>
                  <li className="d-flex align-items-center mb-2">
                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                    <span>Dui faucibus in ornare</span>
                  </li>
                  <li className="d-flex align-items-center mb-2">
                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                    <span>Morbi tincidunt augue</span>
                  </li>
                </ul>
                <Button variant="primary" className="w-100">Buy Now</Button>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="card p-4 m-3" style={{ maxWidth: '320px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              <div className="card-body text-center">
                <h2 className="text-900 font-medium text-xl mb-2">Premium</h2>
                <p className="text-600 mb-4">Plan description</p>
                <div className="d-flex justify-content-center align-items-center mb-4">
                  <span className="font-bold text-2xl text-900">$29</span>
                  <span className="ml-2 font-medium text-600">per month</span>
                </div>
                <ul className="list-unstyled mb-4">
                  <li className="d-flex align-items-center mb-2">
                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                    <span>Arcu vitae elementum</span>
                  </li>
                  <li className="d-flex align-items-center mb-2">
                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                    <span>Dui faucibus in ornare</span>
                  </li>
                  <li className="d-flex align-items-center mb-2">
                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                    <span>Morbi tincidunt augue</span>
                  </li>
                </ul>
                <Button variant="primary" className="w-100">Buy Now</Button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="card p-4 m-3" style={{ maxWidth: '320px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              <div className="card-body text-center">
                <h2 className="text-900 font-medium text-xl mb-2">Enterprise</h2>
                <p className="text-600 mb-4">Plan description</p>
                <div className="d-flex justify-content-center align-items-center mb-4">
                  <span className="font-bold text-2xl text-900">$49</span>
                  <span className="ml-2 font-medium text-600">per month</span>
                </div>
                <ul className="list-unstyled mb-4">
                  <li className="d-flex align-items-center mb-2">
                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                    <span>Arcu vitae elementum</span>
                  </li>
                  <li className="d-flex align-items-center mb-2">
                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                    <span>Dui faucibus in ornare</span>
                  </li>
                  <li className="d-flex align-items-center mb-2">
                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                    <span>Morbi tincidunt augue</span>
                  </li>
                </ul>
                <Button variant="primary" className="w-100">Buy Now</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Homepage;
