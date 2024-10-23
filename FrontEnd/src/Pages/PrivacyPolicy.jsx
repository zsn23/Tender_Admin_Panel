import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
const PrivacyPolicy = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (id) => {
    if (activeAccordion === id) {
      setActiveAccordion(null); 
    } else {
      setActiveAccordion(id); 
    }
  };
  return (
    <div className="container mt-5">
    <Helmet>
     <title>Contact US | Bismillah Tender</title>
     <meta name="description" content="Get in touch with Bismillah Tender. Use our contact form, email, or phone to reach out with questions or requests about tender opportunities in Pakistan." />
     </Helmet>
      <h1 className="text-center fw-bold mb-4">Privacy Policy</h1>
      <p className="text-center text-muted mb-5">
        Your privacy is important to us. Please read below to learn more.
      </p>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="accordion" id="accordionPanelsStayOpenExample">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className={`accordion-button ${activeAccordion === 'accordionOne' ? '' : 'collapsed'} ${activeAccordion === 'accordionOne' ? 'customBgPrivacy text-white' : ''}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded={activeAccordion === 'accordionOne'}
                  aria-controls="collapseOne"
                  onClick={() => toggleAccordion('accordionOne')}
                >
                  General Policy Overview
                </button>
              </h2>
              <div
                id="collapseOne"
                className={`accordion-collapse collapse ${activeAccordion === 'accordionOne' ? 'show' : ''}`}
                aria-labelledby="headingOne"
                data-bs-parent="#privacyPolicyAccordion"
              >
                <div className="accordion-body">
                  We at Tender786 Bismillah are highly concerned about the privacy of our customers and the website visitors. We strictly adhere to all industry guidelines and we continually review our policy and procedures to ensure the safety and protection of our visitor and customer information. We request all the users of our website to go through this policy to understand how their personal & business information will be treated as they make full use of our services to their benefit.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className={`accordion-button ${activeAccordion === 'accordionTwo' ? '' : 'collapsed'} ${activeAccordion === 'accordionTwo' ? 'customBgPrivacy text-white' : ''}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded={activeAccordion === 'accordionTwo'}
                  aria-controls="collapseTwo"
                  onClick={() => toggleAccordion('accordionTwo')}
                >
                  Scope of Policy
                </button>
              </h2>
              <div
                id="collapseTwo"
                className={`accordion-collapse collapse ${activeAccordion === 'accordionTwo' ? 'show' : ''}`}
                aria-labelledby="headingTwo"
                data-bs-parent="#privacyPolicyAccordion"
              >
                <div className="accordion-body">
                  This privacy policy applies to all the publicly accessible pages on <b>insert link</b> . Responsibility for the privacy policies or practices of third-party sites, linked to <b>insert link</b>  is beyond our control, and we do not guarantee any damage whatsoever for that.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingThree">
                <button
                  className={`accordion-button ${activeAccordion === 'accordionThree' ? '' : 'collapsed'} ${activeAccordion === 'accordionThree' ? 'customBgPrivacy text-white' : ''}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded={activeAccordion === 'accordionThree'}
                  aria-controls="collapseThree"
                  onClick={() => toggleAccordion('accordionThree')}
                >
                  Collection of Information
                </button>
              </h2>
              <div
                id="collapseThree"
                className={`accordion-collapse collapse ${activeAccordion === 'accordionThree' ? 'show' : ''}`}
                aria-labelledby="headingThree"
                data-bs-parent="#privacyPolicyAccordion"
              >
                <div className="accordion-body">
                  Where you are required to register before accessing a service, the information gathered is used for invoicing, issuing passwords, and for the occasional dispatch of information which may help you to make better use of our services. We will respect your email privacy, and no customer or visitor information will be passed on to third parties without your prior consent.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingFour">
                <button
                  className={`accordion-button ${activeAccordion === 'accordionFour' ? '' : 'collapsed'} ${activeAccordion === 'accordionFour' ? 'customBgPrivacy text-white' : ''}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFour"
                  aria-expanded={activeAccordion === 'accordionFour'}
                  aria-controls="collapseFour"
                  onClick={() => toggleAccordion('accordionFour')}
                >
                  Use of Cookies
                </button>
              </h2>
              <div
                id="collapseFour"
                className={`accordion-collapse collapse ${activeAccordion === 'accordionFour' ? 'show' : ''}`}
                aria-labelledby="headingFour"
                data-bs-parent="#privacyPolicyAccordion"
              >
                <div className="accordion-body">
                  We also make use of "cookies", small text files stored on your hard drive which allow a website to recognize you as a repeat visitor, or to store session information while you are searching a database. You do, however, have the option of not accepting cookies through settings in your Web browser.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingFive">
                <button
                  className={`accordion-button ${activeAccordion === 'accordionFive' ? '' : 'collapsed'} ${activeAccordion === 'accordionFive' ? 'customBgPrivacy text-white' : ''}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFive"
                  aria-expanded={activeAccordion === 'accordionFive'}
                  aria-controls="collapseFive"
                  onClick={() => toggleAccordion('accordionFive')}
                >
                  Access to Information
                </button>
              </h2>
              <div
                id="collapseFive"
                className={`accordion-collapse collapse ${activeAccordion === 'accordionFive' ? 'show' : ''}`}
                aria-labelledby="headingFive"
                data-bs-parent="#privacyPolicyAccordion"
              >
                <div className="accordion-body">
                  You have the right to ask for a copy of the information we hold about you at any time, and to request any amendments if necessary. For any comments or concerns, please contact us:<Link to="/contact"  rel="noopener noreferrer" className='text-decoration-none text-black'><b> Contact </b></Link>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="text-center mt-4">
        <Link to="/" className="customButtonPrivacy  btn rounded-pill mx-5 text-decoration-none mb-2 ">Back to Home</Link>
        <Link to="/contact" className="customButtonPrivacy btn rounded-pill mx-5 text-decoration-none mb-2" rel="noopener noreferrer">
        Contact Us
      </Link>
      </div>
    </div>
  )
}

export default PrivacyPolicy
