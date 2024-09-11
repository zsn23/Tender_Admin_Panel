import React, { Component, Fragment } from "react";
import Modal from "react-modal";
import TenderTable from "./TenderTable";
import SaveTenderModal from "./SaveTenderModal";
import { billingApiServices } from '../../services/BillingApiService';
import _EventEmitter from "../../constants/emitter";

import "./Tender.css";


class TenderDetails extends Component {
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
      OrganizationDetails: [],
      OrganizationLoader: false,
      CategoryDetails: [],
      CategoryLoader: false,
      newsPaperDetails: [],
      newsPaperLoader: false,
      cityLoader: false,
      cityDetails: [],
      dataForEdit: null,
      isEditMode: false
    };

    // _EventEmitter.on("reloadCategories", this.reloadCategories);
    // _EventEmitter.on("reloadOrganizations", this.reloadOrganizations);
  }


  getOrganizationsDetails = () => {
    this.setState({ OrganizationLoader: true })
    billingApiServices
      .getOrganizationsDetails()
      .then((response) => {
        this.setState({ OrganizationDetails: response?.data?.data, OrganizationLoader: false });
      });
  }


  getCategoryDetails = () => {
    this.setState({ CategoryLoader: true })
    billingApiServices
      .getCategoriesDetails()
      .then((response) => {
        this.setState({ CategoryDetails: response?.data?.data, CategoryLoader: false });
      });
  }

  getCityDetails = () => {
    this.setState({ cityLoader: true })
    billingApiServices
      .getAllCities()
      .then((response) => {
        this.setState({ cityDetails: response?.data?.data, cityLoader: false });
      });
  }

  getNewsPaperDetails = () => {
    this.setState({ newsPaperLoader: true })
    billingApiServices
      .getNewsPaperDetails()
      .then((response) => {
        this.setState({ newsPaperDetails: response?.data?.data, newsPaperLoader: false });
      });
  }

  getTenderDetails() {
    billingApiServices
      .getAllTenders()
      .then((response) => {

        if (response?.data?.data?.length > 0) {
          var sortedArray = response?.data?.data.sort((a, b) => b.id - a.id);

          this.setState({ gridData:sortedArray , loading: false });
        }
        else {
          alert("Data not found")
        }
      });
  }

  componentDidMount() {
    this.getTenderDetails();
    this.getNewsPaperDetails()
    this.getCityDetails()
    this.getOrganizationsDetails()
    this.getCategoryDetails()
  }

  editTender = (data) => {
    this.setState({ dataForEdit: data, isEditMode: true })
    this.setState({ showModal: true })
  }

  reloadData = () => {
    this.setState({ loading: true })
    this.getTenderDetails();
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
        <div style={{ textAlign: "end", marginTop: '5px'  }}>
          <button id="new-report" className="btn-style  p-1"
            onClick={() => this.setState({ showModal: true, dataForEdit: null, isEditMode: false })} > Add New
          </button>
        </div>
        {!this.state.showModal && <TenderTable
          gridData={this.state.gridData}
          loading={this.state.loading}
          reloadData={() => this.reloadData()}
          editTender={(data) => this.editTender(data)}
        />}

        {this.state.showModal && (
          <SaveTenderModal
            gridData={this.state.gridData}
            modalopen={this.state.showModal}
            OrganizationDetails={this.state.OrganizationDetails}
            OrganizationLoader={this.state.OrganizationLoader}
            CategoryDetails={this.state.CategoryDetails}
            CategoryLoader={this.state.CategoryLoader}
            cityLoader={this.state.cityLoader}
            cityDetails={this.state.cityDetails}
            newsPaperDetails={this.state.newsPaperDetails}
            newsPaperLoader={this.state.newsPaperLoader}
            isEditMode={this.state.isEditMode}
            dataForEdit={this.state.dataForEdit}
            categoryData={(categories_data) =>
              this.categoryData(categories_data)
            }
            onClose={() =>
              this.setState({ showModal: false })
            }
            reloadData={() => this.reloadData()}
            reloadOrganizations={() => this.getOrganizationsDetails()}
            reloadCategories={() => this.getCategoryDetails()}
          />
        )}
      </>
    );
  }
}

export default TenderDetails;
