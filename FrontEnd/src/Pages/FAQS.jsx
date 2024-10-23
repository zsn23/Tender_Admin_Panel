import{ useEffect, useState } from 'react';
import axios from 'axios';
import BaseUrl from '../api/BaseUrl';

const FAQS = () => {
    const Base_url = BaseUrl();
    const [faq, setFaq] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeAccordion, setActiveAccordion] = useState(null);
    const toggleAccordion = (id) => {
        if (activeAccordion === id) {
          setActiveAccordion(null); 
        } else {
          setActiveAccordion(id); 
        }
      };
    const FetchFaqs = async () => {
        try {
            const response = await axios.get(Base_url + '/FAQs');
            const data = response.data.data;
            // console.log(data);
            setFaq(data);
            setLoading(false);
        } catch (error) {
            console.log('Error fetching FAQs:', error);
        }
    };

    useEffect(() => {
        FetchFaqs();
    }, []);


  
    return (
        <div className='container mt-5 mb-5 '>
        <div className="row justify-content-center">
        <div>
          <h1 className='p-3 text-center m-4'>Frequently Asked Questions</h1>

        </div>
        <div className="col-md-8">
          <div className="accordion" id="accordionPanelsStayOpenExample">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className={`accordion-button ${activeAccordion === 'accordionOne' ? '' : 'collapsed'} ${activeAccordion === 'accordionOne' ? 'customBgPrivacy text-white' : ''} `}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded={activeAccordion === 'accordionOne'}
                  aria-controls="collapseOne"
                  onClick={() => toggleAccordion('accordionOne')}
                >
                  <strong>FAQs</strong>
                </button>
              </h2>
              <div
                id="collapseOne"
                className={`accordion-collapse collapse ${activeAccordion === 'accordionOne' ? 'show' : ''}`}
                aria-labelledby="headingOne"
                data-bs-parent="#privacyPolicyAccordion"
              >
                <div className="accordion-body">
                {loading ? (
                  <>
      <p className="placeholder-wave">
        <span className="placeholder col-12"></span>
      </p>
      <p className="placeholder-wave">
        <span className="placeholder col-6"></span>
      </p>
      <p className="placeholder-wave">
        <span className="placeholder col-4"></span>
      </p>
    </>
                ) : (
                    faq.map((item, index) => (
                        <div key={index}>
                            <h3>Q: {item.question}</h3>
                            <p>A: {item.answer}</p>
                        </div>
                    ))
                )}
                </div>
              </div>
            </div>
            </div>
            </div>
            </div>
          

            </div>
    );
};

export default FAQS;