import { useState, useEffect } from 'react';
import axios from 'axios';
import BaseUrl from '../api/BaseUrl';
import { Link } from 'react-router-dom';

const CategoriesTable = () => {
  const BASE_URL = BaseUrl();
  const [tenders, setTenders] = useState([]);
  const [allTenders, setAllTenders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const limit = 25;

  useEffect(() => {
    if (!searchQuery) {
      fetchTenders();
    } else {
      fetchAllTenders();
    }
  }, [currentPage, searchQuery]);

  const fetchTenders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/categories?page=${currentPage}&limit=${limit}`);
      const data = response.data.data;
      const sortedCategories = data.sort((a, b) => b.id - a.id);
      setTenders(sortedCategories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tenders:', error);
      setError('Failed to fetch tenders. Please try again later.');
      setLoading(false); 
    }
  };

  const fetchAllTenders = async () => {
    try {
      if (allTenders.length === 0) {
        const response = await axios.get(`${BASE_URL}/categories?limit=1000`);
        const data = response.data.data;
        const sortedCategories = data.sort((a, b) => b.id - a.id);
        setAllTenders(sortedCategories);
      }
    } catch (error) {
      console.error('Error fetching all tenders:', error);
      setError('Failed to fetch tenders. Please try again later.');
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter tenders based on search query
  const filteredTenders = searchQuery
    ? allTenders.filter(tender =>
        tender.name && tender.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tenders;

  // Total pages calculation based on filtered or paginated data
  const totalPages = Math.ceil(filteredTenders.length / limit);

  // Pagination handler
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className='container my-3'>
      <h2 className='text-center fw-bold mb-4'>Tender By Categories</h2>
      <div className='d-flex justify-content-center align-items-center g-3'>
        <input
          type="text"
          placeholder="Search by category or date"
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
      ) : (
        <div className=" container-fluid shadow-lg d-flex justify-content-center flex-column table-data">
  {/* Responsive Table */}
  <div className="table-responsive">
    <table className="table">
      <thead>
        <tr>
          <th style={{ width: "100%" }}>Title</th>
          <th style={{ width: "10%" }}>Details</th>
        </tr>
      </thead>
      <tbody>
        {filteredTenders.length > 0 ? (
          filteredTenders.slice((currentPage - 1) * limit, currentPage * limit)
            .map((tender) => (
              <tr key={tender.id}>
                <td>{tender.name.slice(0, 20)}</td>
                <td>
                  <Link
                    to={`/category-details/${encodeURIComponent(tender.name)}`}
                    rel="noopener noreferrer"
                    className="text-decoration-none">
                    <button className="details-btn">
                      Detail
                    </button>
                  </Link>
                </td>
              </tr>
            ))
        ) : (
          <tr>
            <td colSpan="2" className="text-center">No tenders found</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  {!searchQuery && (
    <nav>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="details-btn me-2"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>
        <li className="page-item">
          <span className="mx-2 fw-bold">
            Page {currentPage} of {totalPages}
          </span>
        </li>
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="details-btn ms-2"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  )}
</div>

      )}
    </div>
  );
};

export default CategoriesTable;