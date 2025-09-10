import React, { useState } from "react";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddCareer = () => {
  const navigate = useNavigate();
  const SubmitData = () => {
    const SubmitterData = {
      title: title,
      experience: experience,
      status: status,
      location: location,
      description: description,
    };
    fetch(`${import.meta.env.VITE_CMS_URL}api/createjob`, {
      method: "POST",
      body: JSON.stringify(SubmitterData),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .then(
        toast.success("Added new data Successfully"),
        navigate(`/cms/pages/career`)
      )
      .catch((err) => toast.error(err.message));
  };

  const handleSubmit = () => {
    if (!(title && experience && location)) {
      toast.error("Please enter all field");
      return;
    }
    try {
      SubmitData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [title, setTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState(1);
  const [description, setDescription] = useState("");
  return (
    <div>
      <PageHeader
        currentpage="Add Career"
        activepage="Pages"
        mainpage="Add Career"
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
                        <label className="ti-form-label mb-0">Position</label>
                        <input
                          type="text"
                          className="my-auto ti-form-input"
                          placeholder="Position"
                          name="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="ti-form-label mb-0">
                          Description
                        </label>
                        <textarea
                          rows={4}
                          className="ti-form-input"
                          name="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="ti-form-label">Experience</label>
                        <input
                          type="number"
                          className="my-auto ti-form-input"
                          name="experience"
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="ti-form-label">Location</label>
                        <input
                          type="text"
                          className="my-auto ti-form-input"
                          placeholder="Location"
                          name="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
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
                            onChange={(val) =>
                              setStatus((prv) => (prv = { status: val.value }))
                            }
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
                <i className="ri-add-line"></i>Add Career
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
export default AddCareer;
