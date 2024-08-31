import React, { useState, useEffect } from "react";
import SaveOrganizationModal from "./SaveOrganizationModal";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Skeleton } from "primereact/skeleton";
import ConfirmationDialog from "./../alert/ConfirmationDialog";
import { billingApiServices } from '../../services/BillingApiService';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import Toast from "../alert/Toast"
import { localStorageService } from "../../services/LocalStorageService";
import ImportFile from "./ImportFile";

const CustomDataTable = (props) => {
  const [isModalOpen, setisModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [gridData, setGridData] = useState(Array.from({ length: 5 }));
  const [loader, setLoader] = useState(true);
  const [dataForEdit, setDataForEdit] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [severity, setSeverity] = useState("")
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [responseMsg, setResponseMsg] = useState("")
  const [selectedRows, setSelectedRows] = useState([])
  const _userData = localStorageService.getPersistedData("USER_DETAILS")
  const [names, setNames] = useState([]);
  const [stateManager, setStateManager] = useState(0);


  let [filterArray, setfilterArray] = useState({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    effectedDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
    userName: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

  const deleteRecords = () => {
    setOpenConfirmation(false)

    const body = {
      id: dataForEdit?.id
    }

    billingApiServices.deleteOrganization(body).then((response) => {
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
        handleToast("error", "associated with some tenders,please remove the tender at first.")
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
    let fileName = 'Organizations'

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


  const importRecords = (data) => {

    const body = {
      values: data,
      effectedBy: _userData?.id
    }

    billingApiServices.importToExcel(body).then((response) => {
      if (response == null || response == undefined) {
        handleToast("error", "associated with some tenders,please remove the tender at first.")
        return
      }

      if (response?.data?.status) {

        handleToast("success", response?.data?.message)
        props.reloadData()
      }
      else {
        handleToast("error", "associated with some tenders,please remove the tender at first.")
      }
    });


  }

  const handleImport=()=>{
    setIsOpen(true)
    setStateManager(new Date()?.toString())
    setStateManager(new Date()?.toString())
  }

  

  return (
    <div>
      <button style={{
        position: 'relative', bottom: 42
      }} className="btn-style" onClick={() => exportToExcel()}>Export</button>

      <button style={{
        position: 'relative', bottom: 42,marginLeft:5
      }} className="btn-style" onClick={() => handleImport()}>Import</button>
    
      <div className="container-fluid " >

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
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>

          <Column
            field="name"
            header="Name"
            sortable
            filter
            filterPlaceholder="Search"
            style={{ width: "30%" }}
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
            style={{ width: "25%" }}
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
            style={{ width: "25%" }}
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            filterFooter={filterFooterTemplate}
            body={CreatedByTemplate}
          ></Column>

          <Column header="Action" body={bodyTemplate} />
        </DataTable>
      </div>

      {isModalOpen && (<SaveOrganizationModal
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
      <ImportFile reloadData={() => reloadData()}  onHide={()=>setIsOpen(false)} isOpen={isOpen} Type="Organization" />

      <ConfirmationDialog openConfirmModal={openConfirmation} acceptConfirmation={() => acceptConfirmation()} rejectConfirmation={() => rejectConfirmation()} />
    </div>
  );
};
export default CustomDataTable;








// import React, { useState, useEffect } from "react";
// import SaveOrganizationModal from "./SaveOrganizationModal";
// import ConfirmationDialog from "./../alert/ConfirmationDialog";
// import { billingApiServices } from '../../services/BillingApiService';
// import * as XLSX from 'xlsx';
// import FileSaver from 'file-saver';
// import Toast from "../alert/Toast";
// import { localStorageService } from "../../services/LocalStorageService";
// import ImportFile from "./ImportFile";

// const CustomDataTable = (props) => {
//   const [isModalOpen, setisModalOpen] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [gridData, setGridData] = useState([]);
//   const [loader, setLoader] = useState(true);
//   const [dataForEdit, setDataForEdit] = useState(null);
//   const [openConfirmation, setOpenConfirmation] = useState(false);
//   const [severity, setSeverity] = useState("");
//   const [openSnackBar, setOpenSnackBar] = useState(false);
//   const [responseMsg, setResponseMsg] = useState("");
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [searchTerm, setSearchTerm] = useState(""); // State to store search term
//   const [currentPage, setCurrentPage] = useState(1); // State for current page
//   const itemsPerPage = 25; // Number of items per page
//   const _userData = localStorageService.getPersistedData("USER_DETAILS");

//   useEffect(() => {
//     setLoader(props.loading);
//     setGridData(props.gridData);
//   }, [props.gridData]);

//   // Function to handle search input change
//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   // Function to filter data based on search term
//   const filteredData = gridData.filter((item) => {
//     return (
//       item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.effectedDate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.userName?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   });

//   // Calculate the total number of pages
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   // Get data for the current page
//   const paginatedData = filteredData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // Calculate the start and end record numbers for the current page
//   const startRecord = (currentPage - 1) * itemsPerPage + 1;
//   const endRecord = Math.min(currentPage * itemsPerPage, filteredData.length);

//   // Handle Next button click
//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   // Handle Previous button click
//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };


//   const editCategory = (data) => {
//     setDataForEdit(data);
//     setisModalOpen(!isModalOpen);
//   };

//   const deleteCategory = (data) => {
//     setDataForEdit(data);
//     setOpenConfirmation(true);
//   };

//   const acceptConfirmation = () => {
//     if (dataForEdit != null) {
//       deleteRecords();
//     }
//   };

//   const deleteRecords = () => {
//     setOpenConfirmation(false);

//     const body = {
//       id: dataForEdit?.id,
//     };

//     billingApiServices.deleteOrganization(body).then((response) => {
//       if (!response) {
//         handleToast("error", "Associated with some tenders, please remove the tender first.");
//         return;
//       }

//       if (response?.data?.status) {
//         handleToast("success", response?.data?.message);
//         setDataForEdit(null);
//         props.reloadData();
//       } else {
//         handleToast("error", response?.data?.message)
//       }
//     });
//   };

//   const reloadData = () => {
//     props.reloadData();
//   };

//   const handleToast = (severity, message) => {
//     setSeverity(severity);
//     setResponseMsg(message);
//     setOpenSnackBar(true);
//     setTimeout(() => {
//       setOpenSnackBar(false);
//     }, 2000);
//   };

//   const rejectConfirmation = () => {
//     setOpenConfirmation(false);
//   };

//   const exportToExcel = async () => {
//     let fileName = 'Organizations';

//     const response = selectedRows.map((d) => ({
//       name: d.name,
//     }));

//     let ws = XLSX.utils.json_to_sheet(response);
//     let wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
//     let excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     let dataToSave = new Blob([excelBuffer], { type: "application/octet-stream" });
//     fileName = fileName + ".xlsx";
//     FileSaver.saveAs(dataToSave, fileName);
//   };

//   const importRecords = (data) => {
//     const body = {
//       values: data,
//       effectedBy: _userData?.id,
//     };

//     billingApiServices.importToExcel(body).then((response) => {
//       if (!response) {
//         handleToast("error", "Associated with some tenders, please remove the tender first.");
//         return;
//       }

//       if (response?.data?.status) {
//         handleToast("success", response?.data?.message);
//         props.reloadData();
//       } else {
//         handleToast("error", "Associated with some tenders, please remove the tender first.");
//       }
//     });
//   };

//   const handleImport = () => {
//     setIsOpen(true);
//   };

//   return (
//     <div className="container mt-4">
//       <div className="d-flex justify-content-between mb-3">
//         <div>
//           <button className="btn btn-primary me-2" onClick={exportToExcel}>
//             Export
//           </button>
//           <button className="btn btn-secondary" onClick={handleImport}>
//             Import
//           </button>
//         </div>
//         <input
//           type="text"
//           className="form-control w-25"
//           placeholder="Search..."
//           value={searchTerm}
//           onChange={handleSearch}
//         />
//       </div>

//       <table className="table table-bordered table-hover">
//         <thead className="thead-dark">
//           <tr>
//             <th>Name</th>
//             <th>Created Date</th>
//             <th>Created By</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loader
//             ? Array.from({ length: 5 }).map((_, index) => (
//                 <tr key={index}>
//                   <td colSpan="4">
//                     <div className="spinner-border" role="status">
//                       <span className="visually-hidden">Loading...</span>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             : paginatedData.map((rowData, index) => (
//                 <tr key={index}>
//                   <td>{rowData.name}</td>
//                   <td>{rowData.effectedDate}</td>
//                   <td>{rowData.userName}</td>
//                   <td>
//                     <button
//                       className="btn btn-sm btn-warning me-2"
//                       onClick={() => editCategory(rowData)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="btn btn-sm btn-danger"
//                       onClick={() => deleteCategory(rowData)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//         </tbody>
//       </table>

//           {/* Pagination Controls */}
//           <div className="d-flex justify-content-between align-items-center mt-3">
//         <button
//           className="btn btn-outline-secondary"
//           onClick={handlePreviousPage}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         {/* Displaying current record range */}
//         <span>
//           Records: {startRecord} to {endRecord}
//         </span>
//         <button
//           className="btn btn-outline-secondary"
//           onClick={handleNextPage}
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>

//       {isModalOpen && (
//         <SaveOrganizationModal
//           dataForEdit={dataForEdit}
//           modalopen={isModalOpen}
//           onClose={() => setisModalOpen(false)}
//           isEditMode={true}
//           reloadData={reloadData}
//         />
//       )}

//       <Toast
//         open={openSnackBar}
//         severity={severity}
//         handleClose={() => setOpenSnackBar(false)}
//         message={responseMsg}
//       />
//       <ImportFile
//         reloadData={reloadData}
//         onHide={() => setIsOpen(false)}
//         isOpen={isOpen}
//         Type="Organization"
//       />

//       <ConfirmationDialog
//         openConfirmModal={openConfirmation}
//         acceptConfirmation={acceptConfirmation}
//         rejectConfirmation={rejectConfirmation}
//       />
//     </div>
//   );
// };

// export default CustomDataTable;
