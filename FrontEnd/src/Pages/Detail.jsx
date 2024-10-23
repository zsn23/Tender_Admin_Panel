import { useEffect, useState } from "react";
import { useParams,Link } from "react-router-dom";
import axios from "axios";
import BaseUrl from "../api/BaseUrl";
import moment from "moment";

const Detail = () => {

    const Base_URL = BaseUrl();
    const { id } = useParams(); 
    const [tender, setTender] = useState(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTenderDetails = async () => {
            try {
                const response = await axios.get(`${Base_URL}/tender/${id}`);
                if(response.data.status) {
                    setTender(response.data.data); 
                } else {
                    console.error('No tender details found');
                }
                setLoading(false); 
            } catch (error) {
                console.error('Error fetching tender details:', error);
                setLoading(false);
            }
        };

        fetchTenderDetails(); 
    }, [id]);
    
    const downloadImageWithWatermark = async () => {
        if (!tender?.tenderImage) return;   
        const img = new Image();
        img.crossOrigin = "anonymous"; 
        img.src = tender.tenderImage;
        img.onload = () => {
            // Create a canvas element
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
    
            // Draw the main image
            ctx.drawImage(img, 0, 0);
    
            // Download the canvas image
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "tender_image.png";
            link.click();
        };
    };
    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!tender) {
        return <div>No tender details found.</div>; 
    }

    return (
        <>
            <div className="container p-3">
                <div className="row g-0">
                <div className='m-3'>
          <Link className="text-decoration-none text-dark icon-link-hover link-underline icon-link" to="/tender">
            <span className=" fw-lighter text-dark colorHover">
              <span className='link-underline p-1'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-door-fill text-" viewBox="0 0 16 16">
                  <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
                </svg>
              </span>
              Tender /</span>
          </Link>
          <span className="text-dark  fs-6 "> Detail Page  </span>
          <div className='mt-2'>
            <h6 className='text-danger'>واٹس ایپ یا ای میل پر ٹینڈر نوٹس حاصل کرنے کے لیے ابھی سبسکرائب کریں ۔ WhatsApp Now : 03254891919 - 03164484377</h6>
          </div>
        </div>
                </div>
                
                <div className="card shadow-lg border rounded mt-3 w-lg-100 w-md-75">
                    <div className="row">
                        <div className="col-12">
                            <h1 className="text-center fs-1 text-dark fw-bolder p-3">Tender Detail</h1>
                        </div>
                    </div>
                    <div className="table-responsive-lg table-responsive-md table-responsive-sm">
                        <table className="table table-borderless">
                            <tbody className="d-flex flex-column flex-wrap bg-transparent">
                                <tr className="d-flex justify-content-lg-start justify-content-md-center justify-content-sm-start flex-wrap">
                                    <th scope="row">Tender Name:</th>
                                    <td>{tender.name}</td> 
                                </tr>
                                <tr className="d-flex justify-content-lg-start justify-content-md-center justify-content-sm-start flex-wrap align-items-center">
                                    <th scope="row">Organization:</th>
                                    <td>{tender.organizationName}</td>
                                </tr>
                                <tr className="d-flex justify-content-lg-start justify-content-md-center justify-content-sm-start flex-wrap align-items-center">
                                    <th scope="row">Tender City:</th>
                                    <td>{tender.cityName}</td> 
                                </tr>
                                <tr className="d-flex justify-content-lg-start justify-content-md-center justify-content-sm-start flex-wrap align-items-center">
                                    <th scope="row">News Paper:</th>
                                    <td>{tender.newPaperName}</td> 
                                </tr>
                                <tr className="d-flex justify-content-lg-start justify-content-md-center justify-content-sm-start flex-wrap align-items-center">
                                    <th scope="row">Submit Date:</th>
                                    <td>{moment(tender.effectedDate).format('ll')}</td> 
                                </tr>
                                <tr className="d-flex justify-content-start flex-wrap">
                                    <th scope="row">End Date:</th>
                                    <td>{moment(tender.publishDate).format('ll')}</td>
                                </tr>
                                <tr className="d-flex justify-content-start flex-wrap">
                                    <th scope="row">Category:</th>
                                    <td>{tender.category}</td> 
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {tender.tenderImage && (
                    <div className="d-flex justify-content-center mb-3">
                        <button 
                            className="btn customButton rounded-pill"
                            onClick={downloadImageWithWatermark}
                        >
                            Download Tender Image
                        </button>
                    </div>
                )}
                </div>
             
                {tender.tenderImage ? (
                    <div className="container-fluid m-1 mt-5">
                        <div className="row">
                            <div className="col-lg-12 d-flex justify-content-center">
                                    {console.log(tender.tenderImage)}
                                <img 
                                    src={tender.tenderImage} 
                                    className="img-fluid" 
                                    alt={`Poster for ${tender.name}`} 
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="container-fluid m-1 mt-5">
                        <div className="row">
                            <div className="col-lg-12 d-flex justify-content-center">
                                <span className="text-muted">No image available</span> 
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </>
    );
};

export default Detail;
