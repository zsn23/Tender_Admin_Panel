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

import helpers from "../../helpers/helpers";
import Spinner from "./../../components/spinner/spinner";

const ResetPassword = (props) => {
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  var { forgotlink } = useParams();

  const redirect = () => {
    var baseurl = window.location.protocol + "//" + window.location.host;
    console.log("baseurl ", baseurl);
    window.location = baseurl;
  };

  useEffect(() => {
    console.log("current url ", window.location.host);
    var url = window.location.host.split(":")[0];
    console.log("url ", url);
    var baseurl = window.location.protocol + "//" + url;

    console.log("forgotlink", forgotlink);
    helpers.checkForgotLink(baseurl, forgotlink).then((response) => {
      console.log("response", response);
      if (response.forgotlink == 0) {
        toastr.info(
          "Password Assistant",
          "Forgot password link expired. Please send it again to reset password.",
          {
            position: "top-right",
          }
        );
        redirect();
      }
    });

    const { user } = props;
    if (user.login.user.userLoginData) {
      console.log("user", user);
      redirect();
    }
  }, []);

  const handleResetPassword = () => {
    document.getElementById("spinner").style.display = "block";
    document.getElementById("submit-btn").style.display = "none";

    console.log("current url ", window.location.host);
    var url = window.location.host.split(":")[0];
    console.log("url ", url);
    var baseurl = window.location.protocol + "//" + url;

    if (
      password != "" &&
      confirmpassword != "" &&
      password == confirmpassword
    ) {
      helpers.resetPassword(baseurl, password, forgotlink).then((response) => {
        console.log("response", response);
        toastr.info("Password Assistant", response, {
          position: "top-right",
        });
        document.getElementById("spinner").style.display = "none";
        document.getElementById("submit-btn").style.display = "block";

        redirect();
      });
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
              <Form className="pt-2">
                <FormGroup>
                  <Col md="12">
                    <Input
                      onChange={(value) => setPassword(value.target.value)}
                      type="password"
                      className="form-control"
                      name="inputPass"
                      id="inputPass"
                      placeholder="Password"
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
                <NavLink exact className="text-white" to="/pages/login">
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

// export default Login;
const mapStateToProps = (state) => ({
  user: state.user,
});
export default connect(mapStateToProps)(ResetPassword);
