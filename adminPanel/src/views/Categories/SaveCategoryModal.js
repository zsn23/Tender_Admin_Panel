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


const SaveCategoryModal = (props) => {
  const [modal, setModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
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
      setCategoryName(props.dataForEdit.name);
    }
  }, [props.dataForEdit]);



  const SubmitForm = () => {
    if (isValid()) {
      if (props.isEditMode) {
        Edit();
        updateTenderCategory();
      }
      else {
        save();
      }
    }
  }

  const Edit = () => {
    const oldCategoryName = props.dataForEdit?.name; // Save the old category name before editing
  
    const body = {
      id: props.dataForEdit?.id,
      name: categoryName?.trim(),
      effectedBy: _userData?.id,
    };
  
    billingApiServices.updateCategory(body).then((response) => {
      if (response == null || response == undefined) {
        handleToast("error", "Operation failed, check your internet connection");
        return;
      }
  
      if (response?.data?.status) {
        handleToast("success", response?.data?.message);
        setCategoryName("");
        props.reloadData();
        setModal(false);
        props.onClose();
  
        // After updating the category, update tenders with the new category
        updateTenderCategory(oldCategoryName, categoryName);
      
      } else {
        handleToast("error", response?.data?.message);
      }
    });
  };
  
  const updateTenderCategory = (oldCategoryName, newCategoryName) => {
    const body = {
      oldCategory: oldCategoryName,
      newCategory: newCategoryName,
    };
  
    billingApiServices.updateTendersWithNewCategory(body).then((response) => {
      if (response == null || response == undefined) {
        return;
      }
  
      if (response?.data?.status) {
        handleToast("success", response.data.message);
        props.reloadData();
      } else {
        handleToast("error", response.data.message);
        console.error("Error updating tenders:", response.data.message);
      }
    }).catch((e) => {
      console.error("Error during API call:", e);
    });
  };
  
  

  const save = () => {
    const body = {
      name: categoryName?.trim(),
      effectedBy: _userData?.id
    }

    billingApiServices.saveCategory(body).then((response) => {
      if (response == null || response == undefined) {
        handleToast("error", "Operation failed, check your internet connection")
        return
      }

      if (response?.data?.status) {
        _EventEmitter.emit("reloadCategories", response?.data?.data);
        handleToast("success", response?.data?.message)
        setCategoryName("")
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
    _EventEmitter.emit('openToast', message + ":" + severity)
  }

  const isValid = () => {
    if (categoryName?.trim() == "") {
      setErrors(true)
      return false
    }
    return true;
  };


  const handleCategoryName = (e) => {
    setCategoryName(e.target.value)
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
              <CardTitle>{!props.isEditMode ? "Insert category" : "Update category"}</CardTitle>
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
                            Write category name
                          </Label>
                          <Input
                            onKeyDown={(e) => handleKeyDown(e)}
                            type="text"
                            id="name"
                            name="name"
                            value={categoryName}
                            onChange={(e) => handleCategoryName(e)}
                            placeholder="Category Name"
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

export default SaveCategoryModal;
