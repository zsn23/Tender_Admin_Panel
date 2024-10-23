import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Contact = () => {
  return (
    <div className="container my-5">
        <Helmet>
        <title>Contact US | Bismillah Tender</title>
        <meta name="description" content="Get in touch with Bismillah Tender. Use our contact form, email, or phone to reach out with questions or requests about tender opportunities in Pakistan." />
      </Helmet>
      <div className="row">
        {/* Main Content Area */}
        <div className="col-md-8">
          {/* Breadcrumb Section */}
          <Link className="text-decoration-none text-dark icon-link-hover link-underline icon-link" to="/">
            <span className=" fw-lighter text-dark colorHover">
              <span className='link-underline p-1'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-door-fill text-" viewBox="0 0 16 16">
                  <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
                </svg>
              </span>
              Home /</span>
          </Link>
          <span className="text-dark  fs-6 "> Contact Us   </span>

          {/* Header Section */}
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold animate_animated animate_fadeInDown">Subscribe to Tenders</h1>
            <p className="lead animate_animated animate_fadeInUp ">Get the latest tender alerts directly to your inbox.</p>
          </div>

          {/* Email Alert Section */}
          <div className="mb-4">
            <p>Email: <a href="mailto:info@tender786.com" className="text-success fw-bold">info@tender786.com</a></p>
          </div>

          {/* Contact Us Section */}
          <div className="mb-4">
            <h2 className="fw-bold">Contact Us</h2>
            <p>We provide tenders based on your category and location through:</p>
            <ul className="list-unstyled mb-4">
              <li><i className="bi bi-envelope me-2 text-primary"></i>Email</li>
              <li><i className="bi bi-whatsapp me-2 text-success"></i>WhatsApp</li>
              <li><i className="bi bi-truck me-2 text-info"></i>Courier</li>
            </ul>
            
            <p className="mb-4">
              <strong>For further information and pricing:</strong>
            </p>
            <Link to="https://wa.me/+9237584398353" target="_blank" rel="noopener noreferrer" className="btn customButton  rounded-pill ">
  <div> 
  <img
    width="28"
    height="28"
    className="whstapplogoInSmallScreen"
    src="https://img.icons8.com/color/48/whatsapp--v1.png"
    alt="WhatsApp"
  />
  
  <span className="ms-2">
    Call or WhatsApp: 
    0325 4891919 - 
    0316 4484377
  </span>
  </div>
  </Link>

  {/* <Link to="https://wa.me/+9237584398353" target="_blank" rel="noopener noreferrer" className="btn btn_ btn-outline-success text-white rounded-pill">
                <img width="30" height="30" className='whstapplogoInSmallScreen' src="https://img.icons8.com/color/48/whatsapp--v1.png" alt="whatsapp--v1" />
                <span> Whatsapp </span>
              </Link> */}

            <div className='mt-4'>

              
              <div className="btn btn-dark d-inline-flex align-items-center iconLink rounded-pill animate_animated animatepulse animate_infinite">
               <Link to='/latest-tender' className='text-decoration-none text-white'>Get in Touch</Link>
              </div>

              <div className="btn btn-dark d-inline-flex align-items-center iconLink rounded-pill mx-4 animate_animated animatepulse animate_infinite">
              <Link to='/price-plan-detail' className='text-decoration-none text-white '> See Subscription Plans</Link>

              </div>
            </div>
          </div>
          {/* Customer Service Section */}
          <div className="alert alert-success animate_animated animate_fadeIn">
            <h2 className="fw-bold">Open Customer Service</h2>
            <p>
              Our dedicated team is available 7 days a week to assist you with any inquiries or support you may need. Feel free to reach out to us anytime!
            </p>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="col-md-4 mt-5">
          <div className="p-4 rounded border bg-light shadow-sm">
            <h3 className="fw-bold mb-3">Famous Categories</h3>
            <ul className="list-unstyled">
              <li className="text-dark text-decoration-none d-block mb-2"><i className="bi bi-tag-fill text-success me-2"></i>NHA Pakistan</li>
              <li  className="text-dark text-decoration-none d-block mb-2"><i className="bi bi-tag-fill text-success me-2"></i>Railway Pakistan</li>
              <li  className="text-dark text-decoration-none d-block mb-2"><i className="bi bi-tag-fill text-success me-2"></i>Lesco Pakistan</li>
              <li  className="text-dark text-decoration-none d-block mb-2"><i className="bi bi-tag-fill text-success me-2"></i>Wapda Pakistan</li>
              <li  className="text-dark text-decoration-none d-block mb-2"><i className="bi bi-tag-fill text-success me-2"></i>SNGPL Pakistan</li>
              <li>
  <Link to="/categories" className="text-dark fw-bold">
    <i className="bi bi-arrow-right-circle-fill me-2"></i>See more...
  </Link>
</li>

            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;