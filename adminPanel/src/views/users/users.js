
import React, { Component, Fragment } from "react";
import Modal from "react-modal";
import UsersTable from "./UsersTable";
import SaveUserModal from "./SaveUserModal";
import "../users/SaveUserModalStyle.css"
import { billingApiServices } from '../../services/BillingApiService';
import _EventEmitter from "./../../constants/emitter";


class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userSearch: "",
      showModal: false,
      users: Array.from({ length: 5 }),
      loading: true,
      activeTab: 1,
      clearSearch: false,

    };
    this.usersearch = this.usersearch.bind(this);
    _EventEmitter.on("RefreshUserData", this.refreshUserData)
  }


  refreshUserData = () => {
    this.setState({ clearSearch: true });
    this.getUsersDetails("");
  }

  usersearch(userSearch) {
    this.setState({ userSearch: userSearch });
    this.setState({ clearSearch: false });
  }

  clearSearch() {
    this.setState({ userSearch: "" });
    this.setState({ clearSearch: true });
    this.getUsersDetails("");
  }

  getSearch() {
    var searchusers = document.getElementById("accounts").value;
    this.setState({ userSearch: searchusers });
    this.getUsersDetails(searchusers);
  }

  getUsersDetails(userSearch) {
    billingApiServices.getUsersDetails().then((users_data) => {
      this.setState({ users: users_data?.data?.data, loading: false });
    });
  }

  componentDidMount() {
    this.getUsersDetails(this.state.userSearch);
  }
  getShowModal = (modal) => {
    this.setState({ showModal: modal });
  };

  userData = (users_data) => {
    this.setState({
      users: users_data,
    });
  };
  setisModalOpen = () => {
    this.setState({ showModal: false })
  }

  render() {
    Modal.setAppElement("#root");

    return (
      <Fragment>
        <div style={{ textAlign: "end", marginTop: '5px' }}>
          <button type="button" id="new-report" className="btn-style"
            onClick={() => this.setState({ showModal: true })} >Add New
          </button>
        </div>
        <div>
          <UsersTable
            users={this.state.users}
            loading={this.state.loading}
          />
        </div>
        {this.state.showModal && (
          <SaveUserModal
            showModal={this.state.showModal}
            action={"insert"}
            modalopening={this.state.showModal}
            closemodal={() => this.setisModalOpen()}
          />
        )}
      </Fragment>
    );
  }
}

export default Users;
