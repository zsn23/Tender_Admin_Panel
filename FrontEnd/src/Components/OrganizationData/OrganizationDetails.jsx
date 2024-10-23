import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BaseUrl from '../../api/BaseUrl';
import TenderNewspaper from '../TenderNewsPaper';
import moment from 'moment';
const OrganizationDetails = () => {
    const Base_Url = BaseUrl();
    const [organization, setOrganization] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const organizationPerPage = 10;
    const { name } = useParams();
    console.log('Name passed through url:',name)
    // const fetchOrganizations = async () => {
    //     try {
    //         const response = await axios.get(`${Base_Url}/tender`);
    //         console.log('In Organization Detail Response of tender :',response);

    //         const tenderData = response.data.data.data;
    //         console.log("tender data in org details " , tenderData)

    //         const filteredTenders = tenderData.filter(tender => tender.organizationName === name);
            
    //         console.log('Data matched :',filteredTenders);
    //         setOrganization(filteredTenders);
    //         setLoading(false);
    //     } catch (error) {
    //         console.error('Error fetching organizations:', error.response || error.message || error);
    //         setError('Failed to fetch organizations. Please try again later.');
    //         setLoading(false);
    //     }
    // };



    const fetchOrganizations = async () => {
        try {
            const response = await axios.get(`${Base_Url}/tender`, {
                params: {
                    limit: 0 // Sending 0 as limit to fetch all tender records
                }
            });
            console.log('In Organization Detail Response of tender:', response);
    
            const tenderData = response.data.data.data;
            console.log("tender data in org details ", tenderData);
    
            const filteredTenders = tenderData.filter(tender => tender.organizationName === name);
            
            console.log('Data matched:', filteredTenders);
            setOrganization(filteredTenders);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching organizations:', error.response || error.message || error);
            setError('Failed to fetch organizations. Please try again later.');
            setLoading(false);
        }
    };

    
    
    useEffect(() => {
        fetchOrganizations();
    }, []);

    const indexOfLastOrg = currentPage * organizationPerPage;
    const indexOfFirstOrg = indexOfLastOrg - organizationPerPage;

    const filteredOrganization = organization.filter(org => 
        org.name && org.name.toLowerCase().includes(search.toLowerCase())
    );

    const currentOrganization = filteredOrganization.slice(indexOfFirstOrg, indexOfLastOrg);
    const totalPages = Math.ceil(filteredOrganization.length / organizationPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleSearchQuery = (event) => {
        setSearch(event.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="container ">
            <div className='m-4'>
                <Link className="text-decoration-none text-dark icon-link-hover link-underline icon-link" to="/organization">
                    <span className="fw-lighter text-dark colorHover">
                        <span className='link-underline p-1'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-door-fill" viewBox="0 0 16 16">
                                <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
                            </svg>
                        </span>
                        Home /
                    </span>
                </Link>
                <span className="text-dark fs-6"> {name} </span>
            </div>
            <div>
                <h1 className='fw-bold'>Tender by Organization: {name}</h1>
                <h6>Explore the Latest Tenders Category: Private and Government Opportunities in Pakistan Discover a wealth of opportunities on BismillahTender.com – Your Gateway to Success!</h6>
                <h6 className='fw-bold text-danger'>واٹس ایپ یا ای میل پر ٹینڈر نوٹس حاصل کرنے کے لیے ابھی سبسکرائب کریں ۔ WhatsApp Now : 03254891919 - 03164484377</h6>
            </div>
            <div className="row">
                <div className="col-lg-8 col-md-12 col-12 ">
                    <div className='d-flex justify-content-center align-items-center mt-3'>
                        <input 
                            type="text" 
                            placeholder='Search organizations for tenders' 
                            value={search} 
                            onChange={handleSearchQuery}
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
                    ) : filteredOrganization.length === 0 ? (
                        <div className="text-center">
                            No tenders found for  <strong>{name}</strong>
                        </div>
                    ) : (
                        <>
                            <div className='p-3 container shadow-lg d-flex justify-content-center flex-column table-data'>
                                <table className="table table-responsive">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '50%' }}>Title</th>
                                            <th style={{ width: '40%' }}>Date</th>
                                            <th style={{ width: "10%" }}>Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentOrganization.map((org) => (
                                            <tr key={org.id}>
                                                <td>{org.name}</td>
                                                <td>{moment(org.effectedDate).format('ll')}</td>
                                                <td>
                                                    <Link
                                                        to={`/TenderOrganizationDetails/${org.id}`}
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
                                                Page  {currentPage} of {totalPages}
                                            </span>
                                        </li>
                                        <li className={`page-item ${currentPage === totalPages && 'disabled'} mx-1` }>
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
                <div className="col-lg-4 col-md-12 col-12">
                    <TenderNewspaper />
                </div>
            </div>
        </div>
    );
};
export default OrganizationDetails;