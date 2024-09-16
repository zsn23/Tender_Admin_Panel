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
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Skeleton } from "primereact/skeleton";
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';

import moment from 'moment';


const SaveNewsPaperModal = (props) => {
  const billingPeriods = [{ id: 1, "title": "one month" }, { id: 2, "title": "3 months" }, { id: 3, "title": "6 months" }]
  const [modal, setModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [company, setCompany] = useState("");
  const [selectedCategories, setSelectedCategories] = useState("");
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState(null);
  const [amount, setAmount] = useState(0);
  const [billingDate, setBillingDate] = useState("");
  const [status, setStatus] = useState(0);


  const [error, setErrors] = useState(false);
  const [severity, setSeverity] = useState("")
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [responseMsg, setResponseMsg] = useState("")
  const _userData = localStorageService.getPersistedData("USER_DETAILS")
  const [CategoryDetails, setCategoryDetails] = useState([{}, {}, {}, {}, {}, {}]);


  useEffect(() => {
    window.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        SubmitForm()
      }
    })

    if (props.modalopen) {
      setModal(true)
    }

    if (!props.CategoryLoader) {
      setCategoryDetails(props.CategoryDetails)
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
    if (props.dataForEdit != null) {
      console.log(props.dataForEdit)

      setUserName(props.dataForEdit?.userName)
      setAmount(props.dataForEdit?.BillingAmount)
      setBillingDate(new Date(props.dataForEdit?.billingDate))
      setCompany(props.dataForEdit?.company)
      setEmail(props.dataForEdit?.email)
      setPhoneNumber(props.dataForEdit?.phoneNumber)

      let billPeriod = billingPeriods?.find(c => c.title == props.dataForEdit?.billingPeriod)
      setSelectedBillingPeriod(billPeriod)


      var selCategory = []
      let category = props.dataForEdit?.categories?.split(",")
      category?.forEach(element => {
        let filtered = props.CategoryDetails?.find(x => x.name == element)
        if(filtered!=undefined && filtered!=null){
        selCategory.push(filtered)
        }
      });
      setSelectedCategories(selCategory)


      if (props.dataForEdit?.status == 1) {
        setStatus(true)
      }
      else {
        setStatus(false)

      }

    }
  }, [props.dataForEdit]);



  const SubmitForm = () => {
    if (isValid()) {
      if (props.dataForEdit != null) {
        Edit()
      }
      else {
        save();
      }
    }
  }

  const Edit = () => {
    let categories = selectedCategories?.map(x => (x.name))
    const body = {
      id: props.dataForEdit?.id,
      userName: userName,
      email: email,
      phoneNumber: phoneNumber,
      company: company,
      billingPeriod: selectedBillingPeriod?.title,
      BillingAmount: amount,
      billingDate: moment(billingDate).format("YYYY-MM-DD HH:mm:ss"),
      categories: categories?.join(","),
      effectedBy: _userData?.id,
      status: status == true ? 1 : 0
    }
    console.log(body)

    billingApiServices.updateSubscriptions(body).then((response) => {
      if (response == null || response == undefined) {
        handleToast("error", "Operation failed, check your internet connection")
        return
      }

      if (response?.data?.status) {
        handleToast("success", response?.data?.message)
        window.location.reload(); // Reloads the current page
        props.reloadData()

        setTimeout(() => {
          setModal(false);
          props.onClose()
        }, 2000);
      }
      else {
        handleToast("error", response?.data?.message)
      }
    });
  }

  const save = () => {
    let categories = selectedCategories?.map(x => (x.name))
    const body = {
      userName: userName,
      email: email,
      phoneNumber: phoneNumber,
      company: company,
      billingPeriod: selectedBillingPeriod?.title,
      BillingAmount: amount,
      billingDate: moment(billingDate).format("YYYY-MM-DD HH:mm:ss"),
      categories: categories?.join(","),
      effectedBy: _userData?.id
    }
    console.log(body)

    billingApiServices.saveSubscription(body).then((response) => {
      if (response == null || response == undefined) {
        handleToast("error", "Operation failed, check your internet connection")
        return
      }

      if (response?.data?.status) {
        handleToast("success", response?.data?.message)
        props.reloadData()
        
        setTimeout(() => {
          setModal(false);
          props.onClose()
        }, 1000);

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
    if (userName?.trim() == "") {
      setErrors(true)
      return false
    }
    return true;
  };


  const handleCategory = (e) => {
    setSelectedCategories(e.value)
  }


  const handleUserName = (e) => {
    setUserName(e.target.value)
    setErrors(false)
  }


  const categoryTemplate = (row) => {
    if (props.CategoryLoader) {
      return <Skeleton></Skeleton>
    }

    return <>{row.name}</>
  }

  return (
    <div className="container-fluid my-3 d-flex align-items-center justify-content-center">

      <Toast open={openSnackBar}
        severity={severity}
        handleClose={() => setOpenSnackBar(false)}
        message={responseMsg} />
      {/* 
      <Modal
        size="lg"
        isOpen={modal}
        toggle={() => toggle()}
        className={props.className}
        backdrop="static"
      > */}
      <div className="modal-lg section" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <CardTitle >{props.dataForEdit == null ? "INSERT SUBSCRIPTION" : "Update Subscription"}</CardTitle>
            <button
              className="cross-btn"
              onClick={() => toggle()}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="container">
            <div class="row">
              <div class="col-sm">
                <FormGroup>
                  <Label className="subscriptionEditLables"  for="name">
                    User Name
                  </Label>
                  <Input
                    type="text"
                    value={userName}
                    onChange={(e) => handleUserName(e)}
                  />
                  {userName == "" && <p style={{ color: "red", fontSize: "12px" }}>* Required</p>}
                </FormGroup>

              </div>
              <div class="col-sm">
                <FormGroup>
                  <Label className="subscriptionEditLables"   for="email">
                    Email
                  </Label>
                  <Input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {email == "" && <p style={{ color: "red", fontSize: "12px" }}>* Required</p>}
                </FormGroup>
              </div>
              <div class="col-sm">
                <FormGroup>
                  <Label className="subscriptionEditLables"  for="phone">
                    Phone Number
                  </Label>
                  <Input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  {phoneNumber == "" && <p style={{ color: "red", fontSize: "12px" }}>* Required</p>}
                </FormGroup>
              </div>
            </div>

            <div class="row ">
              <div class="col-sm">
                <FormGroup>
                  <Label className="subscriptionEditLables"  for="company">
                    Category
                  </Label>
                  <MultiSelect
                    value={selectedCategories}
                    itemTemplate={(e) => categoryTemplate(e)}
                    options={CategoryDetails}
                    onChange={(e) => handleCategory(e)}
                    filter
                    filterBy="name"
                    filterPlaceholder="Search"
                    optionLabel="name"
                     className="" />
                  {selectedCategories == null && <span className="validation-error">* Required</span>}
                </FormGroup>

              </div>
              <div class="col-sm">
                <FormGroup>
                  <Label className="subscriptionEditLables"  for="company">
                    Company
                  </Label>
                  <Input
                    type="text"
                    id="company"
                    name="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                  {company == "" && <p style={{ color: "red", fontSize: "12px" }}>* Required</p>}
                </FormGroup>
              </div>
              <div class="col-sm">
                <FormGroup>
                  <Label className="subscriptionEditLables"  for="bPeriod">
                    Billing Period
                  </Label>
                  <Dropdown
                    options={billingPeriods}
                    filter
                    filterBy="title"
                    onChange={(e) => setSelectedBillingPeriod(e.value)}
                    optionLabel="title"
                    value={selectedBillingPeriod}
                  />
                  {selectedBillingPeriod == null && <p style={{ color: "red", fontSize: "12px" }}>* Required</p>}
                </FormGroup>
              </div>
            </div>

            <div class="row ">
              <div class="col-sm">
                <FormGroup>
                  <Label className="subscriptionEditLables"  for="charges">
                    Amount
                  </Label>
                  <Input
                    type="number"
                    id="Amount"
                    name="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  {amount == "" && <p style={{ color: "red", fontSize: "12px" }}>* Required</p>}
                </FormGroup>

              </div>
              <div class="col-sm">
                <FormGroup>
                  <Label className="subscriptionEditLables"  for="charges">
                    billing Date
                  </Label>
                  <Calendar className="billing-date" format="DD/MM/YYYY" value={billingDate} onChange={(e) => setBillingDate(e.value)} />

                  {billingDate == "" && <p style={{ color: "red", fontSize: "12px" }}>* Required</p>}
                </FormGroup>
              </div>

              {props.dataForEdit != null && <div class="col-sm">
                <FormGroup>
                  <Label className="subscriptionEditLables"  for="charges">
                    Status
                  </Label>
                  <div className=" flex justify-content-center">
                    <InputSwitch checked={status} onChange={(e) => setStatus(e.value)} />
                  </div>
                </FormGroup>
              </div>}

              <div class="col-5">
               
                <div className="button-section form-actions">
                  <Button
                    color="warning"
                    onClick={() => toggle()}
                    className="add-btn"

                  >
                  
                    Cancel
                    <X size={15} color="#FFF" /> 
                  </Button>

                  <Button
                    color="primary"
                    onClick={() => SubmitForm('top')}
                    icon="pi pi-arrow-down" label="Top"
                    className="p-button-warning"
                  >
                    <CheckSquare size={15} color="#FFF" />{props.dataForEdit != null ? "Update" : "Save"}
                  </Button>
                  </div>
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveNewsPaperModal;
