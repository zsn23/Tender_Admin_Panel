import React, { useState, useEffect } from "react";
import SaveSubscriptionsModal from "./SaveSubscriptionsModal";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Skeleton } from "primereact/skeleton";
import ConfirmationDialog from "../alert/ConfirmationDialog";
import { billingApiServices } from '../../services/BillingApiService';
import Toast from "../alert/Toast"
import { Dropdown } from "primereact/dropdown";

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

  let [filterArray, setfilterArray] = useState({
    email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    phoneNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
    userName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    company: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.CONTAINS },
    billingPeriod: { value: null, matchMode: FilterMatchMode.CONTAINS },
    categories: { value: null, matchMode: FilterMatchMode.CONTAINS },
    billingDate: { value: null, matchMode: FilterMatchMode.CONTAINS }
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

  const deleteRecords = () => {
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

  const bodyTemplate = (rowData) => {
    if (loader == true) {
      return <Skeleton shape="circle" size="2rem" className="mr-2"></Skeleton>;
    }
    return (
      <span>
        <span style={{ margin: "5px" }}><i onClick={() => editCategory(rowData)} className="pi pi-pencil "></i></span>
        <i onClick={() => deleteCategory(rowData)} className="pi pi-trash"></i>
      </span>
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
      const dateOnly = effectedDate.slice(6);
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
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();

    const formattedDateTime = `${hours}:${minutes} ${day}-${month}-${year}`;
    return formattedDateTime
  }

  return (
    <div>
      <div className="container-fluid" >
        <DataTable
          value={loader ? Array.from({ length: 5 }) : gridData}
          paginator
          responsiveLayout="scroll"
          paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing Records : {first} to {last} "
          rows={25}

          dataKey="id"
          filters={filterArray}
          filterDisplay="row"
          removableSort
          selectionMode={'checkbox'}
          selection={selectedRows}
          onSelectionChange={(e) => setSelectedRows(e.value)}
        >
          <Column selectionMode="multiple" headerStyle={{ width: '5%' }}></Column>
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
            style={{ width: "10%" }}
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
            style={{ width: "10%" }}
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            
            body={EmailBodyTemplate}
          ></Column>

          <Column
            field="company"
            header="Company"
            sortable
            body={CompanyBodyTemplate}
            style={{ width: "8%" }}

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
            style={{ width: "5%" }}
            body={StatusBodyTemplate}

          ></Column>

          <Column
            field="billingPeriod"
            header="billing Period"
            sortable
            style={{ width: "15%" }}
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
            style={{ width: "20%" }}
            body={CategoriesBodyTemplate}

            filter
            filterPlaceholder="Search"
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            
          ></Column>


          <Column
            field="billingDate"
            header="Billing Date"
            sortable
            style={{ width: "20%" }}
            filter
            filterPlaceholder="Search"
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            

            body={billingDateBodyTemplate}
          ></Column>
          <Column header="Action" body={bodyTemplate} />

        </DataTable>
      </div>

      <Toast open={openSnackBar}
        severity={severity}
        handleClose={() => setOpenSnackBar(false)}
        message={responseMsg} />

      <ConfirmationDialog openConfirmModal={openConfirmation} acceptConfirmation={() => acceptConfirmation()} rejectConfirmation={() => rejectConfirmation()} />
    </div>
  );
};
export default CustomDataTable;
