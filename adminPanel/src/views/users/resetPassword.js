// import external modules
import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Input,
  Form,
  FormGroup,
  Button,
  Card,
  CardBody,
  CardFooter,
} from "reactstrap";
import { toastr } from "react-redux-toastr";
import { connect } from "react-redux";

import Spinner from "./../../components/spinner/spinner";

const ResetPassword = (props) => {
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  var url = window.location.host.split(":")[0];
  var burl = window.location.protocol + "//" + url;
  const [baseurl, setBaseurl] = useState(burl);
  var { forgotlink } = useParams();
  const redirect = () => {
    var baseurl = window.location.protocol + "//" + window.location.host;
    window.location = baseurl;
  };

  useEffect(() => {
   
    const { user } = props;
    if (user.login.user.userLoginData) {
      redirect();
    }
  }, []);

  const handleResetPassword = () => {
    document.getElementById("spinner").style.display = "block";
    document.getElementById("submit-btn").style.display = "none";

    if (
      password != "" &&
      confirmpassword != "" &&
      password == confirmpassword
    ) {
     
    } else {
      if (password == "") {
        toastr.error("Password Assistant", "Please enter password.", {
          position: "top-right",
        });
      } else if (confirmpassword == "") {
        toastr.error("Password Assistant", "Please enter confirm password.", {
          position: "top-right",
        });
      } else if (password != confirmpassword) {
        toastr.error(
          "Password Assistant",
          "Mismatch passwords. Please enter same passwords.",
          {
            position: "top-right",
          }
        );
      }
      document.getElementById("spinner").style.display = "none";
      document.getElementById("submit-btn").style.display = "block";
    }
  };

  return (
    <div className="container">
      <Row className="full-height-vh">
        <Col
          xs="12"
          className="d-flex align-items-center justify-content-center"
        >
          <Card className="gradient-indigo-purple text-center width-400">
            <CardBody>
              <div className="text-center">
                <h4 className="text-uppercase text-bold-400 white py-4">
                  Reset Password
                </h4>
              </div>
              <Form className="pt-2" autoComplete="off">
                <FormGroup>
                  <Col md="12">
                    <Input
                      onChange={(value) => setPassword(value.target.value)}
                      type="password"
                      className="form-control"
                      name="inputPass"
                      id="inputPass"
                      placeholder="Password"
                      autoComplete="new"
                      required
                    />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col md="12">
                    <Input
                      onChange={(value) =>
                        setConfirmPassword(value.target.value)
                      }
                      type="password"
                      className="form-control"
                      name="inputConfirmPass"
                      id="inputConfirmPass"
                      placeholder="Confirm Password"
                      autoComplete="new"
                      required
                    />
                  </Col>
                </FormGroup>
                <FormGroup className="pt-2">
                  <Col md="12">
                    <div className="text-center mt-3">
                      <Button
                        type="button"
                        id="submit-btn"
                        onClick={() => handleResetPassword()}
                        color="danger"
                        block
                      >
                        Update Password
                      </Button>
                      <div
                        className="sp-h"
                        id="spinner"
                        style={{ display: "none" }}
                      >
                        <Spinner />
                      </div>
                    </div>
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
            <CardFooter>
              <div className="white">
                <NavLink exact className="text-white" to="/">
                  Login
                </NavLink>
              </div>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </div>
  );
};


const mapStateToProps = (state) => ({
  user: state.user,
});
export default connect(mapStateToProps)(ResetPassword);
