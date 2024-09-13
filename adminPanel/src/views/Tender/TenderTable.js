// import React, { useState, useEffect } from "react";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import { Button } from "primereact/button";
// import 'primeicons/primeicons.css';
// import { FilterMatchMode } from "primereact/api";
// import { Skeleton } from "primereact/skeleton";
// import { billingApiServices } from '../../services/BillingApiService';
// import Toast from "../alert/Toast";
// import ConfirmationDialog from "../alert/ConfirmationDialog";
// import { ConfirmDialog } from "primereact/confirmdialog";
// import XLSX from "xlsx";
// import FileSaver from 'file-saver';
// import { colors } from "@mui/material";

// const CustomDataTable = (props) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [gridData, setGridData] = useState([]);
//   const [loader, setLoader] = useState(true);
//   const [dataForEdit, setDataForEdit] = useState(null);
//   const [openConfirmation, setOpenConfirmation] = useState(false);
//   const [severity, setSeverity] = useState("");
//   const [openSnackBar, setOpenSnackBar] = useState(false);
//   const [responseMsg, setResponseMsg] = useState("");
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  
//   const [currentPage, setCurrentPage] = useState(1); // Pagination state
//   const [totalRecord, setTotalRecords] = useState(0); // Total records state
  
//   const [sortField, setSortField] = useState(null); // For storing current sort field
//   const [sortOrder, setSortOrder] = useState(null); // For storing current sort order

//   const [filterArray, setFilterArray] = useState({
//     name: { value: null, matchMode: FilterMatchMode.CONTAINS },
//     IPLNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
//     openDate: { value: null, matchMode: FilterMatchMode.EQUALS },
//     publishDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
//     effectedDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
//     userName: { value: null, matchMode: FilterMatchMode.CONTAINS },
//     organizationName: { value: null, matchMode: FilterMatchMode.CONTAINS },
//     category: { value: null, matchMode: FilterMatchMode.CONTAINS },
//     cityName: { value: null, matchMode: FilterMatchMode.CONTAINS },
//     newPaperName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    
//   });
//   const onSort = (event) => {
//     setSortField(event.sortField);
//     setSortOrder(event.sortOrder);
//   };

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     setLoader(true);
//   //     try {
//   //       const response = await billingApiServices.getAllTenders(currentPage, 25); // Use currentPage for API call
//   //       if (response && response.status) {
//   //         setGridData(response.data.data); // Adjust according to your API response structure
//   //         setTotalRecords(response.data.total); // Set total records based on API response
//   //       }
//   //     } catch (error) {
//   //       console.error('Error fetching data:', error);
//   //     }
//   //     setLoader(false);
//   //   };
  
//   //   fetchData();
//   // }, [currentPage]); // Fetch data whenever currentPage changes

  
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoader(true);
//       try {
//         const response = await billingApiServices.getAllTenders(currentPage, 25, sortField, sortOrder === 1 ? 'asc' : 'desc');    //, sortField, sortOrder);
//         if (response && response.status) {
//           setGridData(response.data.data);
//           setTotalRecords(response.data.total);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//       setLoader(false);
//     };

//     fetchData();
//   }, [currentPage, sortField, sortOrder]); 

 


//   useEffect(() => {
//     setLoader(props.loading);
//     if (props.gridData?.length > 0 && !props.loading) {
//       setGridData(props.gridData);
//     }
//   }, [props.gridData , props.loading]);

//   const editTender = (data) => {
//     setDataForEdit(data);
//     props.editTender(data);
//     setIsModalOpen(!isModalOpen);
//   };

  

// const confirmDelete = (data) => {
//   setDataForEdit(data);
//   setDeleteDialogVisible(true);
// };
  

//   const deleteRecords = () => {
//   setDeleteDialogVisible(false);
//     setOpenConfirmation(false);
  
//     const body = {
//       id: dataForEdit?.id,
//     };
  
//     billingApiServices.deleteTender(body).then((response) => {
//       console.log('Delete response', response);
//       if (response == null || response == undefined) {
//         handleToast("error", "Operation failed, check your internet connection");
//         return;
//       }
  
//       if (response?.data?.status) {
//         handleToast("success", response?.data?.message);
//         setDataForEdit(null);
//         props.reloadData();
//       } else {
//         handleToast("error", response?.data?.message);
//       }
//     }).catch((error) => {
//       console.error('Error during deletion:', error);
//       handleToast("error", "An error occurred while deleting the record.");
//     });
//   };
  

//   const handleDownload = (currentRow) => {
//     const imgURL = currentRow.tenderImage;
//     window.open(imgURL, '_blank');
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

//   const exportToExcel = () => {
//     let fileName = 'Tenders';

//     const response = selectedRows.map((d) => ({
//       IPLNumber: d.IPLNumber,
//       name: d.name,
//       organizationName: d.organizationName,
//       category: d.category,
//       cityName: d.cityName,
//       publishDate: d.publishDate,
//       newPaperName: d.newPaperName,
//       tenderImage: d.tenderImage,
//     }));

//     const ws = XLSX.utils.json_to_sheet(response);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
//     const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     const dataToSave = new Blob([excelBuffer], { type: "application/octet-stream" });
//     FileSaver.saveAs(dataToSave, `${fileName}.xlsx`);
//   };

//   const convertDateBestFormate = (inputDateTime) => {
//     const date = new Date(inputDateTime);
//     const hours = date.getUTCHours().toString().padStart(2, '0');
//     const minutes = date.getUTCMinutes().toString().padStart(2, '0');
//     const day = date.getUTCDate().toString().padStart(2, '0');
//     const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
//     const year = date.getUTCFullYear();

//     return `${hours}:${minutes} ${day}-${month}-${year}`;
//   };

//   const bodyTemplate = (rowData) => loader ? (
//     <Skeleton shape="circle" size="1rem" className="mr-2" />
//   ) : (
//     <div style={{ display: 'flex', alignItems: 'center' }}>
//       <Button
//         icon="pi pi-pencil"
//         onClick={() => editTender(rowData)}
//         className="p-button-rounded p-button-warning my-2"
//         style={{ margin: '0.5rem' }} // Optional: adds spacing between buttons
//       />
//       <Button
//         icon="pi pi-trash"
//         onClick={() => confirmDelete(rowData)}
//         className="p-button-rounded p-button-warning"
//         style={{ margin: '0.5rem' }}
//       />


// <Button
//   style={{ cursor: "pointer" , margin: '0.5rem'}}
//   icon="fa-duotone fa-download"
//   onClick={() => handleDownload(rowData)}
//   className="p-button-rounded p-button-warning"
//   iconStyle={{ color: 'black' }} // Inline style to change the icon color
// />



//     </div>
//   );

//   const customHeaderTemplate = () => (
  
//     <div >
//     <span>Action</span>
//     <i className="pi pi-wrench" style={{ fontSize: '13px' ,marginLeft : "3px" }} ></i>
//     </div>
//   );

//   const filterClearTemplate = (options) => (
//     <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} className="p-button-secondary"></Button>
//   );

//   const filterApplyTemplate = (options) => (
//     <Button type="button" icon="pi pi-check" onClick={options.filterApplyCallback} className="p-button-success"></Button>
//   );
  

//   const fetchTendersWithSorting = () => {
//     const page = 1; // set your desired page
//     const limit = 10; // set your desired limit
//     const sortField = setSortField; // get from your state
//     const sortOrder = setSortOrder; // get from your state
  
//     billingApiServices.getAllTenders(page, limit, sortField, sortOrder)
//       .then((response) => {
//         // Update your state with the sorted data
//         setGridData(response.data.data);
//         setTotalRecords(response.data.total);
//       })
//       .catch((error) => {
//         console.error("Error fetching sorted tenders:", error);
//       });
//   };
  

  // const IPLNumberTemplate = (rowData) => loader ? <Skeleton /> : <div>{rowData.IPLNumber}</div>;
  // const NameTemplate = (rowData) => loader ? <Skeleton /> : <div>{rowData.name}</div>;
  // const OrganizationBodyTemplate = (rowData) => loader ? <Skeleton /> : <div>{rowData.organizationName}</div>;
  // const CategoryBodyTemplate = (rowData) => loader ? <Skeleton /> : <div>{rowData.category}</div>;
  // const CityBodyTemplate = (rowData) => loader ? <Skeleton /> : <div>{rowData.cityName}</div>;
  // const NewsPaperBodyTemplate = (rowData) => loader ? <Skeleton /> : <div>{rowData.newPaperName}</div>;
  // const SubmissionDateTemplate = (rowData) => loader ? <Skeleton /> : <div>{convertDateBestFormate(rowData.effectedDate)}</div>;
  // const PublishDateTemplate = (rowData) => loader ? <Skeleton /> : <div>{convertDateBestFormate(rowData.publishDate)}</div>;
  // const CreatedByTemplate = (rowData) => loader ? <Skeleton /> : <div>{rowData.userName}</div>;
  // const TenderImageTemplate = (rowData) => loader ? <Skeleton /> : (
  //   <div style={{ cursor: "pointer" }} onClick={() => handleDownload(rowData)}>
  //     <i className="fa-duotone fa-download"></i>
  //   </div>
  // );
//   return (
    
      
//       <div className="container-fluid mb-5" >
//       <button style={{ position: 'relative', bottom: 42 }} className="btn-style" onClick={exportToExcel}>Export</button>

//       <select onChange={(e) => setSortField(e.target.value)}>
//   <option value="">Select Field</option>
//   <option value="created_at">Created Date</option>
//   <option value="tender_name">Tender Name</option>
//   <option value="amount">Amount</option>
//   {/* Add more fields as necessary */}
// </select>

// <select onChange={(e) => setSortOrder(e.target.value)}>
//   <option value="asc">Ascending</option>
//   <option value="desc">Descending</option>
// </select>

// <button onClick={() => fetchTendersWithSorting()}>Sort</button>

//          <DataTable
//         header="TENDER RECORDS"
//          tableStyle={{ width: '100%' }}
//           value={loader ? Array.from({ length: 5 }) : gridData}
//           paginator
//           responsiveLayout="scroll"
//           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport "
//           currentPageReportTemplate="ON PAGE {currentPage} : RECORDS {first}-{last} "
//           rows={25}
//           lazy
//           totalRecords={totalRecord}
//           first={(currentPage - 1) * 25}
//           onPage={(event) => setCurrentPage(event.page + 1)}
//           dataKey="id"
//           filters={filterArray}
//           filterDisplay="row"
//           removableSort
          // selectionMode={'checkbox'}
          // selection={selectedRows}
          // onSelectionChange={(e) => setSelectedRows(e.value)}

          // sortField={sortField}
//           sortOrder={sortOrder}
//           onSort={onSort}
//         >
//           {/* <Column selectionMode="multiple" ></Column> */}
//           <Column field="IPLNumber" header="IPL Number" sortable filter filterPlaceholder="Search"  filterClear={filterClearTemplate} filterApply={filterApplyTemplate} body={IPLNumberTemplate}></Column>
//           <Column field="name" header="Title" sortable filter filterPlaceholder="Search"  filterApply={filterApplyTemplate} body={NameTemplate}></Column>
//           <Column field="organizationName" header="Organization" sortable filter filterPlaceholder="Search"  filterApply={filterApplyTemplate} body={OrganizationBodyTemplate}></Column>
//           <Column field="category" header="Category" sortable filter filterPlaceholder="Search"  filterApply={filterApplyTemplate} body={CategoryBodyTemplate}></Column>
//           <Column field="cityName" header="City" sortable filter filterPlaceholder="Search"  filterApply={filterApplyTemplate} body={CityBodyTemplate}></Column>
//           <Column field="publishDate" header="Publish Date" sortable filter filterPlaceholder="Search"  filterApply={filterApplyTemplate} body={PublishDateTemplate}></Column>
//           {/* <Column field="effectedDate" header="Submit Date" sortable filter filterPlaceholder="Search"  filterApply={filterApplyTemplate} body={SubmissionDateTemplate}></Column> */}
//           <Column field="newPaperName" header="Newspaper" sortable filter filterPlaceholder="Search"  filterApply={filterApplyTemplate} body={NewsPaperBodyTemplate}></Column>
//           {/* <Column field="userName" header="Created By" sortable filter filterPlaceholder="Search"  filterApply={filterApplyTemplate} body={CreatedByTemplate}></Column> */}
//           {/* <Column field="tenderImage" header="Download"    body={TenderImageTemplate}></Column> */}
//           <Column field="id" header={customHeaderTemplate}  body={bodyTemplate}></Column>
//         </DataTable> 
      
    
//                   <Toast open={openSnackBar}
//                 severity={severity}
//                 handleClose={() => setOpenSnackBar(false)}
//                 message={responseMsg} />

            
//             <ConfirmDialog
//         visible={deleteDialogVisible}
//         onHide={() => setDeleteDialogVisible(false)}
//         message="Are you sure you want to delete this record?"
//         header="Confirmation"
//         icon="pi pi-exclamation-triangle"
//         accept={deleteRecords}
//         reject={() => setDeleteDialogVisible(false)}
//       />
// </div>
   
//   );
// };

// export default CustomDataTable;

import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import 'primeicons/primeicons.css';
import { FilterMatchMode } from "primereact/api";
import { Skeleton } from "primereact/skeleton";
import { billingApiServices } from '../../services/BillingApiService';
import Toast from "../alert/Toast";
import ConfirmationDialog from "../alert/ConfirmationDialog";
import { ConfirmDialog } from "primereact/confirmdialog";
import XLSX from "xlsx";
import FileSaver from 'file-saver';
import ImportFile from "./ImportFile";

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
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [totalRecord, setTotalRecords] = useState(0); // Total records state

  const [sortField, setSortField] = useState('effectedDate'); // For storing current sort field
  // const [sortOrder, setSortOrder] = useState(null); // For storing current sort order
  const [sortOrder, setSortOrder] = useState(1); // 1 for 'asc', -1 for 'desc'

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [stateManager, setStateManager] = useState(0);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 1 ? -1 : 1)); // Toggle between 1 (asc) and -1 (desc)
  };

  const [filterArray, setFilterArray] = useState({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IPLNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
    openDate: { value: null, matchMode: FilterMatchMode.EQUALS },
    publishDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
    effectedDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
    userName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    organizationName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    category: { value: null, matchMode: FilterMatchMode.CONTAINS },
    cityName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    newPaperName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const onSort = (event) => {
    setSortField(event.sortField);
    setSortOrder(event.sortOrder);
  };


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
      const response = await billingApiServices.getAllTenders(currentPage, 25, sortField, sortOrder === 1 ? 'desc' : 'asc', filters);
      if (response && response.status) {
        setGridData(response.data.data);
        setTotalRecords(response.data.total);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoader(false);
  };


  // Reload data when filters, sorting, or pagination change
  useEffect(() => {
    fetchData();
  }, [currentPage, sortField, sortOrder, filterArray, loading]);

  useEffect(() => {
    setLoader(props.loading);
    if (props.gridData?.length > 0 && !props.loading) {
      setGridData(props.gridData);
    }
  }, [props.gridData, props.loading]);

  const editTender = (data) => {
    setDataForEdit(data);
    props.editTender(data);
    setIsModalOpen(!isModalOpen);
  };

  const confirmDelete = (data) => {
    setDataForEdit(data);
    setDeleteDialogVisible(true);
  };

  const deleteRecords = () => {
    setDeleteDialogVisible(false);
    setOpenConfirmation(false);

    const body = {
      id: dataForEdit?.id,
    };

    billingApiServices.deleteTender(body).then((response) => {
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
      SubmitDate: d.effectedDate,
      endDate: d.publishDate,
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
  };

  const bodyTemplate = (rowData) => loader ? (
    <Skeleton shape="circle" size="1rem" className="mr-2" />
  ) : (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Button
        icon="pi pi-pencil"
        onClick={() => editTender(rowData)}
        className="p-button-rounded p-button-warning my-2"
        style={{ margin: '0.5rem' }}
      />
      <Button
        icon="pi pi-trash"
        onClick={() => confirmDelete(rowData)}
        className="p-button-rounded p-button-warning"
        style={{ margin: '0.5rem' }}
      />
      <Button
        style={{ cursor: "pointer", margin: '0.5rem' }}
        icon="pi pi-download"
        onClick={() => handleDownload(rowData)}
        className="p-button-rounded p-button-warning"
        iconStyle={{ color: 'black' }}
      />
    </div>
  );

  const customHeaderTemplate = () => (
    <div>
      <span>Action</span>
      <i className="pi pi-wrench" style={{ fontSize: '13px', marginLeft: "3px" }}></i>
    </div>
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

  const handleFilterChange = (e, field) => {
    const newFilters = { ...filterArray };
    newFilters[field].value = e.value;
    setFilterArray(newFilters);
  };
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
    <div className="container-fluid mb-5">
      <button style={{ position: 'relative', bottom: 36 ,  cursor: selectedRows.length === 0 ? 'not-allowed' : 'pointer'}} className="btn-style" onClick={exportToExcel} disabled={selectedRows.length === 0}>Export</button>
          
      <button style={{
        position: 'relative', bottom: 36, marginLeft: 5
      }} className="btn-style" onClick={() => handleImport()}>Import
      </button>

      <div className="sorting-container___">
     
  <div className="d-flex align-items-center">
    <i className="pi pi-sort-alpha-down " style={{ fontSize: '1rem' }}></i>
    <label className="sorting-label____">SORT BY</label>
  </div>

  <select className="sorting-select___" onChange={(e) => setSortField(e.target.value)} value={sortField || ''}>
    <option value="">By Default Order</option>
    <option value="IPLNumber">IPL Number</option>
    <option value="name">Title</option>
    <option value="organization">Organization</option>
    <option value="category">Category</option>
    <option value="city">City</option>
    <option value="effectedDate">Submit Date</option>
    <option value="publishDate">Publish Date</option>
    <option value="newspaper">Newspaper</option>

  </select>

  <button className="btn-style" onClick={toggleSortOrder}>
    {sortOrder === 1 ? 'Sort Ascending' : 'Sort Descending'}
  </button>

  {/* Add the toggle button for sorting order */}
 
</div>


      <DataTable
        header="TENDER RECORDS"
        value={loader ? Array.from({ length: 5 }) : gridData}
        paginator
        responsiveLayout="scroll"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate="ON PAGE {currentPage} : RECORDS {first}-{last}"
        rows={25}
        lazy
        totalRecords={totalRecord}
        first={(currentPage - 1) * 25}
        onPage={(event) => setCurrentPage(event.page + 1)}
        dataKey="id"
        filters={filterArray}
        onFilter={(e) => setFilterArray(e.filters)} // Set the filters when applied
        removableSort
        filterDisplay="row"
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={onSort}

        selectionMode={'checkbox'}
        selection={selectedRows}
        onSelectionChange={(e) => setSelectedRows(e.value)}
      >
        <Column selectionMode="multiple" header={customExportTemplate} headerStyle={{ width: '5%' }}></Column>
        <Column field="IPLNumber" header="IPL Number" body={IPLNumberTemplate}
          filter filterField="IPLNumber" filterMatchMode="contains" sortable filterPlaceholder="Search" onFilterApplyClick={(e) => handleFilterChange(e, 'IPLNumber')}></Column>
        <Column field="name" header="Title" body={NameTemplate}
          filter filterField="name" filterMatchMode="contains" sortable filterPlaceholder="Search" onFilterApplyClick={(e) => handleFilterChange(e, 'name')}></Column>
        <Column field="organizationName" header="Organization" body={OrganizationBodyTemplate}
          filter filterField="organizationName" filterMatchMode="contains" sortable filterPlaceholder="Search" onFilterApplyClick={(e) => handleFilterChange(e, 'organizationName')}></Column>
        <Column field="category" header="Category" body={CategoryBodyTemplate}
          filter filterField="category" filterMatchMode="contains" sortable filterPlaceholder="Search" onFilterApplyClick={(e) => handleFilterChange(e, 'category')}></Column>
        <Column field="cityName" header="City" body={CityBodyTemplate}
          filter filterField="cityName" sortable filterMatchMode="contains" filterPlaceholder="Search" onFilterApplyClick={(e) => handleFilterChange(e, 'cityName')}></Column>

        <Column
          field="newPaperName"
          header="Newspaper"
          sortable
          body={NewsPaperBodyTemplate}
          filter
          filterField="newPaperName"
          filterMatchMode="contains"
          filterPlaceholder="Search"
          onFilterApplyClick={(e) => handleFilterChange(e, 'newPaperName')}
        />
          <Column 
          field="effectedDate" 
          header="Submit Date" 
          sortable 
          filter 
          filterPlaceholder="Y-MM-DD"  
          body={SubmissionDateTemplate}
          onFilterApplyClick={(e) => handleFilterChange(e, 'effectedDate')}
          ></Column>
       
        <Column 
        field="publishDate" 
        header="End Date" 
        sortable  
        body={PublishDateTemplate}
        filter
        filterField="publishDate"
        // filterMatchMode="contains"
        filterPlaceholder="Y-MM-DD" // Indicate the format required
        onFilterApplyClick={(e) => handleFilterChange(e, 'publishDate')}></Column>



        <Column field="id"  header={customHeaderTemplate}  body={bodyTemplate}></Column>
      </DataTable>

      <Toast open={openSnackBar}
        severity={severity}
        handleClose={() => setOpenSnackBar(false)}
        message={responseMsg} />

<ImportFile reloadData={() => reloadData()} 
onHide={() => setIsOpen(false)} 
isOpen={isOpen} 
Type="Tenders" />

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

