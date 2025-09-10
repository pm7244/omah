import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ReactQuill, { Quill } from "react-quill";

const ProjectStatus = () => {
  const [values, setValues] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/get-all-ps`)
      .then((res) => res.json())
      .then((data) => {
        setValues(data.data);
      })
      .catch((err) => toast.error(err.message));
  };

  const handleDeleteClick = (assoc_id) => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/delete-ps/${assoc_id}`, {
      method: "DELETE",
    })
      .then(() => {
        fetchData();
        toast.success("Deleted Successfully");
      })

      .catch((err) => toast.error(err.message));
  };

  return (
    values && (
      <div>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 ">
            <div className="box">
              <div className="box-header">
                <h5 className="box-title">Project Status</h5>
              </div>
              <div className="app-container">
                <div className="table-bordered rounded-sm overflow-auto todo-table">
                  <table
                    id="delete-datatable"
                    className="ti-custom-table ti-custom-table-head whitespace-nowrap"
                  >
                    <thead className="bg-gray-100 dark:bg-black/20">
                      <tr>
                        <th className="dark:text-white/70">Name</th>
                        <th className="dark:text-white/70">Slug</th>
                        {/* <th className="dark:text-white/70">Location Adv.</th> */}
                        <th className="dark:text-white/70">Meta Title</th>
                        <th className="dark:text-white/70">Meta Description</th>
                        <th className="dark:text-white/70">Status</th>
                        <th className="dark:text-white/70">
                          Add New
                          <div className="hs-tooltip ti-main-tooltip">
                            <button
                              variant=""
                              className="hs-tooltip-toggle w-8 h-8 ti-btn rounded-full p-0 transition-none focus:outline-none ti-btn-soft-primary ms-4"
                              type="button"
                              data-hs-overlay="#adder"
                              onClick={() => {}}
                            >
                              <i className="ri ri-add-fill" />
                            </button>
                          </div>
                          <Modal fetchData={fetchData} />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {values.map((value) => (
                        <ReadOnlyRows
                          key={value.ps_id}
                          value={value}
                          setValues={setValues}
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
      </div>
    )
  );
};

const ReadOnlyRows = ({ value, setValues, handleDeleteClick }) => {
  return (
    <tr>
      <td>{value.name}</td>
      <td>{value.slug}</td>
      {/* <td>
        <ReactQuill value={value.location_advantage} readOnly theme="bubble" />
        {value.location_advantage.slice(0, 60) + "..."}
      </td> */}
      <td>{value.meta_title}</td>
      <td>{value.meta_description.slice(0, 40) + "..."}</td>
      <td>{value.status ? "Enable" : "Disable"}</td>
      <td>
        <div className="hs-tooltip ti-main-tooltip">
          <Link
            to={`/cms/projects/status-edit/${value.ps_id}`}
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
          </Link>
        </div>
        <div className="hs-tooltip ti-main-tooltip">
          <button
            variant=""
            className="hs-tooltip-toggle w-8 h-8 ti-btn rounded-full p-0 transition-none focus:outline-none ti-btn-soft-danger"
            type="button"
            onClick={() => handleDeleteClick(value.ps_id)}
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

const Modal = ({ fetchData }) => {
  const intialValue = {};
  const [formValue, setFormValue] = useState(intialValue);

  const handleCreateAssociate = () => {
    if (
      !(
        formValue.name &&
        formValue.slug &&
        formValue.meta_description &&
        formValue.meta_title
      )
    ) {
      toast.error("Please Fill all the fields");
      return;
    }
    fetch(`${import.meta.env.VITE_CMS_URL}api/create-ps`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ ...formValue }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          toast.success("Created Successfully");
          setFormValue((prv) => (prv = intialValue));
          fetchData();
        }
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prv) => (prv = { ...prv, [name]: value }));
  };

  return (
    formValue && (
      <div id={`adder`} className="hs-overlay hidden ti-modal">
        <div className="hs-overlay-open:mt-7 ti-modal-box  mt-0 ease-out lg:!max-w-4xl lg:w-full m-3 lg:!mx-auto">
          <div className="ti-modal-content">
            <div className="ti-modal-header">
              <h3 className="ti-modal-title text-base">
                {" "}
                Add New Project Status{" "}
              </h3>
              <button
                type="button"
                className="hs-dropdown-toggle ti-modal-close-btn"
                data-hs-overlay="#adder"
              >
                <span className="sr-only">Close</span>
                <i className="ri-close-line"></i>
              </button>
            </div>

            <div className="ti-modal-body">
              <div className="space-y-3">
                <div className="">
                  <label htmlFor="input-label" className="ti-form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="input-label"
                    value={formValue.name}
                    name="name"
                    onChange={(e) => handleInputChange(e)}
                    className="ti-form-input"
                    placeholder="Name"
                  />
                </div>
                <div className="">
                  <label htmlFor="input-label1" className="ti-form-label">
                    Meta Title
                  </label>
                  <input
                    placeholder="Meta Title"
                    type="text"
                    name="meta_title"
                    value={formValue.meta_title}
                    onChange={(e) => handleInputChange(e)}
                    className="ti-form-input"
                  ></input>
                </div>
                <div className="">
                  <label htmlFor="input-label1" className="ti-form-label">
                    Slug
                  </label>
                  <input
                    placeholder="Slug"
                    type="text"
                    name="slug"
                    value={formValue.slug}
                    onChange={(e) => handleInputChange(e)}
                    className="ti-form-input"
                  ></input>
                </div>
                <div className="">
                  <label htmlFor="input-label1" className="ti-form-label">
                    Meta Description
                  </label>
                  <textarea
                    className="ti-form-input"
                    name="meta_description"
                    value={formValue.meta_description}
                    onChange={(e) => handleInputChange(e)}
                    rows="3"
                  ></textarea>
                </div>
                <div>
                  <label className="ti-form-label">Status</label>
                  <Select
                    value={[
                      formValue.status
                        ? { value: 1, label: "Enable" }
                        : { value: 0, label: "Disable" },
                    ]}
                    classNamePrefix="react-select"
                    onChange={(val) => {
                      setFormValue(
                        (prv) => (prv = { ...prv, status: val.value })
                      );
                    }}
                    options={[
                      { value: 1, label: "Enable" },
                      { value: 0, label: "Disable" },
                    ]}
                    placeholder="Open this select menu"
                  />
                </div>
              </div>
            </div>

            <div className="ti-modal-footer">
              <button
                type="button"
                className="hs-dropdown-toggle ti-btn ti-border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:ring-offset-white focus:ring-primary dark:bg-bgdark dark:hover:bg-black/20 dark:border-white/10 dark:text-white/70 dark:hover:text-white dark:focus:ring-offset-white/10"
                data-hs-overlay="#adder"
              >
                Close
              </button>
              <button
                className="ti-btn ti-btn-primary"
                onClick={handleCreateAssociate}
                // data-hs-overlay="#adder"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProjectStatus;
