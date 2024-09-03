import React, { Component } from "react";

import "./login__.css"
import { Input, Form, Label } from "reactstrap";
import { billingApiServices } from "../../services/BillingApiService";
import { localStorageService } from "../../services/LocalStorageService";
import Toast from "../../views/alert/Toast";
import _EventEmitter from "../../constants/emitter";
import { Password } from "primereact/password";
import Cookies from "universal-cookie";
import { Checkbox } from "primereact/checkbox";
import { ProgressSpinner } from "primereact/progressspinner";
import { RadioButton } from "primereact/radiobutton";
import imgSrc from "../../assets/img/logos/my_logo.png";
import aboutImg from "../../assets/img/logos/about-img.png";

import { InputText } from "primereact/inputtext";

import axios from "axios";

const cookies = new Cookies();

class Login extends Component  {
  constructor(props) {
    super(props);
    const { user } = this.props;
  }

 

  state = {
    isChecked: false,
    email: "",
    password: "",
    openSnackBar: false,
    severity: "",
    responseMsg: "",
    loading: false,
    authenticationComponent: false,
    authenticationCode: false,
    Selection: "",
    userData: "",
    userEmail: "",
    Code: "",
    verificationCode: "",
    userPhone: "",
    summary: "",
  };

  handleChecked = (e) => {
    this.setState({ isChecked: e.checked });
    if (e.checked) {
      var emailobj = JSON.stringify(this.state.email);
      var passobj = JSON.stringify(this.state.password);
      cookies.set("email", emailobj);
      cookies.set("password", passobj);
    } else {
      cookies.remove("email");
      cookies.remove("password");
    }
  };

  onKey = (e) => {
    if (e.key === "Enter") {
      this.handleLoginClick();
    }
  };

  handleLoginClick = async () => {
    // localStorageService.persistInLocalStorage("USER_DETAILS", {userLoginData:{username:"asad",interfaces:[{systeminterface:"Invoices"},{systeminterface:"Customers"}]}})
    // _EventEmitter.emit("onLoginSuccess", "")

    const { email, password, isChecked } = this.state;
    if (email == "") {
      this.setState({
        severity: "error",
        responseMsg: "Please enter valid email",
        openSnackBar: true,
      });
    }
    if (password == "") {
      this.setState({
        severity: "error",
        responseMsg: "Please enter valid password",
        openSnackBar: true,
      });
    }
    if (email == "" && password == "") {
      this.setState({
        severity: "error",
        responseMsg: "Please fill all fields",
        openSnackBar: true,
      });
    }

    if (email && password) {
      let body = {
        name: email,
        password: password,
      };

      this.setState({ loading: true });
      let result = await billingApiServices.login(body);

      if (result == null) {
        this.setState({
          responseMsg: "Server Error",
          severity: "error",
          openSnackBar: true,
        });
      }

      if (result?.data?.status) {
        const dataObject = result.data.data[0];

        localStorageService.persistInLocalStorage("USER_DETAILS", dataObject);
        _EventEmitter.emit("onLoginSuccess", "");
        return;
      } else {
        this.setState({
          responseMsg: "Please check your credentials and try again!",
          severity: "error",
          openSnackBar: true,
        });
      }

      this.setState({ loading: false });
    }
  };

  getTime = (date) => {
    var t = date?.toString()?.split("T");
    return t[0];
  };

  componentDidMount() {
    var temp = [
      { id: 0, date: "2023-08-11T19:00:00.000Z" },
      { id: 1, date: "2023-09-11T19:00:00.000Z" },
      { id: 2, date: "2023-07-23T19:00:00.000Z" },
      { id: 3, date: "2023-09-11T19:00:00.000Z" },
    ];

    temp = temp?.map((c) => ({ ...c, date: this.getTime(c.date) }));

    const today = new Date(); // Get the current date and time

    const filteredRecords = temp.filter((record) => {
      const recordDate = new Date(record.date); // Convert the 'date' string to a Date object
      const isSameDate =
        recordDate.getDate() === today.getDate() &&
        recordDate.getMonth() === today.getMonth() &&
        recordDate.getFullYear() === today.getFullYear();

      return isSameDate;
    });

    console.log(filteredRecords);
    // var result=temp?.filter((c)=>new Date(c.date)==new Date())
    // console.log(result)

    let eml = cookies.get("email");
    let pssrd = cookies.get("password");
    if (eml != undefined && pssrd != undefined) {
      this.setState({
        isChecked: true,
        email: eml,
        password: pssrd,
      });
    }
  }

  TwoFactorAuthentication = () => {
    return (
      <>
        <div className="login-head">
          <h2>Two-factor Authentication</h2>
          <h6>Please choose a method to verify your account</h6>
          <div className="radio-class">
            <div className="form-group-">
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  marginBottom: "1rem",
                }}
              >
                <RadioButton
                  inputId="EMAIL"
                  value="Email"
                  onChange={(e) => this.setState({ Selection: e.value })}
                  checked={this.state.Selection === "Email"}
                />
                <label htmlFor="EMAIL" className="type-selection-radio-button">
                  EMAIL
                </label>
              </div>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  marginBottom: "1rem",
                }}
              >
                <RadioButton
                  inputId="SMS"
                  value="Sms"
                  onChange={(e) => this.setState({ Selection: e.value })}
                  checked={this.state.Selection === "Sms"}
                />
                <label htmlFor="SMS" className="type-selection-radio-button">
                  SMS
                </label>
              </div>

              <div
                className="form-group"
                style={{ marginTop: "0px", textAlign: "center" }}
              >
                <button
                  type="submit"
                  className="signin-btn"
                  onClick={() => this.handleVerificationClick()}
                >
                  {console.log(this.state.loading)}
                  {this.state.loading === false ? (
                    <ProgressSpinner
                      style={{ padding: "0px", width: "50px", height: "20px" }}
                    />
                  ) : (
                    "Send verification code"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="forget-password"> Forgot Password?</div> */}
      </>
    );
  };

  handleVerificationClick = async () => {
    var seq = (Math.floor(Math.random() * 10000) + 10000)
      .toString()
      .substring(1);
    this.setState({ verificationCode: seq.toString() });
    let body;
    if (this.state.Selection === "Email") {
      body = {
        verificationCode: seq.toString(),
        verificationType: this.state.Selection,
        employeeEmail: this.state.userEmail,
        employeePhone: "",
      };
    }
    if (this.state.Selection === "Sms" && this.state.userPhone != "") {
      body = {
        verificationCode: seq.toString(),
        verificationType: this.state.Selection,
        employeeEmail: "",
        employeePhone: this.state.userPhone,
      };
    }
    if (this.state.userPhone == "") {
      this.setState({
        responseMsg: "phone number is not register",
        severity: "error",
        openSnackBar: true,
      });
      return;
    }
    if (this.state.Selection != "" && this.state.Selection != undefined) {
      this.setState({ loading: false });
      let result = await this.Authentication(body);
      console.log(result);
      if (result) {
        this.setState({ loading: true });
        this.setState({
          responseMsg: "Code Sent Successfully!",
          severity: "success",
          openSnackBar: true,
          summary: "Success",
        });
        this.setState({ authenticationCode: true });
      }
    } else {
      this.setState({
        responseMsg: "Please select any one",
        severity: "error",
        openSnackBar: true,
      });
      this.setState({ authenticationCode: false });
    }
  };

  AuthenticationCode = () => {
    return (
      <>
        <div className="login-head">
          <h1>Authentication Code</h1>
        </div>
        <div className="form-group">
          <img
            className="login-input-image"
            title="Code"
            src={"/css/email.svg"}
            alt=""
          />
          <Input
            onChange={(value) => {
              this.setState({ Code: value.target.value });
            }}
            type="text"
            className="login-input"
            value={this.state.Code}
            placeholder="Enter your Authentication Code"
            onKeyDown={this.onKey}
            required
          />
        </div>
        <div
          className="form-group"
          style={{ margin: "0px", textAlign: "center" }}
        >
          <button
            type="submit"
            className="signin-btn"
            onClick={() => this.handleSubmitClick()}
          >
            Submit
          </button>
        </div>
        {/* <div className="forget-password">
          Forgot Password?
        </div> */}
      </>
    );
  };

  handleFileChange = async (event) => {
    const fileExtension = event.target.files[0]?.name?.split(".").pop();
    var name = "test" + " " + "Img" + "." + fileExtension;

    var response = await billingApiServices.uploadFile(
      event.target.files[0],
      name
    );
    console.log(response);
    if (response?.status) {
    }
  };

  Authentication = async (body) => {
    try {
    } catch (e) {
      return null;
    }
  };
  handleSubmitClick = async () => {
    if (this.state.verificationCode === this.state.Code) {
      localStorageService.persistInLocalStorage(
        "USER_DETAILS",
        this.state.userData
      );
      _EventEmitter.emit("onLoginSuccess", "");
    } else {
      this.setState({
        responseMsg: "Your code is not valid",
        severity: "error",
        summary: "Authentication",
        openSnackBar: true,
      });
    }
  };

  handleAuthorization = async () => {
    try {
      // Make a request to your backend route to initiate the authorization flow
      const response = await axios.get("http://localhost:5000//authorize");
      console.log(response);
    } catch (error) {
      console.error("Error initiating authorization:", error);
    }
  };

  handleEmail = (value) => {
    this.setState({ email: value });
  };
  togglePasswordVisibility = () => {
    this.setState(prevState => ({
        showPassword: !prevState.showPassword
    }));
}

  render() {
    
    return (
      
      <div className="background__ login-bg hover-area">
        <div className="container d-flex align-items-center justify-content-center min-vh-100">

          <div className="card login-box shadow">
            <div className="card-body">
              <div className="login-logo text-center mb-4">
                <img src={imgSrc} alt="logoimg" className="tenderLogo" />
              </div>
              {this.state.authenticationComponent == false ? (
                <>
                  <div className="login-head text-center mb-0">
                    <h1>TENDER LOGIN</h1>
                  </div>
                  <div className="form-group position-relative mb-3">
                    <label htmlFor="inputEmail" className="sr-only">Username / Email</label>
                    <img
                      className="login-input-image"
                      title="Email"
                      src={"/css/email.svg"}
                      alt=""
                    />
                    <Input
                      onChange={(value) => {
                        this.handleEmail(value.target.value);
                      }}
                      type="text"
                      className="form-control login-input"
                      name="inputEmail"
                      id="inputEmail"
                      value={this.state.email}
                      placeholder="Username / Email"
                      autoComplete="new"
                      onKeyDown={this.onKey}
                      required
                    />
                  </div>


                  <div className="form-group position-relative mb-3 d-flex align-items-center justify-content-center">
                    <label htmlFor="inputPassword" className="sr-only">Password</label>
                    <img
                      className="login-input-image"
                      title="Password"
                      src={"/css/locker.svg"}
                      alt="Password Icon"
                    />
                    <Input
                      value={this.state.password}
                      onChange={(value) => {
                        this.setState({ password: value.target.value });
                      }}
                      onKeyDown={this.onKey}
                      placeholder="Password"
                      type={this.state.showPassword ? "text" : "password"}
                      className="form-control login-input"
                      id="inputPassword"
                    />
                    <i
                      className={`toggle-password ${this.state.showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'}`}
                      onClick={() => this.togglePasswordVisibility()}
                      title={this.state.showPassword ? "Hide Password" : "Show Password"}
                    ></i>
                  </div>


                  <div className="form-group mb-0" style={{ marginLeft: "10px" }}>
                    <div className="custom-checkbox ">
                      <Checkbox
                        className="rememberme-checkbox"
                        checked={this.state.isChecked}
                        onChange={(e) => this.handleChecked(e)}
                        id="cookies"
                      />

                      <Label className="remember-label " for="cookies">
                        Remember Me
                      </Label>
                    </div>
                  </div>


                  <div className="form-group text-center mb-0">
                    <button
                      type="submit"

                      className="btn btn-primary w-100 signin-btn"
                      onClick={() => this.handleLoginClick()}
                    >
                      {this.state.loading ? (
                        <ProgressSpinner
                          style={{ padding: "0px", width: "50px", height: "20px" }}
                        />
                      ) : (
                        "Sign in"
                      )}
                    </button>
                  </div>
                </>
              ) : this.state.authenticationCode === true ? (
                <>{this.AuthenticationCode()}</>
              ) : (
                <>{this.TwoFactorAuthentication()}</>
              )}
              <span onClick={() => this.handleAuthorization()} className="copy-right m-0">
                © {new Date().getFullYear()} Tender786. All rights reserved.
              </span>
              <Toast
                open={this.state.openSnackBar}
                summary={this.state.summary}
                severity={this.state.severity}
                handleClose={() => this.setState({ openSnackBar: false })}
                message={this.state.responseMsg}
              />
            </div>
          </div>
        </div>
      </div>

    );
  }
}
export default Login;
