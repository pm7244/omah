import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const PreServiceTable = () => {
  const [contacts, setContacts] = useState();

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallpreprojects`)
      .then((res) => res.json())
      .then((data) => setContacts(data.data))
      .catch((err) => {
        toast.error(err.message);
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteClick = (id) => {
    const confirm = window.confirm("Are you sure want to delete");
    if (confirm) {
      fetch(`${import.meta.env.VITE_CMS_URL}api/deletebyidpreprojects/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {
          toast.success("Deleted Data successfully");
          fetchData();
        })
        .catch((err) => console.log(err.message));
    }
  };

  return (
    contacts && (
      <div className="app-container">
        <table
          id="delete-datatable"
          className="ti-custom-table ti-custom-table-head ti-custom-table-hover"
        >
          <thead>
            <tr className="border-b">
              <th className="w-10 text-center">#</th>
              <th>Name</th>
              <th>description</th>
              {/* <th>Lessee</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts?.map((contact, i) => (
              <Fragment key={i}>
                <ReadOnlyRows
                  contact={contact}
                  handleDeleteClick={handleDeleteClick}
                  setContacts={setContacts}
                  fetchData={fetchData}
                />
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    )
  );
};
const ReadOnlyRows = ({ contact, handleDeleteClick }) => {
  return (
    contact && (
      <tr>
        <td className="text-center">{contact.i_id}</td>
        <td className=" ">{contact.name}</td>
        {/* <td className="p-2 w-1/3">{contact.description}</td> */}
        <td className="p-2 w-1/3" dangerouslySetInnerHTML={{ __html: contact.description.replace(/^<div>|<\/div>$/g, "") }}></td>

          {/* <textarea rows={2} value={contact.description}></textarea> */}
        
        {/* <td className="">{contact.lessee}</td> */}
        <td className=" grid grid-cols-1 border-l">
          <div className="flex justify-center">
            <div className="hs-tooltip ti-main-tooltip">
              <Link to={`/cms/projects/service/edit/${contact.i_id}`}>
                <button className="hs-tooltip-toggle w-8 h-8 ti-btn rounded-full p-0 transition-none focus:outline-none ti-btn-soft-secondary">
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
                </button>
              </Link>
            </div>
            <div className="hs-tooltip ti-main-tooltip">
              <button
                type="button"
                onClick={() => handleDeleteClick(contact.i_id )}
                className="todo-remove hs-tooltip-toggle w-8 h-8 ti-btn rounded-full p-0 transition-none focus:outline-none ti-btn-soft-danger"
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
          </div>
        </td>
      </tr>
    )
  );
};

export default PreServiceTable;
