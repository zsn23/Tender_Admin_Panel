import React, { useState, useEffect } from "react";
import SaveSettingModal from "./SaveSettingModal";
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
    sliderMessage: { value: null, matchMode: FilterMatchMode.CONTAINS },
    phoneNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
 });

  useEffect(() => {
    setLoader(props.loading);
    setGridData(props.gridData)
  }, [props.gridData]);

  const editSetting = (data) => {
    setDataForEdit(data);
    setisModalOpen(!isModalOpen);
  };

  const deleteSetting = (data) => {
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

    billingApiServices.deleteFAQ(body).then((response) => {
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

  const bodyTemplate = (rowData) => loader ? (
    <Skeleton shape="circle" size="1rem" className="mr-2" />
  ) : (
    <div style={{ display: 'flex', alignItems: 'center' , justifyContent:"center " }}>
      <Button
        icon="pi pi-pencil"
        onClick={() => editSetting(rowData)}
        className="p-button-rounded p-button-warning my-2"
        style={{ margin: '0.5rem' }} // Optional: adds spacing between buttons
      />
    </div>
  );

  const customHeaderTemplate = () => (
  
    <div >
    <span>Action</span>
    <i className="pi pi-wrench" style={{ fontSize: '13px' ,marginLeft : "3px" }} ></i>
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
      return <div>{rowData.sliderMessage}</div>;
    }
  };

  const answerBodyTemplate = (rowData) => {
    if (loader == true) {
      return <Skeleton></Skeleton>;
    } 
    else {
      return <div>{rowData.phoneNumber}</div>;
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
    
      <div className="container-fluid" >
        <DataTable
          header="TENDER SETTINGS"
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
        >

          <Column
            field="sliderMessage"
            header="Message"
            sortable
            filter
            filterPlaceholder="Search"
          
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            
            body={NameBodyTemplate}
          ></Column>
           <Column
            field="phoneNumber"
            header="PhoneNumber"
            sortable
            filter
            filterPlaceholder="Search"
           
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            
            body={answerBodyTemplate}
          ></Column>
         
         <Column field="id" header={customHeaderTemplate}  body={bodyTemplate}></Column>

        </DataTable>
      

      {isModalOpen && (<SaveSettingModal
        dataForEdit={dataForEdit}
        modalopen={isModalOpen}
        onClose={() => setisModalOpen(false)}
        isEditMode={true}
        reloadData={() => reloadData()}
      />)}

      <Toast open={openSnackBar}
        severity={severity}
        handleClose={() => setOpenSnackBar(false)}
        message={responseMsg} />

      <ConfirmationDialog openConfirmModal={openConfirmation} acceptConfirmation={() => acceptConfirmation()} rejectConfirmation={() => rejectConfirmation()} />
    </div>
  );
};
export default CustomDataTable;
