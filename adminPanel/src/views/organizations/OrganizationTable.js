// import React, { useState, useEffect } from "react";
// import SaveOrganizationModal from "./SaveOrganizationModal";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import { Button } from "primereact/button";
// import { FilterMatchMode } from "primereact/api";
// import { Skeleton } from "primereact/skeleton";
// import ConfirmationDialog from "./../alert/ConfirmationDialog";
// import { ConfirmDialog } from "primereact/confirmdialog";
// import { billingApiServices } from '../../services/BillingApiService';
// import * as XLSX from 'xlsx';
// import FileSaver from 'file-saver';
// import Toast from "../alert/Toast"
// import { localStorageService } from "../../services/LocalStorageService";
// import ImportFile from "./ImportFile";

// const CustomDataTable = (props) => {
//   const [isModalOpen, setisModalOpen] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);

//   const [gridData, setGridData] = useState(Array.from({ length: 5 }));
//   const [loader, setLoader] = useState(true);
//   const [dataForEdit, setDataForEdit] = useState(null);
//   const [openConfirmation, setOpenConfirmation] = useState(false);
//   const [severity, setSeverity] = useState("")
//   const [openSnackBar, setOpenSnackBar] = useState(false)
//   const [responseMsg, setResponseMsg] = useState("")
//   const [selectedRows, setSelectedRows] = useState([])
//   const _userData = localStorageService.getPersistedData("USER_DETAILS")
//   const [names, setNames] = useState([]);
//   const [stateManager, setStateManager] = useState(0);
//   const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

//   const [first, setFirst] = useState(0); // Index of the first record to display
//   const [rows, setRows] = useState(25); // Number of rows per page


//   let [filterArray, setfilterArray] = useState({
//     name: { value: null, matchMode: FilterMatchMode.CONTAINS },
//     effectedDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
//     userName: { value: null, matchMode: FilterMatchMode.CONTAINS },
//     id: { value: null, matchMode: FilterMatchMode.CONTAINS },
//   });

//   useEffect(() => {
//     setLoader(props.loading);
//     setGridData(props.gridData);
//   }, [props.gridData]);

//   const editCategory = (data) => {
//     setDataForEdit(data);
//     setisModalOpen(!isModalOpen);
//   };

//   const deleteCategory = (data) => {
//     setDataForEdit(data);
//     setOpenConfirmation(true)
//   };

//   const acceptConfirmation = () => {
//     if (dataForEdit != null) {
//       deleteRecords()
//     }
//   }
//   const confirmDelete = (data) => {
//     setDataForEdit(data);
//     setDeleteDialogVisible(true);
//   };


//   const deleteRecords = () => {
//     setDeleteDialogVisible(true);
//     setOpenConfirmation(false)

//     const body = {
//       id: dataForEdit?.id
//     }

//     billingApiServices.deleteOrganization(body).then((response) => {
//       if (response == null || response == undefined) {
//         handleToast("error", "associated with some tenders,please remove the tender at first.")
//         return
//       }

//       if (response?.data?.status) {

//         handleToast("success", response?.data?.message)
//         setDataForEdit(null)
//         props.reloadData()
//       }
//       else {
//         handleToast("error", "associated with some tenders,please remove the tender at first.")
//       }
//     });


//   }

//   const reloadData = () => {
//     props.reloadData()
//   }

//   const handleToast = (severity, message) => {
//     setSeverity(severity)
//     setResponseMsg(message)
//     setOpenSnackBar(true)
//     setTimeout(() => {
//       setOpenSnackBar(false)
//     }, 2000);
//   }

//   const rejectConfirmation = () => {
//     setOpenConfirmation(false)
//   }

//   const bodyTemplate = (rowData) => loader ? (
//     <Skeleton shape="circle" size="1rem" className="mr-2" />
//   ) : (
//     <div style={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
//       <Button
//         icon="fa-regular fa-money-check-pen"
//         onClick={() => editCategory(rowData)}
//         className="p-button-rounded p-button-warning my-2"
//         style={{ margin: '0.5rem' }} // Optional: adds spacing between buttons
//       />
//       <Button
//         icon="fa-regular fa-trash-can-xmark"
//         onClick={() => confirmDelete(rowData)}
//         className="p-button-rounded p-button-warning"
//         style={{ margin: '0.5rem' }}
//       />



//     </div>
//   );
//   const customHeaderTemplate = () => (

//     <div >
//       <span>Action</span>
//      < i class="fa-sharp fa-solid fa-wrench" style={{ fontSize: '14px', marginLeft: "3px" ,marginTop:"3px" }}></i>
//     </div>
//   );

//   const filterClearTemplate = (options) => {
//     return (
//       <Button
//         type="button"
//         icon="pi pi-times"
//         onClick={options.filterClearCallback}
//         className="p-button-secondary"
//       ></Button>
//     );
//   };

//   const filterApplyTemplate = (options) => {
//     return (
//       <Button
//         type="button"
//         icon="pi pi-check"
//         onClick={options.filterApplyCallback}
//         className="p-button-success"
//       ></Button>
//     );
//   };



//   const NameBodyTemplate = (rowData) => {
//     if (loader == true) {
//       return <Skeleton></Skeleton>;
//     }
//     else {
//       return <div>{rowData.name}</div>;
//     }
//   };

//   const SubmissionDateTemplate = (rowData) => {
//     if (loader == true) {
//       return <Skeleton></Skeleton>;
//     } else {
//       var effectedDate = convertDateBestFormate(rowData.effectedDate)
//       return <div>{effectedDate}</div>
//     }
//   };

//   const CreatedByTemplate = (rowData) => {
//     if (loader == true) {
//       return <Skeleton></Skeleton>;
//     } else {

//       return <div>{rowData?.userName}</div>
//     }
//   };

//   const convertDateBestFormate = (inputDateTime) => {

//     const date = new Date(inputDateTime);
//     const hours = date.getUTCHours().toString().padStart(2, '0');
//     const minutes = date.getUTCMinutes().toString().padStart(2, '0');
//     const day = date.getUTCDate().toString().padStart(2, '0');
//     const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Adding 1 to the month since it's zero-based
//     const year = date.getUTCFullYear();

//     const formattedDateTime = `${hours}:${minutes} ${day}-${month}-${year}`;
//     return formattedDateTime
//   }

//   const exportToExcel = async () => {
//     let fileName = 'Organizations'

//     var response = selectedRows.map((d) => (
//       {
//         name: d.name,
//         CreadtedDate: d.effectedDate,
//       }
//     ))

//     let ws = XLSX.utils.json_to_sheet(response);
//     let wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
//     let excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     let dataToSave = new Blob([excelBuffer], { type: "application/octet-stream" });
//     fileName = fileName + ".xlsx"
//     FileSaver.saveAs(dataToSave, fileName);
//   }


//   const importRecords = (data) => {

//     const body = {
//       values: data,
//       effectedBy: _userData?.id
//     }

//     billingApiServices.importToExcel(body).then((response) => {
//       if (response == null || response == undefined) {
//         handleToast("error", "associated with some tenders,please remove the tender at first.")
//         return
//       }

//       if (response?.data?.status) {

//         handleToast("success", response?.data?.message)
//         props.reloadData()
//       }
//       else {
//         handleToast("error", "associated with some tenders,please remove the tender at first.")
//       }
//     });


//   }

//   const handleImport = () => {
//     setIsOpen(true)
//     setStateManager(new Date()?.toString())
//   }

//   const customExportTemplate = () => (
//     <div className="d-flex align-items-center">
//       <span>Export</span>
//       <i class="fa-sharp fa-solid fa-file-excel" style={{ fontSize: '16px', marginLeft: "5px"}}></i>
//     </div>
//   );



//   return (



//     <div className="container-fluid mb-5" >
//  <div className="d-flex justify-content-end" style={{ position:'relative',bottom:42,marginTop:'5px'}}>

// <div>
// <button style={{ cursor: selectedRows.length === 0 ? 'not-allowed' : 'pointer'  }} className="btn-style p-2 d-flex align-items-center gap-1" onClick={exportToExcel} disabled={selectedRows.length === 0}>
//   <i className="fa-thin fa-file-export" style={{ fontSize: "18px" }}> </i> Export
// </button>
// </div>

// <div>
// <button style={{ marginLeft: 5 }} className="btn-style p-2 d-flex align-items-center gap-1" onClick={() => handleImport()}>
//   <i className="fa-thin fa-file-import" style={{ fontSize: "18px" }}> </i> Import
// </button>
// </div>


// </div>


//         <DataTable
//         header="ORAGANIZATION RECORDS"
//         value={loader ? Array.from({ length: 5 }) : gridData}
//         paginator
//         responsiveLayout="scroll"
//         sortField="effectedDate" 
//         sortOrder={-1 }

//         paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
//         currentPageReportTemplate={`ON PAGE ${Math.floor(first / rows) + 1} : RECORDS {first} to {last}`}
//         rows={rows}
//         first={first}
//         onPage={(e) => {
//           setFirst(e.first);
//           setRows(e.rows);
//         }}

//         dataKey="id"
//         filters={filterArray}
//         filterDisplay="row"
//         removableSort

//         selectionMode={'checkbox'}
//         selection={selectedRows}
//         onSelectionChange={(e) => setSelectedRows(e.value)}
//       >
//         <Column selectionMode="multiple" header={customExportTemplate} headerStyle={{ width: '5%' }} 
        
//         ></Column>
        
//         <Column field="id" header="ID"
//           sortable
//           filter 
//           showFilterMenu={false}  
//           filterElement={
//             <div className="downloadImg d-flex align-items-center flex-column m-0 p-0">
//           <i class="fa-sharp-duotone fa-solid fa-rectangle-list fs-5"></i>
//             </div>
//           }  
//           headerStyle={{ width: '5%' }}
//         ></Column>
        
        

        

//         <Column
//           field="name"
//           header="Name"
//           sortable
//           filter
//           filterPlaceholder="Search"

//           filterClear={filterClearTemplate}
//           filterApply={filterApplyTemplate}

//           body={NameBodyTemplate}
//         ></Column>
//         <Column
//           field="effectedDate"
//           header="Created Date"
//           sortable
//           filter
//           filterPlaceholder="Search"

//           filterClear={filterClearTemplate}
//           filterApply={filterApplyTemplate}

//           body={SubmissionDateTemplate}
//         ></Column>

//         {/* <Column
//             field="userName"
//             header="Created By"
//             sortable
//             filter
//             filterPlaceholder="Search"
           
//             filterClear={filterClearTemplate}
//             filterApply={filterApplyTemplate}
            
//             body={CreatedByTemplate}
//           ></Column> */}

//         <Column header={customHeaderTemplate} body={bodyTemplate} 
//          filter 
//          showFilterMenu={false}  
//          filterElement={
//            <div className="downloadImg d-flex align-items-center flex-column m-0 p-0">
//              <span className="downloadImgheading">EDIT</span>
//              <span className="downloadImgheading"> DELETE</span>
//            </div>
//          }  
//          headerStyle={{ width: '5%' }}
//          />

//       </DataTable>


//       {isModalOpen && (<SaveOrganizationModal
//         dataForEdit={dataForEdit}
//         modalopen={isModalOpen}
//         onClose={() => setisModalOpen(false)}
//         isEditMode={true}
//         reloadData={() => reloadData()}
//       />)}

//       <Toast open={openSnackBar}
//         severity={severity}
//         handleClose={() => setOpenSnackBar(false)}
//         message={responseMsg} />

//       <ImportFile reloadData={() => reloadData()} onHide={() => setIsOpen(false)} isOpen={isOpen} Type="Organization" />

//       <ConfirmDialog
//         visible={deleteDialogVisible}
//         onHide={() => setDeleteDialogVisible(false)}
//         message="Are you sure you want to delete this record?"
//         header="Confirmation"
//         icon="pi pi-exclamation-triangle"
//         accept={deleteRecords}
//         reject={() => setDeleteDialogVisible(false)}
//       />
//     </div>
//   );
// };
// export default CustomDataTable;












import React, { useState, useEffect } from "react";
import SaveOrganizationModal from "./SaveOrganizationModal";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Skeleton } from "primereact/skeleton";
import ConfirmationDialog from "./../alert/ConfirmationDialog";
import { ConfirmDialog } from "primereact/confirmdialog";
import { billingApiServices } from '../../services/BillingApiService';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import Toast from "../alert/Toast"
import { localStorageService } from "../../services/LocalStorageService";
import ImportFile from "./ImportFile";

const CustomDataTable = (props) => {
  const [isModalOpen, setisModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // const [gridData, setGridData] = useState(Array.from({ length: 5 }));
  const [gridData, setGridData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [totalRecord, setTotalRecords] = useState(0); // Total records state

  const [sortField, setSortField] = useState('effectedDate'); // For storing current sort field
  const [sortOrder, setSortOrder] = useState(1); // 1 for 'asc', -1 for 'desc'
  const [loading, setLoading] = useState(true);


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
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);



  let [filterArray, setfilterArray] = useState({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    effectedDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
    userName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const onSort = (event) => {
    setSortField(event.sortField);
    setSortOrder(event.sortOrder);
  };

     // Reload data when filters, sorting, or pagination change
     useEffect(() => {
      fetchData();
    }, [currentPage, sortField, sortOrder, filterArray,loading]);



    // Updated fetchData function to include search filters
    const fetchData = async () => {
      setLoader(true);
      const filters = {}; // Store filters as query params
      for (let key in filterArray) {
        if (filterArray[key].value) {
          filters[key] = filterArray[key].value;
        }
      }
  
      try {
        const response = await billingApiServices.getOrganizationsDetails(currentPage, 10, sortField, sortOrder === 1 ? 'desc' : 'asc', filters);
        if (response && response.status) {
          setGridData(response.data.data);
          setTotalRecords(response.data.total);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoader(false);
    };
  
  
 
    useEffect(() => {
      setLoader(props.loading);
      if (props.gridData?.length > 0 && !props.loading) {
        setGridData(props.gridData);
      }
      fetchData()
    }, [props.gridData, props.loading]);


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

  const bodyTemplate = (rowData) => loader ? (
    <Skeleton shape="circle" size="1rem" className="mr-2" />
  ) : (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
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

    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return null; // Invalid date
    }
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day} `; // Ensure 'YYYY-MM-DD' format
  };

  const exportToExcel = async () => {
    let fileName = 'Organizations'

    var response = selectedRows.map((d) => (
      {
        name: d.name,
        CreadtedDate: d.effectedDate,
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

  const handleImport = () => {
    setIsOpen(true)
    setStateManager(new Date()?.toString())
  }

  const customExportTemplate = () => (
    <div className="d-flex align-items-center">
      <span>Export</span>
      <i class="fa-sharp fa-solid fa-file-excel" style={{ fontSize: '16px', marginLeft: "5px"}}></i>
    </div>
  );

  const handleFilterChange = (e, field) => {
    const newFilters = { ...filterArray };
    newFilters[field].value = e.value;
    setfilterArray(newFilters);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 1 ? -1 : 1)); // Toggle between 1 (asc) and -1 (desc)
  };



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


<div className="sorting-container___">

<div >
  <i className="pi pi-sort-alt text-light_Dark" style={{ fontSize: '13px', marginRight: "3px", color: "black" }}></i>
  <label className="sorting-label____">SORT BY</label>
</div>

<select className="sorting-select___ p-2" onChange={(e) => setSortField(e.target.value)} value={sortField || ''}>
  <option value="">Default Order</option>
  <option value="id">ID</option>
  <option value="name">Name</option>
  <option value="effectedDate">Created Date</option>
  

</select>

<button className="btn-style p-2" onClick={toggleSortOrder}>
  {sortOrder === 1 ? 'Descending' : 'Ascending'}
</button>

</div>


        <DataTable
        header="ORAGANIZATION RECORDS"
        value={loader ? Array.from({ length: 5 }) : gridData}
        paginator
        responsiveLayout="scroll"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate="ON PAGE {currentPage} : RECORDS {first}-{last}"
        rows={10}
        lazy
        totalRecords={totalRecord}
        first={(currentPage - 1) * 10}
        onPage={(event) => setCurrentPage(event.page + 1)}
        dataKey="id"
        filters={filterArray}
        onFilter={(e) => setfilterArray(e.filters)} // Set the filters when applied
        removableSort
        filterDisplay="row"
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={onSort}

        selectionMode={'checkbox'}
        selection={selectedRows}
        onSelectionChange={(e) => setSelectedRows(e.value)}
      >
        <Column selectionMode="multiple" header={customExportTemplate} headerStyle={{ width: '5%' }} 
        
        ></Column>
        
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
          filterPlaceholder="YYYY-MM-DD"

          // filterClear={filterClearTemplate}
          // filterApply={filterApplyTemplate}

          onFilterApplyClick={(e) => handleFilterChange(e, 'effectedDate')}
          body={SubmissionDateTemplate}
        ></Column>

        {/* <Column
            field="userName"
            header="Created By"
            sortable
            filter
            filterPlaceholder="Search"
           
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            
            body={CreatedByTemplate}
          ></Column> */}

        <Column header={customHeaderTemplate} body={bodyTemplate} 
         filter 
         showFilterMenu={false}  
         filterElement={
           <div className="downloadImg d-flex align-items-center flex-column m-0 p-0">
             <span className="downloadImgheading">EDIT</span>
             <span className="downloadImgheading"> DELETE</span>
           </div>
         }  
         headerStyle={{ width: '5%' }}
         />

      </DataTable>


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

      <ImportFile reloadData={() => reloadData()} onHide={() => setIsOpen(false)} isOpen={isOpen} Type="Organization" />

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

