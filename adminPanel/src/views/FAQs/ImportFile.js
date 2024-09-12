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
    const [faqs, setFaqs] = useState([]);
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

            // Assuming the "Question" column is the first column and "Answer" column is the second column
            const faqsArray = columnData.map((e) => ({ question: e[0], answer: e[1] }));
            const modifiedFaqsArray = faqsArray.slice(1); // Skipping the header row if needed

            setFaqs(modifiedFaqsArray);
        };

        reader.readAsBinaryString(file);
    };

    const importRecords = () => {
        if (faqs.length === 0) {
            alert("Select a file with records");
            return;
        }

        const body = {
            values: faqs,
            effectedBy: _userData?.id
        };

        if (props.Type === "Faq") {
            billingApiServices.importToExcelFaqs(body).then((response) => {
                if (response == null) {
                    handleToast("error", "Error occurred while importing FAQs.");
                    return;
                }

                if (response?.data?.status) {
                    handleToast("success", response?.data?.message);
                    props.reloadData();
                    onHide();
                } else {
                    handleToast("error", "Error occurred while importing FAQs.");
                }
            });
        }
    };

    const onHide = () => {
        setFaqs([]);
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
                            Import
                        </div>
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
                                                        <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12">
                                                        <div className='contant'>
                                                            <ul>
                                                                {faqs.map((ele, index) => (
                                                                    <li key={index}>{ele.question} - {ele.answer}</li>
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
