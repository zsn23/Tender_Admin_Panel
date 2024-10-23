


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BaseUrl from '../../api/BaseUrl';

const OrganizationTable = () => {
    const Base_Url = BaseUrl();
    const [organization, setOrganization] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('effectedDate'); // Default sorting field
    const [sortOrder, setSortOrder] = useState('desc'); // Default sorting order
    const organizationPerPage = 10;

    const fetchOrganizations = async () => {
        try {
            const response = await axios.get(`${Base_Url}/FrontEndorganizations`, {
                params: {
                    page: currentPage,
                    pageSize: organizationPerPage,
                    sortField,
                    sortOrder,
                    name: search // Ensure the search is applied correctly
                }
            });
            const data = response.data.data?.data || [];
            setOrganization(data);
            const total = response.data.data?.total || 0; 
            setTotalRecords(total); 
            setLoading(false);
        } catch (error) {
            console.error('Error fetching organizations:', error.response || error.message || error);
            setError('Failed to fetch organizations. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, [currentPage, sortField, sortOrder, search]); 

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
        setCurrentPage(1);
    };

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= Math.ceil(totalRecords / organizationPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    const handleSearchQuery = (event) => {
        setSearch(event.target.value);
        setCurrentPage(1);
    };

    return (
        <div>
            <h1 className="text-center mt-2">Organizations Record</h1>
            <div className="d-flex justify-content-center align-items-center g-3 mt-3">
                <input 
                    type="text" 
                    placeholder='Search by organization name' 
                    value={search} 
                    onChange={handleSearchQuery}
                    className="mb-3 p-2 w-50 rounded-lg shadow-sm form-control"
                />
            </div>

            {loading ? (
                <div className="p-3 container shadow-lg d-flex justify-content-center flex-column table-data">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>View Details</th>
                                </tr>
                            </thead>
                            <tbody className="theme-color">
                                {Array.from({ length: 6 }).map((_, index) => (
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
            ) : error ? (
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                </div>
            ) : (
                <div className="p-3 container shadow-lg d-flex justify-content-center flex-column table-data">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('effectedDate')}>
                                        Title {sortField === 'effectedDate' && (sortOrder === 'asc' ? '▲' : '▼')}
                                    </th>
                                    <th className="d-flex justify-content-end rounded-0">View Details</th>
                                </tr>
                            </thead>
                            <tbody className="theme-color w-100">
                                {organization.length > 0 ? (
                                    organization.map((org) => (
                                        <tr key={org.id} className='w-100'>
                                            <td>{org.name}</td>
                                            <td>
                                                <Link to={`/OrganizationDetails/${org.name}`} rel="noopener noreferrer" className="text-decoration-none d-flex justify-content-end">
                                                    <button className="details-btn">Detail</button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="text-center">No organizations found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>


                   
                    
                    <nav aria-label="Page navigation">
                            <ul className="pagination justify-content-center flex-column flex-md-row align-items-center">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''} mb-2 mb-md-0`}>
                                    <button
                                        className="details-btn px-3 py-1 mx-1"
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                </li>
                                <li className="page-item mb-2 mb-md-0">
                                    <span className="mx-1 fw-bold text-center">
                                    {`Showing Records: ${(currentPage - 1) * organizationPerPage + 1}-${Math.min(currentPage * organizationPerPage, totalRecords)} || Total organizations = ${totalRecords}`}
                                        {/* Page {currentPage} of {Math.ceil(totalRecords / organizationPerPage)} <br className="d-md-none" /> || Total Organizations = {totalRecords} */}
                                    </span>
                                </li>
                                <li className={`page-item ${currentPage === Math.ceil(totalRecords / organizationPerPage) ? 'disabled' : ''}`}>
                                    <button
                                        className="details-btn px-3 py-1 mx-1"
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === Math.ceil(totalRecords / organizationPerPage)}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                </div>
            )}
        </div>
    );
};

export default OrganizationTable;
