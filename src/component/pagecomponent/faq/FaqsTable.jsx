import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";

const FaqsTable = () => {
  const [contacts, setContacts] = useState();

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallwebfaqs`)
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
      fetch(`${import.meta.env.VITE_CMS_URL}api/deletebyidwebfaqs/${id}`, {
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
              <th className="w-10 text-center">id</th>
              <th>Title</th>
              <th>Description</th>
              <th>Cover Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts?.map((contact) => (
              <Fragment key={contact.id}>
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
const ReadOnlyRows = ({ contact, handleDeleteClick, fetchData }) => {
  return (
    contact && (
      <tr>
        <td className="text-center">{contact.id}</td>
        <td>{contact.title}</td>
        <td className="p-2 w-5/12">
          {contact.description.slice(0, 40) + "...."}
        </td>
        <td className="w-1/2">
          <div className="flex  justify-center">
            {contact.cover_url &&
              JSON.parse(contact.cover_url).map((pathFile, i) => {
                return (
                  <img
                    key={i}
                    src={`${
                      import.meta.env.VITE_CMS_URL
                    }api/transform/${pathFile}`}
                    className="w-56 h-auto bg-gray-100 dark:bg-black/20 p-1"
                    alt="Cover_url"
                  />
                );
              })}
          </div>
        </td>
        <td className=" grid grid-cols-1 border-l">
          <div className="flex justify-center">
            <div className="hs-tooltip ti-main-tooltip">
              <Link to={`/cms/pages/faq/editfaq/${contact.id}`}>
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
                onClick={() => handleDeleteClick(contact.id)}
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

export default FaqsTable;
