import React, {  useEffect, useState } from "react";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ManagementList = () => {
  const [values, setValues] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallmanagement`)
      .then((res) => res.json())
      .then((data) => {
        setValues(data.data);
      })
      .catch((err) => toast.error(err.message));
  };

  const handleDeleteClick = (management_id) => {
    fetch(
      `${
        import.meta.env.VITE_CMS_URL
      }api/deletebyidmanagement/${management_id}`,
      {
        method: "DELETE",
      }
    )
      .then(() => {
        fetchData();
        toast.success("Deleted Successfully");
      })

      .catch((err) => toast.error(err.message));
  };

  return (
    values && (
      <div>
        <PageHeader
          currentpage="Management List"
          activepage="Pages"
          mainpage="Management List"
        />
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12">
            <div className="app-container">
              <div className="table-bordered rounded-sm overflow-auto todo-table">
                <table
                  id="delete-datatable"
                  className="ti-custom-table ti-custom-table-head whitespace-nowrap"
                >
                  <thead className="bg-gray-100 dark:bg-black/20">
                    <tr>
                      <th className="dark:text-white/70">Name</th>
                      <th className="dark:text-white/70 w-2/3">Image</th>
                      <th className="dark:text-white/70 w-1/2 ">Description</th>
                      <th className="dark:text-white/70">Status</th>
                      <th className="dark:text-white/70 text-lg font-semibold">
                        Add New
                        <div className="hs-tooltip ti-main-tooltip">
                          <Link
                            to={`/cms/general/create-team/`}
                            variant=""
                            className="hs-tooltip-toggle w-8 h-8 ti-btn rounded-full p-0 transition-none focus:outline-none ti-btn-soft-primary ms-4"
                            type="button"
                            onClick={() => {}}
                          >
                            <i className="ri ri-add-fill" />
                          </Link>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {values.map((value) => (
                      <ReadOnlyRows
                        key={value.management_id}
                        value={value}
                        handleDeleteClick={handleDeleteClick}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

const ReadOnlyRows = ({ value, handleDeleteClick }) => {
  return (
    <tr>
      <td>{value.name}</td>
      <td>
        <img
          src={`${import.meta.env.VITE_CMS_URL}api/transform/${
            JSON.parse(value.image)[0]
          }`}
          className="box-img-top h-36 w-60 rounded-sm"
          alt="management Image"
        />
      </td>
      <td>
        <textarea
          className="text-sm"
          rows={6}
          value={value.description}
        ></textarea>
      </td>
      <td>{value.status ? "Enable" : "Disable"}</td>
      <td>
        <div className="hs-tooltip ti-main-tooltip">
          <Link
            to={`/cms/general/team/${value.management_id}`}
            className="hs-tooltip-toggle w-8 h-8 ti-btn rounded-full p-0 transition-none focus:outline-none ti-btn-soft-secondary"
            data-hs-overlay={`#todo-compose${value.management_id}`}
          >
            <i className="ti ti-pencil"></i>
            <span
              className="hs-tooltip-content ti-main-tooltip-content py-1 px-2 bg-gray-900 text-xs font-medium text-white shadow-sm dark:bg-slate-700 hidden"
              role="tooltip"
              data-popper-placement="top"
              style={{
                position: "fixed",
                inset: "auto auto 0px 0px",
                margin: "0px",
                transform: "translate(953px, -281px)",
              }}
            >
              Edit
            </span>
          </Link>
        </div>
        <div className="hs-tooltip ti-main-tooltip">
          <button
            variant=""
            className="hs-tooltip-toggle w-8 h-8 ti-btn rounded-full p-0 transition-none focus:outline-none ti-btn-soft-danger"
            type="button"
            onClick={() => handleDeleteClick(value.management_id)}
          >
            <i className="ti ti-trash"></i>
            <span
              className="hs-tooltip-content ti-main-tooltip-content py-1 px-2 bg-gray-900 text-xs font-medium text-white shadow-sm dark:bg-slate-700"
              role="tooltip"
              data-popper-placement="top"
              style={{
                position: "fixed",
                inset: "auto auto 0px 0px",
                margin: "0px",
                transform: "translate(985px, -281px)",
              }}
            >
              Delete
            </span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ManagementList;
