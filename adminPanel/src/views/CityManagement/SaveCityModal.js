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
import { localStorageService } from "../../services/LocalStorageService";


const SaveCityModal = (props) => {
  const [modal, setModal] = useState(false);
  const [CityName, setCityName] = useState("");
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
    // if (!props.isEditMode) {
    //   props.showModal.getShowModal(!modal);
    // }
  };

  useEffect(() => {
    if (props.dataForEdit != null && props.isEditMode) {
      setCityName(props.dataForEdit.name);
    }
  }, [props.dataForEdit]);




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

  // const Edit = () => {
  //   const body = {
  //     id: props.dataForEdit?.id,
  //     name: CityName?.trim(),
  //     effectedBy: _userData?.id
  //   }

  //   billingApiServices.updateCity(body).then((response) => {
  //     if (response == null || response == undefined) {
  //       handleToast("error", "Operation failed, check your internet connection")
  //       return
  //     }

  //     if (response?.data?.status) {
  //       handleToast("success", response?.data?.message)
  //       setCityName("")
  //       props.reloadData()
  //       setTimeout(() => {
  //         setModal(false);
  //         props.onClose();
  //       }, 1000); // 1000 ms = 1 second
  //     }
  //     else {
  //       handleToast("error", response?.data?.message)
  //     }
  //   });
  // }



  const Edit = () => {
   
    // Get the old city name from props
    const oldCityName = props.dataForEdit?.name;
   
    // Prepare the body for the update city request
    const body = {
      id: props.dataForEdit?.id,
      name: CityName?.trim(),
      effectedBy: _userData?.id,
    };
  
    // Update the city
    billingApiServices.updateCity(body).then((response) => {
      if (!response) {
        handleToast("error", "Operation failed, check your internet connection");
        return;
      }
  
      if (response?.data?.status) {
        handleToast("success", response?.data?.message);
        setCityName("");
        props.reloadData();
        setTimeout(() => {
          setModal(false);
          props.onClose();
        }, 1000); // 1000 ms = 1 second
  
        // Validate old and new city names before updating tenders
        const newCityName = CityName?.trim();

        // Update tenders with the new city name
        updateTenderCity(oldCityName, newCityName);
  
      } else {
        handleToast("error", response?.data?.message);
      }
    });
  };


  const updateTenderCity = (oldCityName, newCityName) => {
    // Prepare the body for the tender update request
    const body = {
      oldCity: oldCityName,
      newCity: newCityName,
    };
  
    // Update the tenders with the new city name
    billingApiServices.updateTendersWithNewCityInName(body).then((response) => {
      if (!response) {
        console.log("Response is null or undefined in updateTendersWithNewCityInName :", response);
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
      name: CityName?.trim(),
      effectedBy: _userData?.id
    }

    billingApiServices.saveCity(body).then((response) => {
      if (response == null || response == undefined) {
        handleToast("error", "Operation failed, check your internet connection")
        return
      }

      if (response?.data?.status) {
        handleToast("success", response?.data?.message)
        setCityName("")
        props.reloadData()

        setTimeout(() => {
          setModal(false);
          props.onClose();
        }, 1000); // 1000 ms = 1 second
      }
      else {
        handleToast("error", response?.data?.message)
      }
    });
  }

  const handleToast = (severity, message) => {
    setSeverity(severity)
    setResponseMsg(message)
    setOpenSnackBar(true)
    setTimeout(() => {
      setOpenSnackBar(false)
    }, 2000);
  }

  const isValid = () => {
    if (CityName?.trim() == "") {
      setErrors(true)
      return false
    }
    return true;
  };


  const handleCityName = (e) => {
    setCityName(e.target.value)
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
              <CardTitle>{!props.isEditMode ? "Insert City" : "Update City"}</CardTitle>
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
                            Write City name
                          </Label>
                          <Input
                            type="text"
                            id="name"
                            name="name"
                            value={CityName}
                            onChange={(e) => handleCityName(e)}
                            placeholder="City Name"
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

export default SaveCityModal;
