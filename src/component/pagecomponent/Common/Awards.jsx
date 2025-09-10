import React, { useEffect, useState } from "react";
import Select from "react-select";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import Filemanagermain from "../fileManager/filemanagermain";

const Awards = () => {
  const [values, setValues] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getAllawards/`)
      .then((res) => res.json())
      .then((data) => {
        setValues(data.data);
      })
      .catch((err) => toast.error(err.message));
  };

  const handleDeleteClick = (id) => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/deletebyidawards/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        fetchData();
        toast.success("Deleted Succefully");
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    values && (
      <div>
        <PageHeader currentpage="Awards" activepage="Pages" mainpage="Awards" />
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
                      <th className="dark:text-white/70">Title</th>
                      <th className="dark:text-white/70">Date</th>
                      {/* <th className="dark:text-white/70 w-1/2">
                        Image
                        <span style={{ visibility: "hidden" }}>
                          ImageImageImage
                        </span>
                      </th> */}
                      <th className="dark:text-white/70">sort</th>
                      <th className="dark:text-white/70">status</th>
                      <th className="dark:text-white/70 font-semibold">
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
                      </th>
                    </tr>
                    <Modal2 fetchData={fetchData} />
                  </thead>
                  <tbody>
                    {values.map((value) => (
                      <ReadOnlyRows
                        key={value.awards_id}
                        value={value}
                        fetchData={fetchData}
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

const ReadOnlyRows = ({ value, handleDeleteClick, fetchData }) => {
  return (
    <tr>
      <td>{value.title}</td>
      <td>{value.date}</td>
      {/* <td>
        <img
          src={`${import.meta.env.VITE_CMS_URL}${value.image}`}
          className="box-img-top h-40 rounded-sm"
          alt="cover image"
        />
      </td> */}
      <td>{value.sort_order}</td>
      <td>{value.status ? "Enable" : "Disable"}</td>
      <td>
        <div className="hs-tooltip ti-main-tooltip">
          <Link
            to="#"
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
        <Modal value={value} fetchData={fetchData} />
        <div className="hs-tooltip ti-main-tooltip">
          <button
            variant=""
            className="hs-tooltip-toggle w-8 h-8 ti-btn rounded-full p-0 transition-none focus:outline-none ti-btn-soft-danger"
            type="button"
            onClick={() => handleDeleteClick(value.awards_id)}
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

const Modal = ({ value, fetchData }) => {
  const [image, setImage] = useState([...JSON.parse(value.image)]);
  const [managerOpener, setManagerOpener] = useState(false);
  const [formValue, setFormValue] = useState({
    ...value,
    image: JSON.parse(value.image),
  });
  const [assDate, setAssDate] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
  );

  const handleUpdateAward = () => {
    let tempDate = assDate.getTime() + 172800000;
    fetch(
      `${import.meta.env.VITE_CMS_URL}api/updatebyidawards/${
        formValue.awards_id
      }`,
      {
        method: "PUT",
        body: JSON.stringify({
          ...formValue,
          image: JSON.stringify(image),
          date: new Date(tempDate).toISOString().split("T")[0],
        }),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then(() => {
        fetchData();
        toast.success("Updated Succefully");
      })
      .catch((err) => toast.error(err.message));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prv) => (prv = { ...prv, [name]: value }));
  };

  useEffect(() => {
    setFormValue((prv) => (prv = { ...prv, image: image }));
  }, [image]);

  return (
    formValue && (
      <div
        id={`todo-compose${formValue.awards_id}`}
        className="hs-overlay hidden ti-modal"
      >
        <div className="hs-overlay-open:mt-7 ti-modal-box  mt-0 ease-out lg:!max-w-6xl lg:w-full m-3 lg:!mx-auto">
          <div className="ti-modal-content">
            <div className="ti-modal-header">
              <h3 className="ti-modal-title text-base"> Add new Award </h3>
              <button
                type="button"
                className="hs-dropdown-toggle ti-modal-close-btn"
                data-hs-overlay={`#todo-compose${formValue.awards_id}`}
              >
                <span className="sr-only">Close</span>
                <i className="ri-close-line"></i>
              </button>
            </div>
            {managerOpener ? (
              <Filemanagermain
                ratio={1.56}
                file={image}
                fileSetter={setImage}
                openSetter={setManagerOpener}
              />
            ) : (
              <div className="ti-modal-body">
                <div className="space-y-3">
                  <div className="">
                    <label htmlFor="input-label" className="ti-form-label">
                      Award Title
                    </label>
                    <input
                      type="text"
                      id="input-label"
                      value={formValue.title}
                      name="title"
                      onChange={(e) => handleInputChange(e)}
                      className="ti-form-input"
                      placeholder="Award title"
                    />
                  </div>
                  <div className="">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Award Description
                    </label>
                    <textarea
                      name="description"
                      value={formValue.description}
                      onChange={(e) => handleInputChange(e)}
                      className="ti-form-input"
                      rows="6"
                    ></textarea>
                  </div>
                  <div onClick={() => setManagerOpener(!managerOpener)}>
                    <label htmlFor="input-label" className="ti-form-label">
                      Award Image
                    </label>
                    {formValue.image ? (
                      <div>
                        <button
                          type="button"
                          className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                        >
                          Change Image <i className="ti ti-file-plus "></i>
                        </button>
                        <div className="grid grid-cols-12 gap-x-2">
                          {formValue.image.map((imgpath, i) => (
                            <img
                              key={i}
                              src={`${
                                import.meta.env.VITE_CMS_URL
                              }api/transform/${imgpath}`}
                              className="h-40 grid-cols-4 rounded-t-sm"
                            />
                          ))}
                        </div>
                      </div>
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
                      values={[
                        formValue.sort_order
                          ? { value: 1, label: 1 }
                          : { value: 0, label: 0 },
                      ]}
                      classNamePrefix="react-select"
                      onChange={(val) => {
                        setFormValue({ ...formValue, status: val.value });
                      }}
                      options={[
                        { value: 0, label: 0 },
                        { value: 1, label: 1 },
                      ]}
                      placeholder="Open this select menu"
                    />
                  </div>
                  <div>
                    <label htmlFor="input-label" className="ti-form-label">
                      Assigned Date
                    </label>
                    <div className="flex rounded-sm shadow-sm">
                      <div className="px-4 inline-flex items-center min-w-fit ltr:rounded-l-sm rtl:rounded-r-sm border ltr:border-r-0 rtl:border-l-0 border-gray-200 bg-gray-50 dark:bg-black/20 dark:border-white/10">
                        <span className="text-sm text-gray-500 dark:text-white/70">
                          <i className="ri ri-calendar-line"></i>
                        </span>
                      </div>
                      <DatePicker
                        className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10 flatpickr-input"
                        // showIcon
                        // format="yyyy-MM-dd"

                        selected={assDate}
                        onChange={(e) => setAssDate(e)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="ti-form-label">Status</label>
                    <Select
                      values={[
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
                data-hs-overlay={`#todo-compose${formValue.awards_id}`}
              >
                Close
              </button>
              <button
                className="ti-btn ti-btn-primary"
                onClick={handleUpdateAward}
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

const Modal2 = ({ fetchData }) => {
  const initialValue = {
    title: "",
    description: "",
    image: [],
    date: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ),
    sort_order: 0,
    status: 1,
  };

  const [image, setImage] = useState([]);
  const [managerOpener, setManagerOpener] = useState(false);
  const [formValue, setFormValue] = useState(initialValue);
  const [assDate, setAssDate] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
  );

  useEffect(() => {
    setFormValue((prv) => (prv = { ...prv, image: image }));
  }, [image]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prv) => (prv = { ...prv, [name]: value }));
  };

  const handleCreateAwards = () => {
    let tempDate = assDate.getTime() + 172800000;
    fetch(`${import.meta.env.VITE_CMS_URL}api/createawards`, {
      method: "POST",
      body: JSON.stringify({
        ...formValue,
        image: JSON.stringify(image),
        date: new Date(tempDate).toISOString().split("T")[0],
      }),
      headers: { "Content-type": "application/json" },
    })
      .then((res) => res.json())
      .then(() => {
        fetchData();
        toast.success("Updated Succefully");
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <div id={`adder`} className="hs-overlay hidden ti-modal">
      <div className="hs-overlay-open:mt-7 ti-modal-box  mt-0 ease-out lg:!max-w-6xl lg:w-full m-3 lg:!mx-auto">
        <div className="ti-modal-content">
          <div className="ti-modal-header">
            <h3 className="ti-modal-title text-base"> Add new Award </h3>
            <button
              type="button"
              className="hs-dropdown-toggle ti-modal-close-btn"
              data-hs-overlay={`#adder`}
            >
              <span className="sr-only">Close</span>
              <i className="ri-close-line"></i>
            </button>
          </div>
          {managerOpener ? (
            <Filemanagermain
              ratio={1.56}
              file={image}
              fileSetter={setImage}
              openSetter={setManagerOpener}
            />
          ) : (
            <div className="ti-modal-body">
              <div className="space-y-3">
                <div className="">
                  <label htmlFor="input-label" className="ti-form-label">
                    Award Title
                  </label>
                  <input
                    type="text"
                    id="input-label"
                    value={formValue.title}
                    name="title"
                    onChange={(e) => handleInputChange(e)}
                    className="ti-form-input"
                    placeholder="Award title"
                  />
                </div>
                <div className="">
                  <label htmlFor="input-label1" className="ti-form-label">
                    Award Description
                  </label>
                  <textarea
                    name="description"
                    value={formValue.description}
                    onChange={(e) => handleInputChange(e)}
                    className="ti-form-input"
                    rows="6"
                  ></textarea>
                </div>
                <div
                  className=""
                  onClick={() => setManagerOpener(!managerOpener)}
                >
                  <label htmlFor="input-label" className="ti-form-label">
                    Award Image
                  </label>
                  {formValue.image ? (
                    <>
                      <button
                        type="button"
                        className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                      >
                        Change Image <i className="ti ti-file-plus "></i>
                      </button>
                      <div className="grid grid-cols-12 gap-x-2">
                        {formValue.image.map((imgpath, i) => (
                          <img
                            key={i}
                            src={`${
                              import.meta.env.VITE_CMS_URL
                            }api/transform/${imgpath}`}
                            className="box-img-top h-40 rounded-t-sm"
                          />
                        ))}
                      </div>
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
                    values={[
                      formValue.sort_order
                        ? { value: 1, label: 1 }
                        : { value: 0, label: 0 },
                    ]}
                    classNamePrefix="react-select"
                    onChange={(val) => {
                      setFormValue({ ...formValue, status: val.value });
                    }}
                    options={[
                      { value: 0, label: 0 },
                      { value: 1, label: 1 },
                    ]}
                    placeholder="Open this select menu"
                  />
                </div>
                <div>
                  <label htmlFor="input-label" className="ti-form-label">
                    Assigned Date
                  </label>
                  <div className="flex rounded-sm shadow-sm">
                    <div className="px-4 inline-flex items-center min-w-fit ltr:rounded-l-sm rtl:rounded-r-sm border ltr:border-r-0 rtl:border-l-0 border-gray-200 bg-gray-50 dark:bg-black/20 dark:border-white/10">
                      <span className="text-sm text-gray-500 dark:text-white/70">
                        <i className="ri ri-calendar-line"></i>
                      </span>
                    </div>
                    <DatePicker
                      className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10 flatpickr-input"
                      // showIcon
                      // format="yyyy-MM-dd"

                      selected={assDate}
                      onChange={(e) => setAssDate(e)}
                    />
                  </div>
                </div>
                <div>
                  <label className="ti-form-label">Status</label>
                  <Select
                    values={[
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
              data-hs-overlay={`#adder`}
            >
              Close
            </button>
            <button
              className="ti-btn ti-btn-primary"
              onClick={handleCreateAwards}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Awards;
