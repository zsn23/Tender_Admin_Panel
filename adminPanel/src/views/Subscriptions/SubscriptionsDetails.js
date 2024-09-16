// import React, { Component, Fragment } from "react";
// import Modal from "react-modal";
// import SubscriptionsTable from "./SubscriptionsTable";
// import SaveSubscriptionsModal from "./SaveSubscriptionsModal";
// import { billingApiServices } from "../../services/BillingApiService";
// import "./subscription.css";
// import moment from 'moment';

// class SubscriptionDetails extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       categorySearch: "",
//       showModal: false,
//       gridData: [],
//       interface: "",
//       loading: true,
//       activeTab: 1,
//       clearSearch: false,
//       CategoryDetails: [],
//       CategoryLoader: false,
//       DataForEdit: null,
//       tenders: [],
//     };
//   }

//   getSubscriptionDetails() {
//     billingApiServices.getSubscriptions().then((response) => {
//       this.setState({ gridData: response?.data?.data, loading: false });
//     });
//   }

//   getCategoryDetails = () => {
//     this.setState({ CategoryLoader: true });
//     billingApiServices.getCategoriesDetails().then((response) => {
//       this.setState({
//         CategoryDetails: response?.data?.data,
//         CategoryLoader: false,
//       });
//     });
//   };

//   async componentDidMount() {
//     this.getTenderDetails();
//     await this.getCategoryDetails();
//     this.getSubscriptionDetails();
//   }

//   getTenderDetails() {
//     billingApiServices.getAllTenders().then((response) => {
//       if (response?.data?.data?.length > 0) {
//         var sortedArray = response?.data?.data.sort((a, b) => b.id - a.id);

//         this.setState({ tenders: sortedArray, loading: false });


//       } else {
//         alert("Tender Data not found");
//       }
//     });
//   }

//   reloadData = () => {
//     this.setState({ loading: true });
//     this.getSubscriptionDetails();
//   };

//   getShowModal = (modal) => {
//     this.setState({ showModal: modal });
//   };

//   categoryData = (categories_data) => {
//     this.setState({
//       gridData: categories_data,
//     });
//   };

//   EditMode = (data) => {
//     this.setState({ dataForEdit: data });
//     this.setState({ showModal: true });
//   };

//   getTendeWithCategoryId = () => {
//     // Create a map of category titles to their IDs
//     const categoryMap = this.state.CategoryDetails?.reduce((map, category) => {
//       map[category.title] = category.id;
//       return map;
//     }, {});

//     // Function to convert comma-separated category titles to an array of IDs
//     const getCategoryIds = (categoryTitles) => {
//       if (categoryTitles == null) {
//         return [];
//       }

//       if (categoryTitles.includes(":")) {
//         return categoryTitles.split(":").map((title) => categoryMap[title]);
//       } else {
//         const categoryId = categoryMap[categoryTitles];
//         return categoryId ? [categoryId] : [];
//       }
//     };

//     // Map category titles in businesses array to their corresponding IDs
//     const businessesWithIds = this.state.tenders?.map((business) => ({
//       ...business,
//       categoryIds: getCategoryIds(business.category),
//     }));

//     return businessesWithIds;
//   };

//   SendEmail = async () => {
//     if (
//       this.state.CategoryDetails?.length > 0 &&
//       this.state.tenders?.length > 0 &&
//       this.state.gridData?.length > 0
//     ) {
//       const parseCategories = (categories) => {
//         if (categories == null || categories == "") {
//           return [];
//         }
//         return categories.split(",");
//       };

//       const isPreviousDay = (date) => {
//         const today = new Date();
//         const yesterday = new Date(today);
//         yesterday.setDate(today.getDate() - 1);
//         return (
//           date.getFullYear() === yesterday.getFullYear() &&
//           date.getMonth() === yesterday.getMonth() &&
//           date.getDate() === yesterday.getDate()
//         );
//       };

//       const generateSubscribeArray = () => {
//         const subscribeArray = [];

//         let activeUser = this.state.gridData?.filter((c) => c.status == 1);
//         if (activeUser?.length == 0) {
//           alert("Active users are not available");
//           return;
//         }

//         activeUser?.forEach((userSubscribe) => {
//           const subscribedCategories = parseCategories(
//             userSubscribe.categories
//           );
//           const filteredBusinesses = this.state.tenders.filter((business) =>
//             parseCategories(business.category)?.some((category) =>
//               subscribedCategories.includes(category)
//             )
//           );

//           const previousDayTnd = filteredBusinesses.filter((item) => {
//             const effectedDate = new Date(item.effectedDate);
//             return isPreviousDay(effectedDate);
//           });

//           if (previousDayTnd?.length > 0) {
//             let imgLinks = previousDayTnd?.map((item) => ({
//               img: item.tenderImage,
//               categories: item.category,
//               name: item.name,
//               newPaperName:item.newPaperName,
//               publishDate:moment(item.publishDate).format("YYYY-MM-DD")
//             }));
//             let emailTemplate = `
//           <html>
//           <head></head>
//           <body>
//               <h2>Today Tender List</h2>
//               <ul>
//                   ${imgLinks
//                     .map(
//                       (link) =>
//                         `<li>
//                           <p>Newspaper : ${link.newPaperName}</p>
//                           <p>Publish Date : ${link.publishDate}</p>
//                           <p>Tender Title : ${link.name} </p> 
//                           <p> Tender Image : </p>
//                           <a href="${link.img}" target="_blank"> ${link.img}</a>
//                         </li>`
//                     )
//                     .join("")}
//               </ul>

//           </body>
//           </html>
//       `;

//             subscribeArray.push({
//               userInfo: userSubscribe,
//               tenderInfo: emailTemplate,
//             });
//           }
//         });
//         return subscribeArray;
//       };

//       const result = await generateSubscribeArray();

//       if (result?.length > 0) {
//         const body = { dataForEmail: result };
//         console.log(body);
//         let response = await billingApiServices.sendEmail(body);
//         alert(response?.data?.message);
//       }
//     }
//   };






// getStyle = () => {
//   if (
//     this.state.CategoryDetails?.length > 0 &&
//     this.state.tenders?.length > 0 &&
//     this.state.gridData?.length > 0
//   ) {
//     return "btn-style p-2 d-flex align-items-center gap-1";
//   }
//   else{
//   return "btn-style disable-btn p-2 d-flex align-items-center gap-1" ;

//   }

// };

//   render() {
//     return (
//       <>
// <div className="d-flex justify-content-between " style={{  marginTop: "5px"  }}>

//           <div>
//           <button
//             id="new-report"
//             className="btn-style p-2 d-flex align-items-center gap-1"
//             onClick={() => this.setState({ showModal: true })}
//           >
//             {" "}
//             <i className="fa-regular fa-circle-plus" style={{fontSize:"22px"}}></i> Add New
//           </button>
//           </div>



//           <div>

//           <button
//             id="new-report"
//             className={this.getStyle()}
//             onClick={() => this.SendEmail()}
//           >
//            <i className="fa-regular fa-circle-envelope" style={{fontSize:"25px"}}></i> Send Email to Active users   
//           </button>

//           </div>

//         </div>
//         {!this.state.showModal && (
//           <SubscriptionsTable
//             gridData={this.state.gridData}
//             loading={this.state.loading}
//             reloadData={() => this.reloadData()}
//             CategoryDetails={this.state.CategoryDetails}
//             EditMode={(data) => this.EditMode(data)}
//           />
//         )}

//         {this.state.showModal && (
//           <SaveSubscriptionsModal
//             CategoryDetails={this.state.CategoryDetails}
//             CategoryLoader={this.state.CategoryLoader}
//             modalopen={this.state.showModal}
//             dataForEdit={this.state.dataForEdit}
//             categoryData={(categories_data) =>
//               this.categoryData(categories_data)
//             }
//             onClose={() =>
//               this.setState({ showModal: false, dataForEdit: null })
//             }
//             reloadData={() => this.reloadData()}
//           />
//         )}
//       </>
//     );
//   }
// }

// export default SubscriptionDetails;






import React, { Component } from "react";
import Modal from "react-modal";
import SubscriptionsTable from "./SubscriptionsTable";
import SaveSubscriptionsModal from "./SaveSubscriptionsModal";
import { billingApiServices } from "../../services/BillingApiService";
import "./subscription.css";
import moment from 'moment';
import Toast from "../alert/Toast";

class SubscriptionDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categorySearch: "",
      showModal: false,
      gridData: [],
      loading: true,
      CategoryDetails: [],
      CategoryLoader: false,
      DataForEdit: null,
      tenders: [],
      sendingEmail: false, // New state for tracking email sending
      emailSendingError: false, // New state for tracking errors
    };
  }

  async componentDidMount() {
    await this.getCategoryDetails();
    await this.getSubscriptionDetails();
    await this.getTenderDetails();
  }

  getSubscriptionDetails() {
    billingApiServices.getSubscriptions().then((response) => {
      this.setState({ gridData: response?.data?.data || [], loading: false });
    }).catch(error => {
      console.error("Error fetching subscriptions:", error);
    });
  }

  getCategoryDetails = () => {
    this.setState({ CategoryLoader: true });
    return billingApiServices.getCategoriesDetails().then((response) => {
      this.setState({
        CategoryDetails: response?.data?.data || [],
        CategoryLoader: false,
      });
    }).catch(error => {
      console.error("Error fetching categories:", error);
    });
  };

  getTenderDetails() {
    return billingApiServices.getAllTenders().then((response) => {
      if (response?.data?.data?.length > 0) {
        const sortedArray = response?.data?.data.sort((a, b) => b.id - a.id);
        this.setState({ tenders: sortedArray, loading: false });
      } else {
        console.warn("No tenders found.");
      }
    }).catch(error => {
      console.error("Error fetching tenders:", error);
    });
  }

  reloadData = () => {
    this.setState({ loading: true });
    this.getSubscriptionDetails();
  };

  getShowModal = (modal) => {
    this.setState({ showModal: modal });
  };

  categoryData = (categories_data) => {
    // Code to handle category data
    // this.setState({
    //   gridData: categories_data,
    // });
  };

  EditMode = (data) => {
    this.setState({ dataForEdit: data, showModal: true });
  };

  getTendeWithCategoryId = () => {
    const categoryMap = this.state.CategoryDetails?.reduce((map, category) => {
      map[category.title] = category.id;
      return map;
    }, {});

    const getCategoryIds = (categoryTitles) => {
      if (!categoryTitles) return [];
      return categoryTitles.split(":").map(title => categoryMap[title] || null).filter(id => id !== null);
    };

    return this.state.tenders?.map(business => ({
      ...business,
      categoryIds: getCategoryIds(business.category),
    })) || [];
  };

 
 
 

  SendEmail = async () => {
    this.setState({ sendingEmail: true, emailSendingError: false }); // Start sending email

    if (
      this.state.CategoryDetails?.length > 0 &&
      this.state.tenders?.length > 0 &&
      this.state.gridData?.length > 0
    ) {
      const parseCategories = (categories) => {
        if (!categories) return [];
        return categories.split(":");
      };

  //send mail on basis of previous date
      const isPreviousDay = (date) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate()-1);

        return (
          date.getFullYear() === yesterday.getFullYear() &&
          date.getMonth() === yesterday.getMonth() &&
          date.getDate() === yesterday.getDate()
        );
      };


      // Send email on today date basis
      // const isPreviousDay = (date) => {
      //   const today = new Date();
  
      //   console.log("today Date : " , today);
    
      //   return (
      //     date.getFullYear() === today.getFullYear() &&
      //     date.getMonth() === today.getMonth() &&
      //     date.getDate() === today.getDate()
      //   );
      // };


      const generateSubscribeArray = () => {
        const subscribeArray = [];

        const activeUsers = this.state.gridData.filter(user => user.status === 1);
        if (activeUsers.length === 0) {
          alert("No active users available.");
          return [];
        }

        activeUsers.forEach(user => {
          const subscribedCategories = parseCategories(user.categories);
          const filteredTenders = this.state.tenders.filter(tender =>
            parseCategories(tender.category).some(category =>
              subscribedCategories.includes(category)
            )
          );

          const previousDayTenders = filteredTenders.filter(tender =>
            isPreviousDay(new Date(tender.effectedDate))
          );

          if (previousDayTenders.length > 0) {
            // Generate Table and Embed Image directly
            const emailContent = `
              <html>
              <head>
                <style>
                  table {
                    width: 100%;
                    border-collapse: collapse;
                  }
                  table, th, td {
                    border: 1px solid black;
                  }
                  th, td {
                    padding: 8px;
                    text-align: left;
                  }
                </style>
              </head>
              <body>
                <h2>Today's Tender List</h2>
                <table>
                  <thead>
                    <tr>
                    <th>Tender Title</th>
                      <th>Newspaper</th>
                      <th>Publish Date</th>
                      <th>Tender Image</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    ${previousDayTenders.map(tender => `
                      <tr>
                       <td>${tender.name}</td>
                        <td>${tender.newPaperName}</td>
                        <td>${moment(tender.publishDate).format("YYYY-MM-DD")}</td>
                        <td>
                          <a href="${tender.tenderImage}" target="_blank">View or download Image</a>
                        </td>
                        
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </body>
              </html>
            `;

            subscribeArray.push({
              userInfo: user,
              tenderInfo: emailContent,
            });
          }
        });

        return subscribeArray;
      };

      const emailData = generateSubscribeArray();
      if (emailData.length > 0) {
        try {
          const response = await billingApiServices.sendEmail({ dataForEmail: emailData });
          alert(response?.data?.message || "Email sent successfully!");
        } catch (error) {
          console.error("Error sending email:", error);
          this.setState({ emailSendingError: true });
          alert("Failed to send email.");
        }
      } else {
        const activeUsers = this.state.gridData.filter(user => user.status === 1);
        if (activeUsers.length === 0) {
          alert("First Activate your required users to send E-Mail.");
        } else {
          alert("No email data generated. Maybe there is no yesterday tender exist against subscribed categories.");
        }
      }
    } else {
      alert("Required data is missing.");
    }

    this.setState({ sendingEmail: false }); // Stop sending email
  };


  

  getStyle = () => {
    return (
      this.state.CategoryDetails?.length > 0 &&
      this.state.tenders?.length > 0 &&
      this.state.gridData?.length > 0
    )
      ? "btn-style p-2 d-flex align-items-center gap-1"
      : "btn-style disable-btn p-2 d-flex align-items-center gap-1";
  };

  render() {
    return (
      <>
        <div className="d-flex justify-content-between" style={{ marginTop: "5px" }}>
          <div>
            <button
              id="new-report"
              className="btn-style p-2 d-flex align-items-center gap-1"
              onClick={() => this.setState({ showModal: true })}
            >
              <i className="fa-regular fa-circle-plus" style={{ fontSize: "22px" }}></i> Add New
            </button>
          </div>
          <div>
            <button
              id="new-report"
              className={this.getStyle()}
              onClick={() => this.SendEmail()}
              disabled={this.state.sendingEmail} // Disable button while sending email
            >
              <i className="fa-regular fa-circle-envelope" style={{ fontSize: "25px" }}></i> Send Email to Active users
            </button>
          </div>
        </div>

        {this.state.sendingEmail && (
          <div className="loading-message">
            Sending email, please wait...
          </div>
        )}

        {!this.state.showModal && (
          <SubscriptionsTable
            gridData={this.state.gridData}
            loading={this.state.loading}
            reloadData={() => this.reloadData()}
            CategoryDetails={this.state.CategoryDetails}
            EditMode={(data) => this.EditMode(data)}
          />
        )}

        {this.state.showModal && (
          <SaveSubscriptionsModal
            CategoryDetails={this.state.CategoryDetails}
            CategoryLoader={this.state.CategoryLoader}
            modalopen={this.state.showModal}
            dataForEdit={this.state.dataForEdit}
            categoryData={(categories_data) => this.categoryData(categories_data)}
            onClose={() => this.setState({ showModal: false, dataForEdit: null })}
            reloadData={() => this.reloadData()}
          />
        )}
      </>
    );
  }
}

export default SubscriptionDetails;


