// import external modules
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Form,
  Media,
  Collapse,
  Navbar,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  // Moon,
  Mail,
  Menu,
  MoreVertical,
  Check,
  Bell,
  User,
  AlertTriangle,
  Inbox,
  Phone,
  Calendar,
  Lock,
  X,
  LogOut,
  Settings,
} from "react-feather";
import { localStorageService } from "./../../../services/LocalStorageService"
// import userImage from "../../../assets/img/logos/logo-big-black.png";
import { utils } from "../../../utility/index";
import _EventEmitter from "./../../../constants/emitter"
import Toast from "../../../views/alert/Toast"


class ThemeNavbar extends Component {
  _userData = localStorageService.getPersistedData("USER_DETAILS")
  InternetDisconnectionInterval = 0;
  checkUpdateInterval = 0;

  constructor(props) {
    super(props);

    this.state = {
      isOpen: true,
      isThemeOpen: this.props.customizerState,
      userData: this._userData,
      InternetDisconnectedTime: null,
      openSnackBar: false,
      severity: "",
      responseMsg: "",
    };

    _EventEmitter.on('openToast', this.openSnackBar)

  }

  componentDidMount = () => {

    window.addEventListener('visibilitychange', e => {
      this.onAppVisibilityChange(e)
    })

    window.addEventListener('storage', e => {
      var userData = JSON.parse(localStorage.getItem("USER_DETAILS"));
      if (userData == null || userData == undefined) {
        this.userLogout("LogId is Not Alive.");
      }
    });
  }

  onAppVisibilityChange = (e) => {

    if (document.visibilityState == "visible") {
      clearInterval(this.InternetDisconnectionInterval);
    }
    else {
      this.InternetDisconnectionInterval = setInterval(this.ForceFullyLogout, 2000);
      this.setState({ InternetDisconnectedTime: new Date()?.getMinutes() })
    }
  }

  ForceFullyLogout = () => {  
  }

 

  toggle = () => {
    this.setState({ showUpdateModal: false })
    window.location.reload();
  }


  handleClick = (e) => {
    this.props.toggleSidebarMenu("open");
  };

  isThemeOpen = () => {
    _EventEmitter.emit("handleCustomizer", "");
  };

  userLogout = () => {
    _EventEmitter.emit("onLogOut", "")
  }

  openSnackBar = (value) => {
    let msg = value.split(":")
    this.setState({
      severity: msg[1],
      openSnackBar: true,
      responseMsg: msg[0]
    })
    setTimeout(() => {
      this.setState({ openSnackBar: false })
    }, 3000);
  }


  getHeading = () => {
    let route = window.location.hash.split("/")

    if (route.length != 0) {
      let routeName = route[route.length - 1].replace(/[^A-Za-z]/g, '');
      let _userData = localStorageService.getPersistedData("USER_DETAILS")
    

      if (routeName === "") {
        return "Dashboard"
      }     
      else if (routeName === "users") {
        return "Users"
      }      
      else if (routeName === "roles") {
        return "Roles"
      }   
      else {
        return routeName
      }
    }
  };

  handleLeftSideBar = () => {
    _EventEmitter.emit("handleLeftSideBar", "")
  }
  handleToggleBar = () => {
    console.log('we are here')
    let isOpen = !this.state.isOpen
    this.setState({ isOpen: isOpen })
  }
  render() {
    return (
      <div>
        <Navbar className="navbar navbar-expand-lg bg-navbar justify-content-center">
          <div className="container-fluid " style={{paddingBottom:"6px"}}>
            <h5 className="page-hd p-3 text-light">{this.getHeading()}</h5>


            <div className="navbar-container align-items-center">
              <Menu
                size={14}
                className="navbar-toggle d-lg-none float-left"
                onClick={() => this.handleLeftSideBar()}
                data-toggle="collapse"
              />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto float-right" navbar>


                  <UncontrolledDropdown nav inNavbar className="pr-1">
                    <DropdownToggle nav>
                      <span className="fw-bold userName p-3 px-0" style={{color:'#fff' }}>
                      {/* <i class="fa fa-user mx-1 " style={{color:'#fff' }}></i> */}
                      {/* <i className="fa fa-user-edit mx-1" style={{ color: '#fff' }}></i> */}
                      <i className="bi bi-person-fill mx-1" style={{ color: '#fff', fontSize: '20px' }}></i>

                        {this.state?.userData?.name?.charAt(0)?.toUpperCase() +  this.state?.userData?.name?.slice(1)}
                        <span className="text-muted "></span>
                        
                      </span>{" "}
                      {/* <img
                        src={userImage}
                        alt="logged-in-user"
                        className="rounded-circle"
                      /> */}
                    </DropdownToggle>

                    <DropdownMenu right>


                      <DropdownItem
                      >
                        <User size={16} className="mr-1" /> 
                        {this.state.userData!=null && this.state.userData?.name?.toUpperCase()}
                      </DropdownItem>

                      <DropdownItem divider />

                      <DropdownItem>
                        <span
                          className="customizer-toggle"
                          id="customizer-toggle-icon"
                          onClick={() => this.isThemeOpen()}
                        >
                          <Settings size={16} className="spinner mr-1" />Dark Theme
                          
                        </span>
                      </DropdownItem>

                      <DropdownItem
                        onClick={() => {
                          this.userLogout();
                        }}
                      >
                        <LogOut size={16} className="mr-1" /> Logout
                      </DropdownItem>

                    </DropdownMenu>

                  </UncontrolledDropdown>
                </Nav>
              </Collapse>
            </div>
          </div>
        </Navbar>

        <Toast open={this.state.openSnackBar}
          severity={this.state.severity}
          handleClose={() => this.setState({ OpenSnackBar: false })}
          message={this.state.responseMsg} />

        <Modal isOpen={this.state.showUpdateModal} centered>
          <ModalHeader className="modal-header" >New Updates Available!</ModalHeader>
          <ModalBody className="modal-body">
            Please refresh the page to see the latest updates.
          </ModalBody>
          <ModalFooter className="modal-footer">
            <button className="btn-primary" onClick={this.toggle}>Refresh</button>{' '}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default ThemeNavbar;
