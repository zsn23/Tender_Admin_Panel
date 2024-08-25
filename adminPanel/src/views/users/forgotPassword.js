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
// import { connect } from "react-redux";


import Spinner from "./../../components/spinner/spinner";

const ForgotPassword = (props) => {
  const [email, setEmail] = useState("");
  var url = window.location.host.split(":")[0];
  var burl = window.location.protocol + "//" + url;
  const [baseurl, setBaseurl] = useState(burl);
  const redirect = () => {
    var baseurl = window.location.protocol + "//" + window.location.host;
    window.location = baseurl;
  };

  const handleForgotPassword = () => {
    document.getElementById("spinner").style.display = "block";
    document.getElementById("submit-btn").style.display = "none";
   
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

export default ForgotPassword;

