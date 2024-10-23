import React from 'react';
import Logo1 from './railway-bridge.ef6276582a3a96af5d27.jpg';
import Logo2 from './pic2railway.jpg';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
const About = () => {
  return (
    <>
      <div className="container-fluid p-0 background-imageabout1">
      <Helmet>
        <title>About US | Bismillah Tender</title>
        <meta name="description" content="Learn more about Bismillah Tender, our mission, values, and the team behind our services. Discover how we provide the latest tender opportunities in Pakistan." />
      </Helmet>
        <div className="opacity-bg h-100 d-flex align-items-center justify-content-center" data-negative="true">
          <div className="text-white text-center fade-in-text ">
            <h1 className="fw-bold">ABOUT US</h1>
            <p className="fw-bold">We help you find tenders according to your category</p>
          </div>
        </div>
      </div>
      <div className='m-4'>
        <Link className="text-decoration-none text-dark icon-link-hover link-underline icon-link" to="/">
          <span className=" fw-lighter text-dark colorHover">
            <span className='link-underline p-3'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-door-fill text-" viewBox="0 0 16 16">
                <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
              </svg>
            </span>
            Home /</span>
        </Link>
        <span className="text-dark  fs-6 "> About us  </span>
      </div>

      <div className="container-fluid pl-5  my-5">
        <div className="row ">
          <div className="col-lg-6 mb-4 bgcolor ">
            <h5 >Since 2010</h5>
            <h1>Our Story</h1>
            <p>
              Tender Bismillah comprises of a young, dynamic & experienced team who is passionate about just one thing "Helping you in exploring business opportunities by providing right Tenders information & related services Tender Bismillah is your leading edge partner in finding the right tenders. We understand your needs; know the opportunities that exist to fulfil them, and help leverage these opportunities in the shortest possible time. Our team has some of the industry's most valued experts who understand the pain points of clients and have put together Tender Bismillah to give you a renewed perspective on Tendering. We have achieved this commendable presence with results across our extensive network.
            </p>
            <div className="  process-step">
              <div className="process-icon">
                <i className="bi bi-check-circle-fill text-success"></i>
                <span className='p-3'>We have get tenders from right resources</span>
              </div>
            </div>
            <div className="  process-step">
              <div className="process-icon">
                <i className="bi bi-check-circle-fill text-success"></i>
                <span className='p-3'>We have to classfied all the tenders according to category</span>
              </div>
            </div>
            <div className="  process-step">
              <div className="process-icon">
                <i className="bi bi-check-circle-fill text-success"></i>
                <span className='p-3'>Daily Upload on the website</span>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mb-4">
            <img src={Logo1} className="img-fluid" alt="Story" />
          </div>
        </div>

        <div className="container-fluid text-center my-5">
          <h2>Our Tender Process</h2>
          <div className="row justify-content-center align-items-center mt-5">
            <div className="col-12 col-md-4">
              <div className="process-step">
                <div className="process-icon">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span><hr /></span>
                </div>
                <p>We have get tenders from right resources</p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="process-step">
                <div className="process-icon">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span><hr /></span>
                </div>
                <p>Classified all the tenders according to category</p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="process-step">
                <div className="process-icon">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span><hr /></span>
                </div>
                <p>Daily upload on website</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-lg-6 mb-4 ">
            <img src={Logo2} className="img-fluid" alt="Story" />
          </div>
          <div className="col-lg-6 mb-4 bgcolor">
            <h3>Ensuring Customer Satisfaction and Confidence in Our Tenders</h3>

            <span className='mt-5 '>
              At Bismillah Tender, we take immense pride in providing our esteemed customers with the highest level of assurance and confidence when it comes to our tender services. We understand that your trust is paramount, and we are committed to delivering transparent, reliable, and secure tender processes that guarantee your satisfaction.
            </span>
            <div className=" d-flex align-items-center mt-3">
              <i className="bi bi-shield-fill-check text-success" style={{ fontSize: '2rem', marginRight: '15px' }}></i>
              <div>
                <h6 className="mb-1">Transparent and Ethical Practices</h6>
                <p>We strictly adhere to ethical standards in all our tender processes</p>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <i className="bi bi-check2-circle text-success" style={{ fontSize: '2rem', marginRight: '15px' }}></i>
              <div>
                <h6 className="mb-1">Verified and Credible Information</h6>
                <p>We diligently verify all tender-related information</p>
              </div>

            </div>

            <div className=" d-flex align-items-center">
              <i className="bi bi-graph-up-arrow text-success" style={{ fontSize: '2rem', marginRight: '15px' }}></i>
              <div>
                <h6 className="mb-1">Impeccable Track Record</h6>
                <p>With a proven track record of successful tenders and satisfied customers</p>
              </div>
            </div>

          </div>
        
        </div>
      </div>

      <div className=" container-fluid mt-5 p-0 background-imageabout ">
        <div className="opacity-bg h-100 d-flex align-items-center justify-content-center" data-negative="true">
          <div className="text-white text-center fade-in-text">
            <h1 className="fw-bold  ">For More Details</h1>
            <p className="fw-bold  ">Visit Our Blog Page</p>
          </div>
        </div>
      </div>

    </>
  );
}

export default About;
