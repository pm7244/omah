import React, { useEffect, useState } from "react";
import Select from "react-select";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const SocialLinks = () => {
  const [values, setValues] = useState();

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallsocial`)
      .then((res) => res.json())
      .then((data) => {
        setValues(data.data);
      })
      .catch((err) => toast.error(err.message));
  };

  const handleDeleteClick = (id) => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/deletebyidsocial/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        fetchData();
        toast.success("Deleted Successfully");
      })
      .catch((err) => toast.error(err.message));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    values && (
      <div>
        <PageHeader
          currentpage="Social Links"
          activepage="Pages"
          mainpage="Social Links"
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
                      <th className="dark:text-white/70">Link</th>
                      <th className="dark:text-white/70">Icon</th>
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
                        key={value.social_id}
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
      <td>{value.link}</td>
      <td>
        <i className={value.icon}></i>
      </td>
      <td>{value.status ? "Enable" : "Disable"}</td>
      <td>
        <div className="hs-tooltip ti-main-tooltip">
          <Link
            to={`/cms/general/social/${value.social_id}`}
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
            onClick={() => handleDeleteClick(value.social_id)}
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
    icon: "",
    status: 1,
    sort_order: 0,
  };

  const [formValue, setFormValue] = useState(intialValue);

  const handleCreateSocial = () => {
    if (!(formValue.link && formValue.name && formValue.icon)) {
      toast.error("Please Fill all the fields");
      return;
    }
    fetch(`${import.meta.env.VITE_CMS_URL}api/createsocial`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        ...formValue,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prv) => (prv = { ...prv, [name]: value }));
  };

  const icons = [
    {
      value: "ti ti-brand-facebook-filled",
      label: (
        <>
          <i className="ti ti-brand-facebook-filled "></i>Facebook
        </>
      ),
    },
    {
      value: "ti ti-brand-facebook",
      label: (
        <>
          <i className="ti ti-brand-facebook"></i> Facebook
        </>
      ),
    },
    {
      value: "ti ti-brand-instagram",
      label: (
        <>
          <i className="ti ti-brand-instagram"></i> Instagram
        </>
      ),
    },
    {
      value: "ti ti-brand-twitter-filled",
      label: (
        <>
          <i className="ti ti-brand-twitter-filled"></i> Twitter
        </>
      ),
    },
    {
      value: "ti ti-brand-twitter",
      label: (
        <>
          <i className="ti ti-brand-twitter"></i> Twitter
        </>
      ),
    },
    {
      value: "ti ti-mail",
      label: (
        <>
          <i className="ti ti-mail"></i> Mail
        </>
      ),
    },
    {
      value: "ti ti-brand-whatsapp",
      label: (
        <>
          <i className="ti ti-brand-whatsapp"></i> Whatsapp
        </>
      ),
    },
    {
      value: "ti ti-brand-yahoo",
      label: (
        <>
          <i className="ti ti-brand-yahoo"></i> Yahoo
        </>
      ),
    },
    {
      value: "ti ti-phone-calling",
      label: (
        <>
          <i className="ti ti-phone-calling"></i> Phone
        </>
      ),
    },
    {
      value: "ti ti-phone-call",
      label: (
        <>
          <i className="ti ti-phone-call"></i> Phone
        </>
      ),
    },
    {
      value: "ti ti-brand-google",
      label: (
        <>
          <i className="ti ti-brand-google"></i> Google
        </>
      ),
    },
    {
      value: "ti ti-brand-reddit",
      label: (
        <>
          <i className="ti ti-brand-reddit"></i> Reddit
        </>
      ),
    },
    {
      value: "ti ti-brand-yahoo",
      label: (
        <>
          <i className="ti ti-brand-yahoo"></i> Yahoo
        </>
      ),
    },
    {
      value: "ti ti-download",
      label: (
        <>
          <i className="ti ti-download"></i> Download
        </>
      ),
    },
  ];

  const [selectedIcon, setSelectedIcon] = useState(null);

  const handleChange = (selectedIcon) => {
    setSelectedIcon(selectedIcon);
    setFormValue((prev) => ({
      ...prev,
      icon: selectedIcon ? selectedIcon.value : null,
    }));
  };

  return (
    formValue && (
      <div id={`adder`} className="hs-overlay hidden ti-modal">
        <div className="hs-overlay-open:mt-7 ti-modal-box  mt-0 ease-out lg:!max-w-6xl lg:w-full m-3 lg:!mx-auto">
          <div className="ti-modal-content">
            <div className="ti-modal-header">
              <h3 className="ti-modal-title text-base"> Add new Social </h3>
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
                    Social Name
                  </label>
                  <input
                    type="text"
                    id="input-label"
                    value={formValue.title}
                    name="name"
                    onChange={(e) => handleInputChange(e)}
                    className="ti-form-input"
                    placeholder="Social name"
                  />
                </div>
                <div className="">
                  <label htmlFor="input-label1" className="ti-form-label">
                    Social link
                  </label>
                  <input
                    placeholder="Social Link"
                    type="text"
                    name="link"
                    value={formValue.description}
                    onChange={(e) => handleInputChange(e)}
                    className="ti-form-input"
                  ></input>
                </div>
                <div className="">
                  <label htmlFor="input-label" className="ti-form-label">
                    Social Icon
                  </label>
                  <Select
                    value={selectedIcon}
                    onChange={handleChange}
                    options={icons}
                    placeholder="Select an icon"
                    isClearable
                  />
                  {selectedIcon && (
                    <>
                      <div
                        className="selected-icon  ti-btn
                       
                        ti-btn-outline-primary"
                      >
                        <i className={selectedIcon.value}></i>{" "}
                      </div>
                      {selectedIcon.label.props.children[1]}
                    </>
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
                onClick={handleCreateSocial}
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

export default SocialLinks;
