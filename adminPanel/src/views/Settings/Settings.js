import React, { Component, Fragment } from "react";
import Modal from "react-modal";
import SettingTable from "./SettingTable";
import SaveSettingModal from "./SaveSettingModal";
import { billingApiServices } from '../../services/BillingApiService';
import "./Setting.css";


class SettingDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categorySearch: "",
      showModal: false,
      gridData: [],
      interface: "",
      loading: true,
      activeTab: 1,
      clearSearch: false,
    };

  }

  getSettingDetails() {
    billingApiServices
      .getAllSettings()
      .then((response) => {

        this.setState({ gridData: response?.data?.data, loading: false });
      });
  }

  componentDidMount() {
    this.getSettingDetails();
  }


  reloadData = () => {
    this.setState({ loading: true })
    this.getSettingDetails();
  }

  getShowModal = (modal) => {
    this.setState({ showModal: modal });
  };

  categoryData = (categories_data) => {
    this.setState({
      gridData: categories_data,
    });
  };

  render() {
    return (
      <>
        <div style={{ textAlign: "end", marginTop: '5px' }}>
          <button id="new-report" className="btn-style"
            onClick={() => this.setState({ showModal: true })} > Add New
          </button>
        </div>
        <SettingTable
          gridData={this.state.gridData}
          loading={this.state.loading}
          reloadData={() => this.reloadData()}
        />

        {this.state.showModal && (
          <SaveSettingModal
            modalopen={this.state.showModal}
            isEditMode={false}
            categoryData={(categories_data) =>
              this.categoryData(categories_data)
            }
            onClose={() =>
              this.setState({ showModal: false })
            }
            reloadData={() => this.reloadData()}
          />
        )}
      </>
    );
  }
}

export default SettingDetails;
