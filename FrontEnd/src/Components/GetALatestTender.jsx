// import  { useState, useEffect } from 'react';
// import Select from 'react-select';  // Import react-select
// import FAQS from '../Pages/FAQS';
// import axios from 'axios';
// import { Helmet } from 'react-helmet';

// const GetALatestTender = () => {
//   const [formData, setFormData] = useState({
//     userName: '',
//     phoneNumber: '',
//     email: '',
//     company: '',
//     billingPeriod: '',
//     BillingAmount:'',
//     categories: []  // Update to use 'categories' instead of 'category'
//   });

//   const [statusMessage, setStatusMessage] = useState('');
//   const [errors, setErrors] = useState({});
//   const [categoryOptions, setCategoryOptions] = useState([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/categories');
//         if (response.status === 200) {
//           // Map categories for react-select
//           const options = response.data.data.map(category => ({
//             value: category.name ,
//             label: category.name
//           }));
//           setCategoryOptions(options);
//         }
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle multi-category selection
//   const handleCategoryChange = (selectedOptions) => {
//     setFormData({ ...formData, categories: selectedOptions });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.userName) newErrors.userName = 'Name is required';
//     if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone Number is required';
//     if (!formData.email) newErrors.email = 'Email is required';
//     if (!formData.company) newErrors.company = 'Company Name is required';
//     if (!formData.categories.length) newErrors.categories = 'At least one category is required';
//     if (!formData.billingPeriod) newErrors.billingPeriod = 'Billing period is required';
//     if (!formData.BillingAmount) newErrors.BillingAmount = 'Billing Amount is required';
    
//     return newErrors;
//   };

// const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   const newErrors = validateForm();
//   if (Object.keys(newErrors).length > 0) {
//     setErrors(newErrors);
//   } else {
//     try {
//       // Convert the selected categories array to a colon-separated string
//       const submissionData = {
//         ...formData,
//         categories: formData.categories.map(option => option.value).join(':')  // Convert categories array to colon-separated string
//       };

//       const response = await axios.post('http://localhost:5000/subscriptions', submissionData);
      
//       if (response.status === 200) {
//         setStatusMessage('Form submitted successfully!');
//         setFormData({ userName: '', phoneNumber: '', email: '', company: '', billingPeriod: '' , BillingAmount: '' ,categories: [] ,  });
//         setErrors({});
//       }
//     } catch (error) {
//       setStatusMessage('Error submitting form. Please try again.');
//     }
//   }
// };


//   return (
//     <div className="container mt-5 py-5">
//       <Helmet>
//         <title>Get Latest Tender | Bismillah Tender</title>
//         <meta name="description" content="Get in touch with Bismillah Tender. Use our contact form, email, or phone to reach out with questions or requests about tender opportunities in Pakistan." />
//       </Helmet>
//       <div> 
//         <h1 className="customColorForm text-center">Get In Touch</h1>
//       </div>
//       {statusMessage && <div className="alert alert-success">{statusMessage}</div>}
//       <form onSubmit={handleSubmit}>
//         <div className="form-group p-3 mt-5">
//           <div className="row">
//             <div className="col-md-6 col-lg-6 col-6">
//             <label className='fw-bold mx-1'>Name</label>
//               <input
//                 type="text"
//                 className="form-control mt-1"
//                 name="userName"
//                 placeholder="Name"
//                 value={formData.userName}
//                 onChange={handleChange}
//               />
//               {errors.userName && <small className="text-danger">{errors.userName}</small>}
//             </div>
//             <div className="col-md-6 col-lg-6 col-6">
//               <label className='fw-bold mx-1'>Phone</label>
//               <input
//                 type="text"
//                 className="form-control mt-1"
//                 name="phoneNumber"
//                 placeholder="Phone Number"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//               />
//               {errors.phoneNumber && <small className="text-danger">{errors.phoneNumber}</small>}
//             </div>
//           </div>


//           <div className="row mt-5">
//             <div className="col-md-6 col-lg-6 col-6">
//             <label className='fw-bold mx-1'>E-Mail</label>
//               <input
//                 type="email"
//                 className="form-control mt-1"
//                 name="email"
//                 placeholder="E-Mail"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//               {errors.email && <small className="text-danger">{errors.email}</small>}
//             </div>
//             <div className="col-md-6 col-lg-6 col-6">
//             <label className='fw-bold mx-1'>Company</label>
//               <input
//                 type="text"
//                 className="form-control mt-1"
//                 name="company"
//                 placeholder="Company Name"
//                 value={formData.company}
//                 onChange={handleChange}
//               />
//               {errors.company && <small className="text-danger">{errors.company}</small>}
//             </div>


//           </div>



//             {/* billing Period and billing amount coming in props fron PriceplanDerail  */}
//           <div className="row mt-5">
//             <div className="col-md-6 col-lg-6 col-6">
//             <label className='fw-bold mx-1'>Billing Period</label>
//               <input
//                 type="email"
//                 className="form-control mt-1"
//                 name="billingPeriod"
//                 placeholder="Billing Period"
//                 value={formData.billingPeriod}
//                 onChange={handleChange}
//               />
//               {errors.billingPeriod && <small className="text-danger">{errors.billingPeriod}</small>}
//             </div>
//             <div className="col-md-6 col-lg-6 col-6">
//             <label className='fw-bold mx-1'>Company</label>
//               <input
//                 type="text"
//                 className="form-control mt-1"
//                 name="BillingAmount"
//                 placeholder="BillingAmount"
//                 value={formData.BillingAmount}
//                 onChange={handleChange}
//               />
//               {errors.BillingAmount && <small className="text-danger">{errors.BillingAmount}</small>}
//             </div>
//             {/* billing Period and billing amount coming in props fron PriceplanDerail  */}



//           </div>

//         </div>

//         <div className="row mt-3 p-3">
//           <div className="col-md-6 col-lg-6 col-6">
//           <label className='fw-bold mx-1'>Category</label>
//             {/* Multi-select dropdown */}
//             <Select
//               isMulti
//               name="categories"
//               options={categoryOptions}
//               className="basic-multi-select mt-1"
//               classNamePrefix="select"
//               value={formData.categories}
//               onChange={handleCategoryChange}
//               placeholder="Select Category"
//             />
//             {errors.categories && <small className="text-danger">{errors.categories}</small>}
//           </div>
//         </div>

//         <div className="p-3 mt-2">
//           <button className="customButton btn rounded pill" type="submit">Submit</button>
//         </div>

//       </form>
//       <div className='d-flex justify-content-center'>
//         <FAQS/>
//       </div>
//     </div>
//   );
// };

// export default GetALatestTender;


import { useState, useEffect } from 'react';
import Select from 'react-select';  // Import react-select
import FAQS from '../Pages/FAQS';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
 import { useLocation } from 'react-router-dom';

const GetALatestTender = () => {  // Receive title and price from props
  const location = useLocation();  // Get location from react-router
  const { billingPeriod = { value: '', label: 'Select Billing Period' }, price = '' } = location.state || {};

  const [formData, setFormData] = useState({
    userName: '',
    phoneNumber: '',
    email: '',
    company: '',
    billingPeriod: billingPeriod || '',
    BillingAmount: price.slice(3) || '', // Set initial billing amount
    categories: []
  });
  

  const [statusMessage, setStatusMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [categoryOptions, setCategoryOptions] = useState([]);

  // Billing period options
  const billingPeriodOptions = [
    { value: 'one month', label: '1 Month' },
    { value: '3 months', label: '3 Months' },
    { value: '6 months', label: '6 Months' }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/categories');
        if (response.status === 200) {
          const options = response.data.data.map(category => ({
            value: category.name,
            label: category.name
          }));
          setCategoryOptions(options);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (selectedOptions) => {
    setFormData({ ...formData, categories: selectedOptions });
  };

  const handleBillingPeriodChange = (selectedOption) => {
    let updatedBillingAmount = '';
  
    if (selectedOption.value === 'one month') {
      updatedBillingAmount = '99';
    } else if (selectedOption.value === '3 months') {
      updatedBillingAmount = '249';
    } else if (selectedOption.value === '6 months') {
      updatedBillingAmount = '499';
    }
  
    setFormData({ 
      ...formData, 
      billingPeriod: selectedOption,
      BillingAmount: updatedBillingAmount // Update billing amount based on the selected period
    });
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName) newErrors.userName = 'Name is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone Number is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.company) newErrors.company = 'Company Name is required';
    if (!formData.categories.length) newErrors.categories = 'At least one category is required';
    if (!formData.billingPeriod) newErrors.billingPeriod = 'Billing period is required';
    if (!formData.BillingAmount) newErrors.BillingAmount = 'Billing Amount is required';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const submissionData = {
          ...formData,
          billingPeriod: formData.billingPeriod.value,  // Use value from the dropdown
          categories: formData.categories.map(option => option.value).join(':')  // Convert categories array to colon-separated string
        };

        const response = await axios.post('http://localhost:5000/subscriptions', submissionData);
        
        if (response.status === 200) {
          setStatusMessage('Successfully Subscribed!');
          setFormData({ userName: '', phoneNumber: '', email: '', company: '', billingPeriod: '', billingAmount: '', categories: [] });
          setErrors({});
        }
      } catch (error) {
        setStatusMessage('Error submitting form. Please try again.');
      }
    }
  };

  return (
    <div className="container  mt-5 py-5">
      <Helmet>
        <title>Get Latest Tender | Bismillah Tender</title>
        <meta name="description" content="Get in touch with Bismillah Tender. Use our contact form, email, or phone to reach out with questions or requests about tender opportunities in Pakistan." />
      </Helmet>
      <div>
        <h1 className="customColorForm text-center">Get In Touch</h1>
      </div>
      {statusMessage && <div className="alert alert-success">{statusMessage}</div>}
      <form className=' border-bottom' onSubmit={handleSubmit}>
        <div className="form-group p-3 mt-5 ">
          <div className="row">
            <div className="col-md-6">
              <label className='fw-bold mx-1'>Name</label>
              <input
                type="text"
                className="form-control mt-1"
                name="userName"
                placeholder="Name"
                value={formData.userName}
                onChange={handleChange}
              />
              {errors.userName && <small className="text-danger">{errors.userName}</small>}
            </div>
            <div className="col-md-6">
              <label className='fw-bold mx-1'>Phone</label>
              <input
                type="text"
                className="form-control mt-1"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && <small className="text-danger">{errors.phoneNumber}</small>}
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-md-6">
              <label className='fw-bold mx-1'>E-Mail</label>
              <input
                type="email"
                className="form-control mt-1"
                name="email"
                placeholder="E-Mail"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <small className="text-danger">{errors.email}</small>}
            </div>
            <div className="col-md-6">
              <label className='fw-bold mx-1'>Company</label>
              <input
                type="text"
                className="form-control mt-1"
                name="company"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleChange}
              />
              {errors.company && <small className="text-danger">{errors.company}</small>}
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-md-6">
              <label className='fw-bold mx-1'>Billing Period</label>
              <Select
                name="billingPeriod"
                options={billingPeriodOptions}
                className="basic-single mt-1"
                classNamePrefix="select"
                value={formData.billingPeriod}
                onChange={handleBillingPeriodChange}
                placeholder="Select Billing Period"
              />
              {errors.billingPeriod && <small className="text-danger">{errors.billingPeriod}</small>}
            </div>
            <div className="col-md-6">
              <label className='fw-bold mx-1'>Billing Amount (RS.)</label>
              <input
                type="text"
                className="form-control mt-1"
                name="BillingAmount"
                placeholder="Billing Amount"
                value={formData.BillingAmount}
                onChange={handleChange}
                readOnly
              />
              {errors.BillingAmount && <small className="text-danger">{errors.BillingAmount}</small>}
            </div>
          </div>



        </div>

        <div className="row mt-3 p-3 justify-content-start">
          <div className="col-md-6">
            <label className='fw-bold mx-1'>Category</label>
            <Select
              isMulti
              name="categories"
              options={categoryOptions}
              className="basic-multi-select mt-1"
              classNamePrefix="select"
              value={formData.categories}
              onChange={handleCategoryChange}
              placeholder="Select Category"
            />
            {errors.categories && <small className="text-danger">{errors.categories}</small>}
          </div>
        </div>

        <div className="p-3 mt-2 text-center">
          <button className="customButton btn rounded-pill" type="submit">Subscribe To Tender 786 Bismillah</button>
        </div>
      </form>
      <div className='d-flex justify-content-center'>
        <FAQS />
      </div>
    </div>
  );
};

// Define PropTypes for component's props
GetALatestTender.propTypes = {
  location: PropTypes.object,
};

export default GetALatestTender;
