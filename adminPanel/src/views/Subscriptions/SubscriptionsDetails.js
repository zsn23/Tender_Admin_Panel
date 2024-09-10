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
//         alert("Data not found");
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
//     // this.setState({
//     //   gridData: categories_data,
//     // });
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
//                         `<li><p>${link.newPaperName}</p><p>Publish Date : ${link.publishDate}</p><p>${link.name} </p> <a href="${link.img}" target="_blank">${link.img}</a></li>`
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

//   getStyle = () => {
//     if (
//       this.state.CategoryDetails?.length > 0 &&
//       this.state.tenders?.length > 0 &&
//       this.state.gridData?.length > 0
//     ) {
//       return "btn-style";
//     }

//     return "btn-style disable-btn";
//   };

//   render() {
//     return (
//       <>
//         <div style={{ textAlign: "end", marginTop: "5px" }}>
//           <button
//             id="new-report"
//             className="btn-style"
//             onClick={() => this.setState({ showModal: true })}
//           >
//             {" "}
//             Add New
//           </button>

//           <button
//             id="new-report"
//             className={this.getStyle()}
//             onClick={() => this.SendEmail()}
//           >
//             Send Email to Active customers
//           </button>
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
import moment from "moment";

class SubscriptionDetails extends Component {
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
      CategoryDetails: [],
      CategoryLoader: false,
      DataForEdit: null,
      tenders: [],
    };
  }

  getSubscriptionDetails() {
    billingApiServices.getSubscriptions().then((response) => {
      console.log("Subscriptions Response:", response); // Add this log
      this.setState({ gridData: response?.data?.data, loading: false });
    });
  }

  getCategoryDetails = () => {
    this.setState({ CategoryLoader: true });
    billingApiServices.getCategoriesDetails().then((response) => {
      this.setState({
        CategoryDetails: response?.data?.data,
        CategoryLoader: false,
      });
    });
  };

  async componentDidMount() {
    this.getTenderDetails();
    await this.getCategoryDetails();
    this.getSubscriptionDetails();
  }

  getTenderDetails() {
    billingApiServices.getAllTenders().then((response) => {
      console.log("Tenders Response:", response); // Add this log
      if (response?.data?.data?.length > 0) {
        var sortedArray = response?.data?.data.sort((a, b) => b.id - a.id);
        this.setState({ tenders: sortedArray, loading: false });
      } else {
        alert("Data not found");
      }
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
    this.setState({
      gridData: categories_data,
    });
  };

  EditMode = (data) => {
    this.setState({ dataForEdit: data });
    this.setState({ showModal: true });
  };

  getTendeWithCategoryId = () => {
    const categoryMap = this.state.CategoryDetails?.reduce((map, category) => {
      map[category.title] = category.id;
      return map;
    }, {});

    const getCategoryIds = (categoryTitles) => {
      if (categoryTitles == null) {
        return [];
      }

      if (categoryTitles.includes(":")) {
        return categoryTitles.split(":").map((title) => categoryMap[title]);
      } else {
        const categoryId = categoryMap[categoryTitles];
        return categoryId ? [categoryId] : [];
      }
    };

    const businessesWithIds = this.state.tenders?.map((business) => ({
      ...business,
      categoryIds: getCategoryIds(business.category),
    }));

    return businessesWithIds;
  };

  generateSubscribeArray = () => {
    const subscribeArray = [];
  
    const parseCategories = (categories) => {
      if (!categories || categories.trim() === "") {
        return [];
      }
      return categories.split(/[:/]/).map(category => category.trim().toLowerCase());
    };

  
    const isPreviousDay = (date) => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return (
        date.getFullYear() === yesterday.getFullYear() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getDate() === yesterday.getDate()
      );
    };
  
    let activeUser = this.state.gridData?.filter((c) => c.status === 1);
    console.log("Active Users:", activeUser); // Log active users
  
    if (activeUser?.length === 0) {
      alert("Active users are not available");
      return [];
    }
  
    activeUser?.forEach((userSubscribe) => {
      const subscribedCategories = parseCategories(userSubscribe.categories);
      console.log("Subscribed Categories:", subscribedCategories);

      const filteredBusinesses = this.state.tenders.filter((business) => {
        const tenderCategories = parseCategories(business.category);
        console.log("Tender Categories:", tenderCategories);
        
        // Check if any part of subscribedCategories exists in tenderCategories
        return tenderCategories?.some((tenderCategory) =>
          subscribedCategories.some((subCategory) =>
            tenderCategory.includes(subCategory) || subCategory.includes(tenderCategory)
          )
        );
      });
    

      console.log("Filtered Businesses:", filteredBusinesses); // Log filtered tenders
  
      
  const previousDayTnd = filteredBusinesses.filter((item) => {
    const effectedDate = new Date(item.effectedDate);
    return isPreviousDay(effectedDate);
  });
      console.log("Tenders from Previous Day:", previousDayTnd); // Log tenders from the previous day
  
      if (previousDayTnd?.length > 0) {
        let imgLinks = previousDayTnd?.map((item) => ({
          img: item.tenderImage,
          categories: item.category,
          name: item.name,
          newPaperName: item.newPaperName,
          publishDate: moment(item.publishDate).format("YYYY-MM-DD"),
        }));
  
        let emailTemplate = `
          <html>
          <head></head>
          <body>
              <h2>Today Tender List</h2>
              <ul>
                  ${imgLinks
                    .map(
                      (link) =>
                        `<li><p>${link.newPaperName}</p><p>Publish Date : ${link.publishDate}</p><p>${link.name} </p> <a href="${link.img}" target="_blank">${link.img}</a></li>`
                    )
                    .join("")}
              </ul>
          </body>
          </html>
        `;
  
        subscribeArray.push({
          userInfo: userSubscribe,
          tenderInfo: emailTemplate,
        });
      }
    });
  
    return subscribeArray;
  };
  

  SendEmail = async () => {
    if (
      this.state.CategoryDetails?.length > 0 &&
      this.state.tenders?.length > 0 &&
      this.state.gridData?.length > 0
    ) {
      const result = this.generateSubscribeArray();
      console.log("Generated Subscription Array:", result); // Add this to see the result

      if (result?.length > 0) {
        const body = { dataForEmail: result };
        console.log(body);
        let response = await billingApiServices.sendEmail(body);
        alert(response?.data?.message);
      } else {
        alert("No data available to send emails");
      }
    }
  };

  getStyle = () => {
    if (
      this.state.CategoryDetails?.length > 0 &&
      this.state.tenders?.length > 0 &&
      this.state.gridData?.length > 0
    ) {
      return "btn-style";
    }

    return "btn-style disable-btn";
  };

  render() {
    return (
      <>
        <div style={{ textAlign: "end", marginTop: "5px" }}>
          <button
            id="new-report"
            className="btn-style"
            onClick={() => this.setState({ showModal: true })}
          >
            {" "}
            Add New
          </button>

          <button
            id="new-report"
            className={this.getStyle()}
            onClick={() => this.SendEmail()}
          >
            Send Email to Active customers
          </button>
        </div>
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
            categoryData={(categories_data) =>
              this.categoryData(categories_data)
            }
            onClose={() =>
              this.setState({ showModal: false, dataForEdit: null })
            }
            reloadData={() => this.reloadData()}
          />
        )}
      </>
    );
  }
}

export default SubscriptionDetails;
