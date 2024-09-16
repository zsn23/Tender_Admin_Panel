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

import XLSX from "xlsx";
import FileSaver from 'file-saver';
import { Password } from "primereact/password";
import { Phone } from "react-feather";
import ImportFile from "./ImportFile";





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
  const [first, setFirst] = useState(0); // Index of the first record to display
 const [rows, setRows] = useState(25); // Number of rows per page
 const [selectedRows, setSelectedRows] = useState([])
 const [isOpen, setIsOpen] = useState(false);
 const [stateManager, setStateManager] = useState(0)

 const [openConfirmation, setOpenConfirmation] = useState(false);
 const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);





  let [filterArray, setfilterArray] = useState({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    phoneNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
    role: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    password: {value:null , matchMode: FilterMatchMode.CONTAINS},
    effectedDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

  const confirmDelete = (data) => {
    setdataForEdit(data);
    setDeleteDialogVisible(true);
  };

  const deleteRecords = () => {
    setDeleteDialogVisible(true);
  
    setOpenConfirmation(false);
  
    const body = {
      id: dataForEdit?.id
    }
  
    billingApiServices.deleteUser(body).then((response) => {
      if (response == null || response == undefined) {
        handleToast("error", "Operation failed, check your internet connection");
        return;
      }
  
      if (response?.data?.status) {
        handleToast("success", response?.data?.message);
        setdataForEdit(null);
        _EventEmitter.emit("RefreshUserData", "")
      } else {
        handleToast("error", response?.data?.message);
      }
    });
  }

  const handleToast = (severity, message) => {
    setSeverity(severity)
    setResponseMsg(message)
    setOpenSnackBar(true)
    setTimeout(() => {
      setOpenSnackBar(false)
    }, 2000);
  }
  
 
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
      }, 1000);
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
      }, 1000);
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

  const bodyTemplate = (rowData) => loader ? (
    <Skeleton shape="circle" size="1rem" className="mr-2" />
  ) : (
    <div style={{ display: 'flex', alignItems: 'center' , justifyContent:"center " }}>
      <Button
        icon="fa-regular fa-money-check-pen"
        onClick={() => edituser(rowData)}
        className="p-button-rounded p-button-warning my-2"
        style={{ margin: '0.5rem' }} // Optional: adds spacing between buttons
      />
        <Button
        icon="fa-regular fa-trash-can-xmark"
        onClick={() => confirmDelete(rowData)}
        className="p-button-rounded p-button-warning"
        style={{ margin: '0.5rem' }}
      />
    </div>
  );

  const customHeaderTemplate = () => (
  
    <div >
    <span>Action</span>
    < i class="fa-sharp fa-solid fa-wrench" style={{ fontSize: '14px', marginLeft: "3px" ,marginTop:"3px" }}></i>
    </div>
  );


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
  const reloadData = () => {
    props.reloadData()
  }

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
      <div className="card" >
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
  const PasswordskeletonTemplate=(rowData)=>{
    if (rowData == undefined || loader == true) {
      return <Skeleton></Skeleton>;
    } else {
      return <div>{rowData.password}</div>;
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

  const exportToExcel = () => {
    let fileName = 'Users';

    const response = selectedRows.map((d) => ({
      Username: d.name,
      email: d.email,
      password: d.password,
      Phone: d.phoneNumber,
      joinDate: d.effectedDate
    }));

    const ws = XLSX.utils.json_to_sheet(response);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataToSave = new Blob([excelBuffer], { type: "application/octet-stream" });
  
    FileSaver.saveAs(dataToSave, `${fileName}.xlsx`);
   
  };

  const customExportTemplate=()=>(
    <div className="d-flex align-items-center">
    <span>Export</span>
    <i class="fa-sharp fa-solid fa-file-excel" style={{ fontSize: '16px', marginLeft: "5px", marginTop:"1px" }}></i>
    </div>
  );

  const convertDateBestFormate = (inputDateTime) => {
    const date = new Date(inputDateTime);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return null; // Invalid date
    }
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day} `; // Ensure 'YYYY-MM-DD' format
  };

  const JoinDateTemplate = (rowData) => loader ? <Skeleton /> : <div>{convertDateBestFormate(rowData.effectedDate)}</div>;

  const handleImport=()=>{
    setIsOpen(true)
    setStateManager(new Date()?.toString());
  }
  return (
  
      <div className="container-fluid  ">
           <div className="d-flex justify-content-end" style={{ position:'relative',bottom:42,marginTop:'5px'}}>

<div>
<button style={{ cursor: selectedRows.length === 0 ? 'not-allowed' : 'pointer'  }} className="btn-style p-2 d-flex align-items-center gap-1" onClick={exportToExcel} disabled={selectedRows.length === 0}>
  <i className="fa-thin fa-file-export" style={{ fontSize: "18px" }}> </i> Export
</button>
</div>

<div>
<button style={{ marginLeft: 5 }} className="btn-style p-2 d-flex align-items-center gap-1" onClick={() => handleImport()}>
  <i className="fa-thin fa-file-import" style={{ fontSize: "18px" }}> </i> Import
</button>
</div>


</div>

        <DataTable
          header="USERS INFORMATION"
          value={users}
          paginator
          responsiveLayout="scroll"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          currentPageReportTemplate={`ON PAGE ${Math.floor(first / rows) + 1} : RECORDS {first} to {last}`}
          rows={rows}
          first={first}
          onPage={(e) => {
          setFirst(e.first);
          setRows(e.rows);
          }}
          sortField="effectedDate" 
          sortOrder={-1}
          
          dataKey="id"
          filters={filterArray}
          filterDisplay="row"

          removableSort
          selectionMode={'checkbox'}
          selection={selectedRows}
          onSelectionChange={(e) => setSelectedRows(e.value)} 
        >

<Column selectionMode="multiple" header={customExportTemplate} headerStyle={{ width: '5%' }}></Column>
         <Column
            field="name"
            header="Username"
            sortable
            filter
            filterField="name"
            filterPlaceholder="Search... "
           
            body={UserNamekeletonTemplate}
          ></Column>

         <Column
            field="email"
            header="Email"
            sortable
            filter
            filterField="email"
            filterPlaceholder="Search... "
         
            body={EmailskeletonTemplate}
          ></Column>

          <Column
            field="password"
            header="Password"
            sortable
            filter
            filterField="password"
            filterPlaceholder="Search... "
            body={PasswordskeletonTemplate}
          ></Column>

         
         <Column
            field="phoneNumber"
            header="Phone"
            sortable
            filter
            filterField="phoneNumber"
            filterPlaceholder="Search"
           
            body={PhoneskeletonTemplate}
          ></Column>

          <Column
          field="effectedDate"
          header="Join Date"
          sortable
          filter
          filterField="effectedDate"
          filterPlaceholder="Search"
          body={JoinDateTemplate}
          ></Column>
            
            <Column field="id" header={customHeaderTemplate}  body={bodyTemplate}
               filter 
               showFilterMenu={false}  
               filterElement={
                 <div className="downloadImg d-flex align-items-center flex-column m-0 p-0">
                   <span className="downloadImgheading">EDIT</span>
                   <span className="downloadImgheading"> DELETE</span>
                 </div>
               }  
               headerStyle={{ width: '5%' }}
            ></Column>
            </DataTable>
      

      {/* {isModalOpen && ( */}
      <SaveUserModal
        dataForEdit={dataForEdit}
        action={"update"}
        modalopening={isModalOpen}
        userData={(users_data) => userData(users_data)}
        closemodal={() => setisModalOpen(false)}
        
      />

<ImportFile reloadData={() => this.reloadData()} onHide={() => setIsOpen(false)} isOpen={isOpen} Type="User" />


      <Toast open={openSnackBar}
        severity={severity}
        handleClose={() => setOpenSnackBar(false)}
        message={responseMsg} />
      {/* )} */}

      <ConfirmDialog
        visible={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        message="Are you sure you want to delete this record?"
        header="Confirmation"
        icon="pi pi-exclamation-triangle"
        accept={deleteRecords}
        reject={() => setDeleteDialogVisible(false)}
      />  

    </div>
  );
};

export default UsersTable;
