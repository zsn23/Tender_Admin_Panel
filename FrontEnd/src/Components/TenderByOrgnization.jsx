import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import BaseUrl from '../api/BaseUrl';

export default function TenderByOrganization() {
    const Base_Url = BaseUrl();
    const [organization, setOrganization] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [currentPage, setCurrentPage] = useState(1); // Pagination: Current page
    // const [totalPages, setTotalPages] = useState(1); // Total pages

    const fetchOrganization = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`${Base_Url}/FrontEndorganizations`, {
                params: { page, pageSize: 6,  sortField: 'effectedDate',  // Sort by 'effectedDate'
                    sortOrder: 'desc'  } // Fetching 6 records per page
            });
            const data = response.data.data.data; // Accessing nested data
            setOrganization(data);
            // setTotalPages(response.data.data.last_page); // Set total pages from response
            setLoading(false);
        } catch (error) {
            console.error('Error fetching organizations:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganization(); // Fetch data when component mounts or page changes
    }, []);

    // const handleNextPage = () => {
    //     if (currentPage < totalPages) {
    //         setCurrentPage(currentPage + 1); // Go to the next page
    //     }
    // };

    // const handlePreviousPage = () => {
    //     if (currentPage > 1) {
    //         setCurrentPage(currentPage - 1); // Go to the previous page
    //     }
    // };

    return (
        <div>
            <h2 className="text-center fw-bolder">
                Tender By Organizations
            </h2>
            <div className="container-fluid pt-5 pb-5 pl-0 pr-0">
                <div className="row d-flex justify-content-center align-items-center gap-3 tenderByRows">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="col-md-3 col-12">
                                <p className="text-center shadow-lg rounded-sm p-3 placeholder-glow">
                                    <span className="placeholder col-12"></span>
                                </p>
                            </div>
                        ))
                    ) : (
                        organization.map((org) => (
                            <div key={org.id} className="col-md-3 col-12">
                                <Link to={`/OrganizationDetails/${org.name}`} className="text-decoration-none text-dark">
                                    <p className="text-center shadow-lg rounded-sm p-3">{org.name.slice(0, 25)}</p>
                                </Link>
                            </div>
                        ))
                    )}
                </div>

                {/* <div className="text-center mt-4">
                    <button
                        className="btn btn-secondary mx-2"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span> */}
                    {/* <button
                        className="btn btn-secondary mx-2"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button> */}
                {/* </div> */}

                <div className="text-center mt-4">
                    <Link to="/organization" className="btn customButton rounded-pill text-decoration-none">
                        View All Organizations
                    </Link>
                </div>
            </div>
        </div>
    );
}
