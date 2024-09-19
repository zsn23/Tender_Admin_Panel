import React, { useState, useEffect } from "react";
import SaveCityModal from "./SaveCityModal";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Skeleton } from "primereact/skeleton";
import ConfirmationDialog from "../alert/ConfirmationDialog";
import { billingApiServices } from '../../services/BillingApiService';
import { ConfirmDialog } from "primereact/confirmdialog";
import Toast from "../alert/Toast"
import XLSX from "xlsx";
import FileSaver from 'file-saver';
import ImportFile from "./../organizations/ImportFile";

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
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [stateManager, setStateManager] = useState(0);

  let [filterArray, setfilterArray] = useState({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    effectedDate: { value: null, matchMode: FilterMatchMode.CONTAINS },

  });

  useEffect(() => {
    setLoader(props.loading);
    setGridData(props.gridData);
  }, [props.gridData]);

  const editCategory = (data) => {
    setDataForEdit(data);
    setisModalOpen(!isModalOpen);
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
    setDeleteDialogVisible(true);

    setOpenConfirmation(false)

    const body = {
      id: dataForEdit?.id
    }

    billingApiServices.deleteCity(body).then((response) => {
      if (response == null || response == undefined) {
        handleToast("error", "associated with some tenders,please remove the tender at first.")
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
        icon="fa-regular fa-money-check-pen"
        onClick={() => editCategory(rowData)}
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
      return <div>{rowData.name}</div>;
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



  const convertDateBestFormate = (inputDateTime) => {

    const date = new Date(inputDateTime);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Adding 1 to the month since it's zero-based
    const year = date.getUTCFullYear();

    const formattedDateTime = `${day}-${month}-${year}`;
    return formattedDateTime
  }

  const exportToExcel = () => {
    let fileName = 'Cities';

    const response = selectedRows.map((d) => ({
      name: d.name,
      CreatedDate: d.effectedDate,
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

  const handleImport=()=>{
    setIsOpen(true)
    setStateManager(new Date()?.toString());
  }

  return (
   
      <div className="container-fluid mb-5" >
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
        header="CITIES RECORD"
          value={loader ? Array.from({ length: 5 }) : gridData}
          paginator
          responsiveLayout="scroll"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink  LastPageLink CurrentPageReport"
         
       
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

<Column selectionMode="multiple" header={customExportTemplate} headerStyle={{ width: '5%' }}></Column>

          <Column field="id" header="ID"
          sortable
          filter 
          showFilterMenu={false}  
          filterElement={
            <div className="downloadImg d-flex align-items-center flex-column m-0 p-0">
          <i class="fa-sharp-duotone fa-solid fa-rectangle-list fs-5"></i>
            </div>
          }  
          headerStyle={{ width: '5%' }}
        ></Column>
        
          <Column
            field="name"
            header="Name"
            sortable
            filter
            filterPlaceholder="Search"
            
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            
            body={NameBodyTemplate}
          ></Column>
          <Column
            field="effectedDate"
            header="Created Date"
            sortable
            filter
            filterPlaceholder="Search"
          
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            
            body={SubmissionDateTemplate}
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
     

      {isModalOpen && (<SaveCityModal
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

<ImportFile reloadData={() => reloadData()} onHide={() => setIsOpen(false)} isOpen={isOpen} Type="Cities" />


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
