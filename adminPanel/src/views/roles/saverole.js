import React, { Component, Fragment } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FormGroup, Input } from "reactstrap";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import Toast from "../alert/Toast"
import { withRouter } from "react-router";
import { Dropdown } from "primereact/dropdown";
import { PickList } from 'primereact/picklist';
import { billingApiServices } from "../../services/BillingApiService";
import { localStorageService } from "../../services/LocalStorageService";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an interface from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8;

const getInterfaceStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the Interfaces look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  color: "white",
  textTransform: "capitalize",

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
  position: "relative",
  float: "left",
  margin: "27px",
});

class SaveRole extends Component {
  constructor(props) {
    super(props);

    var url = window.location.host.split(":")[0];
    var baseurl = window.location.protocol + "//" + url;
    this.state = {
      interfaces: [],
      companies: [],
      companyid: "",
      role: "",
      snackBarMsg: '',
      openSnackBar: '',
      severity: '',
      baseurl: baseurl,
      selected: [],
      source: [],
      target: [],
      RolesData: []
    };
  }

  componentDidMount = async () => {

    var roleid = "";
    var type = "";
    var companyid = "";
    if (this.props.location.state != null) {
      roleid = this.props.location.state.roleid;
      type = this.props.location.state.role;
      companyid = this.props.location.state.companyid;
      this.setState({ role: type, companyid: companyid })
    }

    billingApiServices.getCompaniesDetails("companies")
      .then((companies_data) => {
        let data = companies_data != "0 results" ? companies_data : []
        this.setState({
          companies: data
        });
      });

    billingApiServices.getRolesDetails("companies")
      .then((roles_data) => {
        let data = roles_data != "0 results" ? roles_data : []
        this.setState({
          RolesData: data
        });
      });


    if (roleid != "") {

      await billingApiServices.getInterfacesDetails(
        'interfaces'
      ).then((interfaces) => {
        this.setState({
          source: interfaces
        });
      });

      await billingApiServices
        .getSelectedInterfaces(
          companyid,
          type,
          roleid
        ).then((selected_interfaces) => {
          this.setState({
            target: selected_interfaces
          });
        });
      this.getFilteredInterfces()

    }

    // calling helper function to get selected values
    billingApiServices.getRoleData(roleid)
      .then((role_data) => {
        this.setState({
          companyid: role_data.companyid,
        });
        this.setState({
          role: role_data.role,
        });
      });



  }

  // get interfaces
  getInterfaces = async (type) => {

    // calling helper function to get current Interfaces
    var interfaces_data = await billingApiServices.getInterfacesDetails(type)
    this.setState({
      interfaces: interfaces_data,
      source: interfaces_data
    });




  }

  onChange = (event) => {
    this.setState({ source: event.source, target: event.target })
  };

  itemTemplate = (item) => {

    return (
      <span className="font-bold">{item.systeminterface}</span>
    );
  };

  async getSelectedInterfaces(value, type) {

    var companyid = "";
    var role = "";
    var roleid = "";
    if (type == "company") {
      this.setState({ companyid: value });
      companyid = value;
      role = this.state.role;
    } else if (type == "role") {
      this.setState({ role: value });
      companyid = this.state.companyid;
      role = value;
    } else if (type != "") {
      roleid = type;
    }

    // if (type == "company" || type == "role") {

    //   this.getInterfaces(value);

    // }

    // var selected_interfaces = await billingApiServices
    //   .getSelectedInterfaces(
    //     companyid,
    //     role,
    //     roleid
    //   ).then((selected_interfaces) => {
    //     this.setState({
    //       target: selected_interfaces
    //     });
    //   });

    if (roleid !== 'undefined' && roleid !== '') {
      this.getFilteredInterfces();
    }

  }
  getFilteredInterfces() {
    // var third = this.state.source.filter(function (obj) {
    //   return !this.state.target.some(function (obj2) {
    //     return obj.systeminterface === obj2.systeminterface;
    //   });
    // });
    console.log(this.state.target)
    console.log(this.state.source, 'source')
    const arrayTwoIds = new Set(this.state.target.map((el) => el.systeminterface));
    const arrayOneFiltered = this.state.source.filter((el) => !arrayTwoIds.has(el.systeminterface));
    this.setState({ source: arrayOneFiltered })
  }


  isRoleExist = () => {
    const { role } = this.state;
    const action = this.props.location.state.action;
    const company = this.props.location.state.company;
    const roleExists = this.state.RolesData.some((roles) => roles.title === role);

    if (action === 'insert' && roleExists) {
      this.setState({
        openSnackBar: true,
        severity: "error",
        snackBarMsg: "Role name already exists"
      });
      return true;
    }

    if (this.state.companyid == '' || this.state.companyid == undefined || this.state.companyid == null) {
      this.setState({
        openSnackBar: true,
        severity: "error",
        snackBarMsg: "Please select a company"
      });
      return true;
    }

    if (role == '' || role == undefined || role == null) {
      this.setState({
        openSnackBar: true,
        severity: "error",
        snackBarMsg: "Role cannot be empty"
      });
      return true;
    }


    if (action === 'edit' && role !== this.props.location.state.role) {
      if (roleExists) {
        this.setState({
          openSnackBar: true,
          severity: "error",
          snackBarMsg: "Role name already exists"
        });
        return true;
      }
    }
  }

  saveRole = async () => {
    let roleExist = this.isRoleExist();
    if (roleExist == true) {
      return
    }

    if (this.state.companyid != "" && this.state.role != "" && this.props.location.state.action != '' && this.state.target != '') {
      // calling helper function to get current Interfaces
      billingApiServices
        .saveRole(
          this.state.companyid,
          this.state.role,
          this.state.target,
          this.props.location.state.roleid,
          this.props.location.state.action
        ).then((response) => {
          let msg
          if (this.props.location.state.action == 'edit') {
            msg = "Role updated successfully"
          } else {
            msg = "Role created successfully"
          }
          if (response === 1) {
            this.setState({
              snackBarMsg: msg,
              severity: "success",
              openSnackBar: true
            }, () => {

            });
          }
        });
      setTimeout(() => {
        this.setState({ openSnackBar: false })
        const { history } = this.props;
        history.push('/roles');
      }, 3000);
    } else {
      console.log('else response')
      this.setState({
        snackBarMsg: "Please select atleast one interface",
        severity: "error",
        openSnackBar: true,
      });
    }
  }

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */
  id2List = {
    droppable: "interfaces",
    droppable2: "selected",
  };

  getList = (id) => this.state[this.id2List[id]];

  onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const interfaces = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      let state = { interfaces };

      if (source.droppableId === "droppable2") {
        state = { selected: interfaces };
      }

      this.setState(state);
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      this.setState({
        interfaces: result.droppable,
        selected: result.droppable2,
      });
    }
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    {
      //console.log("interfaces", this.state.interfaces);
    }
    return (
      <Fragment>
        <div className="account-application">
          <div className="content-overlay" />
          <div className="account-content row">
            <div className="account-content-area w-100 bg-white">
              <div className="app-list-mails p-0">
                <div className="account-actions p-0 bg-white">

                  <div className="stage stage-1">
                    <div className="row m-0 px-2">
                      <div className="displyflex mr-2 py-2">
                        <div className="flex-item">
                          <span className="label">Company</span>
                          <Dropdown
                            value={this.state.companyid}
                            options={this.state.companies}
                            onChange={(e) => this.getSelectedInterfaces(e.value, 'company')}
                            // onFocus={() => this.setState({ DesignationError: '' })}
                            optionLabel="name"
                            optionValue="id"
                            // className="input-field lang-dropdown"
                            filter
                            filterBy="name"
                            filterPlaceholder="Search"
                            className="saved-role-input"
                          />
                        </div>
                        <div className="flex-item">
                          <span className="label">Role</span>
                          <Input
                            type="text"
                            name="role"

                            className="role-input-field"
                            value={this.state.role}
                            onChange={(e) =>
                              this.getSelectedInterfaces(
                                e.target.value,
                                "role"
                              )
                            }
                          ></Input>

                          <button
                            className="blue-btn"
                            onClick={() => this.saveRole()}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                  <Toast open={this.state.openSnackBar}
                    severity={this.state.severity}
                    handleClose={() => this.setState({ OpenSnackBar: false })}
                    message={this.state.responseMsg} />

                  <div className="stage-2" style={{ float: "left", width: "100%" }}>
                    <PickList className="hi" source={this.state.source}
                      target={this.state.target} onChange={this.onChange}
                      itemTemplate={this.itemTemplate} breakpoint="1400px"
                      sourceStyle={{ height: '30rem' }} targetStyle={{ height: '30rem' }}
                      sourceFilterPlaceholder="Search with Interface" filter
                      targetFilterPlaceholder="Search with Interface" filterBy='systeminterface'
                      sourceHeader="Available Interfaces" targetHeader="Selected Interfaces"
                    />
                    <Toast open={this.state.openSnackBar}
                      severity={this.state.severity}
                      handleClose={() => this.setState({ openSnackBar: false })}
                      message={this.state.snackBarMsg} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment >
    );
  }
}

export default SaveRole;