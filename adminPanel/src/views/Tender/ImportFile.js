import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Button, Modal } from "reactstrap";
import { billingApiServices } from '../../services/BillingApiService';
import Toast from "../alert/Toast";
import "./ImportFile.css";

import {
    Card,
    CardBody,
    Row,
    Col,
    Form
} from "reactstrap";
import { CheckSquare } from 'react-feather';
import { localStorageService } from "../../services/LocalStorageService";

function ImportFile(props) {
    const [tenders, setTenders] = useState([]);
    const [modal, setModal] = useState(false);
    const _userData = localStorageService.getPersistedData("USER_DETAILS");
    const [severity, setSeverity] = useState("");
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [responseMsg, setResponseMsg] = useState("");

    useEffect(() => {
        if (props.isOpen) {
            setModal(true);
        }
    }, [props.isOpen]);

    const handleToast = (severity, message) => {
        setSeverity(severity);
        setResponseMsg(message);
        setOpenSnackBar(true);
        setTimeout(() => {
            setOpenSnackBar(false);
        }, 2000);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (evt) => {
            const data = evt?.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet
            const sheet = workbook.Sheets[sheetName];
            const columnData = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });

            // Extracting necessary fields from the file in the correct order
            const tendersArray = columnData.map((e) => ({
                IPLNumber: e[0],          // IPLNumber - Assuming first column is IPLNumber
                name: e[1],               // name - Assuming second column is name
                organization: e[2],   // organizationName - Assuming third column is organizationName
                category: e[3],           // category - Assuming fourth column is category
                city: e[4],           // cityName - Assuming fifth column is cityName
                newspaper: e[5],       // newPaperName - Assuming sixth column is newPaperName
                effectedDate: e[6],
                publishDate: e[7],
                tenderImage: e[8],
            }));

            // Skipping the header row (if necessary)
            const modifiedTendersArray = tendersArray.slice(1); // Remove header row

            setTenders(modifiedTendersArray);
            console.log("Parsed Data:", modifiedTendersArray);
        };

        reader.readAsBinaryString(file);
    };




    const importRecords = () => {
        if (tenders.length === 0) {
            
            handleToast("error","Select a file with records");
            return;
        }

        const body = {
            values: tenders,
            effectedBy: _userData?.id
        };

        if (props.Type == "Tenders") {
            billingApiServices.importToExcelTenders(body).then((response) => {
                if (response == null) {
                    handleToast("error", "Error occurred while importing tenders(NULL).");
                    return;
                }

                if (response?.data?.status) {
                    handleToast("success", response?.data?.message);
                    props.reloadData();
                    onHide();
                } else {
                    handleToast("error", "Error occurred while importing tenders.");
                }
            });
        }
    };




    // const importRecords = () => {
    //     if (tenders.length === 0) {
    //         handleToast("error", "Select a file with records");
    //         return;
    //     }
    
    //     // Map tenders to include the dates
    //     const tendersWithDates = tenders.map(tender => ({
    //         ...tender,
    //         effectedDate: tender.effectedDate ? new Date(tender.effectedDate).toISOString() : null,
    //         publishDate: tender.publishDate ? new Date(tender.publishDate).toISOString() : null,
    //     }));
    
    //     const body = {
    //         values: tendersWithDates,
    //         effectedBy: _userData?.id
    //     };
    
    //     if (props.Type === "Tenders") {
    //         billingApiServices.importToExcelTenders(body).then((response) => {
    //             if (response == null) {
    //                 handleToast("error", "Error occurred while importing tenders (NULL).");
    //                 return;
    //             }
    
    //             if (response?.data?.status) {
    //                 handleToast("success", response?.data?.message);
    //                 props.reloadData();
    //                 onHide();
    //             } else {
    //                 handleToast("error", "Error occurred while importing tenders.");
    //             }
    //         });
    //     }
    // };
    

    const onHide = () => {
        setTenders([]);
        setModal(false);
        props.onHide();
    };

    return (
        <div>
            <Modal
                size="lg"
                isOpen={modal}
                toggle={() => onHide()}
                backdrop="static"
            >
                <div className="modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            Import Data Only From Excel File
                        </div>
                        <p>
                            <span className='ml-3'>Important Notes:</span>
                            <ul className='text-danger fs-4'>

                                <li>
                                    <p>
                                        In Excel file write proper column headings and follow same order as you see in table.
                                        Date is auto generated or and write manually.
                                    </p>
                                </li>
                                
                                <li>
                                    <p className='text-dark'>
                                       End Date Format: YYYY-MM-DD
                                    </p>
                                </li>

                                <li>
                                    <p>
                                        Title & IPL number must be unique for every tender.
                                    </p>
                                </li>
                                
                                <li>
                                    <p className='text-dark'>
                                        Title Format : Title - Organization_Name - City_Name
                                    </p>
                                </li>


                                <li>
                                    <p>
                                        Tender Image must be added manually.
                                    </p>
                                </li>

                                <li>   
                                    <p> 
                                       For Category : Only write those categories or category which are exsisted in tender categories.
                                        <p>
                                            Write Category in this Format:  <span className='text-dark bg-light p-1 m-1 rounded-5'> Category1Name:Category2Name:Category3Name....so on. </span>
                                        </p>
                                    </p>
                                     
                                </li>

                                <li>
                                    <p>
                                        For Organization : Write only onganization id in excel file. See id in city page.
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        For City : Write only city id in excel file. See id in organization page.
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        For newspaper : Write only newspaper id in excel file. See id in newspaper page.
                                    </p>
                                </li>

                            </ul>
                        </p>
                    </div>
                    <Row>
                        <Col sm="12">
                            <Card>
                                <CardBody>
                                    <div className="px-1">
                                        <Form>
                                            <div className="form-body">
                                                <Row>
                                                    <Col xs="12">
                                                        <input className='NofileSelINdarkMopde' type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12">
                                                        <div className='contant'>
                                                            <ul>
                                                                <table>
                                                                <thead>
                                                                    <tr className='d-flex gap-4' >
                                                                        <th className='textofExcelFileIndarkMode' >IPLNumber</th>
                                                                        <th className='textofExcelFileIndarkMode' >Name</th>
                                                                        <th className='textofExcelFileIndarkMode' >Organization_ID</th>
                                                                        <th className='textofExcelFileIndarkMode' >Category</th>
                                                                        <th className='textofExcelFileIndarkMode' >City_ID</th>
                                                                        <th className='textofExcelFileIndarkMode' >Newspaper_ID</th>
                                                                        <th className='textofExcelFileIndarkMode' >End Date</th>
                                                                        <th className='textofExcelFileIndarkMode' >Download Tender Image</th>
                                                                    </tr>
                                                                </thead>
                                                                
                                                                </table>

                                                                
                                                                {tenders.map((ele, index) => (
                                                                    <li className='textofExcelFileIndarkMode' key={index}>
                                                                        {ele.IPLNumber} - {ele.name} - {ele.organization} - {ele.category} - {ele.city} - {ele.newspaper} - {ele.publishDate} - {ele.tenderImage} 
                                                                    </li>
                                                                ))}
                                                            </ul>

                                                           


                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Form>

                                        <div className="form-actions">
                                            <Button
                                                color="warning"
                                                className="mr-3"
                                                onClick={() => onHide()}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                color="primary"
                                                onClick={(e) => importRecords(e)}
                                            >
                                                <CheckSquare size={16} color="#FFF" /> Save
                                            </Button>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Modal>
            <Toast open={openSnackBar}
                severity={severity}
                handleClose={() => setOpenSnackBar(false)}
                message={responseMsg} />
        </div>
    );
}

export default ImportFile;
