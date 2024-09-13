import React, { useState, useEffect } from "react";
import SaveSubscriptionsModal from "./SaveSubscriptionsModal";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Skeleton } from "primereact/skeleton";
import ConfirmationDialog from "../alert/ConfirmationDialog";
import { ConfirmDialog } from "primereact/confirmdialog";
import { billingApiServices } from '../../services/BillingApiService';
import Toast from "../alert/Toast"
import { Dropdown } from "primereact/dropdown";
import XLSX from "xlsx";
import FileSaver from 'file-saver';
import ImportFile from "./ImportFile";

const CustomDataTable = (props) => {
  const [isModalOpen, setisModalOpen] = useState(false);
  const [gridData, setGridData] = useState(Array.from({ length: 5 }));
  const [loader, setLoader] = useState(true);
  const [dataForEdit, setDataForEdit] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [severity, setSeverity] = useState("")
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [responseMsg, setResponseMsg] = useState("")
  const [selectedRows, setSelectedRows] = useState([])

  const [first, setFirst] = useState(0); // Index of the first record to display
  const [rows, setRows] = useState(25); // Number of rows per page

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [stateManager, setStateManager] = useState(0);

  let [filterArray, setfilterArray] = useState({
    email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    phoneNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
    userName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    company: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.CONTAINS },
    billingPeriod: { value: null, matchMode: FilterMatchMode.CONTAINS },
    categories: { value: null, matchMode: FilterMatchMode.CONTAINS },
    billingDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
    BillingAmount:{ value: null, matchMode: FilterMatchMode.CONTAINS },
    effectedDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  useEffect(() => {
    setLoader(props.loading);
    setGridData(props.gridData);
  }, [props.gridData , props.loading]);



  const editCategory = (data) => {
    setDataForEdit(data);
    props.EditMode(data)
    // setisModalOpen(!isModalOpen);
  };

  const deleteCategory = (data) => {
    setDataForEdit(data);
    setOpenConfirmation(true)
  };

  const acceptConfirmation = () => {
    if (dataForEdit != null) {
      deleteRecords()
    }
  }
  const confirmDelete = (data) => {
    setDataForEdit(data);
    setDeleteDialogVisible(true);
  };

  const deleteRecords = () => {
    setDeleteDialogVisible(false);
    setOpenConfirmation(false)

    const body = {
      id: dataForEdit?.id
    }

    billingApiServices.deleteSubscription(body).then((response) => {
      if (response == null || response == undefined) {
        handleToast("error", "Operation failed, check your internet connection")
        return
      }

      if (response?.data?.status) {

        handleToast("success", response?.data?.message)
        setDataForEdit(null)
        props.reloadData()
      }
      else {
        handleToast("error", response?.data?.message)
      }
    });


  }

  const reloadData = () => {
    props.reloadData()
  }

  const handleToast = (severity, message) => {
    setSeverity(severity)
    setResponseMsg(message)
    setOpenSnackBar(true)
    setTimeout(() => {
      setOpenSnackBar(false)
    }, 2000);
  }

  const rejectConfirmation = () => {
    setOpenConfirmation(false)
  }

  const exportToExcel = () => {
    let fileName = 'SubscriptionDetail';

    const response = selectedRows.map((d) => ({
      userName: d.userName,
      phoneNumber: d.phoneNumber, 
      email: d.email,
      company: d.company,
      billingPeriod: d.billingPeriod,
      categories: d.categories,
      billingDate: d.billingDate,
      BillingAmount: d.BillingAmount
    }));

    const ws = XLSX.utils.json_to_sheet(response);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataToSave = new Blob([excelBuffer], { type: "application/octet-stream" });
    FileSaver.saveAs(dataToSave, `${fileName}.xlsx`);
  };

  const bodyTemplate = (rowData) => loader ? (
    <Skeleton shape="circle" size="1rem" className="mr-2" />
  ) : (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Button
        icon="pi pi-pencil"
        onClick={() => editCategory(rowData)}
        className="p-button-rounded p-button-warning my-2"
        style={{ margin: '0.5rem' }} // Optional: adds spacing between buttons
      />
      <Button
        icon="pi pi-trash"
        onClick={() => confirmDelete(rowData)}
        className="p-button-rounded p-button-warning"
        style={{ margin: '0.5rem' }}
      />
    </div>
  );

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


  const NameBodyTemplate = (rowData) => {
    if (loader == true) {
      return <Skeleton></Skeleton>;
    }
    else {
      return <div>{rowData.userName}</div>;
    }
  };

  const BillingPeriodBodyTemplate = (rowData) => {
    if (loader == true) {
      return <Skeleton></Skeleton>;
    }
    else {
      return <div>{rowData.billingPeriod}</div>;
    }
  };
  const phoneNumberTemplate = (rowData) => {
    if (loader == true) {
      return <Skeleton></Skeleton>;
    }
    else {
      return <div>{rowData.phoneNumber}</div>;
    }
  };

  const EmailBodyTemplate = (rowData) => {
    if (loader == true) {
      return <Skeleton></Skeleton>;
    }
    else {
      return <div>{rowData.email}</div>;
    }
  };

  const BillingAmountBodyTemplate = (rowData) => {
    if (loader == true) {
      return <Skeleton></Skeleton>;
    }
    else {
      return <div>{rowData.BillingAmount}</div>;
    }
  };

  const CompanyBodyTemplate = (rowData) => {
    if (loader == true) {
      return <Skeleton></Skeleton>;
    }
    else {
      return <div>{rowData.company}</div>;
    }
  };

  const StatusBodyTemplate = (rowData) => {
    if (loader) {
      return <Skeleton></Skeleton>;
    }

    return rowData.status === 1 ? "Active" : "InActive";
  };

  const handleFilterChange = (value) => {
    setfilterArray((prevFilters) => ({
      ...prevFilters,
      status: { value, matchMode: FilterMatchMode.EQUALS }, // Use FilterMatchMode.EQUALS for exact match
    }));
  };

  const statusFilterTemplate = (options) => {
    const statusOptions = [
      { label: 'Active', value: 1 },
      { label: 'InActive', value: 0 },
    ];

    return (
      <Dropdown
        value={options.value}
        options={statusOptions}
        onChange={(e) => {

          handleFilterChange(e.value); // Update filter array
        }} // Update filterArray on change
        placeholder="Select"
        className="text-dark"
      />
    );
  };



  const CategoriesBodyTemplate = (rowData) => {
    if (loader == true) {
      return <Skeleton></Skeleton>;
    }
    else {
      var names = []
      let category = rowData?.categories?.split(",")
      return <div>{category}</div>;
    }
  };
  const SubmissionDateTemplate = (rowData) => {
    if (loader == true) {
      return <Skeleton></Skeleton>;
    } else {
      var effectedDate = convertDateBestFormate(rowData.effectedDate)
      return <div>{effectedDate}</div>
    }
  };

  const billingDateBodyTemplate = (rowData) => {
    if (loader == true) {
      return <Skeleton></Skeleton>;
    } else {
      var effectedDate = convertDateBestFormate(rowData.billingDate)
      const dateOnly = effectedDate;
      return <div>{dateOnly}</div>
    }
  };

  const CreatedByTemplate = (rowData) => {
    if (loader == true) {
      return <Skeleton></Skeleton>;
    } else {
      return <div>{rowData?.userName}</div>
    }
  };

  const convertDateBestFormate = (inputDateTime) => {

    const date = new Date(inputDateTime);
    // const hours = date.getUTCHours().toString().padStart(2, '0');
    // const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return null; // Invalid date
    }
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day} `; // Ensure 'YYYY-MM-DD' format
  }
  const customHeaderTemplate = () => (
  
    <div >
    <span>Action</span>
    <i className="pi pi-wrench" style={{ fontSize: '13px' ,marginLeft : "3px" }} ></i>
    </div>
  );
  const customExportTemplate=()=>(
    <div >
    <span>Export</span>
    <i className="pi pi-file-excel" style={{ fontSize: '14px' ,marginLeft : "2px" }} ></i>
    </div>
  );

  const handleImport=()=>{
    setIsOpen(true)
    setStateManager(new Date()?.toString());
  }

  return (
  
      <div className="container-fluid" >
          <button style={{ position: 'relative', bottom: 36 ,  cursor: selectedRows.length === 0 ? 'not-allowed' : 'pointer'}} className="btn-style" onClick={exportToExcel} disabled={selectedRows.length === 0}>Export</button>
          
          <button style={{
        position: 'relative', bottom: 36, marginLeft: 5
      }} className="btn-style" onClick={() => handleImport()}>Import
      </button>

        <DataTable
        header="SUBSCRIPTION RECORDS"
          value={loader ? Array.from({ length: 5 }) : gridData}
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

          dataKey="id"
          filters={filterArray}
          filterDisplay="row"
          removableSort
          sortField="effectedDate" 
          sortOrder={-1}

          selectionMode={'checkbox'}
          selection={selectedRows}
          onSelectionChange={(e) => setSelectedRows(e.value)}
        >
           <Column selectionMode="multiple" header={customExportTemplate} headerStyle={{ width: '10%' }}></Column>
          <Column
            field="userName"
            header="Name"
            sortable
            filter
            filterPlaceholder="Search"
            style={{ width: "15%" }}
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            
            body={NameBodyTemplate}
          ></Column>

          <Column
            field="phoneNumber"
            header="Phone"
            sortable
            filter
            filterPlaceholder="Search"
           
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            
            body={phoneNumberTemplate}
          ></Column>

          <Column
            field="email"
            header="Email"
            sortable
            filter
            filterPlaceholder="Search"
            
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            
            body={EmailBodyTemplate}
          ></Column>

          <Column
            field="company"
            header="Company"
            sortable
            body={CompanyBodyTemplate}
           

            filter
            filterPlaceholder="Search"
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            
          ></Column>

          

          <Column
            field="billingPeriod"
            header="billing Period"
            sortable
           
            body={BillingPeriodBodyTemplate}

            filter
            filterPlaceholder="Search"
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            
          ></Column>

          <Column
            field="categories"
            header="Categories"
            sortable
           
            body={CategoriesBodyTemplate}

            filter
            filterPlaceholder="Search"
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            
          ></Column>
          
          <Column
            field="BillingAmount"
            header="Bill   Amount"
            sortable
           
            body={BillingAmountBodyTemplate}

            filter
            filterPlaceholder="Search"
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            
          ></Column>
          

          <Column
            field="status"
            header="Status"
            sortable
            filter
            filterElement={statusFilterTemplate}
           
            body={StatusBodyTemplate}
          ></Column>


<Column 
          field="effectedDate" 
          header="Submit Date" 
          sortable 
          filter 
          filterPlaceholder="Search"  
          body={SubmissionDateTemplate}
          
          ></Column>
          <Column
            field="billingDate"
            header="Billing Date"
            sortable
           
            filter
            filterPlaceholder="Search"
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            

            body={billingDateBodyTemplate}
          ></Column>
          <Column field="id" header={customHeaderTemplate}  body={bodyTemplate} />

        </DataTable>
      

      <Toast open={openSnackBar}
        severity={severity}
        handleClose={() => setOpenSnackBar(false)}
        message={responseMsg} />

<ImportFile reloadData={() => reloadData()} 
onHide={() => setIsOpen(false)} 
isOpen={isOpen} 
Type="Subscription" />
      
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
export default CustomDataTable;
