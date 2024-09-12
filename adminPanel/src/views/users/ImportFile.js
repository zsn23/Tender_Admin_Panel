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
    const [users, setUsers] = useState([]);
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
    const reloadData = () => {
        
      }
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
      
          // Assuming columns: "Name", "Email", "Password", "PhoneNumber", "EffectedDate"
          const usersArray = columnData.map((e) => ({
            name: e[0],
            email: e[1],
            password: e[2],
            phoneNumber: e[3],          
          }));
          const modifiedUsersArray = usersArray.slice(1); // Skipping the header row if needed
      
          setUsers(modifiedUsersArray);
        };
      
        reader.readAsBinaryString(file);
      };

    const importRecords = () => {
        if (users.length === 0) {
            alert("Select a file with records");
            return;
        }

        const body = {
            values: users,
            effectedBy: _userData?.id
        };

        if (props.Type === "User") {
            billingApiServices.importToExcelUsers(body).then((response) => {
                if (response == null) {
                    handleToast("error", "Error occurred while importing users(NULL)");
                    return;
                }

                if (response?.data?.status) {
                    handleToast("success", response?.data?.message);
                    window.location.reload();
                    onHide();
                } else {
                    handleToast("error", "Error occurred while importing users.");
                }
            });
        } 
        
    };

    const onHide = () => {
        setUsers([]);
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
                                                                {users.map((ele, index) => (
                                                                    <li key={index}>
                                                                        {ele.name} - {ele.email} - {ele.password} - {ele.phoneNumber} - {ele.effectedDate}
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
                                                onClick={() => importRecords()}
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
