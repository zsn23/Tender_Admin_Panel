import React, { useState, useEffect } from "react";
import SaveRolesModal from "./SaveRolesModal";
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
    title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    // effectedDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
    // userName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  useEffect(() => {
    setLoader(props.loading);
    if (props.gridData?.length > 0 && !props.loading) {
      var customized = props.gridData
      setGridData(customized);
    }
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
      id: dataForEdit?._id
    }

    billingApiServices.deleteNewsPaper(body).then((response) => {
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
        <span style={{margin:"5px"}}><i onClick={() => editCategory(rowData)} className="pi pi-pencil "></i></span>
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
      return <div>{rowData.title}</div>;
    }
  };


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
            field="title"
            header="Title"
            sortable
            filter
            filterPlaceholder="Search"
            style={{ width: "30%" }}
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            filterFooter={filterFooterTemplate}
            body={NameBodyTemplate}
          ></Column>
         
          <Column header="Action" body={bodyTemplate} />
        </DataTable>
      </div>

      {isModalOpen && (<SaveRolesModal
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
