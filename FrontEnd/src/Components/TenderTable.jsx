/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import axios from 'axios';
import BaseUrl from '../api/BaseUrl';
import moment from 'moment';
import { Link } from 'react-router-dom';

const TenderTable = () => {
  const BASE_URL = BaseUrl();
  const [tenders, setTenders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const [searchFilters, setSearchFilters] = useState({
    organizationName: '',
  });

  const limit = 10; // Items per page

  // Fetch tenders when page or search filters change
  useEffect(() => {
    fetchTenders(currentPage, searchFilters);
  }, [currentPage, searchFilters]);

  const fetchTenders = async (page, search = {}) => {
    setLoading(true);  // Show loading spinner while fetching data
    try {
      const params = {

        page,
        limit,
        ...search, // Spread the search filters as query parameters
        sortField: 'publishDate',  // Sort by the publishDate field
        sortOrder: 'desc', 

      };

      const response = await axios.get(`${BASE_URL}/tender`, { params });
      const data = response.data.data;

      const sortedTenders = data.data.sort((a, b) => b.id - a.id);
      setTenders(sortedTenders);
      setCurrentPage(data.current_page);
      setTotalPages(data.last_page);
      setTotalItems(data.total);
    } catch (error) {
      console.error('Error fetching tenders:', error);
    }
    setLoading(false);  
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle changes in search filters
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setSearchFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
    setCurrentPage(1);  // Reset to first page when filters change
  };

  return (
    <div>
      <h1 className='text-center mt-2'>Tenders Record</h1>
      <div className='d-flex justify-content-center align-items-center g-3 mt-3'>
        {/* Search input fields */}
        <input
          type="text"
          name="organizationName"
          placeholder="Search by organization"
          value={searchFilters.organizationName}
          onChange={handleFilterChange}
          className='mb-3 p-2 w-25 rounded-lg shadow-sm form-control'
        />
    
 
 
      </div>

      {loading ? (
        <div className="p-3 container shadow-lg d-flex justify-content-center flex-column table-data">
          {/* Loading state */}
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>NewsPaper</th>
                  <th>City</th>
                  <th>End Date</th>
                  <th>View Details</th>
                </tr>
              </thead>
              <tbody className="theme-color">
                {/* Show loading placeholders */}
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan="5" className="placeholder-glow">
                      <span className="placeholder col-12"></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-3 container shadow-lg d-flex justify-content-center flex-column table-data">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>NewsPaper</th>
                  <th>City</th>
                  <th>Submit Date</th>
                  <th>End Date</th>
                  <th>View Details</th>
                </tr>
              </thead>
              <tbody className="theme-color">
                {/* Map through tenders data */}
                {tenders.map((tender) => (
                  <tr key={tender.id}>
                    <td>{tender.organizationName}</td>
                    <td>{tender.newPaperName}</td>
                    <td>{tender.cityName}</td>
                    <td>{moment(tender.effectedDate).format("ll")}</td>
                    <td>{moment(tender.publishDate).format("ll")}</td>
                    <td>
                      <Link to={`/detail/${tender.id}`} rel="noopener noreferrer" className="text-decoration-none">
                        <button className="details-btn">Detail</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="pagination-controls d-flex justify-content-between align-items-center">
            <button className="details-btn" onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              {`Showing Records: ${(currentPage - 1) * limit + 1}-${Math.min(currentPage * limit, totalItems)} || Total Tenders = ${totalItems}`}
            </span>
            <button className="details-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenderTable;
