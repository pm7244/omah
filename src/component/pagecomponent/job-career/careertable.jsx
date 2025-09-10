import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";

const CareerTable = () => {
  const [contacts, setContacts] = useState();

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getalljob`)
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
      fetch(`${import.meta.env.VITE_CMS_URL}api/deletebyidjob/${id}`, {
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
              <th>Position</th>
              {/* <th>Requirement</th> */}
              <th>Description</th>
              <th>Location</th>
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
const ReadOnlyRows = ({ contact, handleDeleteClick, fetchData }) => {
  return (
    contact && (
      <tr>
        <td className="text-center">{contact.job_id}</td>
        <td className=" ">{contact.title}</td>
        <td className="p-2 w-1/3">
          <textarea rows={3} value={contact.description}></textarea>
        </td>
        <td className="">{contact.location}</td>
        <td className=" grid grid-cols-1 border-l">
          <div className="flex justify-center">
            <div className="hs-tooltip ti-main-tooltip">
              <button
                data-hs-overlay={`#enquiry-compose${contact.job_id}`}
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
                  Edit
                </span>
              </button>
            </div>
            <div className="hs-tooltip ti-main-tooltip">
              <button
                type="button"
                onClick={() => handleDeleteClick(contact.job_id)}
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
          <Modal fetchData={fetchData} contacts={contact} />
        </td>
      </tr>
    )
  );
};

export default CareerTable;

const Modal = ({ contacts, fetchData }) => {
  const [input, setInput] = useState(contacts);

  const SubmitChangedData = (id) => {
    const newData = { ...input };
    fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidjob/${id}`, {
      method: "PUT",
      body: JSON.stringify(newData),
      headers: { "Content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          toast.success("Enquiry Status Updated");
          fetchData();
        }
      })
      .catch((err) => {
        toast.error(err.message);
        console.log(err.message);
      });
  };

  const handleSubmit = () => {
    if (!(input.title && input.experience && input.location)) {
      toast.error("Please fill all field");
      return;
    }
    try {
      SubmitChangedData(input.job_id);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  return (
    input && (
      <div
        id={`enquiry-compose${input.job_id}`}
        className="hs-overlay hidden ti-modal"
      >
        <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out ">
          <div className="ti-modal-content">
            <div className="ti-modal-header">
              <h3 className="ti-modal-title"> Edit Career </h3>
              <button
                type="button"
                className="hs-dropdown-toggle ti-modal-close-btn"
                data-hs-overlay={`#enquiry-compose${input.job_id}`}
              >
                <span className="sr-only">Close</span>
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div className="ti-modal-body">
              <div className="space-y-3">
                <div className="">
                  <label className="ti-form-label">Position</label>
                  <input
                    type="text"
                    className="ti-form-input"
                    placeholder="Position"
                    name="title"
                    value={input.title}
                    onChange={(e) => handleChangeInput(e)}
                  />
                </div>
                <div className="">
                  <label className="ti-form-label">Description</label>
                  <textarea
                    className="ti-form-input"
                    rows={4}
                    name="description"
                    value={input.description}
                    onChange={(e) => handleChangeInput(e)}
                  ></textarea>
                </div>
                <div className="">
                  <label className="ti-form-label">Experience</label>
                  <input
                    type="text"
                    className="ti-form-input"
                    name="experience"
                    value={input.experience}
                    onChange={(e) => handleChangeInput(e)}
                  />
                </div>
                <div className="">
                  <label className="ti-form-label">Location</label>
                  <input
                    type="text"
                    className="ti-form-input"
                    name="location"
                    value={input.location}
                    onChange={(e) => handleChangeInput(e)}
                  />
                </div>
                <div>
                  <label className="ti-form-label">Status</label>
                  <Select
                    classNamePrefix="react-select"
                    options={[
                      { value: 0, label: "Enable" },
                      { value: 1, label: "Disable" },
                    ]}
                    value={[
                      input.status === 0
                        ? { value: 0, label: "Enable" }
                        : { value: 1, label: "Disable" },
                    ]}
                    onChange={(val) =>
                      setInput((prv) => (prv = { ...input, status: val.value }))
                    }
                    menuPlacement="top"
                    placeholder="Open this select menu"
                  />
                </div>
              </div>
            </div>
            <div className="ti-modal-footer">
              <button
                type="button"
                className="hs-dropdown-toggle ti-btn ti-border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:ring-offset-white focus:ring-primary dark:bg-bgdark dark:hover:bg-black/20 dark:border-white/10 dark:text-white/70 dark:hover:text-white dark:focus:ring-offset-white/10"
                data-hs-overlay={`#enquiry-compose${input.job_id}`}
              >
                Close
              </button>
              <button className="ti-btn ti-btn-primary " onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
