import React, { useState, useEffect } from "react";
import SaveCategoryModal from "./SaveCategoryModal";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Skeleton } from "primereact/skeleton";
import ConfirmationDialog from "./../alert/ConfirmationDialog";
import { billingApiServices } from '../../services/BillingApiService';
import Toast from "../alert/Toast"
import XLSX from "xlsx";
import FileSaver from 'file-saver';import ImportFile from "./../organizations/ImportFile";


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
  const [isOpen, setIsOpen] = useState(false);
  const [stateManager, setStateManager] = useState(0);
  let [filterArray, setfilterArray] = useState({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    effectedDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
    userName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  useEffect(() => {
    setLoader(props.loading);
    setGridData(props.gridData)
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

  const deleteRecords = () => {
    setOpenConfirmation(false)
    const body = {
      categoryId: dataForEdit?.id
    }

    billingApiServices.deleteCategory(body).then((response) => {
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
        <span style={{ margin: "5px" }}> <i onClick={() => editCategory(rowData)} className="pi pi-pencil "></i>    </span>
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

  const exportToExcel = async () => {
    let fileName = 'Categories'

    var response = selectedRows.map((d) => (
      {
        name: d.name,     
      }
    ))

    let ws = XLSX.utils.json_to_sheet(response);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    let excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    let dataToSave = new Blob([excelBuffer], { type: "application/octet-stream" });
    fileName = fileName + ".xlsx"
    FileSaver.saveAs(dataToSave, fileName);
  }
  const handleImport=()=>{
    setIsOpen(true)
    setStateManager(new Date()?.toString())
    setStateManager(new Date()?.toString())
  }
  return (
    <div>
      <button style={{
        position:'relative',bottom:42
      }} className="btn-style" onClick={() => exportToExcel()}>Export</button>
 <button style={{
        position: 'relative', bottom: 42, marginLeft: 5
      }} className="btn-style" onClick={() => handleImport()}>Import</button>
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
          selectionMode={'checkbox'}
          selection={selectedRows}
          onSelectionChange={(e) => setSelectedRows(e.value)}
        >
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>

          <Column
            field="name"
            header="Name"
            sortable
            filter
            filterPlaceholder="Search"
            style={{ width: "50%" }}
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            filterFooter={filterFooterTemplate}
            body={NameBodyTemplate}
          ></Column>
          <Column
            field="effectedDate"
            header="Created Date"
            sortable
            filter
            filterPlaceholder="Search"
            style={{ width: "16%" }}
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            filterFooter={filterFooterTemplate}
            body={SubmissionDateTemplate}
          ></Column>

          <Column
            field="userName"
            header="Created By"
            sortable
            filter
            filterPlaceholder="Search"
            style={{ width: "16%" }}
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            filterFooter={filterFooterTemplate}
            body={CreatedByTemplate}
          ></Column>

          <Column header="Action" body={bodyTemplate} />
        </DataTable>
      </div>

      {isModalOpen && (<SaveCategoryModal
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

<ImportFile reloadData={() => reloadData()} onHide={() => setIsOpen(false)} isOpen={isOpen} Type="Category" />
      <ConfirmationDialog openConfirmModal={openConfirmation} acceptConfirmation={() => acceptConfirmation()} rejectConfirmation={() => rejectConfirmation()} />
    </div>
  );
};
export default CustomDataTable;
