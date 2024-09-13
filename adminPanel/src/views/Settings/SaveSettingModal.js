import React, { useEffect, useState } from "react";
import { Button, Modal } from "reactstrap";
import {
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { X, CheckSquare, Save } from "react-feather";
import Toast from "../alert/Toast"
import { billingApiServices } from '../../services/BillingApiService';
import { localStorageService } from "../../services/LocalStorageService";
import { InputTextarea } from "primereact/inputtextarea";


const SaveFAQModal = (props) => {
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setErrors] = useState(false);
  const [severity, setSeverity] = useState("")
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [responseMsg, setResponseMsg] = useState("")
  const _userData = localStorageService.getPersistedData("USER_DETAILS")

  useEffect(() => {
    window.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        SubmitForm()
      }
    })

    if (props.modalopen) {
      setModal(true)
    }

  }, [props.modalopen])

  const toggle = () => {
    setModal(false);
    props.onClose()
    if (!props.isEditMode) {
      props.showModal.getShowModal(!modal);
    }
  };

  useEffect(() => {
    if (props.dataForEdit != null && props.isEditMode) {
      setMessage(props.dataForEdit.sliderMessage);
      setPhoneNumber(props.dataForEdit.phoneNumber);

    }
  }, [props.dataForEdit]);



  const SubmitForm = () => {
    if (isValid()) {
      if (props.isEditMode) {
        Edit();
      }else {
        Save();
      }
      
    }
  }

  const Edit = () => {
    const body = {
      id: props.dataForEdit?.id,
      sliderMessage: message?.trim(),
      phoneNumber: phoneNumber?.trim(),
      effectedBy: _userData?.id
    }

    billingApiServices.updateSetting(body).then((response) => {
      if (response == null || response == undefined) {
        handleToast("error", "Operation failed, check your internet connection")
        return
      }

      if (response?.data?.status) {
        handleToast("success", response?.data?.message)
        setMessage("")
        setPhoneNumber("")
        props.reloadData()
        setModal(false);
        props.onClose()
      }
      else {
        handleToast("error", response?.data?.message)
      }
    });
  }

  const Save = () => {
    const body = {
      sliderMessage: message?.trim(),
      phoneNumber: phoneNumber?.trim(),
      effectedBy: _userData?.id
    };
  
    billingApiServices.createSetting(body).then((response) => {
      if (!response || response === undefined) {
        handleToast("error", "Operation failed, check your internet connection");
        return;
      }
  
      if (response?.data?.status) {
        handleToast("success", response?.data?.message);
        setMessage("");
        setPhoneNumber("");
        props.reloadData();
        setModal(false);
        props.onClose();
      } else {
        handleToast("error", response?.data?.message);
      }
    });
  };
  



  const handleToast = (severity, message) => {
    setSeverity(severity)
    setResponseMsg(message)
    setOpenSnackBar(true)
    setTimeout(() => {
      setOpenSnackBar(false)
    }, 2000);
  }

  // const isValid = () => {
  //   if (message?.trim() == "" || phoneNumber?.trim() == "") {
  //     setErrors(true)
  //     return false
  //   }
  //   return true;
  // };
  const isValid = () => {
    if (message?.trim() === "" || phoneNumber?.trim() === "") {
      setErrors(true);
      handleToast("error", "Message and Phone Number are required fields.");
      return false;
    }
    return true;
  };


  const handleQuestion = (e) => {
    setMessage(e.target.value)
    setErrors(false)
  }

  const handleAnswer = (e) => {
    setPhoneNumber(e.target.value)
    setErrors(false)
  }

  const handleKeyDown=(e)=>{
    if(e.key=="Enter"){
      SubmitForm()
    }
  }
  
  return (
    <div>
      <Modal
        size="md"
        isOpen={modal}
        toggle={() => toggle()}
        className={props.className}
        backdrop="static"
      >
        <div className="modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <CardTitle>{!props.isEditMode ? "Insert Setting" : "Update Settings"}</CardTitle>
              <button
                className="cross-btn"
                onClick={() => toggle()}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <Row className="row-eq-height justify-content-md-center">
              <Col md="12">
                <Card>
                  <CardBody>
                    <div className="px-1">
                        <div className="form-body">
                          <FormGroup>
                            <Label className="LableINdarkmode" for="name">
                              Write Message here
                            </Label>
                            <Input
                              onKeyDown={(e) => handleKeyDown(e)}
                              type="text"
                              className="question-textarea"
                              value={message}
                              autoResize
                              onChange={(e) => handleQuestion(e)}
                            />
                            {error && <p style={{ color: "red", fontSize: "12px" }}>* Required</p>}
                          </FormGroup>
                        </div>


                        <div className="form-body">
                          <FormGroup>
                            <Label className="LableINdarkmode" for="name">
                              Write PhoneNumber here
                            </Label>
                            <Input
                              type="text"
                              className="question-textarea"
                              value={phoneNumber}
                              autoResize
                              onChange={(e) => handleAnswer(e)}
                            />


                            {error && <p style={{ color: "red", fontSize: "12px" }}>* Required</p>}
                          </FormGroup>
                        </div>
                        <div className="form-actions right">
                          <Button
                            color="warning"
                            className="mr-3"
                            onClick={() => toggle()}
                          >
                            <X size={16} color="#FFF" /> Cancel
                          </Button>
                          <Button
                            color="primary"
                            onClick={() => SubmitForm('top')}
                            icon="pi pi-arrow-down" label="Top"
                            className="p-button-warning mr-2"
                          >
                            <CheckSquare size={16} color="#FFF" />{props.isEditMode ? "Update" : "Save"}
                          </Button>

                          <Toast open={openSnackBar}
                            severity={severity}
                            handleClose={() => setOpenSnackBar(false)}
                            message={responseMsg} />
                        </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SaveFAQModal;
