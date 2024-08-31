import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Skeleton } from "primereact/skeleton";
import { billingApiServices } from '../../services/BillingApiService';
import Toast from "../alert/Toast";
import ConfirmationDialog from "../alert/ConfirmationDialog";
import XLSX from "xlsx";
import FileSaver from 'file-saver';
import { colors } from "@mui/material";

const CustomDataTable = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [dataForEdit, setDataForEdit] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [severity, setSeverity] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const [filterArray, setFilterArray] = useState({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IPLNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
    openDate: { value: null, matchMode: FilterMatchMode.EQUALS },
    publishDate: { value: null, matchMode: FilterMatchMode.EQUALS },
    effectedDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
    userName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    organizationName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    category: { value: null, matchMode: FilterMatchMode.CONTAINS },
    cityName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    newPaperName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  useEffect(() => {
    setLoader(props.loading);
    if (props.gridData?.length > 0 && !props.loading) {
      setGridData(props.gridData);
    }
  }, [props.gridData , props.loading]);

  const editTender = (data) => {
    setDataForEdit(data);
    props.editTender(data);
    setIsModalOpen(!isModalOpen);
  };

  
  const deleteTender = (data) => {
    console.log('Delete button clicked', data);
    setDataForEdit(data);
    setOpenConfirmation(true);
  };
  

  const acceptConfirmation = () => {
    console.log('Accept confirmation clicked', dataForEdit);
    if (dataForEdit != null) {
      deleteRecords();
    }
  };
  

  const deleteRecords = () => {
    setOpenConfirmation(false);
  
    const body = {
      id: dataForEdit?.id,
    };
  
    billingApiServices.deleteTender(body).then((response) => {
      console.log('Delete response', response);
      if (response == null || response == undefined) {
        handleToast("error", "Operation failed, check your internet connection");
        return;
      }
  
      if (response?.data?.status) {
        handleToast("success", response?.data?.message);
        setDataForEdit(null);
        props.reloadData();
      } else {
        handleToast("error", response?.data?.message);
      }
    }).catch((error) => {
      console.error('Error during deletion:', error);
      handleToast("error", "An error occurred while deleting the record.");
    });
  };
  

  const handleDownload = (currentRow) => {
    const imgURL = currentRow.tenderImage;
    window.open(imgURL, '_blank');
  };

  const reloadData = () => {
    props.reloadData();
  };

  const handleToast = (severity, message) => {
    setSeverity(severity);
    setResponseMsg(message);
    setOpenSnackBar(true);
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };

  const rejectConfirmation = () => {
    setOpenConfirmation(false);
  };

  const exportToExcel = () => {
    let fileName = 'Tenders';

    const response = selectedRows.map((d) => ({
      IPLNumber: d.IPLNumber,
      name: d.name,
      organizationName: d.organizationName,
      category: d.category,
      cityName: d.cityName,
      publishDate: d.publishDate,
      newPaperName: d.newPaperName,
      tenderImage: d.tenderImage,
    }));

    const ws = XLSX.utils.json_to_sheet(response);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataToSave = new Blob([excelBuffer], { type: "application/octet-stream" });
    FileSaver.saveAs(dataToSave, `${fileName}.xlsx`);
  };

  const convertDateBestFormate = (inputDateTime) => {
    const date = new Date(inputDateTime);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${hours}:${minutes} ${day}-${month}-${year}`;
  };

  const bodyTemplate = (rowData) => loader ? (
    <Skeleton shape="circle" size="2rem" className="mr-2"></Skeleton>
  ) : (
    <span>
      <span style={{ margin: "5px" }}>
        <i onClick={() => editTender(rowData)} className="pi pi-pencil"></i>
      </span>
      <i onClick={() => deleteTender(rowData)} className="pi pi-trash"></i>
    </span>
  );

  const filterClearTemplate = (options) => (
    <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} className="p-button-secondary"></Button>
  );

  const filterApplyTemplate = (options) => (
    <Button type="button" icon="pi pi-check" onClick={options.filterApplyCallback} className="p-button-success"></Button>
  );

  const IPLNumberTemplate = (rowData) => loader ? <Skeleton /> : <div>{rowData.IPLNumber}</div>;
  const NameTemplate = (rowData) => loader ? <Skeleton /> : <div>{rowData.name}</div>;
  const OrganizationBodyTemplate = (rowData) => loader ? <Skeleton /> : <div>{rowData.organizationName}</div>;
  const CategoryBodyTemplate = (rowData) => loader ? <Skeleton /> : <div>{rowData.category}</div>;
  const CityBodyTemplate = (rowData) => loader ? <Skeleton /> : <div>{rowData.cityName}</div>;
  const NewsPaperBodyTemplate = (rowData) => loader ? <Skeleton /> : <div>{rowData.newPaperName}</div>;
  const SubmissionDateTemplate = (rowData) => loader ? <Skeleton /> : <div>{convertDateBestFormate(rowData.effectedDate)}</div>;
  const PublishDateTemplate = (rowData) => loader ? <Skeleton /> : <div>{convertDateBestFormate(rowData.publishDate)}</div>;
  const CreatedByTemplate = (rowData) => loader ? <Skeleton /> : <div>{rowData.userName}</div>;
  const TenderImageTemplate = (rowData) => loader ? <Skeleton /> : (
    <div style={{ cursor: "pointer" }} onClick={() => handleDownload(rowData)}>
      <i className="fa-duotone fa-download"></i>
    </div>
  );

  return (
    <div>
      <button style={{ position: 'relative', bottom: 42 }} className="btn-style" onClick={exportToExcel}>Export</button>
      <div className="container-fluid ">
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
          <Column field="IPLNumber" header="IPL Number" sortable filter filterPlaceholder="Search" style={{ width: "10%" }} filterClear={filterClearTemplate} filterApply={filterApplyTemplate} body={IPLNumberTemplate}></Column>
          <Column field="name" header="Title" sortable filter filterPlaceholder="Search" style={{ width: "10%" }} filterApply={filterApplyTemplate} body={NameTemplate}></Column>
          <Column field="organizationName" header="Organization" sortable filter filterPlaceholder="Search" style={{ width: "10%" }} filterApply={filterApplyTemplate} body={OrganizationBodyTemplate}></Column>
          <Column field="category" header="Category" sortable filter filterPlaceholder="Search" style={{ width: "10%" }} filterApply={filterApplyTemplate} body={CategoryBodyTemplate}></Column>
          <Column field="cityName" header="City" sortable filter filterPlaceholder="Search" style={{ width: "10%" }} filterApply={filterApplyTemplate} body={CityBodyTemplate}></Column>
          <Column field="publishDate" header="Publish Date" sortable filter filterPlaceholder="Search" style={{ width: "10%" }} filterApply={filterApplyTemplate} body={PublishDateTemplate}></Column>
          <Column field="effectedDate" header="Submit Date" sortable filter filterPlaceholder="Search" style={{ width: "10%" }} filterApply={filterApplyTemplate} body={SubmissionDateTemplate}></Column>
          <Column field="newPaperName" header="Newspaper" sortable filter filterPlaceholder="Search" style={{ width: "10%" }} filterApply={filterApplyTemplate} body={NewsPaperBodyTemplate}></Column>
          <Column field="userName" header="Created By" sortable filter filterPlaceholder="Search" style={{ width: "10%" }} filterApply={filterApplyTemplate} body={CreatedByTemplate}></Column>
          <Column field="tenderImage" header="Download" sortable filter filterPlaceholder="Search" style={{ width: "10%" }} body={TenderImageTemplate}></Column>
          <Column field="id" header="Action"  body={bodyTemplate}></Column>
        </DataTable>
      </div>
    
                  <Toast open={openSnackBar}
                severity={severity}
                handleClose={() => setOpenSnackBar(false)}
                message={responseMsg} />

            <ConfirmationDialog 
            openConfirmModal={openConfirmation} 
            acceptConfirmation={() => acceptConfirmation()} 
            rejectConfirmation={() => rejectConfirmation()} />

    </div>
  );
};

export default CustomDataTable;