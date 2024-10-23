import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BaseUrl from '../../api/BaseUrl';
import { Link } from 'react-router-dom';

export default function CitiesTable() {
    const Base_Url = BaseUrl();
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const citiesPerPage = 25;

    const fetchCities = async () => {
        try {
            const response = await axios.get(Base_Url + "/cities");
            const data = response.data.data;
            
            // Sort cities by 'id' in descending order (most recent first)
            const sortedCities = data.sort((a, b) => b.id - a.id);
            
            setCities(sortedCities);  // Set sorted cities
            
            setLoading(false);  // Stop loading spinner
        } catch (err) {
            console.error('Error fetching cities:', err);
            setError('Failed to fetch cities. Please try again later.');
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchCities();
    }, []);

    const indexOfLastCity = currentPage * citiesPerPage;
    const indexOfFirstCity = indexOfLastCity - citiesPerPage;

    const filteredCities = cities.filter(
        (city) => city.name && city.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        setCurrentPage(1); // Reset to first page when searching
    };

    return (
        <div className="container my-3">
            <h2 className="text-center fw-bold mb-4">Tender By Cities</h2>
            <div className='d-flex justify-content-center align-items-center g-3'>
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
            ) : (
                <>
                    <div className="p-3 container shadow-lg d-flex justify-content-center flex-column table-data">
                        <table className="table table-responsive">
                            <thead >
                                <tr>
                                    <th style={{ width: "90%" }}>Title</th>
                                    <th style={{ width: "10%" }}>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCities.map((city, index) => (
                                    <tr key={city.id || index}>
                                        <td>{city.name}</td>
                                        <td>
                                            <Link 
                                                to={`/detail_cities/${city.name}`}  
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
                            <li className={`page-item ${currentPage === 1 && 'disabled'} `}>
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
                            <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
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

 
                </>
            )}
        </div>
    );
}
