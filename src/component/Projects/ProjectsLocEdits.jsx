import React, { useEffect, useState } from "react";
import Select from "react-select";
import PageHeader from "../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
const ProjectsLocEdits = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState();

  const fetchData = () => {
    if (!id) {
      toast.error("Enter Valid ID");
      return;
    }
    fetch(`${import.meta.env.VITE_CMS_URL}api/getbyid-location/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setValues({ ...data.data[0] });
      })
      .then(() => {})
      .catch((err) => toast.error(err.message));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prv) => (prv = { ...values, [name]: value }));
  };

  const handleLocSubmit = () => {
    if (
      !(
        values.name &&
        values.meta_title &&
        values.slug &&
        values.meta_description &&
        values.location_advantage
      )
    ) {
      toast.error("Please Fill all the fields!");
      return;
    }
    fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyid-location/${id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          toast.success("ProjectsEdits updated succesfully");
          navigate("/cms/projects/configs");
        } else {
          toast.error("Failed to update");
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    values && (
      <>
        <div>
          <PageHeader
            currentpage="ProjectsEdits"
            activepage="Pages"
            mainpage="ProjectsEdits"
          />
          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-12 xxl:col-span-8">
              <div className="box">
                <div className="box-header">
                  <h5 className="box-title">Location Name</h5>
                </div>
                <div className="box-body space-y-5">
                  <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    id="input-label1"
                    className="ti-form-input"
                    placeholder="Location Name"
                  />
                </div>
              </div>
              <div className="box">
                <div className="box-header">
                  <h5 className="box-title">Longitude</h5>
                </div>
                <div className="box-body space-y-5">
                  <input
                    type="text"
                    name="latitude"
                    value={values.latitude}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    id="input-label1"
                    className="ti-form-input"
                    placeholder="Enter Longitude"
                  />
                </div>
              </div>
              <div className="box">
                <div className="box-header">
                  <h5 className="box-title">Latitude</h5>
                </div>
                <div className="box-body space-y-5">
                  <input
                    type="text"
                    name="longitude"
                    value={values.longitude}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    id="input-label1"
                    className="ti-form-input"
                    placeholder="Enter Latitude"
                  />
                </div>
              </div>
              <div className="box">
                <div className="box-header">
                  <h5 className="box-title">Meta Description</h5>
                </div>
                <div className="box-body space-y-4">
                  <textarea
                    className="ti-form-input"
                    name="meta_description"
                    value={values.meta_description}
                    onChange={(e) => handleInputChange(e)}
                    rows="7"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="col-span-12 xxl:col-span-4">
              <div className="box">
                <div className="box-header">
                  <h5 className="box-title"> Slug</h5>
                </div>
                <div className="box-body space-y-5">
                  <input
                    type="text"
                    name="slug"
                    value={values.slug}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    className="ti-form-input"
                    placeholder="Slug"
                  ></input>
                </div>
              </div>

              <div className="box">
                <div className="box-header">
                  <h5 className="box-title">Meta Title</h5>
                </div>
                <div className="box-body space-y-5">
                  <input
                    type="text"
                    name="meta_title"
                    value={values.meta_title}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    className="ti-form-input"
                    placeholder="Category Meta Title"
                  ></input>
                </div>
              </div>
              <div className="box">
                <div className="box-header">
                  <h5 className="box-title">Status</h5>
                </div>
                <div className="box-body">
                  <Select
                    value={[
                      values.cat_status === 1
                        ? { value: 1, label: "Enable" }
                        : { value: 0, label: "Disable" },
                    ]}
                    classNamePrefix="react-select"
                    options={[
                      { value: 1, label: "Enable" },
                      { value: 0, label: "Disable" },
                    ]}
                    onChange={(val) => {
                      setValues(
                        (prv) => (prv = { ...values, status: val[0].value })
                      );
                    }}
                    placeholder="Open this select menu"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-12">
              <div className="box">
                <div className="box-header">
                  <h5 className="box-title">Location Advantage</h5>
                </div>
                <div className="box-body">
                  <ReactQuill
                    theme="snow"
                    value={values.location_advantage}
                    onChange={(e) =>
                      setValues(
                        (prv) => (prv = { ...prv, location_advantage: e })
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-6"></div>
          </div>
          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-12">
              <div className="box">
                <div className="box-footer bg-transparent">
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={handleLocSubmit}
                      className="py-2 px-3 ti-btn ti-btn-primary"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
};
export default ProjectsLocEdits;
