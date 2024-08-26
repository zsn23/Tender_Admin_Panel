import React, { Component, lazy, Suspense } from "react";
import {
  Home,
  Server,
  Layers,
  DollarSign,
  UserCheck,
  FileText,
  Trello,
  FilePlus,
  Map ,
  HelpCircle

} from "react-feather";
import { NavLink } from "react-router-dom";
import "../../../../assets/scss/components/sidebar/sidemenu/sidemenu.scss";
import SideMenu from "../sidemenuHelper";
import * as _ from "lodash";
import { localStorageService } from '../../../../services/LocalStorageService';
import _EventEmitter from "../../../../constants/emitter";

const LazyEcommerceDashboard = lazy(() =>
  import("../../../../views/dashboard/ecommerceDashboard")
);

const LazyUsers = lazy(() => import("../../../../views/users/users"));
const LazyRoles = lazy(() => import("../../../../views/Roles management/RolesDetails"));
const OrganizationsDetails = lazy(() => import("../../../../views/organizations/OrganizationsDetails"));
const Categories = lazy(() => import("../../../../views/Categories/Categories"));
const NewsPaperDetails = lazy(() => import("../../../../views/NewsPaper/NewsPaperDetails"));
const Cities = lazy(() => import("../../../../views/CityManagement/Cities"));
const FAQs = lazy(() => import("../../../../views/FAQs/FAQs"));
const Tender = lazy(() => import("../../../../views/Tender/Tender"));
const SubscriptionsDetails = lazy(() => import("../../../../views/Subscriptions/SubscriptionsDetails"));
const Settings = lazy(() => import("../../../../views/Settings/Settings"));

export const routes = [
  {
    title: "Dashboard",
    path: "/dashboard",
    image: null,
    icon: <  Home      size={18} />,
    interfaceName: "",
    component: LazyEcommerceDashboard,
    componentProps: {},
    showInMenu: true,
    backgroundColor: "",
    color: "",
    dashboardIcon: "",
    heading: "Dashboard",
    content: "Dashboard ",
  }, 
  {
    title: "Tender",
    path: "/Tender",
    image: null,
    icon: <FilePlus size={18} />,
    interfaceName: "",
    component: Tender,
    componentProps: {},
    showInMenu: true,
    backgroundColor: "rgb(234, 247, 236)",
    // color: "rgb(70, 167, 82)",
    dashboardIcon: "fa-light fa-sack-dollar",
    heading: "FAQs",
    content: "See and manage Tenders",
  },
   {
    title: "Subscription",
    path: "/SubscriptionsDetails",
    image: null,
    icon: <DollarSign size={18} />,
    interfaceName: "Subscription",
    component: SubscriptionsDetails,
    componentProps: {},
    showInMenu: true,
    backgroundColor: "rgb(238, 238, 252)",
    color: "rgb(105, 97, 223)",
    dashboardIcon: "fa-light fa-eye",
    heading: "Roles",
    content: "View and manage your All Subscriptions in one place",
  },
  {
    title: "Organization",
    path: "/OrganizationsDetails",
    image: null,
    icon: <Layers size={18} />,
    interfaceName: "",
    component: OrganizationsDetails,
    componentProps: {},
    showInMenu: true,
    backgroundColor: "rgb(244, 247, 235)",
    color: "rgb(147, 172, 68)",
    dashboardIcon: "fa-light fa-building",
    heading: "Organization",
    content: "View and manage all added Organization",
  },
  {
    title: "Categories",
    path: "/Categories",
    image: null,
    icon: <Trello size={18} />,
    interfaceName: "",
    component: Categories,
    componentProps: {},
    showInMenu: true,
    backgroundColor: "rgb(244, 247, 235)",
    color: "rgb(147, 172, 68)",
    dashboardIcon: "fa-light fa-building",
    heading: "Categories",
    content: "View and manage all added Categories",
  },
  {
    title: "News Paper",
    path: "/NewsPaperDetails",
    image: null,
    // icon: <i className="fa-light fa-bar-chart" />,
    icon: <FileText size={18} />,

    interfaceName: "",
    component: NewsPaperDetails,
    componentProps: {},
    showInMenu: true,
    backgroundColor: "rgb(244, 247, 235)",
    color: "rgb(147, 172, 68)",
    dashboardIcon: "fa-light fa-building",
    heading: "News Paper",
    content: "View and manage all added News Papers",
  },
  {
    title: "Cities",
    path: "/Cities",
    image: null,
    // icon: <i className="fa-light fa-scale-balanced" />,
    icon: <Map size={18} />,
    interfaceName: "",
    component: Cities,
    componentProps: {},
    showInMenu: true,
    backgroundColor: "rgb(234, 247, 236)",
    color: "rgb(70, 167, 82)",
    dashboardIcon: "fa-light fa-scale-balanced",
    heading: "Cities",
    content: "View and manage all Cities",
  },
  {
    title: "FAQ`s",
    path: "/FAQs",
    image: null,
    // icon: <i class="fa-light fa-memo-circle-check" />,
    icon: <HelpCircle size={18} />,
    interfaceName: "",
    component: FAQs,
    componentProps: {},
    showInMenu: true,
    backgroundColor: "rgb(234, 247, 236)",
    color: "rgb(70, 167, 82)",
    dashboardIcon: "fa-light fa-sack-dollar",
    heading: "FAQs",
    content: "See and manage FAQs",
  },
  {
    title: "Users",
    path: "/users",
    image: null,
    icon: <UserCheck size={18} />,
    interfaceName: "Users",
    component: LazyUsers,
    componentProps: {},
    showInMenu: true,
    backgroundColor: "rgb(234, 247, 236)",
    color: "rgb(70, 167, 82)",
    dashboardIcon: "fa-light fa-user-check",
    heading: "Users",
    content: "See all Users which are added",
  },
  {
    title: "Settings",
    path: "/Settings",
    image: null,
    // icon: <i className="fa-light fa-memo-circle-check blackOnFocus" />,
    icon: <Server size={18} />,
    interfaceName: "",
    component: Settings,
    componentProps: {},
    showInMenu: true,
    backgroundColor: "rgb(234, 247, 236)",
    // color: "black !important",
    // dashboardIcon: "fa-light fa-sack-dollar",
    heading: "Settings",
    content: "See and manage Settings",
  }
 
]
class SideMenuContent extends Component {
  _userData = localStorageService.getPersistedData("USER_DETAILS");

  constructor(props) {
    super(props);

    this.state = {
      userData: null,
    };

    _EventEmitter.on("onLoginSuccess", this.onLogin);
  }

  componentDidMount() {
    this.setState({
      userData: this._userData,
    });
  }

  onLogin = () => {
    var res = localStorageService.getPersistedData("USER_DETAILS");
    this.setState({
      userData: res,
    });
  };

  getUserPermittedRoutes = () => {
    let routesList = routes;
    if (routesList.length > 0) {
      return routesList;
    } else {
      return [];
    }
  };

  renderSideMenuLinks = () => {
    if (this.state.userData == null) {
      return;
    }

    if (this.state.userData != null) {
      let permittedMenus = this.getUserPermittedRoutes();
      return permittedMenus.map((route) => {
        return (
          <SideMenu.MenuSingleItem key={route.path}>
            <NavLink
              title={route.title}
              to={route.path}
              onClick={this.props.onMenuItemClick}  // Collapse sidebar on click
            >
              {route.icon ? <i className="">{route.icon}</i> : ""}
              <span className="menu-item-text">{route.title}</span>
            </NavLink>
          </SideMenu.MenuSingleItem>
        );
      });
    }
  };

  render() {
    return (
      <SideMenu
        className="sidebar-content"
        toggleSidebarMenu={this.props.toggleSidebarMenu}
      >
        {this.renderSideMenuLinks()}
      </SideMenu>
    );
  }
}

export default SideMenuContent;