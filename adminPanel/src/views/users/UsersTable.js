import React, { useState, useEffect } from "react";
import SaveUserModal from "./SaveUserModal";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Skeleton } from "primereact/skeleton";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { SelectButton } from 'primereact/selectbutton';
import "../users/UserTablestyle.css";
import Toast from "../alert/Toast"
import "primeicons/primeicons.css";
import { InputSwitch } from 'primereact/inputswitch';
import { billingApiServices } from '../../services/BillingApiService';
import _EventEmitter from "./../../constants/emitter";

const UsersTable = (props) => {
  const [isModalOpen, setisModalOpen] = useState(false);
  const [userID, setuserID] = useState(0);
  const [dataForEdit, setdataForEdit] = useState(null);
  const [users, setusers] = useState(Array.from({ length: 5 }));
  const [loader, setLoader] = useState(true);
  const [refreshstate, setRefreshState] = useState()
  const [userActive, setUserActive] = useState()
  const [isAuth, setIsAuth] = useState()
  const [_userid, setUpdatedUserId] = useState()
  const [severity, setSeverity] = useState("")
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [responseMsg, setResponseMsg] = useState("")
  const [userStatus, setUserStatus] = useState('Disable');
  const options = ['Disable', 'Enable'];






  let [filterArray, setfilterArray] = useState({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    phoneNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
    role: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  useEffect(() => {
    if (typeof props.users == "object") {
      // console.log(props.users, 'props here')
      setusers(props.users)
      // if (props.users !== undefined) {
      //   var statusAdded = props.users.map((user) => {

      //     var val = {
      //       ...user, ...{
      //         status: [
      //           { "id": 0, "value": "Disable" }, { "id": 2, "value": "Enable" },
      //         ]
      //       }
      //     }
      //     console.log("===")
      //     console.log(val)
      //     // return {...user, status: [{id: 1, value: "Disable", id: 2, value: "Enable"}]}
      //   });
      // }


      // setusers({...statusAdded});
    }

    //  console.log(statusAdded)


    // console.log(users)
    setLoader(props.loading);
  }, [props.users]);

  const edituser = (data) => {
    setdataForEdit(data);
    setisModalOpen(!isModalOpen);
    setRefreshState(new Date())
  };

  const closeModal = () => {
    // alert("close model")
  }


  const reject = () => {
    // alert("open model")
  }
  const toggleAuth = (e, id) => {
    let value = e;
    let _id = id;

    submitAuth(value, _id);
  };


  const toggle = (e, id) => {
    let value = e;
    let _id = id;
    // let msg
    // if (_id == 1) {
    //   msg = "Are you sure you want to enable the user?"
    // } else {
    //   msg = "Are you sure you want to disable the user?"
    // }
    // confirmDialog({
    //   message: msg,
    //   header: 'Confirmation',
    //   icon: 'pi pi-info-circle',
    //   position: "top",
    //   accept: () => { submit(value, _id) },
    //   reject: reject()
    // });

    submit(value, _id);
  };



  const submitAuth = (status, id) => {
    let action = 'update'
    billingApiServices.saveUserAuth(id, status, action).then(() => {
      var msg = "User updated successfully!";

      _EventEmitter.emit("RefreshUserData", "")


      setSeverity("success")
      setResponseMsg(msg)
      setOpenSnackBar(true)

      setTimeout(() => {
        // toggle();
      }, 3000);
    });


    // _EventEmitter.emit("RefreshUserData", "")


    //     // setSeverity("success")
    //     // setResponseMsg(msg)
    //     // setOpenSnackBar(true)

    //     setTimeout(() => {
    //       toggle();
    //     }, 3000);
    //   });
  };

  const submit = (status, id) => {

    if (status == true) {
      status = 1
    } else {
      status = 0
    }
    let action = 'update'
    billingApiServices.saveUserStatus(id, status, action).then(() => {
      var msg = "User updated successfully!";

      _EventEmitter.emit("RefreshUserData", "")


      setSeverity("success")
      setResponseMsg(msg)
      setOpenSnackBar(true)

      setTimeout(() => {
        // toggle();
      }, 3000);
    });


    // _EventEmitter.emit("RefreshUserData", "")


    //     // setSeverity("success")
    //     // setResponseMsg(msg)
    //     // setOpenSnackBar(true)

    //     setTimeout(() => {
    //       toggle();
    //     }, 3000);
    //   });
  };

  const userData = (users_data) => {
    if (typeof users_data == "object") {
      setusers(users_data);
    }
  };

  const bodyTemplate = (rowData) => {
    if (rowData == undefined || loader == true) {
      return <Skeleton shape="circle" size="2rem" className="mr-2"></Skeleton>;

    }
    return (
      <div>
        <i className="pi pi-pencil " onClick={() => edituser(rowData)}></i>

      </div>
    );
  };


  const changeUserStatus = (e, id) => {
    setuserID(id)
    setUserActive(e.value)
    toggle(e.value, id);
  }

  const changeUserAuth = (e, id) => {
    setuserID(id)
    setIsAuth(e.value)
    toggleAuth(e.value, id);
  }

  const userActiveTemplate = (rowData) => {

    if (rowData == undefined || loader == true) {
      return <Skeleton shape="circle" size="2rem" className="mr-2"></Skeleton>;
    }
    else {
      let active = rowData.status
      if (active == 1) {
        active = true
        setUserActive(true)
      } else {
        active = false
        setUserActive(false)
      }
      return (

        <div>
          <div>{active}</div>
          <InputSwitch checked={active} onChange={(e) => changeUserStatus(e, rowData.id)} />
        </div>
      );
    }

  };

  const userAuthTemplate = (rowData) => {

    if (rowData == undefined || loader == true) {
      return <Skeleton shape="circle" size="2rem" className="mr-2"></Skeleton>;
    }
    else {
      let isAuthActive = rowData.twofactorauthentication
      if (isAuthActive == 'Enable') {
        isAuth = 'Enable'
        setIsAuth('Enable')
      } else {
        isAuth = 'Disable'
        setIsAuth(false)
      }
      return (

        <div>
          <div>{isAuthActive}</div>
          <InputSwitch checked={isAuth} onChange={(e) => changeUserAuth(e, rowData.id)} />
        </div>
      );
    }

  };


  const userStatusTemplate = (rowData) => {
    // toggle();
    // debugger
    if (rowData !== undefined) {
      var status = rowData.status == 0 ? "Disable" : "Enable";
      console.log(status)
      console.log(rowData.status)
    }
    if (rowData == undefined || loader == true) {
      return <Skeleton shape="circle" size="2rem" className="mr-2"></Skeleton>;

    }
    return (
      <div className="card">
        <SelectButton value={userStatus} options={options} onChange={(e) => setUserStatus(e.value)} />
      </div>
    );
  };

  const filterClearTemplate = (options) => {
    return (
      <Button
        type="button"
        icon="pi pi-times"
        onClick={options.filterClearCallback}
        className="p-button-secondary"
      ></Button>
    );
  };

  const filterApplyTemplate = (options) => {
    return (
      <Button
        type="button"
        icon="pi pi-check"
        onClick={options.filterApplyCallback}
        className="p-button-success"
      ></Button>
    );
  };

  const filterFooterTemplate = () => {
    return (
      <div className="px-3 pt-0 pb-3 text-center font-bold">Add rules</div>
    );
  };
  const FirstNameskeletonTemplate = (rowData) => {
    if (rowData == undefined || loader == true) {
      return <Skeleton></Skeleton>;
    } else {
      if (rowData.firstname.length > 20) {
        return (
          <div title={rowData.firstname}>
            {rowData.firstname.slice(0, 20)}...
          </div>
        );
      }
      return <div>{rowData.firstname}</div>;
    }
  };
  const LastNameskeletonTemplate = (rowData) => {
    if (rowData == undefined || loader == true) {
      return <Skeleton></Skeleton>;
    } else {
      if (rowData.lastname != null && rowData.lastname?.length > 20) {
        return (
          <div title={rowData.lastname}>{rowData.lastname.slice(0, 2)}...</div>
        );
      }
      return <div>{rowData.lastname}</div>;
    }
  };
  const EmailskeletonTemplate = (rowData) => {
    if (rowData == undefined || loader == true) {
      return <Skeleton></Skeleton>;
    } else {
      if (rowData.email.length > 20) {
        return <div title={rowData.email}>{rowData.email.slice(0, 20)}...</div>;
      }
      return <div>{rowData.email}</div>;
    }
  };
  const UserNamekeletonTemplate = (rowData) => {
    if (rowData == undefined || loader == true) {
      return <Skeleton></Skeleton>;
    } else {
      return <div>{rowData.name}</div>;
    }
  };
  const PhoneskeletonTemplate = (rowData) => {
    if (rowData == undefined || loader == true) {
      return <Skeleton></Skeleton>;
    } else {     
      return <div>{rowData.phoneNumber}</div>;
    }
  };
  const CompanyskeletonTemplate = (rowData) => {
    if (rowData == undefined || loader == true) {
      return <Skeleton></Skeleton>;
    } else {
      if (rowData.company.length > 20) {
        return (
          <div title={rowData.company}>{rowData.company.slice(0, 20)}...</div>
        );
      }
      return <div>{rowData.company}</div>;
    }
  };
  const RoleskeletonTemplate = (rowData) => {
    if (rowData == undefined || loader == true) {
      return <Skeleton></Skeleton>;
    } else {
      if (rowData.role.length > 20) {
        return <div title={rowData.role}>{rowData.role.slice(0, 20)}...</div>;
      }
      return <div>{rowData.role}</div>;
    }
  };

  return (
    <div>
      <div className="card table-scroll">
        <DataTable
          value={users}
          paginator
          responsiveLayout="scroll"
          paginatorTemplate=" FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
          rows={20}
          rowsPerPageOptions={[20, 40, 60]}
          dataKey="id"
          filters={filterArray}
          filterDisplay="row"
        >
         <Column
            field="name"
            header="Username"
            sortable
            filter
            filterField="name"
            filterPlaceholder="Search... "
            style={{ width: "12.5%" }}
            body={UserNamekeletonTemplate}
          ></Column>

         <Column
            field="email"
            header="Email"
            sortable
            filter
            filterField="email"
            filterPlaceholder="Search... "
            style={{ width: "12.5%" }}
            body={EmailskeletonTemplate}
          ></Column>
         
         <Column
            field="phoneNumber"
            header="Phone"
            sortable
            filter
            filterField="phoneNumber"
            filterPlaceholder="Search"
            style={{ width: "12.5%" }}
            body={PhoneskeletonTemplate}
          ></Column>
            
          <Column header="Action" body={bodyTemplate}  style={{ width: "12.5%" }}/> 
        </DataTable>
      </div>

      {/* {isModalOpen && ( */}
      <SaveUserModal
        dataForEdit={dataForEdit}
        action={"update"}
        modalopening={isModalOpen}
        userData={(users_data) => userData(users_data)}
        closemodal={() => setisModalOpen(false)}
      />
      <Toast open={openSnackBar}
        severity={severity}
        handleClose={() => setOpenSnackBar(false)}
        message={responseMsg} />
      {/* )} */}
    </div>
  );
};

export default UsersTable;
