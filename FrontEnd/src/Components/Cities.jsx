import React from 'react'
import CitiesTable from './CitiesData/CitiesTable'
import { Link } from 'react-router-dom'
import TenderNewspaper from './TenderNewsPaper'
import { Helmet } from 'react-helmet'
const Cities = () => {
  return (
    <>
      <div className="container ">
      <Helmet>
        <title>Cities Tender | Bismillah Tender</title>
        <meta name="description" content="Discover the latest City tenders from Bismillah Tender" />
      </Helmet>
        <div className='m-4'>
          <Link className="text-decoration-none text-dark icon-link-hover link-underline icon-link" to="/">
            <span className=" fw-lighter text-dark colorHover">
              <span className='link-underline p-1'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-door-fill text-" viewBox="0 0 16 16">
                  <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
                </svg>
              </span>
              Home /</span>
          </Link>
          <span className="text-dark  fs-6 "> Cities  </span>
        </div>
        <div>
          <h1 className='fw-bold'>Tender by City</h1>
          <h6>Explore the Latest Tenders Cities: Private and Government Opportunities in Pakistan Discover a wealth of opportunities on BismillahTender.com – Your Gateway to Success!</h6>
          <h6 className='fw-bold text-danger'>واٹس ایپ یا ای میل پر ٹینڈر نوٹس حاصل کرنے کے لیے ابھی سبسکرائب کریں ۔ WhatsApp Now : 03254891919 - 03164484377</h6>
        </div>
        <div className="row">
          <div className="col-lg-8 col-md-12 col-12">
            <CitiesTable/>
          </div>
          <div className="col-lg-4 col-md-12 col-12">
          <TenderNewspaper/>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cities