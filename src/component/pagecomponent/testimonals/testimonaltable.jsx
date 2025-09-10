import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";

const TestimonialTable = () => {
  const [contacts, setContacts] = useState();

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getalltestimonial`)
      .then((res) => res.json())
      .then((data) => setContacts(data.data))
      .catch((err) => {
        res.status(400).json({ message: "error occured", error: err.message });
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteClick = (id) => {
    const confirm = window.confirm("Are you sure want to delete");
    if (confirm) {
      fetch(`${import.meta.env.VITE_CMS_URL}api/deletebyidtestimonial/${id}`, {
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
          className="ti-custom-table ti-striped-table ti-custom-table-hover"
        >
          <thead>
            <tr className="border-b">
              <th className="w-10 text-center">id</th>
              <th>Name</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts?.map((contact) => (
              <Fragment key={contact.testimonial_id}>
                <ReadOnlyRows
                  contact={contact}
                  handleDeleteClick={handleDeleteClick}
                  setContacts={setContacts}
                />
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    )
  );
};
const ReadOnlyRows = ({ contact, handleDeleteClick, setContacts }) => {
  return (
    <tr>
      <td className="text-center">{contact.testimonial_id}</td>
      <td>{contact.name}</td>
      <td className="p-2 w-1/2">{contact.description.slice(0, 80) + "..."}</td>
      <td className=" grid grid-cols-1 text-end font-medium">
        <div className="flex justify-center">
          <div className="hs-tooltip ti-main-tooltip">
            <Link
              to={`/cms/pages/testimonals/edittestimonals/${contact.testimonial_id}`}
              className="hs-tooltip-toggle w-8 h-8 ti-btn rounded-full p-0 transition-none focus:outline-none ti-btn-soft-secondary"
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
                {" "}
                Edit
              </span>
            </Link>
          </div>
          <div className="hs-tooltip ti-main-tooltip">
            <button
              type="button"
              onClick={() => handleDeleteClick(contact.testimonial_id)}
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
                {" "}
                Delete
              </span>
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default TestimonialTable;
