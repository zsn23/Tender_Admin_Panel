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
import { X, CheckSquare } from "react-feather";
import Toast from "../alert/Toast"
import { billingApiServices } from '../../services/BillingApiService';
import { localStorageService } from "./../../services/LocalStorageService";
import _EventEmitter from "../../constants/emitter";


const SaveOrganizationModal = (props) => {
  const [modal, setModal] = useState(false);
  const [OrganizationName, setOrganizationName] = useState("");
  const [error, setErrors] = useState(false);
  const [severity, setSeverity] = useState("")
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [responseMsg, setResponseMsg] = useState("")
  const _userData = localStorageService.getPersistedData("USER_DETAILS")

  useEffect(() => {      
    if (props.modalopen) {
      setModal(true)
    }

  }, [props.modalopen])

  const toggle = () => {
    setModal(false);
    props.onClose()  
  };

  useEffect(() => {
    if (props.dataForEdit != null && props.isEditMode) {
      setOrganizationName(props.dataForEdit.name);
    }
  }, [props.dataForEdit]);

  const handleKeyDown=(e)=>{
    if(e.key=="Enter"){
      SubmitForm()
    }
  }


  const SubmitForm = () => {
    if (isValid()) {
      if (props.isEditMode) {
        Edit()
      }
      else {
        save();
      }
    }
  }

 
  const Edit = () => {
   
    // Get the old organization name from props
    const oldOrganizationName = props.dataForEdit?.name;
   
    // Prepare the body for the update organization request
    const body = {
      id: props.dataForEdit?.id,
      name: OrganizationName?.trim(),
      effectedBy: _userData?.id,
    };
  
    // Update the organization
    billingApiServices.updateOrganization(body).then((response) => {
      if (!response) {
        handleToast("error", "Operation failed, check your internet connection");
        return;
      }
  
      if (response?.data?.status) {
        handleToast("success", response?.data?.message);
        setOrganizationName("");
        props.reloadData();
        setModal(false);
        props.onClose();
  
        // Validate old and new organization names before updating tenders
        const newOrganizationName = OrganizationName?.trim();

        // Update tenders with the new organization name
        updateTenderOrganization(oldOrganizationName, newOrganizationName);
  
      } else {
        handleToast("error", response?.data?.message);
      }
    });
  };
  
  
  const updateTenderOrganization = (oldOrganizationName, newOrganizationName) => {
    // Prepare the body for the tender update request
    const body = {
      oldOrganization: oldOrganizationName,
      newOrganization: newOrganizationName,
    };
  
    // Update the tenders with the new organization name
    billingApiServices.updateTendersWithNewOrganizationInName(body).then((response) => {
      if (!response) {
        console.log("Response is null or undefined in updateTendersWithNewOrganizationInName :", response);
        return;
      }
  
      if (response?.data?.status) {
        handleToast("success", response.data.message);
        props.reloadData();
      } else {
        handleToast("error", response.data.message);
        console.error("Error updating tenders:", response.data.message);
      }
    }).catch((error) => {
      console.error("Error during API call:", error);
      handleToast("error", "An error occurred while updating tenders.");
    });
  };
  
  

  const save = () => {
    const body = {
      name: OrganizationName?.trim(),
      effectedBy: _userData?.id
    }

    billingApiServices.saveOrganization(body).then((response) => {
      if (response == null || response == undefined) {
        handleToast("error", "Operation failed, check your internet connection")
        return
      }

      if (response?.data?.status) {
        handleToast("success", response?.data?.message)

        _EventEmitter.emit("reloadOrganizations", response?.data?.data);
        setOrganizationName("")
        props.reloadData()
        setModal(false);
        props.onClose()
      }
      else {
        handleToast("error", response?.data?.message)
      }
    });
  }

  const handleToast = (severity, message) => {
    _EventEmitter.emit('openToast', message+":"+severity)   
  }

  const isValid = () => {
    if (OrganizationName?.trim() == "") {
      setErrors(true)
      return false
    }
    return true;
  };


  const handleOrganizationName = (e) => {
    setOrganizationName(e.target.value)
    setErrors(false)
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
              <CardTitle>{!props.isEditMode ? "Insert Organization" : "Update Organization"}</CardTitle>
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
                              Write Organization name
                            </Label>
                            <Input
                             onKeyDown={(e) => handleKeyDown(e)}
                              type="text"
                              id="name"
                              name="name"
                              value={OrganizationName}
                              onChange={(e) => handleOrganizationName(e)}
                              placeholder="Organization Name"
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

export default SaveOrganizationModal;
