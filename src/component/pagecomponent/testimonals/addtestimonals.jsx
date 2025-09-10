import React, { useState } from "react";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation);

const Addtestimonals = () => {
  const navigate = useNavigate();

  const SubmitData = () => {
    const SubmitterData = {
      name: name,
      description: description,
      company: company,
      status: status,
    };
    fetch(`${import.meta.env.VITE_CMS_URL}api/createtestimonial`, {
      method: "POST",
      body: JSON.stringify(SubmitterData),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .then(
        toast.success("Added new data Successfully"),
        navigate(`/cms/pages/testimonials/`)
      )
      .catch((err) => toast.error(err.message));
  };

  const handleSubmit = () => {
    if (!(name && description && company)) {
      toast.error("Please enter all field");
      return;
    }
    try {
      SubmitData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState(1);
  return (
    <div>
      <PageHeader
        currentpage="Add Testimonal"
        activepage="Pages"
        mainpage="Add Testimonal"
      />
      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12">
          <div className="box !bg-transparent border-0 shadow-none">
            <div className="box-body p-0">
              <div className="col-span-12 xl:col-span-6">
                <div className="box ">
                  <div className="box-body">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="ti-form-label mb-0">Name</label>
                        <input
                          type="text"
                          className="my-auto ti-form-input"
                          placeholder="name "
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="ti-form-label">Message</label>
                        <textarea
                          className="ti-form-input"
                          rows="2"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="ti-form-label mb-0">Company</label>
                        <input
                          type="text"
                          className="my-auto ti-form-input"
                          placeholder="Enter Company"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                        />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <div className="space-y-2  product-1">
                          <label className="ti-form-label mb-0">Status</label>
                          <Select
                            className="product-search"
                            value={[
                              status === 1
                                ? { value: 1, label: "Enable" }
                                : { value: 0, label: "Disable" },
                            ]}
                            classNamePrefix="react-select"
                            options={[
                              { value: 1, label: "Enable" },
                              { value: 0, label: "Disable" },
                            ]}
                            onChange={(val) => setStatus(val.value)}
                            placeholder="Status"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="box-footer text-end border-t-0 px-0">
              <button
                className="ti-btn ti-btn-primary"
                onClick={(e) => handleSubmit(e)}
                type="button"
              >
                <i className="ri-add-line"></i>Add Product
              </button>
              <Link to="#" className="ti-btn ti-btn-danger">
                <i className="ri-delete-bin-line"></i>Discard Product
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Addtestimonals;
