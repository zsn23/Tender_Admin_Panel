import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import BaseUrl from '../api/BaseUrl';

export default function TenderByCity() {
    const Base_Url = BaseUrl();
    const [Cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCities = async () => {
        setLoading(true); // Set loading to true when fetching starts
        try {
            const response = await axios.get(`${Base_Url}/cities`);
            const data = response.data.data;

            // Sort the cities by id (descending), then limit to the first 6 cities
            const sortedAndLimitedData = data.sort((a, b) => b.id - a.id).slice(0, 6);
            setCities(sortedAndLimitedData);

            setLoading(false); // Set loading to false when data is fetched
        } catch (error) {
            console.error('Error fetching Cities:', error);
            setLoading(false); // Set loading to false in case of an error
        }
    }

    useEffect(() => {
        fetchCities();
    }, []);

    return (
        <div>
            <h2 className='text-center fw-bolder'>
                Tender By Cities
            </h2>
            <div className='container-fluid pt-5 pb-5'>
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
                        Cities.map((city, index) => (
                            <div key={index} className="col-md-3 col-12">
                                <Link to={`/detail_cities/${city.name}`} className='text-decoration-none text-dark'>
                                    <p className="text-center shadow-lg rounded-sm p-3">
                                        {city.name.slice(0, 27)}
                                    </p>
                                </Link>
                            </div>
                        ))
                    )}
                    <div className="text-center">
                        <Link to="/cities" className="btn customButton rounded-pill text-decoration-none">
                            View Cities
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
