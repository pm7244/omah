import React, {  useEffect, useState } from "react";
import Select from "react-select";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Filemanagermain from "../fileManager/filemanagermain";

const AssocLists = () => {
  const [values, setValues] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallassociate`)
      .then((res) => res.json())
      .then((data) => {
        setValues(data.data);
      })
      .catch((err) => toast.error(err.message));
  };

  const handleDeleteClick = (assoc_id) => {
    fetch(
      `${import.meta.env.VITE_CMS_URL}api/deletebyidassociate/${assoc_id}`,
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
          currentpage="Associates List"
          activepage="Pages"
          mainpage="Associates List"
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
                      <th className="dark:text-white/70 w-3/4">Logo</th>
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
                        key={value.associate_id}
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
            JSON.parse(value.logo)[0]
          }`}
          className="box-img-top h-36 rounded-sm"
          alt="associate logo"
        />
      </td>
      <td>{value.status ? "Enable" : "Disable"}</td>
      <td>
        <div className="hs-tooltip ti-main-tooltip">
          <Link
            to={`/cms/general/assoc/${value.associate_id}`}
            className="hs-tooltip-toggle w-8 h-8 ti-btn rounded-full p-0 transition-none focus:outline-none ti-btn-soft-secondary"
            data-hs-overlay={`#todo-compose${value.awards_id}`}
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
            onClick={() => handleDeleteClick(value.associate_id)}
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
    logo: [],
    status: 1,
    sort_order: 0,
  };
  const [formValue, setFormValue] = useState(intialValue);
  const [managerOpener, setManagerOpener] = useState(false);
  const [image, setImage] = useState([]);

  const handleCreateAssociate = () => {
    if (!(formValue.link && formValue.name && formValue.logo)) {
      toast.error("Please Fill all the fields");
      return;
    }
    fetch(`${import.meta.env.VITE_CMS_URL}api/createassociate`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ ...formValue, logo: JSON.stringify(image) }),
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
    setFormValue({ ...formValue, logo: image });
  }, [image]);

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
              <h3 className="ti-modal-title text-base"> Add new Associate </h3>
              <button
                type="button"
                className="hs-dropdown-toggle ti-modal-close-btn"
                data-hs-overlay="#adder"
              >
                <span className="sr-only">Close</span>
                <i className="ri-close-line"></i>
              </button>
            </div>
            {managerOpener ? (
              <Filemanagermain
                file={image}
                ratio={170 / 66}
                fileSetter={setImage}
                openSetter={setManagerOpener}
              />
            ) : (
              <div className="ti-modal-body">
                <div className="space-y-3">
                  <div className="">
                    <label htmlFor="input-label" className="ti-form-label">
                      Associate Name
                    </label>
                    <input
                      type="text"
                      id="input-label"
                      value={formValue.title}
                      name="name"
                      onChange={(e) => handleInputChange(e)}
                      className="ti-form-input"
                      placeholder="Associate name"
                    />
                  </div>
                  <div className="">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Associate link
                    </label>
                    <input
                      placeholder="Associate Link"
                      type="text"
                      name="link"
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
                      Logo Image
                    </label>
                    {formValue.logo ? (
                      <>
                        <button
                          type="button"
                          className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                        >
                          Change Image <i className="ti ti-file-plus "></i>
                        </button>
                        <img
                          src={`${import.meta.env.VITE_CMS_URL}api/transform/${
                            formValue.logo
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
            )}
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
                data-hs-overlay="#adder"
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

export default AssocLists;
