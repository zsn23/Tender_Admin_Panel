// @ts-nocheck

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import Spinner from "./../../components/spinner/spinner";
import helpers from "../../helpers/helpers";

class Profiles extends Component {
  constructor(props) {
    super(props);

    console.log("current url ", window.location.host);
    var url = window.location.host.split(":")[0];
    console.log("url ", url);
    var baseurl = window.location.protocol + "//" + url;

    this.state = {
      showModal: false,
      users: [],
      interface: "",
      loading: false,
      baseurl: baseurl,
    };
  }

  componentDidMount() {
    document.getElementById("spinner").style.display = "block";
    document.getElementById("users-tbl").style.display = "none";

    console.log("current url ", window.location.host);
    var url = window.location.host.split(":")[0];
    console.log("url ", url);
    var baseurl = window.location.protocol + "//" + url;

    // calling helper function to get current users
    helpers.getUsersDetails(baseurl, "accounts").then((users_data) => {
      console.log("users_data ", users_data);
      this.setState({
        users: users_data,
      });
    });

    // calling helper function to get current interface
    helpers.getInterface(this.state.baseurl, "users").then((iface) => {
      this.setState({ interface: iface });
      document.getElementById("spinner").style.display = "none";
      document.getElementById("users-tbl").style.display = "block";
    });
  }
  getShowModal = (modal) => {
    this.setState({ showModal: modal });
  };

  userData = (users_data) => {
    console.log("userData", users_data);
    this.setState({
      users: users_data,
    });
  };

  render() {
    const { user } = this.props;
    return (
      <Fragment>
        <div className="account-application">
          <div className="content-overlay" />
          {/* <EmailSidebar /> */}
          <div className="account-content row">
            <div className="account-content-area w-100">
              <div className="app-list-mails p-0">
                <div className="account-actions p-0 bg-white">
                  {/* <EmailActions /> */}

                  <div className="stage stage-1">
                    <div className="stage-header">
                      <span className="page-title">
                        {user.login.user.userLoginData.firstname}{" "}
                        {user.login.user.userLoginData.lastname}
                      </span>
                      <div
                        data-automation-id="newReport"
                        className="pull-right"
                      ></div>
                      <div className="allLists"></div>
                    </div>
                    <div className="account-page-search-section">
                      <div className="account-search-bar pull-left w-50">
                        {/* <EmailSearch /> */}
                        <div className="account-search-box w-50 mt-3 my-2 ml-2">
                          <div className="media">
                            <span className="account-app-sidebar-toggle ft-align-justify font-large-1 mr-2 d-xl-none" />
                            {/* <div className="media-body">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search...."
                                onChange={(e) =>
                                  this.props.onChange(e.target.value)
                                }
                                value={this.props.searchTerm}
                              />
                            </div> */}
                          </div>
                        </div>
                      </div>

                      <div className="accounts-ctas pull-right text-right d-flex">
                        <button
                          type="button"
                          className="btn btn-default btn-lg mb-0 mt-2"
                          aria-label="Left Align"
                        >
                          <i className="pi pi-pencil"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-default btn-lg mb-0 mt-2"
                        >
                          <i className="fa fa-print black-color-icon"></i>
                        </button>
                        <div className="btn-settings">
                          <button
                            type="button"
                            className="btn btn-default btn-lg mb-0 mt-2"
                          >
                            <i className="fa fa-cog black-color-icon"></i>
                          </button>
                          <div className="settings-dropdown text-left p-2">
                            <span>Columns</span>
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="type"
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="type"
                              >
                                Type
                              </label>
                            </div>
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="detailType"
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="detailType"
                              >
                                Detail Type
                              </label>
                            </div>
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="quickBooksBalance"
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="quickBooksBalance"
                              >
                                Balance
                              </label>
                            </div>
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="bankBalance"
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="bankBalance"
                              >
                                Bank Balance
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="modal fade"
                    id="modalAccount"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLongTitle"
                    aria-hidden="true"
                  ></div>
                  <div className="stage-2">
                    <div
                      className="dgrid-header dgrid-header-row ui-widget-header sticky-header"
                      role="row"
                    ></div>
                    <div id="spinner">
                      <Spinner />
                    </div>
                    <div id="users-tbl">
                      {/* <UsersTable
                        users={this.state.users}
                        interface={this.state.interface}
                        loading={this.state.loading}
                      /> */}
                    </div>
                  </div>
                </div>
                {/* <EmailContent /> */}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

// export default Login;
const mapStateToProps = (state) => ({
  user: state.user,
});
export default connect(mapStateToProps)(Profiles);
