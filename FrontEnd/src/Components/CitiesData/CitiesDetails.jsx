import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import TenderNewspaper from '../TenderNewsPaper';
import BaseUrl from '../../api/BaseUrl';
const CitiesDetails = () => {
  const { name } = useParams(); 
  console.log(name);
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const citiesPerPage = 10
  const Base_Url = BaseUrl();
  useEffect(() => {
    const fetchTendersByCity = async () => {
      try {
        const response = await axios.get(Base_Url + "/tender", {
          params: {
              limit: 0 // Sending 0 as limit to fetch all tender records
          }
      });
        const tenderData = response.data.data.data; 
       
        const filteredTenders = tenderData.filter(tender => tender.cityName === name);
        setTenders(filteredTenders);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tenders:', err);
        setError('Failed to fetch tenders. Please try again later.');
        setLoading(false);
      }
    };

    fetchTendersByCity();
  }, [name]);
  const indexOfLastCity = currentPage * citiesPerPage;
    const indexOfFirstCity = indexOfLastCity - citiesPerPage;

    const filteredCities = tenders.filter(
        (city) => city.cityName && city.cityName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentCities = filteredCities.slice(indexOfFirstCity, indexOfLastCity);
    const totalPages = Math.ceil(filteredCities.length / citiesPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); 
    };
  return (
    <div className="container">
      <div className='m-4'>
        <Link className="text-decoration-none text-dark icon-link-hover link-underline icon-link" to="/cities">
          <span className="fw-lighter text-dark colorHover">
            <span className='link-underline p-1'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-door-fill" viewBox="0 0 16 16">
                <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
              </svg>
            </span>
            Home /
          </span>
        </Link>
        <span className="text-dark fs-6"> {name}</span>
      </div>
      <div>
        <h1 className='fw-bold'>Tender by City: {name}</h1>
        <h6>Explore the Latest Tenders Cities: Private and Government Opportunities in Pakistan Discover a wealth of opportunities on BismillahTender.com – Your Gateway to Success!</h6>
        <h6 className='fw-bold text-danger'>واٹس ایپ یا ای میل پر ٹینڈر نوٹس حاصل کرنے کے لیے ابھی سبسکرائب کریں ۔ WhatsApp Now : 03254891919 - 03164484377</h6>
      </div>

      <div className="row">
        <div className="col-lg-8 col-md-12 col-12 ">
        <div className='d-flex justify-content-center align-items-center mt-3'>
                <input 
                    type="text"
                    placeholder="Search cities for tenders"
                    value={searchQuery}
                    onChange={handleSearch}
                    className='mb-3 p-2 w-50 rounded-lg shadow-sm form-control'
                />
            </div>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          ) : tenders.length > 0 ? (
            <div className="p-3 container shadow-lg d-flex justify-content-center flex-column table-data">
              <table className="table table-responsive">
                <thead>
                  <tr>
                    <th  style={{ width: "50%" }}>Title</th>
                    <th  style={{ width: "40%" }}>Date</th>
                    <th  style={{ width: "10%" }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCities.map((tender, index) => (
                    <tr key={tender.id}>
                      <td>{tender.name}</td>
                      <td>{moment(tender.publishDate).format('ll')}</td>
                      <td>
                      <Link 
                            to={`/TenderCityDetails/${tender.id}`}  
                            rel="noopener noreferrer"
                            className='text-decoration-none'
                      > 
                        <button className='details-btn'>
                            Detail
                        </button>
                        </Link>
                       
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <nav>
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${currentPage === 1 && 'disabled'} mx-1`}>
                                <button
                                    className="details-btn mx-1"
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                            </li>
                            <li className="page-item">
                                <span className="mx-1 fw-bold">
                                    Page {currentPage} of {totalPages}
                                </span>
                            </li>
                            <li className={`page-item ${currentPage === totalPages && 'disabled'} mx-1`}>
                                <button
                                    className="details-btn mx-1"
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
            </div>
          ) : (
            <div>
            <h5 className='fw-bold text-center mt-3'>No tenders found for {name}.</h5>
            </div>
          )}
        </div>
        <div className="col-lg-4 col-md-12 col-12">
          <TenderNewspaper />
        </div>
      </div>
    </div>
  );
};

export default CitiesDetails;
