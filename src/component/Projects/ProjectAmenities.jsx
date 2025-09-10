import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Filemanagermain from "../pagecomponent/fileManager/filemanagermain";

const ProjectAmenities = () => {
  const [values, setValues] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getall-amenities`)
      .then((res) => res.json())
      .then((data) => {
        setValues(data.data);
      })
      .catch((err) => toast.error(err.message));
  };

  const handleDeleteClick = (assoc_id) => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/delete-amenities/${assoc_id}`, {
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
                <h5 className="box-title">Categories</h5>
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
                        <th className="dark:text-white/70 ">Slug</th>
                        <th className="dark:text-white/70 w-3/5">icon</th>
                        <th className="dark:text-white/70">sort_order</th>
                        <th className="dark:text-white/70">Status</th>
                        <th className="dark:text-white/70">
                          Add New
                          <div className="hs-tooltip ti-main-tooltip">
                            <button
                              variant=""
                              className="hs-tooltip-toggle w-8 h-8 ti-btn rounded-full p-0 transition-none focus:outline-none ti-btn-soft-primary ms-4"
                              type="button"
                              data-hs-overlay={"#adder-amenities"}
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
                          key={value.amenities_id}
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
      <td>
        <img
          src={`${import.meta.env.VITE_CMS_URL}api/transform/${
            JSON.parse(value.icon)[0]
          }`}
          className="box-img-top h-36 rounded-sm"
          alt="Amenities icon"
        />
      </td>
      <td>{value.sort_order}</td>
      <td>{value.amenities_status ? "Enable" : "Disable"}</td>
      <td>
        <div className="hs-tooltip ti-main-tooltip">
          <Link
            to={`/cms/projects/amenities-edit/${value.amenities_id}`}
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
            onClick={() => handleDeleteClick(value.amenities_id)}
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
  const intialValue = {
    name: "",
    link: "",
    icon: [],
    amenities_status: 1,
    sort_order: 0,
  };
  const [formValue, setFormValue] = useState(intialValue);
  const [managerOpener, setManagerOpener] = useState(false);
  const [image, setImage] = useState([]);

  const handleCreateAmenities = () => {
    if (!(formValue.slug && formValue.name && formValue.icon)) {
      toast.error("Please Fill all the fields");
      return;
    }
    fetch(`${import.meta.env.VITE_CMS_URL}api/create-amenities`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        ...formValue,
        icon: JSON.stringify(formValue.icon),
      }),
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

  useEffect(() => {
    setFormValue({ ...formValue, icon: image });
  }, [image]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prv) => (prv = { ...prv, [name]: value }));
  };

  return (
    formValue && (
      <div id={`adder-amenities`} className="hs-overlay hidden ti-modal">
        <div className="hs-overlay-open:mt-7 ti-modal-box  mt-0 ease-out lg:!max-w-4xl lg:w-full m-3 lg:!mx-auto">
          <div className="ti-modal-content">
            <div className="ti-modal-header">
              <h3 className="ti-modal-title text-base"> Add new Amenities </h3>
              <button
                type="button"
                className="hs-dropdown-toggle ti-modal-close-btn"
                data-hs-overlay={`#adder-amenities`}
              >
                <span className="sr-only">Close</span>
                <i className="ri-close-line"></i>
              </button>
            </div>
            {managerOpener ? (
              <Filemanagermain
                file={image}
                ratio={100 / 100}
                fileSetter={setImage}
                openSetter={setManagerOpener}
              />
            ) : (
              <div className="ti-modal-body">
                <div className="space-y-3">
                  <div className="">
                    <label htmlFor="input-label" className="ti-form-label">
                      Amenities Name
                    </label>
                    <input
                      type="text"
                      id="input-label"
                      value={formValue.name}
                      name="name"
                      onChange={(e) => handleInputChange(e)}
                      className="ti-form-input"
                      placeholder="Amenities name"
                    />
                  </div>
                  <div className="">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Amenities slug
                    </label>
                    <input
                      placeholder="Amenities slug"
                      type="text"
                      name="slug"
                      value={formValue.description}
                      onChange={(e) => handleInputChange(e)}
                      className="ti-form-input"
                    ></input>
                  </div>
                  <div
                    className=""
                    onClick={() => setManagerOpener(!managerOpener)}
                  >
                    <label htmlFor="input-label" className="ti-form-label">
                      icon Image
                    </label>
                    {formValue.icon ? (
                      <>
                        <button
                          type="button"
                          className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                        >
                          Change Image <i className="ti ti-file-plus "></i>
                        </button>
                        <img
                          src={`${import.meta.env.VITE_CMS_URL}api/transform/${
                            formValue.icon
                          }`}
                          className="box-img-top h-40 rounded-t-sm"
                          alt="cover image"
                        />
                      </>
                    ) : (
                      <button
                        type="button"
                        className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                      >
                        Add Image <i className="ti ti-file-plus "></i>
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="ti-form-label">Sord Order</label>
                    <Select
                      value={[
                        formValue.sort_order
                          ? { value: 1, label: 1 }
                          : { value: 0, label: 0 },
                      ]}
                      classNamePrefix="react-select"
                      onChange={(val) => {
                        setFormValue(
                          (prv) => (prv = { ...prv, sort_order: val.value })
                        );
                      }}
                      options={[
                        { value: 0, label: 0 },
                        { value: 1, label: 1 },
                      ]}
                      placeholder="Open this select menu"
                    />
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
                          (prv) =>
                            (prv = { ...prv, amenities_status: val.value })
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
            )}
            <div className="ti-modal-footer">
              <button
                type="button"
                className="hs-dropdown-toggle ti-btn ti-border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:ring-offset-white focus:ring-primary dark:bg-bgdark dark:hover:bg-black/20 dark:border-white/10 dark:text-white/70 dark:hover:text-white dark:focus:ring-offset-white/10"
                data-hs-overlay={`#adder-amenities`}
              >
                Close
              </button>
              <button
                className="ti-btn ti-btn-primary"
                onClick={handleCreateAmenities}
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

export default ProjectAmenities;
