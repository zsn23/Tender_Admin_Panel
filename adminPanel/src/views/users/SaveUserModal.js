import React, { useEffect, useState } from "react";
import { Button, Modal } from "reactstrap";
import { Password } from 'primereact/password';
import { confirmDialog } from 'primereact/confirmdialog';
import { utils } from "../../utility/index";

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

import {
  X,
  CheckSquare,
} from "react-feather";
import Toast from "../alert/Toast"
import { billingApiServices } from '../../services/BillingApiService';
import _EventEmitter from "./../../constants/emitter";

const SaveUserModal = (props) => {
  const [userData, setUserData] = useState([]);
  const [modal, setModal] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState("");
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState('');
  const [id, setId] = useState(props.user)
  const [refreshstate, setRefreshState] = useState();
  const [severity, setSeverity] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [userRoleId, setUserRole] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [oldPassHash, setOldPassHash] = useState("");
  const [fieldsDisable, setFieldsDisable] = useState(true);
  const [notMatchError, setNotMatchError] = useState(false);
  const [showPassError, setShowpassError] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  const twofactorauthentication = ["true", "false"]

  useEffect(() => {
    if (props.modalopening) {
      setModal(true)
      // setId(props.user)
      // getUserDetails();
      handleProps()
    }
    // if cache store pass to display in pass and confirm pass field that would be set empty
   
  }, [props.modalopening])

  const handleProps = async () => {
    // await getRoles();
    if (props.dataForEdit != null) {
      setUsername(props.dataForEdit.name)
      setEmail(props.dataForEdit.email)
      setPhone(props.dataForEdit?.phoneNumber)
      setPassword(props.dataForEdit?.password)
      setId(props.dataForEdit?.id)
    }
  }

  const toggle = () => {
    setModal(false);
    props.closemodal()
  };

  const accept = () => {
    submit();
  }

  const reject = () => { }

  const getRoles = async () => {
    var response = await billingApiServices.getRoles("")
    if (response?.data?.data?.length > 0) {
      setRoles(response?.data?.data);
      if (props.dataForEdit != null) {
        var selectedRoles = response?.data?.data?.find(v => v._id == props.dataForEdit?.role)
        setRole(selectedRoles?.title)
      }
    }
    else {
      setRoles([])
    }
    return;
  };

  const handleSubmit = async () => {
    if (await handleValidation()) {
      accept();
    }
    else {
      setSeverity("error")
      setResponseMsg("Please complete required fields")
      setOpenSnackBar(true)
    }
  };

  const submit = async () => {
    if (props.dataForEdit != null) {
      editUser()
      return;
    }
   
    const body = {
      name: username,
      email: email,
      password: password,
      phoneNumber: phone
    }
    var response = await billingApiServices.saveUser(body)
    if (response?.data?.status) {
      var msg = "";
      if (props.action == "insert") {
        msg = "User created successfully!";

      } else if (props.action == "update") {
        msg = "User updated successfully!";
      }

      _EventEmitter.emit("RefreshUserData", "")

      setSeverity(response?.data?.message == "Data already exists" ? "error" : "success")
      setResponseMsg(response?.data?.message)
      setOpenSnackBar(true)

      setTimeout(() => {
        toggle();
      }, 3000);
    }
    else {
      setSeverity("success")
      setResponseMsg("request faild!. Server error")
      setOpenSnackBar(true)
    }
  };

  const editUser = async () => {
   
    const body = {
      name: username,
      email: email,
      password: password,
      phoneNumber: phone,     
      id:props.dataForEdit?.id
    }
    var response = await billingApiServices.editUser(body)
    console.log(response)
    if (response?.data?.status) {
      var msg = "";
      if (props.action == "insert") {
        msg = "User created successfully!";

      } else if (props.action == "update") {
        msg = "User updated successfully!";
      }

      _EventEmitter.emit("RefreshUserData", "")

      setSeverity(response?.data?.message == "Data already exists" ? "error" : "success")
      setResponseMsg(response?.data?.message)
      setOpenSnackBar(true)

      setTimeout(() => {
        toggle();
      }, 3000);
    }
    else {
      setSeverity("success")
      setResponseMsg("request faild!. Server error")
      setOpenSnackBar(true)
    }
  };

  const handleValidation = async () => {
    let errors = {};
    let formIsValid = true;

    if (password == "" && props.action === "insert") {
      formIsValid = false;
      errors["password"] = "Cannot be empty";
    }

    if (cpassword == "" && props.action === "insert") {
      formIsValid = false;
      errors["cpassword"] = "Cannot be empty";
    }

    if (password == "" && props.action === "update") {

      if (oldPassword !== "") {
        formIsValid = false;
        setShowpassError(true);
      } else {
        formIsValid = true;
      }
      errors["password"] = "Cannot be empty";
    }

    if (cpassword == "" && props.action === "update") {
      if (oldPassword !== "") {
        formIsValid = false;
        setShowpassError(true);
      } else {
        formIsValid = true;
      }
      errors["cpassword"] = "Cannot be empty";
    }

    if (phone?.length > 20) {
      errors["phone"] = "20 degits is allowed";
      formIsValid = false;
    }
    const lastChar = phone.slice(-1);
    if (!(/^\d*[-+]?$/.test(lastChar))) {

      errors["phone"] = "Invalid Phone Number";
      formIsValid = false;
    }

    if (username == "") {
      formIsValid = false;
      errors["username"] = "Cannot be empty";
    }

    if (email == "") {
      formIsValid = false;
      errors["email"] = "Cannot be empty";
    } else if (typeof email !== "undefined") {
      let lastAtPos = email.lastIndexOf("@");
      let lastDotPos = email.lastIndexOf(".");

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          email.indexOf("@@") == -1 &&
          lastDotPos > 2 &&
          email.length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors["email"] = "Email is not valid";
      }

    }

    
    setErrors(errors);
    return formIsValid;
  };

  const passwordHandler = (newPassword) => {
    if (newPassword !== "") {
      setShowpassError(false);
    }

    setPassword(newPassword);
    setCPassword(newPassword);
  }

  const getSelectedRole = (e) => {
    setRole(e.target.value)
  }

  return (
    <div>
      <Modal
        size="lg"
        isOpen={modal}
        toggle={() => toggle()}
        className={props.className}
        backdrop="static"
      >
        <div className="modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <CardTitle><div>
                {id ? (
                  <div>
                    Edit User
                  </div>
                )
                  :
                  <div>
                    Create User
                  </div>
                }
              </div>
              </CardTitle>
              <button className="cross-btn" onClick={() => toggle()}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <Row>
              <Col sm="12">
                <Card>
                  <CardBody>
                    <div className="  px-1">
                      <Form>
                        <div className="form-body">
                          <Row>
                            <Col xs="4">
                              <FormGroup>
                                <Label for="username">Username<b style={{ color: "red" }}>*</b></Label>
                                <div className="position-relative has-icon-left">
                                  <Input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={(e) =>
                                      setUsername(e.target.value)
                                    }
                                    className={`form-control ${errors.username && "is-invalid"}`}
                                    disabled={id > 0 ? true : false}
                                  />
                                  <div className="form-control-position"></div>
                                  {errors.username ? (
                                    <div className="invalid-feedback">
                                      {errors.username}
                                    </div>
                                  ) : null}
                                </div>
                              </FormGroup>
                            </Col>
                            <Col xs="4">
                              <FormGroup>
                                <Label for="email">Email<b style={{ color: "red" }}>*</b></Label>
                                <div className="position-relative has-icon-left">
                                  <Input
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`form-control ${errors.email && "is-invalid"}`}
                                    disabled={id > 0 ? true : false}
                                  />
                                  <div className="form-control-position">
                                  </div>
                                  {errors.email ? (
                                    <div className="invalid-feedback">
                                      {errors.email}
                                    </div>
                                  ) : null}
                                </div>
                              </FormGroup>
                            </Col>
                            <Col xs="4">
                              <FormGroup>
                                <Label for="phone">Phone<b style={{ color: "red" }}>*</b></Label>
                                <div className="position-relative has-icon-left">
                                  <Input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className={`form-control ${errors.phone && "is-invalid"}`}
                                  />
                                  <div className="form-control-position">
                                  </div>
                                  {errors.phone ? (
                                    <div className="invalid-feedback">
                                      {errors.phone}
                                    </div>
                                  ) : null}
                                </div>
                              </FormGroup>
                            </Col>
                          </Row>


                          {/* <Row>
                            <Col xs="4">
                              <FormGroup>
                                <Label for="role">Role<b style={{ color: "red" }}>*</b></Label>
                                <div className="position-relative has-icon-left">
                                  <Input
                                    type="select"
                                    id="role"
                                    name="role"
                                    value={role}
                                    invalid={Boolean(errors.role)}
                                    onChange={(e) => getSelectedRole(e)}
                                    className={`${errors.role && "is-invalid"}`}
                                  >
                                    <option
                                      value="0"
                                      defaultValue=""
                                      disabled=""
                                    >
                                      Select
                                    </option>
                                    {roles.map((role) => {
                                      const { id, title } = role;
                                      return (
                                        <option key={id} value={id}>
                                          {title}
                                        </option>
                                      );
                                    })}
                                  </Input>
                                  <div className="form-control-position">
                                  </div>
                                  {errors.role ? (
                                    <div className="invalid-feedback">
                                      {errors.role}
                                    </div>
                                  ) : null}
                                </div>
                              </FormGroup>
                            </Col>
                            <Col xs="4"></Col>
                          </Row> */}

                          <Row>
                            <hr />
                            <Col md="6">
                              <FormGroup>
                                <Label for="password">Password<b style={{ color: "red" }}>{"*"}</b></Label>
                                <div className="position-relative has-icon-left">
                                  <Password value={password}
                                    onChange={(e) => passwordHandler(e.target.value)}
                                    toggleMask
                                  />
                                  {errors.password ? (
                                    <div className="invalid-feedback">
                                      {errors.password}
                                    </div>
                                  ) : null}
                                </div>
                              </FormGroup>
                            </Col>
                            <Col md="6">
                              <FormGroup>
                                <Label for="cpassword">Confirm Password<b style={{ color: "red" }}>{"*"}</b></Label>
                                <div className="position-relative has-icon-left">
                                  <>
                                    <Password value={cpassword}
                                      onChange={(e) => passwordHandler(e.target.value)}
                                      toggleMask
                                    />
                                    {errors.cpassword ? (
                                      <div className="invalid-feedback">
                                        {errors.cpassword}
                                      </div>
                                    ) : null}
                                  </>

                                </div>
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>
                      </Form>

                      <div className="form-actions">
                        <Button
                          color="warning"
                          className="mr-3"
                          onClick={() => toggle()}
                        >
                          <X size={16} color="#FFF" /> Cancel
                        </Button>
                        <Button
                          color="primary"
                          onClick={(e) => handleSubmit(e)}
                        >
                          <CheckSquare size={16} color="#FFF" /> Save
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

export default SaveUserModal;
