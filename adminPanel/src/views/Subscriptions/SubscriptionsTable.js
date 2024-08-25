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

const CustomDataTable = (props) => {
  const [isModalOpen, setisModalOpen] = useState(false);
  const [gridData, setGridData] = useState(Array.from({ length: 5 }));
  const [loader, setLoader] = useState(true);
  const [dataForEdit, setDataForEdit] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [severity, setSeverity] = useState("")
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [responseMsg, setResponseMsg] = useState("")

  let [filterArray, setfilterArray] = useState({
    email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    phoneNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
    userName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  useEffect(() => {
    setLoader(props.loading);

    setGridData(props.gridData);
  }, [props.gridData]);

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

  const filterFooterTemplate = () => {
    return (
      <div className="px-3 pt-0 pb-3 text-center font-bold">Add rules</div>
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
    if (loader == true) {
      return <Skeleton></Skeleton>;
    }

    if (rowData.status == 1) {
      return <div>Active</div>;
    }
    else {
      return <div>InActive</div>;
    }
  };


  const CategoriesBodyTemplate = (rowData) => {
    if (loader == true) {
      return <Skeleton></Skeleton>;
    }
    else {
      var names = []
      let category = rowData?.categories?.split(",")
      // category?.forEach(element => {
      //   let filtered = props.CategoryDetails?.find(x => x.id ==parseInt(element))
      //   names.push(filtered?.name)
      // });

      // names = names.join(",")
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
      return <div>{effectedDate}</div>
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
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Adding 1 to the month since it's zero-based
    const year = date.getUTCFullYear();

    const formattedDateTime = `${hours}:${minutes} ${day}-${month}-${year}`;
    return formattedDateTime
  }

  return (
    <div>
      <div className="card">
        <DataTable
          value={loader ? Array.from({ length: 5 }) : gridData}
          paginator
          responsiveLayout="scroll"
          paginatorTemplate=" FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
          rows={20}
          rowsPerPageOptions={[20, 40, 60]}
          dataKey="id"
          filters={filterArray}
          filterDisplay="row"
          removableSort
        >

          <Column
            field="userName"
            header="Name"
            sortable
            filter
            filterPlaceholder="Search"
            style={{ width: "15%" }}
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            filterFooter={filterFooterTemplate}
            body={NameBodyTemplate}
          ></Column>

          <Column
            field="phoneNumber"
            header="Phone Number"
            sortable
            filter
            filterPlaceholder="Search"
            style={{ width: "10%" }}
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            filterFooter={filterFooterTemplate}
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
            filterFooter={filterFooterTemplate}
            body={EmailBodyTemplate}
          ></Column>

          <Column
            field="company"
            header="Company"
            sortable
            style={{ width: "8%" }}
            body={CompanyBodyTemplate}
          ></Column>

          <Column
            field="status"
            header="Status"
            sortable
            style={{ width: "8%" }}
            body={StatusBodyTemplate}
          ></Column>

          <Column
            field="billingPeriod"
            header="billing Period"
            sortable
            style={{ width: "20%" }}
            body={BillingPeriodBodyTemplate}
          ></Column>

          <Column
            field="categories"
            header="Categories"
            sortable
            style={{ width: "20%" }}
            body={CategoriesBodyTemplate}
          ></Column>


          <Column
            field="billingDate"
            header="Billing Date"
            sortable
            style={{ width: "20%" }}

            body={billingDateBodyTemplate}
          ></Column>

          {/* <Column
            field="effectedDate"
            header="Created Date"
            sortable           
            body={SubmissionDateTemplate}
          ></Column> */}

          {/* <Column
            field="userName"
            header="Created By"
            sortable          
            style={{ width: "16%" }}          
            body={CreatedByTemplate}
          ></Column> */}

          <Column header="Action" body={bodyTemplate} />
        </DataTable>
      </div>

      {/* {isModalOpen && (<SaveSubscriptionsModal
        dataForEdit={dataForEdit}
        modalopen={isModalOpen}
        onClose={() => setisModalOpen(false)}
        isEditMode={true}
        reloadData={() => reloadData()}

        
      />)} */}

      <Toast open={openSnackBar}
        severity={severity}
        handleClose={() => setOpenSnackBar(false)}
        message={responseMsg} />

      <ConfirmationDialog openConfirmModal={openConfirmation} acceptConfirmation={() => acceptConfirmation()} rejectConfirmation={() => rejectConfirmation()} />
    </div>
  );
};
export default CustomDataTable;
