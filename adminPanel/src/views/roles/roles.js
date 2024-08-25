// @ts-nocheck
import React, { Component, Fragment } from "react";
import { NavLink, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Toast from "../alert/Toast"
import helpers from "../../helpers/helpers";
import RolesTable from "./RolesTable";
import AutoComplete from "../../services/autocomplete";
import { billingApiServices } from '../../services/BillingApiService';

class Roles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roleSearch: "",
      roles: Array.from({ length: 5 }),
      interface: "",
      loading: true,
      activePage: 50,
      currentPage: 1,
      rolesPerPage: 50,
      activeTab: 1,
      clearSearch: false,
    };
    this.rolesearch = this.rolesearch.bind(this);
    this.paginate = this.paginate.bind(this);
  }

  rolesearch(rolesearch) {
    this.setState({ roleSearch: rolesearch });
    this.setState({ clearSearch: false });
  }

  clearSearch() {
    this.setState({ roleSearch: "" });
    this.setState({ clearSearch: true });
    this.getRoles("");
  }
  paginate(pageNumber) {
    this.setState({ currentPage: pageNumber });
  }
  getSearch() {
    var searchroles = document.getElementById("roles").value;
    this.setState({ roleSearch: searchroles });
    this.getRoles(searchroles);
  }
  getRoles(searchroles) {

    billingApiServices.getRoles(searchroles).then((roles_data) => {
      this.setState({
        roles: roles_data, loading: false
      });
    });
  }

  componentDidMount() {
    this.getRoles(this.state.roleSearch);
  }

  roleData = (roles_data) => {
    this.setState({
      roles: roles_data,
    });
  };

  render() {
    return (
      <Fragment>
        <div style={{ textAlign: "end", marginTop: '5px' }}>
          <NavLink to={{
            pathname: "/save-role",
            state: { baseurl: `${this.state.baseurl}`,action: `${'insert'}`, },
          }}
          >
            <span className="btn-style btn-lg">Add Role</span>
          </NavLink>
        </div>
        <RolesTable
          roles={this.state.roles}
          loading={this.state.loading}
        />

      <Toast open={this.state.openSnackBar}
          severity={this.state.severity}
          handleClose={() => this.setState({ OpenSnackBar: false })}
          message={this.state.responseMsg} />

      </Fragment>
    );
  }
}

export default Roles;
