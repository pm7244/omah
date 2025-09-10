import { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";

const ProjectSubCategories = () => {
  const [contacts, setContacts] = useState();

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallsub_category`)
      .then((res) => res.json())
      .then((data) => setContacts(data.data))
      .catch((err) => console.log(err.message));
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    contacts && (
      <div className="box">
        <div className="box-body">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <div className="box xl:overflow-auto">
                <div className="box-header">
                  <h5 className="box-title">Sub-Categories List</h5>
                </div>
                <div className="box-body">
                  <div className="overflow-auto table-bordered">
                    <table className="ti-custom-table ti-striped-table ti-custom-table-hover">
                      <thead>
                        <tr className="border-b text-center">
                          <th className="w-7 p-4 ">#</th>
                          <th>Title</th>
                          <th>Description</th>
                          <th className="grid grid-cols-2">
                            Add New
                            <div className="hs-tooltip ti-main-tooltip">
                              <button
                                variant=""
                                className="hs-tooltip-toggle h-6 w-6 ti-btn rounded-full p-0 transition-none focus:outline-none ti-btn-soft-primary ms-4"
                                type="button"
                                data-hs-overlay={`#sub-categories-new-compose`}
                              >
                                <i className="ri ri-add-fill" />
                              </button>
                            </div>
                            <ModalAddNew fetchData={fetchData} />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts?.map((contact, i) => (
                          <SubCategoriesTable
                            iter={i}
                            contacts={contact}
                            key={i}
                            fetchData={fetchData}
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
      </div>
    )
  );
};

export default ProjectSubCategories;

const SubCategoriesTable = ({ contacts, fetchData }) => {
  const handleDeleteClick = (id) => {
    const confirm = window.confirm("Are you sure want to delete");
    if (confirm) {
      fetch(`${import.meta.env.VITE_CMS_URL}api/deletebyidsub_category/${id}`, {
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
      <tr className="border-b p-5">
        <td className="  border-r">{contacts.sub_cat_id}</td>
        <td className="border-r">{contacts.title}</td>
        <td className=" border-r ">
          <textarea
            className="ti-form-input lg:w-full"
            rows="2"
            value={contacts.description}
            disabled
          ></textarea>
        </td>
        <td className="justify-center">
          <div className="hs-tooltip ti-main-tooltip">
            <button
              data-hs-overlay={`#category-edit-compose${contacts.sub_cat_id}`}
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
              onClick={() => handleDeleteClick(contacts.sub_cat_id)}
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
          <ModalEdit fetchData={fetchData} contacts={contacts} />
        </td>
      </tr>
    )
  );
};

const ModalEdit = ({ contacts, fetchData }) => {
  const [inputData, setInputData] = useState(contacts);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prv) => (prv = { ...prv, [name]: value }));
  };

  const SubmitChangedData = (id) => {
    const newData = { ...inputData };
    if (JSON.stringify(newData) !== JSON.stringify(contacts)) {
      fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidsub_category/${id}`, {
        method: "PUT",
        body: JSON.stringify(newData),
        headers: { "Content-type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            toast.success("Details Updated");
            fetchData();
          }
        })
        .catch((err) => {
          toast.error(err.message);
        });
    } else {
      toast.success("Data is not changed");
    }
  };

  const handleSubmit = () => {
    if (!(inputData.title && inputData.description)) {
      toast.error("Please fill all fields");
      return;
    } else {
      SubmitChangedData(inputData.sub_cat_id);
    }
  };

  return (
    <div
      id={`category-edit-compose${inputData.sub_cat_id}`}
      className="hs-overlay hidden ti-modal"
    >
      <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out lg:!max-w-2xl lg:w-full m-3 lg:!mx-auto">
        <div className="ti-modal-content">
          <div className="ti-modal-header">
            <h3 className="ti-modal-title">Edit Details</h3>
            <button
              type="button"
              className="hs-dropdown-toggle ti-modal-close-btn"
              data-hs-overlay={`#category-edit-compose${inputData.sub_cat_id}`}
            >
              <span className="sr-only">Close</span>
              <i className="ri-close-line"></i>
            </button>
          </div>
          <div className="ti-modal-body">
            <div className="space-y-3">
              <div className="">
                <label className="ti-form-label">Title</label>
                <input
                  type="text"
                  className="ti-form-input"
                  placeholder="Enter Title"
                  name="title"
                  value={inputData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="">
                <label className="ti-form-label">Description</label>
                <textarea
                  className="ti-form-input"
                  name="description"
                  rows="3"
                  value={inputData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div>
                <label className="ti-form-label">Status</label>
                <Select
                  classNamePrefix="react-select"
                  options={[
                    { value: 0, label: "Disable" },
                    { value: 1, label: "Enable" },
                  ]}
                  value={[
                    inputData.status === 0
                      ? { value: 0, label: "Disable" }
                      : { value: 1, label: "Enable" },
                  ]}
                  onChange={(val) =>
                    setInputData((prev) => ({ ...prev, status: val.value }))
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
              data-hs-overlay={`#category-edit-compose${inputData.sub_cat_id}`}
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
  );
};

const ModalAddNew = ({ fetchData }) => {
  const [formInput, setFormInput] = useState({
    title: "",
    description: "",
    status: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prv) => (prv = { ...prv, [name]: value }));
  };

  const SubmitData = () => {
    const formData = {
      ...formInput,
    };
    fetch(`${import.meta.env.VITE_CMS_URL}api/createsub_category`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        toast.success("Category Added Successfully");
        setFormInput({
          title: "",
          description: "",
          status: 0,
        });
        fetchData();
      })
      .catch((err) => {
        toast.error(err.message), console.log(err);
      });
  };

  const handleSubmit = () => {
    if (!(formInput.title && formInput.description)) {
      toast.error("Please fill all fields");
      return;
    } else {
      SubmitData();
    }
  };

  return (
    <div
      id={`sub-categories-new-compose`}
      className="hs-overlay hidden ti-modal"
    >
      <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out lg:!max-w-2xl lg:w-full m-3 lg:!mx-auto">
        <div className="ti-modal-content">
          <div className="ti-modal-header">
            <h3 className="ti-modal-title"> Sub-Categories Detail </h3>
            <button
              type="button"
              className="hs-dropdown-toggle ti-modal-close-btn"
              data-hs-overlay={`#sub-categories-new-compose`}
            >
              <span className="sr-only">Close</span>
              <i className="ri-close-line"></i>
            </button>
          </div>
          <div className="ti-modal-body">
            <div className="space-y-3">
              <div className="">
                <label className="ti-form-label">Title</label>
                <input
                  type="text"
                  className="ti-form-input"
                  placeholder="Enter Title"
                  name="title"
                  value={formInput.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="">
                <label className="ti-form-label">Description</label>
                <textarea
                  type="text"
                  rows={3}
                  className="ti-form-input"
                  name="description"
                  placeholder="Enter Description"
                  value={formInput.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div>
                <label className="ti-form-label">Status</label>
                <Select
                  classNamePrefix="react-select"
                  name="status"
                  value={[
                    formInput.status === 1
                      ? { value: 1, label: "Enable" }
                      : { value: 0, label: "Disable" },
                  ]}
                  options={[
                    { value: 0, label: "Disable" },
                    { value: 1, label: "Enable" },
                  ]}
                  onChange={(val) =>
                    setFormInput((prev) => ({
                      ...prev,
                      status: val.value,
                    }))
                  }
                  menuPlacement="top"
                />
              </div>
            </div>
          </div>
          <div className="ti-modal-footer">
            <button
              type="button"
              className="hs-dropdown-toggle ti-btn ti-border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:ring-offset-white focus:ring-primary dark:bg-bgdark dark:hover:bg-black/20 dark:border-white/10 dark:text-white/70 dark:hover:text-white dark:focus:ring-offset-white/10"
              data-hs-overlay={`#sub-categories-new-compose`}
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
    // )
  );
};
