// import external modules
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
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

const ForgotPassword = (props) => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const { user } = props;
    if (user.login.user.userLoginData) {
      console.log("user", user);
      var baseurl = window.location.protocol + "//" + window.location.host;
      console.log("baseurl ", baseurl);
      window.location = baseurl;
    }
  }, []);

  const handleForgotPassword = () => {
    document.getElementById("spinner").style.display = "block";
    document.getElementById("submit-btn").style.display = "none";

    console.log("current url ", window.location.host);
    var url = window.location.host.split(":")[0];
    console.log("url ", url);
    var baseurl = window.location.protocol + "//" + url;

    console.log("email", email);

    helpers.forgotPassword(baseurl, email).then((response) => {
      console.log("response", response);
      toastr.info("Password Assistant", response, {
        position: "top-right",
      });
      document.getElementById("spinner").style.display = "none";
      document.getElementById("submit-btn").style.display = "block";
    });
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
                  Forgot Password
                </h4>
              </div>
              <Form className="pt-2">
                <FormGroup>
                  <Col md="12">
                    <Input
                      type="email"
                      className="form-control"
                      name="inputEmail"
                      id="inputEmail"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      placeholder="Your Email Address"
                    />
                  </Col>
                </FormGroup>
                <FormGroup className="pt-2">
                  <Col md="12">
                    <div className="text-center mt-3">
                      <Button
                        type="button"
                        id="submit-btn"
                        onClick={() => handleForgotPassword()}
                        color="danger"
                        block
                      >
                        Submit
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
              {/* <div className="float-right white">
                        <NavLink exact className="text-white" to="/pages/register">
                           Register Now
                        </NavLink>
                     </div> */}
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
export default connect(mapStateToProps)(ForgotPassword);
