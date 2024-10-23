import React from 'react';
import tender786Logo from '../tender_786.png';
import { Link } from 'react-router-dom';
const Footer = () => {
    return (
        <div className="footer-container container-fluid py-1">
            <div className="row align-items-center">
                <div className="col-6 col-md-6 mt-3">
                    <img src={tender786Logo} className="HeaderFooterlogo" alt="Tender786 Logo" />
                </div>

                <div className="col-6 col-md-6 d-flex justify-content-md-end social-icons ">
                    <Link to="https://www.facebook.com/"  rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="25" height="25" >
                            <path fill="white" d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5 16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"/>
                        </svg>
                    </Link>
                    <Link to="https://www.instagram.com/"  rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="25" height="25">
                            <path fill="white" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                        </svg>
                    </Link>
                    <Link to="https://www.twitter.com/"  rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"  width="25" height="25">
                            <path fill="white" d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103v-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z"/>
                        </svg>
                    </Link>
                    <Link to="https://pk.linkedin.com/"  rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"  width="25" height="25">
                            <path fill="white" d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.74 0 54.53S24.09 1 53.79 1s53.79 24.36 53.79 53.53-24.09 53.57-53.79 53.57zM447.91 448h-92.29v-177c0-42.27-15.09-71.13-52.85-71.13-28.85 0-46.05 19.46-53.59 38.22-2.75 6.71-3.46 16.1-3.46 25.51v184.4h-92.29s1.25-299.2 0-330.3h92.29v46.78c12.26-18.93 34.26-45.9 83.26-45.9 60.92 0 106.46 39.86 106.46 125.51z"/>
                        </svg>
                    </Link>
                </div>
            </div>
            <hr />
            <div className="container ">
  <div className="row d-flex justify-content-evenly mb-4">  c
    <div className="col-12 col-md-3 text-center text-md-start">
      <p className="mb-2 text-center customColor d-flex justify-content-start">Tender786</p>
      <p className="mb-3 text-white footer-link">Your Gateway to Exclusive Tender Opportunities</p>
      <p className="text-white footer-link  ">Welcome to Tender 786, your premier source for accessing the latest tender opportunities across a wide range of categories and government departments in Pakistan.</p>
    </div>

    <div className="col-6 col-md-2 text-center text-md-start">
      <p className="mb-2 customColor">Our Services</p>
      <ul className="list-unstyled footer-list">
  <li>
    <Link to="/organization" className="footer-link text-white">Organization</Link>
  </li>
  <li>
    <Link to="/categories" className="footer-link text-white">Category</Link>
  </li>
  <li>
    <Link to="/tender" className="footer-link text-white">Tender</Link>
  </li>
  <li>
    <Link to="/cities" className="footer-link text-white">Cities</Link>
  </li>
</ul>

    </div>

    <div className="col-6 col-md-2 text-center text-md-start">
      <p className="customColor mb-2">Useful Links</p>
      <ul className="list-unstyled footer-list">
        <li><Link to="/subscription" className="footer-link text-white">Subscription Details</Link></li>
        <li><Link to="/price-plan-detail" className="footer-link text-white">See Subscription Plans</Link></li>
        <li><Link to="/contact" className="footer-link text-white">Contact Us</Link></li>
        <li><Link to="/latest-tender" className="footer-link text-white">Get's Latest Tender</Link></li>
        <li><Link to="/FAQs" className="footer-link text-white">FAQS</Link></li>
        <li><Link to="/privacy-policy" className="footer-link text-white"><strong>Privacy Policy</strong></Link></li>
      </ul>
    </div>

    <div className="col-12 col-md-3 text-center text-md-start">
      <p className="customColor mb-2">Contact</p>
      <ul className="list-unstyled">
      <li>
       
        <Link to="mailto:info@tender786.com" className="footer-link text-white">info@tender786.com</Link></li>
        <li className='text-white footer-link'>
       
           0325 4891919 - 0316 4484377
           </li>
        <li className='text-white'><strong>We are not responsible for any missing tender due to any reason</strong></li>
      </ul>
    </div>
  </div>
  <hr />
  <div className="row text-center">
    <div className="col-12">
      <p className="fw-bold mb-3 text-white">Copyright &copy; 2024 Tender786 Ltd. All Rights Reserved.</p>
    </div>
  </div>
</div>

        </div>
    );
}

export default Footer;