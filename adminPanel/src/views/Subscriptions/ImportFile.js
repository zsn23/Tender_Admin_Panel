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
    const [subscriptions, setSubscriptions] = useState([]);
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
            const subscriptionsArray = columnData.map((e) => ({
                userName: e[0],          // userName - Assuming first column is userName
                phoneNumber: e[1],       // phoneNumber - Assuming second column is phoneNumber
                email: e[2],             // email - Assuming third column is email
                company: e[3],           // company - Assuming fourth column is company
                billingPeriod: e[4],     // billingPeriod - Assuming sixth column is billingPeriod
                categories: e[5],  
                BillingAmount: e[6],     // categories - Assuming seventh column is categories
            }));

            // Skipping the header row (if necessary)
            const modifiedSubscriptionsArray = subscriptionsArray.slice(1); // Remove header row

            setSubscriptions(modifiedSubscriptionsArray);
        };

        reader.readAsBinaryString(file);
    };

    const importRecords = () => {
        if (subscriptions.length === 0) {
            alert("Select a file with records");
            return;
        }

        const body = {
            values: subscriptions,
            effectedBy: _userData?.id
        };
        if (props.Type == "Subscription") {
        billingApiServices.importToExcelSubscriptions(body).then((response) => {
            if (response == null) {
                handleToast("error", "Error occurred while importing subscriptions(NULL).");
                return;
            }

            if (response?.data?.status) {
                handleToast("success", response?.data?.message);
                props.reloadData();
                onHide();
            } else {
                handleToast("error", "Error occurred while importing subscriptions.");
            }
        });
        }
    };

    const onHide = () => {
        setSubscriptions([]);
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
                                        Date is auto generated (Current date will be added to date column)
                                    </p> 
                                </li>

                                <li>   
                                    <p> 
                                        Status is auto generated.Update Status Manually. After import data from file status will be In-Active for all users.
                                    </p> 
                                </li>
                                <li>   
                                    <p> 
                                       For Category : Only write those categories or category which are exsisted in tender categories.
                                        <p>
                                            Write Category in this Format: <span className='text-dark bg-light p-1 m-1 rounded-5'> Category1Name:Category2Name:Category3Name....so on. </span> 
                                        </p>
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
                                                                        <th className='textofExcelFileIndarkMode' >userName</th>
                                                                        <th className='textofExcelFileIndarkMode' >phoneNumber</th>
                                                                        <th className='textofExcelFileIndarkMode' >email</th>
                                                                        <th className='textofExcelFileIndarkMode' >company</th>
                                                                        <th className='textofExcelFileIndarkMode' >billingPeriod</th>
                                                                        <th className='textofExcelFileIndarkMode' >categories</th>
                                                                        <th className='textofExcelFileIndarkMode' >BillingAmount</th>

                                                                    </tr>
                                                                </thead>
                                                                
                                                                </table>

                                                                {subscriptions.map((ele, index) => (
                                                                    <li className='textofExcelFileIndarkMode' key={index}>{ele.userName} - {ele.phoneNumber} - {ele.email} - {ele.company} - {ele.billingPeriod}- {ele.categories} - {ele.BillingAmount}</li>
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
