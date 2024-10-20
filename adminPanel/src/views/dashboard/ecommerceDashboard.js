import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./EDashboard.css";
import { routes as SideMenuRoutes } from "../../layouts/components/sidebar/sidemenu/sidemenu";
import * as _ from "lodash";
import { InputText } from "primereact/inputtext";
import { localStorageService } from '../../services/LocalStorageService';
import MonthlyReport from "./MonthlyReport";
import { billingApiServices } from "./../../services/BillingApiService";

class EcommerceDashboard extends Component {
   _userData = localStorageService.getPersistedData("USER_DETAILS")

   constructor(props) {
      super(props);

      this.state = {
         modulesSearch: "",
         permittedRoutes: [],
         userData: this._userData,
         Catgeories: [],
         Organizations: [],
         Tenders: [],
         Subscriptions: []
      };
   }

   componentDidMount() {

      // var routes = this.getUserPermittedRoutes();
      // this.setState({ permittedRoutes: routes });
      this.getTenderDetails()
      this.getCatgeoriesDetails()
      this.getOrganizationsDetails()
      this.getSubscriptionDetails()
   }

   getSubscriptionDetails() {
      billingApiServices
         .getSubscriptions()
         .then((response) => {
            this.setState({ Subscriptions: response?.data?.data });
         });
   }

 
   getTenderDetails() {
      billingApiServices
         .getAllTenders()
         .then((response) => {
            this.setState({
               Tenders: response?.data?.total, // this is still the paginated data
               // totalTenders: response?.data?.total 
            });
         });
   }
   
   getOrganizationsDetails() {
      billingApiServices
         .getOrganizationsDetails()
         .then((response) => {

            this.setState({ Organizations: response?.data?.data });
         });
   }

   getCatgeoriesDetails() {
      billingApiServices
         .getCategoriesDetails()
         .then((response) => {

            this.setState({ Catgeories: response?.data?.data, });
         });
   }

   getUserPermittedRoutes = () => {
      let routesList = SideMenuRoutes.filter(x => ((x.showInMenu && this.state.userData.interfaces.some((item) => item.interfaceName.toLowerCase() == x.interfaceName.toLowerCase()))))
      if (routesList.length > 0) {
         return routesList
      }
      else {
         return []
      }
   };



   filterModules = (value) => {
      this.setState({ modulesSearch: value });
      if (value?.toString() !== "") {
         var res = this.getUserPermittedRoutes()?.filter((x) => x.heading?.toLowerCase().includes(value?.toLowerCase()));
         this.setState({ permittedRoutes: res });
      } else {
         var routes = this.getUserPermittedRoutes();
         this.setState({ permittedRoutes: routes });
      }
   };


   applyclassNamees = () => {
      return "search-div";
   };

   render() {
      return (
         <>
            <div>
               <div className="container-fluid container-fluid_bg mb-3 mt-0 p-3">
                  <h1 className="dashboardHeading d-flex justify-content-center m-5 mt-1">DASHBOARD</h1>
                  {/* <TreeTable/> */}
                  <div className="row ">
                     <div className="col-12 d-flex justify-content-around flex-wrap">

                        <div className="dashboard-chat-box" style={{  cursor: "pointer" }}>
                            <Link className="text-decoration-none"  to={"/SubscriptionsDetails"} >

                              <div className="img-box " >
                                 <i className="fa-regular fa-user-plus icon_color" ></i>
                              </div>
                              
                              <h1>{this.state.Subscriptions?.length}</h1>
                              <p>View all Subscribers</p>
                           </Link>
                        </div>



                        <div className="dashboard-chat-box" >
                            <Link className="text-decoration-none" to={"/Tender"} >
                              <div className="img-box" >
                                 <i className="fa-sharp fa-solid fa-t icon_color" ></i>
                              </div>
                              
                              <h1>{this.state.Tenders}</h1>
                              <p>View All Tenders detail</p>
                           </Link>
                        </div>

                        <div className="dashboard-chat-box second-lastbox" >
                         <Link className="text-decoration-none" to={"/Categories"} >
                           <div className="img-box" >
                              <i className="fa-sharp fa-light fa-layer-group icon_color" ></i>
                           </div>
                           <h1>{this.state.Catgeories?.length}</h1>
                           <p>View All Categories</p>
                           </Link>
                        </div>

                        <div className="dashboard-chat-box second-lastbox" >
                         <Link className="text-decoration-none" to={"/OrganizationsDetails"} > 

                           <div className="img-box ">
                              <i className="fa-sharp fa-regular fa-server icon_color" ></i>
                           </div>
                           <h1>{this.state.Organizations?.length}</h1>
                           <p>View All Organizations</p>
                           </Link>
                        </div>
                     </div>
                  </div>



               </div>
               <div className="dashboard-container">
                  <MonthlyReport />
               </div>

            </div>
         </>
      );
   }
}

export default EcommerceDashboard;
