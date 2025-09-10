import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";

const BlogCategory = () => {
  const [contacts, setContacts] = useState();

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallblog_category`)
      .then((res) => res.json())
      .then((data) => setContacts(data.data))
      .catch((err) => console.log(err.message));
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    contacts && (
      <div>
        <PageHeader
          currentpage="Blog Categories List"
          activepage="Pages"
          mainpage="Blog Categories"
        />
        <div className="box">
          <div className="p-3">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-4">
                <div className="sm:flex sm:space-x-3 sm:space-y-0 space-y-1 task-left rtl:space-x-reverse">
                  <button
                    data-hs-overlay={`#category-new-compose`}
                    className="hs-tooltip-toggle  ti-btn rounded-full p-0 transition-none "
                  >
                    <div className="ti-btn ti-btn-primary">
                      <i className="ri-add-line"></i>
                      Add New Category
                    </div>
                  </button>
                </div>
                <ModalAddNew fetchData={fetchData} />
              </div>
              <div className="col-span-12 lg:col-span-8">
                <div className="relative sm:max-w-4xl w-full">
                  <label htmlFor="hs-table-search" className="sr-only">
                    Search
                  </label>
                  <div className="absolute inset-y-0 ltr:right-0 rtl:left-0 flex items-center pointer-events-none ltr:pr-4 rtl:pl-4">
                    <i className="ti ti-search"></i>
                  </div>
                  <input
                    type="text"
                    name="hs-table-search"
                    id="hs-table-search"
                    className="p-2 ltr:pr-10 rtl:pl-10 ti-form-input"
                    placeholder="Search By Name"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="box">
          <div className="box-body">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12">
                <div className="box xl:overflow-auto">
                  <div className="box-header">
                    <h5 className="box-title">Category List</h5>
                  </div>
                  <div className="box-body">
                    <div className="overflow-auto table-bordered">
                      <table className="ti-custom-table ti-striped-table ti-custom-table-hover">
                        <thead>
                          <tr className="border-b text-center">
                            <th className="w-7 p-4 ">#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Sort Order</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contacts?.map((contact, i) => (
                            <CategoryTable
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
      </div>
    )
  );
};

export default BlogCategory;

const CategoryTable = ({ contacts, fetchData }) => {
  const handleDeleteClick = (id) => {
    const confirm = window.confirm("Are you sure want to delete");
    if (confirm) {
      fetch(
        `${import.meta.env.VITE_CMS_URL}api/deletebyidblog_category/${id}`,
        {
          method: "DELETE",
        }
      )
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
        <td className=" py-9 border-r">{contacts.category_id}</td>
        <td className=" py-9 border-r">{contacts.name}</td>
        <td className=" py-9 border-r">
          {contacts.description.slice(0, 40) + "..."}
        </td>
        <td className=" py-9 border-r">{contacts.sort_order}</td>
        <td className="flex justify-start">
          <div className="hs-tooltip ti-main-tooltip">
            <button
              data-hs-overlay={`#category-edit-compose${contacts.category_id}`}
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
              onClick={() => handleDeleteClick(contacts.category_id)}
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

    setInputData((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };

      if (name === "name") {
        newState.cat_slug = value.toLowerCase().replace(/\s+/g, "-");
      }

      return newState;
    });
  };

  const SubmitChangedData = (id) => {
    const newData = { ...inputData };
    if (JSON.stringify(newData) !== JSON.stringify(contacts)) {
      fetch(
        `${import.meta.env.VITE_CMS_URL}api/updatebyidblog_category/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(newData),
          headers: { "Content-type": "application/json" },
        }
      )
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
    if (
      !(
        inputData.name &&
        inputData.meta_title &&
        inputData.meta_title &&
        inputData.description
      )
    ) {
      toast.error("Please fill all fields");
      return;
    } else {
      SubmitChangedData(inputData.category_id);
    }
  };

  return (
    <div
      id={`category-edit-compose${inputData.category_id}`}
      className="hs-overlay hidden ti-modal"
    >
      <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out ">
        <div className="ti-modal-content">
          <div className="ti-modal-header">
            <h3 className="ti-modal-title"> Edit Details</h3>
            <button
              type="button"
              className="hs-dropdown-toggle ti-modal-close-btn"
              data-hs-overlay={`#category-edit-compose${inputData.category_id}`}
            >
              <span className="sr-only">Close</span>
              <i className="ri-close-line"></i>
            </button>
          </div>
          <div className="ti-modal-body">
            <div className="space-y-3">
              <div className="">
                <label className="ti-form-label">Name</label>
                <input
                  type="text"
                  className="ti-form-input"
                  placeholder="Enter Name"
                  name="name"
                  value={inputData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="">
                <label className="ti-form-label">Slug</label>
                <input
                  type="text"
                  className="ti-form-input"
                  placeholder="Slug"
                  name="cat_slug"
                  value={inputData.cat_slug}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
              <div className="">
                <label className="ti-form-label">Description</label>
                <input
                  type="text"
                  className="ti-form-input"
                  placeholder="Desription"
                  name="description"
                  value={inputData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="">
                <label className="ti-form-label">Sorting</label>
                <input
                  type="number"
                  className="ti-form-input"
                  name="sort_order"
                  placeholder="Enter sorting number"
                  value={inputData.sort_order}
                  onChange={handleInputChange}
                />
              </div>
              <div className="">
                <label className="ti-form-label">Meta Title</label>
                <input
                  type="text"
                  className="ti-form-input"
                  name="meta_title"
                  placeholder="Enter Meta Title"
                  value={inputData.meta_title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="">
                <label className="ti-form-label">Meta Description</label>
                <textarea
                  type="text"
                  rows={2}
                  className="ti-form-input"
                  name="meta_desc"
                  placeholder="Enter Meta Description"
                  value={inputData.meta_desc}
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
                    inputData.cat_status === 0
                      ? { value: 0, label: "Disable" }
                      : { value: 1, label: "Enable" },
                  ]}
                  onChange={(val) =>
                    setInputData((prev) => ({ ...prev, cat_status: val.value }))
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
              data-hs-overlay={`#category-edit-compose${inputData.category_id}`}
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
    name: "",
    cat_slug: "",
    description: "",
    sort_order: "",
    cat_status: 1,
    meta_title: "",
    meta_desc: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormInput((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };

      if (name === "name") {
        newState.cat_slug = value.toLowerCase().replace(/\s+/g, "-");
      }

      return newState;
    });
  };

  const SubmitData = () => {
    const formData = {
      ...formInput,
    };
    fetch(`${import.meta.env.VITE_CMS_URL}api/createblog_category`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        toast.success("Category Added Successfully");
        setFormInput({
          name: "",
          cat_slug: "",
          sort_order: "",
          description: "",
          cat_status: 1,
          meta_desc: "",
          meta_title: "",
        });
        fetchData();
      })
      .catch((err) => {
        toast.error(err.message), console.log(err);
      });
  };

  const handleSubmit = () => {
    if (
      !(
        formInput.name &&
        formInput.meta_title &&
        formInput.meta_title &&
        formInput.description
      )
    ) {
      toast.error("Please fill all fields");
      return;
    } else {
      SubmitData();
    }
  };

  return (
    <div id={`category-new-compose`} className="hs-overlay hidden ti-modal">
      <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out ">
        <div className="ti-modal-content">
          <div className="ti-modal-header">
            <h3 className="ti-modal-title"> Category Detail </h3>
            <button
              type="button"
              className="hs-dropdown-toggle ti-modal-close-btn"
              data-hs-overlay={`#category-new-compose`}
            >
              <span className="sr-only">Close</span>
              <i className="ri-close-line"></i>
            </button>
          </div>
          <div className="ti-modal-body">
            <div className="space-y-3">
              <div className="">
                <label className="ti-form-label">Name</label>
                <input
                  type="text"
                  className="ti-form-input"
                  placeholder="Enter Category Name"
                  name="name"
                  value={formInput.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="">
                <label className="ti-form-label">Slug</label>
                <input
                  type="text"
                  className="ti-form-input"
                  placeholder="Slug"
                  name="cat_slug"
                  value={formInput.cat_slug}
                  disabled
                />
              </div>
              <div className="">
                <label className="ti-form-label">Description</label>
                <input
                  type="text"
                  className="ti-form-input"
                  placeholder="Desription"
                  name="description"
                  value={formInput.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="">
                <label className="ti-form-label">Sorting</label>
                <input
                  type="number"
                  className="ti-form-input"
                  name="sort_order"
                  placeholder="Enter sorting number"
                  value={formInput.sort_order}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="">
                <label className="ti-form-label">Meta Title</label>
                <input
                  type="text"
                  className="ti-form-input"
                  name="meta_title"
                  placeholder="Enter Meta Title"
                  value={formInput.meta_title}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="">
                <label className="ti-form-label">Meta Description</label>
                <textarea
                  type="text"
                  rows={2}
                  className="ti-form-input"
                  name="meta_desc"
                  placeholder="Enter Meta Description"
                  value={formInput.meta_desc}
                  onChange={(e) => handleInputChange(e)}
                ></textarea>
              </div>
              <div>
                <label className="ti-form-label">Status</label>
                <Select
                  classNamePrefix="react-select"
                  name="status"
                  value={[
                    formInput.cat_status === 1
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
                      cat_status: val.value,
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
              data-hs-overlay={`#category-new-compose`}
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
