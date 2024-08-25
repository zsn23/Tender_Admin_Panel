import React, { Component, Fragment } from "react";
import Modal from "react-modal";
import CityTable from "./CityTable";
import SaveCityModal from "./SaveCityModal";
import { billingApiServices } from '../../services/BillingApiService';


class CityDetails extends Component {
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

  getCityDetails() {
    billingApiServices
      .getAllCities()
      .then((response) => {

        this.setState({ gridData: response?.data?.data, loading: false });
      });
  }

  componentDidMount() {
    this.getCityDetails();
  }


  reloadData = () => {
    this.setState({ loading: true })
    this.getCityDetails();
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
        <CityTable
          gridData={this.state.gridData}
          loading={this.state.loading}
          reloadData={() => this.reloadData()}
        />

        {this.state.showModal && (
          <SaveCityModal
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

export default CityDetails;
