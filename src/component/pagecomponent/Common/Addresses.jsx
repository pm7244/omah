import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";

const Addresses = () => {
  const [contacts, setContacts] = useState();

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getalladdress`)
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
          currentpage="Addresses List"
          activepage="Pages"
          mainpage="Address"
        />
        <div className="box">
          <div className="p-3">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-4">
                <div className="sm:flex sm:space-x-3 sm:space-y-0 space-y-1 task-left rtl:space-x-reverse">
                  <button
                    data-hs-overlay={`#address-new-compose`}
                    className="hs-tooltip-toggle  ti-btn rounded-full p-0 transition-none "
                  >
                    <div className="ti-btn ti-btn-primary">
                      <i className="ri-add-line"></i>
                      Add New Address
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
                    <h5 className="box-title">Addresses List</h5>
                  </div>
                  <div className="box-body">
                    <div className="overflow-auto table-bordered">
                      <table className="ti-custom-table ti-striped-table ti-custom-table-hover">
                        <thead>
                          <tr className="border-b text-center">
                            <th className="w-7 p-4 ">#</th>
                            <th>Location</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contacts?.map((contact, i) => (
                            <AddressesTable
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

export default Addresses;

const AddressesTable = ({ contacts, fetchData }) => {
  const handleDeleteClick = (id) => {
    const confirm = window.confirm("Are you sure want to delete");
    if (confirm) {
      fetch(`${import.meta.env.VITE_CMS_URL}api/deletebyidaddress/${id}`, {
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
        <td className="  border-r">{contacts.address_id}</td>
        <td className="border-r">{contacts.city}</td>
        <td className="  border-r">{contacts.email}</td>
        <td className=" border-r ">
          <textarea
            className="ti-form-input lg:w-full"
            rows="3"
            value={contacts.address}
          ></textarea>
        </td>
        <td className="grid grid-cols-1 justify-start">
          <div className="hs-tooltip ti-main-tooltip">
            <button
              data-hs-overlay={`#category-edit-compose${contacts.address_id}`}
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
              onClick={() => handleDeleteClick(contacts.address_id)}
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
      fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidaddress/${id}`, {
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
    if (
      !(
        inputData.name &&
        inputData.address &&
        inputData.email &&
        inputData.city &&
        inputData.phone_no
      )
    ) {
      toast.error("Please fill all fields");
      return;
    } else {
      SubmitChangedData(inputData.address_id);
    }
  };

  return (
    <div
      id={`category-edit-compose${inputData.address_id}`}
      className="hs-overlay hidden ti-modal"
    >
      <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out lg:!max-w-2xl lg:w-full m-3 lg:!mx-auto">
        <div className="ti-modal-content">
          <div className="ti-modal-header">
            <h3 className="ti-modal-title"> Edit Details</h3>
            <button
              type="button"
              className="hs-dropdown-toggle ti-modal-close-btn"
              data-hs-overlay={`#category-edit-compose${inputData.address_id}`}
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
              <div className="flex space-x-5">
                <div className="">
                  <label className="ti-form-label">Latitude</label>
                  <input
                    type="number"
                    name="latitude"
                    value={inputData.latitude}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="">
                  <label className="ti-form-label">Longitude</label>
                  <input
                    type="number"
                    name="longitude"
                    value={inputData.longitude}
                    onChange={handleInputChange}
                  />
                </div>
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
              <div>
                <label className="ti-form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="ti-form-input"
                  value={inputData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="">
                <label className="ti-form-label">Address</label>
                <textarea
                  className="ti-form-input"
                  name="address"
                  rows="3"
                  value={inputData.address}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="flex space-x-4">
                <div className="">
                  <label className="ti-form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    value={inputData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="">
                  <label className="ti-form-label">Phone No</label>
                  <input
                    type="number"
                    name="phone_no"
                    value={inputData.phone_no}
                    onChange={handleInputChange}
                  />
                </div>
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
              data-hs-overlay={`#category-edit-compose${inputData.address_id}`}
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
    latitude: 0,
    longitude: 0,
    email: "",
    address: "",
    city: "",
    phone_no: 0,
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
    fetch(`${import.meta.env.VITE_CMS_URL}api/createaddress`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        toast.success("Category Added Successfully");
        setFormInput({
          name: "",
          latitude: 0,
          longitude: 0,
          email: "",
          address: "",
          city: "",
          phone_no: 0,
          status: 0,
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
        formInput.email &&
        formInput.address &&
        formInput.city &&
        formInput.city &&
        formInput.phone_no
      )
    ) {
      toast.error("Please fill all fields");
      return;
    } else {
      SubmitData();
    }
  };

  return (
    <div id={`address-new-compose`} className="hs-overlay hidden ti-modal">
      <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out lg:!max-w-2xl lg:w-full m-3 lg:!mx-auto">
        <div className="ti-modal-content">
          <div className="ti-modal-header">
            <h3 className="ti-modal-title"> Address Detail </h3>
            <button
              type="button"
              className="hs-dropdown-toggle ti-modal-close-btn"
              data-hs-overlay={`#address-new-compose`}
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
                  value={formInput.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="">
                <label className="ti-form-label">Email</label>
                <input
                  type="email"
                  className="ti-form-input"
                  name="email"
                  placeholder="Enter Email address"
                  value={formInput.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex space-x-3">
                <div className="">
                  <label className="ti-form-label">Latitude</label>
                  <input
                    type="number"
                    placeholder="Enter Latitude"
                    name="latitude"
                    value={formInput.latitude}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="">
                  <label className="ti-form-label">Longitude</label>
                  <input
                    type="number"
                    placeholder="Enter Longitude"
                    name="longitude"
                    value={formInput.longitude}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="">
                  <label className="ti-form-label">Contact no</label>
                  <input
                    type="number"
                    name="phone_no"
                    placeholder="Enter Phone no"
                    value={formInput.phone_no}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="">
                  <label className="ti-form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter City Name"
                    value={formInput.city}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="">
                <label className="ti-form-label">Address</label>
                <textarea
                  type="text"
                  rows={3}
                  className="ti-form-input"
                  name="address"
                  placeholder="Enter Address"
                  value={formInput.address}
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
              data-hs-overlay={`#address-new-compose`}
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
