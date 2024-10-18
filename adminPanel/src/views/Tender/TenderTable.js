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
import { title } from "process";

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
      const response = await billingApiServices.getAllTenders(currentPage, 10, sortField, sortOrder === 1 ? 'desc' : 'asc', filters);
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

  const handleSeeImg = (currentRow) => {
    const imgURL = currentRow.tenderImage;
    window.open(imgURL, '_blank');
  };

const handleDownload = async (currentRow) => {
  if (!currentRow?.tenderImage) return;

  const img = new Image();
  img.crossOrigin = "anonymous"; 
  img.src = currentRow.tenderImage;

  img.onload = () => {
    // Create a canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the main image
    ctx.drawImage(img, 0, 0);

    // Compress the image and download it
    canvas.toBlob((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "tender_image.jpg"; // Updated file name without watermark
      link.click();
    }, "image/jpeg", 0.9); // 0.9 is the quality factor for compression (higher for better quality)
  };
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
      title: d.name,
      organizationName_ID: d.organization,
      category: d.category,
      cityName_ID: d.city,
      newPaperName_ID: d.newspaper,
      SubmitDate: d.effectedDate,//.slice(0,10),
      endDate: d.publishDate,//.slice(0,10),
      DownloadtenderImage: d.tenderImage,
      TenderImage: d.tenderImage
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
        icon="fa-regular fa-money-check-pen"
        onClick={() => editTender(rowData)}
        className=" p-button-rounded p-button-warning my-2"
        style={{ margin: '0.5rem' }}
      />
      <Button
        icon="fa-regular fa-trash-can-xmark"
        onClick={() => confirmDelete(rowData)}
        className="p-button-rounded p-button-warning"
        style={{ margin: '0.5rem' }}
      />
      {/* <Button
        style={{ cursor: "pointer", margin: '0.5rem' }}
        icon="pi pi-download"
        onClick={() => handleDownload(rowData)}
        className="p-button-rounded p-button-warning"
        iconStyle={{ color: 'black' }}
      /> */}
    </div>
  );

  const customHeaderTemplate = () => (
    <div className="d-flex align-items-center">
      <span>Action</span>

      <i class="fa-sharp fa-solid fa-wrench" style={{ fontSize: '14px', marginLeft: "3px", marginTop: "3px" }}></i>
    </div>
  );

  const customImagesTemplate = () => (
    <div className="d-flex align-items-center">
      <span>Tender</span>
      <i class=" fa-regular fa-image" style={{ fontSize: '15px', marginLeft: "5px", marginTop: "3px" }}></i>
    </div>
  );
  const customImagesDownloadTemplate = () => (
    <div className="d-flex align-items-center">
      <span>Download</span>
      <i class=" fa-regular fa-image" style={{ fontSize: '15px', marginLeft: "5px", marginTop: "3px" }}></i>
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
 
 
  const TenderImageTemplate = (rowData) => {
    if (loader) {
      return <Skeleton />; // Show loader while loading
    }
  
    return (
      <div style={{ display: 'flex', alignItems: 'center' , justifyContent:'center'  }}>
        {/* Display the image */}
        <img 
          src={rowData.tenderImage} 
          alt="Tender_Image" 
          onClick={() => handleSeeImg(rowData)}
          style={{ 
            width: '80px', // Set a desired width
            height: '80px', // Set a desired height
            objectFit: 'cover', // Ensure the image fits well
            borderRadius: '10px'
          }} 
        />
      </div>
    );
  };

  const TenderImageDownloadTemplate = (rowData) => {
    if (loader) {
      return <Skeleton />; // Show loader while loading
    }
  
    return (
      <div >
  
        {/* Download button */}
        <Button
          style={{ cursor: "pointer" }}
          icon="fa-sharp-duotone fa-solid fa-download"
          onClick={() => handleDownload(rowData)}
          className="p-button-rounded p-button-warning"
          iconStyle={{ color: 'black' }}
        />
      </div>
    );
  };
  

  const handleFilterChange = (e, field) => {
    const newFilters = { ...filterArray };
    newFilters[field].value = e.value;
    setFilterArray(newFilters);
  };
  const customExportTemplate = () => (
    <div className="d-flex align-items-center">
      <span>Export</span>

      <i class="fa-sharp fa-solid fa-file-excel" style={{ fontSize: '16px', marginLeft: "5px", marginTop: "1px" }}></i>
    </div>
  );

  const handleImport = () => {
    setIsOpen(true)
    setStateManager(new Date()?.toString());
  }



  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-end" style={{ position: 'relative', bottom: 42, marginTop: '5px' }}>

        <div>
          <button style={{ cursor: selectedRows.length === 0 ? 'not-allowed' : 'pointer' }} className="btn-style p-2 d-flex align-items-center gap-1" onClick={exportToExcel} disabled={selectedRows.length === 0}>
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
          <option value="IPLNumber">IPL Number</option>
          <option value="name">Title</option>
          <option value="organization">Organization</option>
          <option value="category">Category</option>
          <option value="city">City</option>
          <option value="effectedDate">Submit Date</option>
          <option value="publishDate">Publish Date</option>
          <option value="newspaper">Newspaper</option>

        </select>

        <button className="btn-style p-2" onClick={toggleSortOrder}>
          {sortOrder === 1 ? 'Descending' : 'Ascending'}
        </button>

      </div>


      <DataTable
        header="TENDER RECORDS"
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
         
          filterPlaceholder="Y-MM-DD" // Indicate the format required
          onFilterApplyClick={(e) => handleFilterChange(e, 'publishDate')}></Column>



<Column 
          field="tenderImage" 
          header={customImagesDownloadTemplate} 

          filter 
          showFilterMenu={false} 
          filterElement={
            <div className="downloadImg d-flex align-items-center m-0 p-0">
              <span className="downloadImgheading">DOWNLOAD IMAGE</span>
            </div>
          } 

          headerStyle={{ width: '2%' }} 
          body={TenderImageDownloadTemplate}
          ></Column>




<Column 
          field="tenderImage" 
          header={customImagesTemplate} 

          filter 
          showFilterMenu={false} 
          filterElement={
            <div className="downloadImg d-flex align-items-center m-0 p-0">
              <span className="downloadImgheading">SEE IMAGE</span>
            </div>
          } 

          headerStyle={{ width: '5%' }} 
          body={TenderImageTemplate}
          ></Column>
     

        <Column 
          field="id" 
          header={customHeaderTemplate} 
          body={bodyTemplate} 

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

