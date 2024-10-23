import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types'; // Import PropTypes
// import GetALatestTender from '../Components/GetALatestTender';
// import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// PricingCard Component
const PricePlanDetail = () => {
//   const [selectedPlan, setSelectedPlan] = useState({ title: '' , price: '' });
  const navigate = useNavigate(); // Initialize useNavigate

  const handlePlanSelect = (title, price) => {
    // Match the billing period object format for react-select
    let billingPeriod = null;
  
    if (title === '1 Month Plan') {
      billingPeriod = { value: 'one month', label: '1 Month' };
    } 
    else if (title === '3 Month\'s Plan') {
      billingPeriod = { value: '3 months', label: '3 Months' };
    } 
    else if (title === '6 Month\'s Plan') {
      billingPeriod = { value: '6 months', label: '6 Months' };
    }
  
    // Pass both billingPeriod and price
    navigate('/latest-tender', { state: { billingPeriod, price } });
  };
  
  
  return (
    <div className="container-fluid my-5">
      <Helmet>
        <title>Price Plan Detail | Bismillah Tender</title>
        <meta
          name="description"
          content="Get in touch with Bismillah Tender. Use our contact form, email, or phone to reach out with questions or requests about tender opportunities in Pakistan."
        />
      </Helmet>
      <div>
        <h1 className='d-flex justify-content-center m-3 p-3 display-1 fw-lighter pricing_plan_heading'>
          Choose Your Subscriptions Plan
        </h1>
      </div>
      <div className="container gap-4 d-flex justify-content-center flex-wrap">
        {plans.map((plan, index) => (
          <div key={index} className="col-9 col-sm-6 col-md-5 col-lg-3 mb-4">
            <div className="card h-100 h-sm-50 shadow-lg border-none rounded-3 p-3">
              <CardHeader title={plan.title} description={plan.description} />
              <CardPrice price={plan.price} />
              <CardFeatures features={plan.features} />
              <CardButton onClick={() => handlePlanSelect(plan.title, plan.price)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Plans data
const plans = [
  {
    title: "1 Month Plan",
    description: "Access for 30 days",
    price: "Rs.99",
    features: [
      "Complete documentation",
      "Working materials in Sketch",
      "5GB cloud storage",
      "10 team members",
    ],
  },
  {
    title: "3 Month's Plan",
    description: "Access for 90 days",
    price: "Rs.249",
    features: [
      "Complete documentation",
      "Working materials in Sketch",
      "15GB cloud storage",
      "25 team members",
    ],
  },
  {
    title: "6 Month's Plan",
    description: "Access for 180 days",
    price: "Rs.499",
    features: [
      "Complete documentation",
      "Working materials in Sketch",
      "30GB cloud storage",
      "50 team members",
    ],
  },
];

// CardHeader Component
const CardHeader = ({ title, description }) => (
  <div className="card-body">
    <h2 className="card-title text-center">{title}</h2>
    <p className="text-muted text-center">{description}</p>
  </div>
);

// Prop validation for CardHeader
CardHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

// CardPrice Component
const CardPrice = ({ price }) => (
  <div className="card-body text-center">
    <p className="display-4">{price} <span className="text-muted"></span></p>
  </div>
);

// Prop validation for CardPrice
CardPrice.propTypes = {
  price: PropTypes.string.isRequired,
};

// CardButton Component
const CardButton = ({ onClick }) => (
  <div className="card-body text-center">
    <button className="theme-color p-2 rounded-pill btn-sm mt-4" onClick={onClick}>
      SUBSCRIBE NOW
    </button>
  </div>    
);

// Prop validation for CardButton
CardButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

// CardFeatures Component
const CardFeatures = ({ features }) => (
  <ul className="list-group list-group-flush">
    {features.map((feature, index) => (
      <li key={index} className="list-group-item align-items-center">
        <span className="text-primary">✔️</span>
        <span className="ml-2 text-muted">{feature}</span>
      </li>
    ))}
  </ul>
);

// Prop validation for CardFeatures
CardFeatures.propTypes = {
  features: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PricePlanDetail;
