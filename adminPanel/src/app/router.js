import React, { Component, Suspense, lazy } from "react";
import { BrowserRouter, Switch, HashRouter } from "react-router-dom";
import Spinner from "../components/spinner/spinner";
import history from "./history";
import _EventEmitter from "../constants/emitter";
import { routes } from "../layouts/components/sidebar/sidemenu/sidemenu";

import MainLayoutRoutes from "../layouts/routes/mainRoutes";
import FullPageLayout from "../layouts/routes/fullpageRoutes";
import ErrorLayoutRoute from "../layouts/routes/errorRoutes";
import { localStorageService } from '../services/LocalStorageService';

const LazyEcommerceDashboard = lazy(() =>
  import("../views/dashboard/ecommerceDashboard")
);
const LazyUsers = lazy(() => import("../views/users/users"));

const LazyRoles = lazy(() => import("../views/Roles management/RolesDetails"));
const LazySaveRole = lazy(() => import("../views/roles/saverole"));

const LazyForgotPassword = lazy(() => import("../views/users/forgotPassword"));
const LazyResetPassword = lazy(() => import("../views/users/resetPassword"));
const LazyLogin = lazy(() => import("../views/pages/login"));
const LazyLockScreen = lazy(() => import("../views/pages/lockScreen"));
const LazyErrorPage = lazy(() => import("../views/pages/error"));
const OrganizationsDetails = lazy(() => import("../views/organizations/OrganizationsDetails"));
const Categories = lazy(() => import("../views/Categories/Categories"));
const NewsPaperDetails = lazy(() => import("../views/NewsPaper/NewsPaperDetails"));
const Cities = lazy(() => import("../views/CityManagement/Cities"));
const FAQs = lazy(() => import("../views/FAQs/FAQs"));
const Tender = lazy(() => import("../views/Tender/Tender"));
const SubscriptionsDetails = lazy(() => import("../views/Subscriptions/SubscriptionsDetails"));
const Settings = lazy(() => import("../views/Settings/Settings"));


class Router extends Component {
  _userData = localStorageService.getPersistedData("USER_DETAILS")

  constructor(props) {
    super(props);

    this.state = {
      userData: this._userData,
      InvoicesPermission: '',
      CustomersPermission: "",
      DMCCReportPermission: "",
      ResellerReportPermission: "",
      ReportsPermission: "",
      RolesPermission: '',
      UsersPermission: "",
      InterfacesPermission: "",
      CompaniesPermission: "",
      GenralJournal: "",
      StatementofAccount: "",
      TrialBalance: "",
      Ledger: "",
      CustomerSummary: ""
    };
    _EventEmitter.on("onLoginSuccess", this.onLogin)
    _EventEmitter.on("onLogOut", this.onLogout)

  }

  componentDidMount = async () => {

    let _userData = localStorageService.getPersistedData("USER_DETAILS")
  }


  onLogin = () => {
    var res = localStorageService.getPersistedData("USER_DETAILS")
    this.setState({
      userData: res
    })

    window.location.href = "/"
  };

  onLogout = () => {
    localStorage.clear()
    window.location.href = "/"
  }


  render() {
    if (this.state.userData == null) {

      return (
        <HashRouter basename="/">
          <Switch>
            <FullPageLayout
              exact
              path="/"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <LazyLogin {...matchprops} />
                </Suspense>
              )}
            />

            <FullPageLayout
              exact
              path="/login"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <LazyLogin {...matchprops} />
                </Suspense>
              )}
            />

            <FullPageLayout
              exact
              path="/forgot-password"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <LazyForgotPassword {...matchprops} />
                </Suspense>
              )}
            />
            <FullPageLayout
              exact
              path="/reset-password/:forgotlink"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <LazyResetPassword {...matchprops} />
                </Suspense>
              )}
            />

            <FullPageLayout
              exact
              path="*"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <LazyLogin {...matchprops} />
                </Suspense>
              )}
            />
          </Switch>
        </HashRouter>
      );
    }
    else {

      return (
        <HashRouter basename="/">
          <Switch>
            <MainLayoutRoutes
              exact
              path="/dashboard"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <LazyEcommerceDashboard  {...matchprops} />
                </Suspense>
              )}
            />
            <MainLayoutRoutes
              exact
              path="/login"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <LazyLogin {...matchprops} />
                </Suspense>
              )}
            />
            <MainLayoutRoutes
              exact
              path="/"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <LazyEcommerceDashboard {...matchprops} />
                </Suspense>
              )}
            />
            <MainLayoutRoutes
              exact
              path="/users"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <LazyUsers {...matchprops} />
                </Suspense>
              )}
            />
            <MainLayoutRoutes
              exact
              path="/OrganizationsDetails"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <OrganizationsDetails {...matchprops} />
                </Suspense>
              )}
            />
            <MainLayoutRoutes
              exact
              path="/Categories"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <Categories {...matchprops} />
                </Suspense>
              )}
            />

            <MainLayoutRoutes
              exact
              path="/NewsPaperDetails"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <NewsPaperDetails {...matchprops} />
                </Suspense>
              )}
            />
            <MainLayoutRoutes
              exact
              path="/Cities"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <Cities {...matchprops} />
                </Suspense>
              )}
            />
            <MainLayoutRoutes
              exact
              path="/FAQs"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <FAQs {...matchprops} />
                </Suspense>
              )}
            />

            <MainLayoutRoutes
              exact
              path="/Settings"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <Settings {...matchprops} />
                </Suspense>
              )}
            />
            <MainLayoutRoutes
              exact
              path="/Tender"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <Tender {...matchprops} />
                </Suspense>
              )}
            />

            <MainLayoutRoutes
              exact
              path="/SubscriptionsDetails"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <SubscriptionsDetails {...matchprops} />
                </Suspense>
              )}
            />



            <MainLayoutRoutes
              exact
              path="/users"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <LazyUsers {...matchprops} />
                </Suspense>
              )}
            />


            <MainLayoutRoutes
              exact
              path="/roles"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <LazyRoles {...matchprops} />
                </Suspense>
              )}
            />

            <MainLayoutRoutes
              exact
              path="/save-role"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <LazySaveRole {...matchprops} />
                </Suspense>
              )}
            />


            <FullPageLayout
              exact
              path="/pages/forgot-password"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <LazyForgotPassword {...matchprops} />
                </Suspense>
              )}
            />
            <FullPageLayout
              exact
              path="/pages/reset-password/:forgotlink"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <LazyResetPassword {...matchprops} />
                </Suspense>
              )}
            />

            <FullPageLayout
              exact
              path="/pages/login"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <LazyLogin {...matchprops} onSuccess={this.onLogin} />
                </Suspense>
              )}
            />

            <FullPageLayout
              exact
              path="/pages/lockscreen"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <LazyLockScreen {...matchprops} />
                </Suspense>
              )}
            />



            <ErrorLayoutRoute
              exact
              path="/pages/error"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <LazyErrorPage {...matchprops} />
                </Suspense>
              )}
            />
            <MainLayoutRoutes
              exact
              path="*"
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <LazyEcommerceDashboard  {...matchprops} />
                </Suspense>
              )}
            />
            <ErrorLayoutRoute
              render={(matchprops) => (
                <Suspense fallback={<Spinner />}>
                  <LazyErrorPage {...matchprops} />
                </Suspense>
              )}
            />
          </Switch>
        </HashRouter>
      );
    }
  }
}
export default Router;
