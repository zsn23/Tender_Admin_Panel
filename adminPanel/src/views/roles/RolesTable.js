import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import "primeicons/primeicons.css";
import { Skeleton } from "primereact/skeleton";
import { title } from "process";

const RolesTable = (props) => {
  const [isModalOpen, setisModalOpen] = useState(false);
  const [roleID, setRoleID] = useState(0);
  const [roles, setroles] = useState(Array.from({ length: 5 }));
  const [loader, setLoader] = useState(true);

  let [filterArray, setfilterArray] = useState({
    title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    createdby: { value: null, matchMode: FilterMatchMode.CONTAINS },
    createddate: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  useEffect(() => {
    setLoader(props.loading);
    setroles(props.roles);
  }, [props.roles]);

  const editrole = (id) => {
    setRoleID(id);
    setisModalOpen(!isModalOpen);
  };

  const roleData = (roles_data) => {
    setroles(roles_data);
  };
  const RolebodyTemplate = (rowData) => {

    if (loader == true) {
      return <Skeleton shape="circle" size="2rem" className="mr-2"></Skeleton>;
    }
    return (
      <div>
        <NavLink
          to={{
            pathname: "/save-role",
            state: {
              roleid: `${rowData.id}`,
              role: `${rowData.title}`,
              action: "edit",
              companyid: `${rowData.companyid}`,
              action: `${'edit'}`,
            },
          }}
          exact
          className="btn-lg"
          activeclassname="active"
        >
          <i className="pi pi-pencil"></i>
        </NavLink>
      </div>
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
  const TitleBodyTemplate = (rowData) => {
    if (loader == true) {
      return <Skeleton></Skeleton>;
    } else {
      if (rowData.title.length > 20) {
        return <div title={rowData.title}>{rowData.title.slice(0, 20)}...</div>;
      }
      return <div>{rowData.title}</div>;
    }
  };
  const NameBodyTemplate = (rowData) => {
    if (loader == true) {
      return <Skeleton></Skeleton>;
    } else {
      if (rowData.title.length > 20) {
        return <div title={rowData.name}>{rowData.name.slice(0, 20)}...</div>;
      }
      return <div>{rowData.name}</div>;
    }
  };
  const CreatedbyBodyTemplate = (rowData) => {
    if (loader == true) {
      return <Skeleton></Skeleton>;
    } else {
      if (rowData.title.length > 20) {
        return (
          <div title={rowData.createdby}>
            {rowData.createdby.slice(0, 20)}...
          </div>
        );
      }
      return <div>{rowData.createdby}</div>;
    }
  };
  const CreateddateBodyTemplate = (rowData) => {
    if (loader == true) {
      return <Skeleton></Skeleton>;
    } else {
      if (rowData.title.length > 20) {
        return (
          <div title={rowData.createddate}>
            {rowData.createddate.slice(0, 20)}...
          </div>
        );
      }
      return <div>{rowData.createddate}</div>;
    }
  };

  return (
    <div>
      <div className="card">
        <DataTable
          value={roles}
          paginator
          responsiveLayout="scroll"
          paginatorTemplate=" FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
          rows={20}
          rowsPerPageOptions={[20, 40, 60]}
          dataKey="id"
          filters={filterArray}
          filterDisplay="row"
        >
          <Column
            field="title"
            header="Role"
            sortable
            filter
            filterPlaceholder="Search"
            style={{ width: "16%" }}
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            filterFooter={filterFooterTemplate}
            body={TitleBodyTemplate}
          ></Column>
          <Column
            field="name"
            header="Company"
            sortable
            filter
            filterPlaceholder="Search"
            style={{ width: "16%" }}
            body={NameBodyTemplate}
          ></Column>
          <Column
            field="createdby"
            header="Created By"
            sortable
            filter
            filterPlaceholder="Search"
            style={{ width: "16%" }}
            body={CreatedbyBodyTemplate}
          ></Column>
          <Column
            field="createddate"
            header="Created Date"
            sortable
            filter
            filterPlaceholder="Search "
            style={{ width: "16%" }}
            body={CreateddateBodyTemplate}
          ></Column>
          <Column header="Action" body={RolebodyTemplate} />
        </DataTable>
      </div>
    </div>
  );
};

export default RolesTable;
