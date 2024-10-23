
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BaseUrl from '../api/BaseUrl';
import { Link } from 'react-router-dom';
const TenderCategoryDetails = () => {
  const { id } = useParams();   
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Base_Url = BaseUrl();

  useEffect(() => {
    const fetchTenderDetails = async () => {
      try {
        const response = await axios.get(`${Base_Url}/tender/${id}`);
        setTender(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tender details:', err);
        setError('Failed to fetch tender details. Please try again later.');
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
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  if (!tender) {
    return <div className="alert alert-warning text-center">Tender not found.</div>;
  }

  return (
    <div className="container ">
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
      <div className="card shadow-lg p-3 mb-4">
        <h2 className="card-title text-center fw-bold">Tender Detail</h2>
        <div className="card-body">
          <p><strong>Tender Name:</strong> {tender.name}</p>
          <p><strong>Organization:</strong> {tender.organizationName}</p>
          <p><strong>Tender City:</strong> {tender.cityName}</p>
          <p><strong>Newspaper:</strong> {tender.newPaperName}</p>
          <p><strong>Categories:</strong> {tender.category}</p>
          <p><strong>Publish Date:</strong> {new Date(tender.publishDate).toLocaleDateString()}</p>
          {tender.tenderImage && (
                    <div className="d-flex justify-content-center mt-4">
                        <button 
                            className="btn  customButton rounded-pill mb-3"
                            onClick={downloadImageWithWatermark}
                        >
                            Download Tender Image
                        </button>
                    </div>
                )}
        </div>
        </div>
        {tender.tenderImage ? (
                    <div className="container-fluid m-1 mt-5">
                        <div className="row">
                            <div className="col-lg-12 d-flex justify-content-center">
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
  );
};

export default TenderCategoryDetails;
