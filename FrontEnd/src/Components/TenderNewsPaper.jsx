import News1 from './Pictures/1 (1).jpg'
import News2 from './Pictures/1 (1).png'
import News3 from './Pictures/1 (2).jpg'
import News4 from './Pictures/1 (2).png'
import News5 from './Pictures/1 (3).jpg'
import News6 from './Pictures/1 (4).png'
import News7 from './Pictures/1 (5).png'


const TenderNewspaper = () => {

  return(
    <>
    <div className=" d-flex justify-content-start flex-column mt-5">
      <h5 className="fw-bolder mt-5 mx-4">Tender By Newspapers</h5>
      <div className="row">
        <div className="col-lg-12">
          <div className="p-3 d-flex flex-row Newspapers gap-1 flex-wrap mt-5">
            <img src={News1} className="img-fluid rounded" alt="mini posters" />
            <img src={News2} className="img-fluid rounded" alt="mini posters" />
            <img src={News3} className="img-fluid rounded" alt="mini posters" />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="p-3 d-flex flex-row Newspapers gap-1 flex-wrap">
            <img src={News4} className="img-fluid rounded" alt="mini posters" />
            <img src={News5} className="img-fluid rounded" alt="mini posters" />
            <img src={News6} className="img-fluid rounded" alt="mini posters" />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="p-3 d-flex flex-row Newspapers gap-1 flex-wrap">
            <img src={News7} className="img-fluid rounded" alt="mini posters" />
            <img src={News3} className="img-fluid rounded" alt="mini posters" />
            <img src={News2} className="img-fluid rounded" alt="mini posters" />
          </div>
        </div>
      </div>
    </div>
    <div className="border-bottom border-top mt-3 mb-3 p-3 blinkingEffectOfTenderAlert">
      <div className="row">
        <div className="col-12 tenderAlerts">
          <h1 className="text-center fs-1 fw-bolder p-3 tenderAlerts">Tender Alert</h1>
        </div>
      </div>


      <div className=" table-responsive-lg ">
        <table className="table  table-borderless ">
          <tbody className="d-flex flex-column">
            <tr className="d-flex justify-content-center justify-content-md-center ">
              <td className="text-primary fst-italic fw-semibold">E-mail and WhatsApp alerts for advertisement tenders</td>
            </tr>

            <tr className="d-flex justify-content-center  align-items-center">
              <td className="text-danger border-bottom fst-italic fw-semibold">For Call - 0325-4891919</td>
            </tr>
          </tbody>
        </table>
      </div>


      <div className="row">
        <div className="col-12">
          <h1 className="text-center fs-1 text-dark fw-bolder p-3 tenderAlerts">ٹینڈر الرٹ</h1>
        </div>
      </div>
      <table className="table table-responsive table-borderless">
        <tbody className="d-flex flex-column">
          <tr className="d-flex justify-content-center  ">
            <td className="text-primary fst-italic fw-semibold " >اشتہاری ٹینڈرز کے لیے ای میل اور واٹس ایپ الرٹس</td>
          </tr>

          <tr className="d-flex justify-content-center  align-items-center">
            <td className="text-danger fst-italic fw-semibold ">0325-4891919 - کال کے لیے </td>
          </tr>
        </tbody>
      </table>
    </div>
    </>
    )
}
export default TenderNewspaper