import React, { useEffect, useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import PageHeader from "../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Filemanagermain from "../pagecomponent/fileManager/filemanagermain";
import SunEditor from "suneditor-react";
import AddSpecification from "./AddNewSpecification";

const ProjectCreate = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const [managerOpener, setManagerOpener] = useState(false);
  const [addNewSpecificationField, setAddNewSpecificationField] = useState(false);
  const [addNewSpecificationFieldData, setAddNewSpecificationFieldData] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [video, setVideo] = useState([]);
  const [image, setImage] = useState([]);
  const [files, setFiles] = useState([]);
  const [listi, setListi] = useState([]);

  const [values, setValues] = useState({
    pc_id: [],
    image: [],
    name: "",
    slug: "",
    image_name: "",
    img_tagline: "",
    project_title: "",
    video: "",
    v_title: "",
    v_des: "",
    listing_image: [],
    img_title: "",
    img_des: "",
    meta_title: "",
    meta_des: "",
    project_meta_title: "",
    project_meta_desc: "",
    cover_url: [],
    gallery_images: [],
    status: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => {
      const newState = { ...prev, [name]: value };

      if (name === "name") {
        newState.slug = value
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9\-]/g, "")
          .replace(/-+/g, "-");
      }

      return newState;
    });
  };

  const FetchCategory = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_CMS_URL}api/getallcontain`);
      const data = await res.json();
      const result = data.data;
      if (!result) {
        toast.error("Amenities not found");
        return [];
      }
      return result;
    } catch (error) {
      toast.error("Failed to fetch amenities");
      return [];
    }
  };

  const handleSelectInputChange = (value) => {
    setValue(value);
  };

  const handleChange = (value) => {
    setSelectedValue(value);
    const select = value.map((vl) => vl.pc_id);
    setAmenities(select);
  };

  const handleProjectSubmit = async () => {
    if (!values.img_title) {
      toast.error("Please fill all the required fields!");
      return;
    }

    const data = {
      ...values,
      icon: JSON.stringify(values.cover_url),
      gallery_images: JSON.stringify(values.gallery_images),
      pa_id: JSON.stringify(amenities),
      video: values.video ? JSON.stringify(values.video) : null,
      listing_image: JSON.stringify(values.listing_image),
      cover_url: JSON.stringify(values.cover_url),
      specification_data:
        addNewSpecificationFieldData.length > 0
          ? JSON.stringify(addNewSpecificationFieldData)
          : [],
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_CMS_URL}api/createproject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.status) {
        toast.success("Project Created Successfully");
        navigate("/cms/projects/list");
      } else {
        toast.error("Failed to create project");
      }
    } catch (err) {
      toast.error("Error occurred while creating project");
    }
  };


  useEffect(() => {
    setValues((prev) => ({ ...prev, cover_url: image }));
  }, [image]);


  useEffect(() => {
    setValues((prev) => ({ ...prev, video }));
  }, [video]);


  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      gallery_images: files,
      listing_image: listi,
    }));
  }, [files, listi]);


  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      image: files,
    }));
  }, [files]);

  const handleDeleteClick = (index) => {
    const updatedData = addNewSpecificationFieldData.filter((_, i) => i !== index);
    setAddNewSpecificationFieldData(updatedData);
  };

  return (
    <div>
    <>
      {managerOpener === 1 && (
        <Filemanagermain
          file={image}
          ratio={1920 / 780}
          fileSetter={setImage}
          openSetter={setManagerOpener}
        />
      )}
      {managerOpener === 3 && (
        <Filemanagermain
          file={listi}
          ratio={410 / 505}
          fileSetter={setListi}
          openSetter={setManagerOpener}
        />
      )}
      {managerOpener === 5 && (
        <Filemanagermain
          file={files}
          fileSetter={setFiles}
          openSetter={setManagerOpener}
        />
      )}
      {managerOpener === 6 && (
        <Filemanagermain
          file={video}
          fileSetter={setVideo}
          openSetter={setManagerOpener}
        />
      )}
      {addNewSpecificationField && (
        <AddSpecification
          openSetter={setAddNewSpecificationField}
          file={addNewSpecificationFieldData}
          fileSetter={setAddNewSpecificationFieldData}
        />
      )}

      <div>
        <PageHeader
          currentpage="Create New Project"
          activepage="Pages"
          mainpage="Create New Project"
        />
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 xxl:col-span-8">
            {/* Name Field */}
            <div className="box">
              <div className="box-body space-y-5">
                {/* <label className="ti-form-label  text-dark-grey ">Name</label> */}
                
              <label className="ti-form-label text-dark-grey ">Name</label>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleInputChange}
                  className="ti-form-input"
                  placeholder="Enter Name"
                />
              </div>
            </div>

            {/* Slug */}
            <div className="box">
              <div className="box-body space-y-5">
                <label className="ti-form-label">Project Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={values.slug}
                  className="ti-form-input"
                  disabled
                />
              </div>
            </div>

            {/* Image Name */}
            <div className="box">
              <div className="box-body space-y-5">
                <label className="ti-form-label">Image Name</label>
                <input
                  name="image_name"
                  value={values.image_name}
                  onChange={handleInputChange}
                  className="ti-form-input"
                  placeholder="Project Image Name"
                />
              </div>
            </div>

            {/* Tagline */}
            <div className="box">
              <div className="box-body space-y-5">
                <label className="ti-form-label">Image Tagline</label>
                <input
                  name="img_tagline"
                  value={values.img_tagline}
                  onChange={handleInputChange}
                  className="ti-form-input"
                  placeholder="Project Image Tagline"
                />
              </div>
            </div>

            {/* Video Section */}
            <div className="box">
              <div className="box-header">Video</div>
              <div className="box-body space-y-4">
                {values.video && values.video.length > 0 ? (
                  <>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        className="ti-btn ti-btn-outline-primary"
                        onClick={() => setManagerOpener(6)}
                      >
                        Change Video
                      </button>
                      <button
                        type="button"
                        className="ti-btn ti-btn-outline-danger"
                        onClick={() => {
                          setValues({ ...values, video: "" });
                          toast.success("Video removed successfully");
                        }}
                      >
                        Remove Video
                      </button>
                    </div>
                    <video controls className="box-img-top h-52 rounded-t-sm">
                      <source
                        src={`${import.meta.env.VITE_CMS_URL}${values.video}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </>
                ) : (
                  <button
                    type="button"
                    className="ti-btn ti-btn-outline-primary"
                    onClick={() => setManagerOpener(6)}
                  >
                    Add Video
                  </button>
                )}
              </div>
            </div>

            {/* Listing Image */}
            <div className="box">
              <div className="box-header">
                <h5 className="box-title">Listing Image</h5>
              </div>
              <div className="box-body">
                <button
                  onClick={() => setManagerOpener(3)}
                  className="ti-btn ti-btn-outline-primary"
                >
                  Change Image
                </button>
                <div className="grid grid-cols-12 gap-x-2">
                  {values.listing_image?.map((img) => (
                    <img
                      key={img}
                      src={`${import.meta.env.VITE_CMS_URL}api/transform/${img}`}
                      className="col-span-4 h-32 rounded-t-sm"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Main Images (values.image) */}
            <div className="box">
              <div className="box-header">
                <h5 className="box-title">Images</h5>
              </div>
              <div className="box-body">
                <button
                  onClick={() => setManagerOpener(5)}
                  className="ti-btn ti-btn-outline-primary"
                >
                  Change Image
                </button>
                <div className="grid grid-cols-12 gap-x-2">
                  {values.image?.map((img) => (
                    <img
                      key={img}
                      src={`${import.meta.env.VITE_CMS_URL}api/transform/${img}`}
                      className="col-span-4 h-32 rounded-t-sm"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 xxl:col-span-4">
            <div className="box">
              <div className="box-header">
                <h5 className="box-title">Status</h5>
              </div>
              <div className="box-body">
                <Select
                  value={[
                    values.status === 1
                      ? { value: 1, label: "Enable" }
                      : { value: 0, label: "Disable" },
                  ]}
                  options={[
                    { value: 1, label: "Enable" },
                    { value: 0, label: "Disable" },
                  ]}
                  onChange={(val) =>
                    setValues((prev) => ({ ...prev, status: val.value }))
                  }
                />
              </div>
            </div>

            {/* Meta fields */}
            <div className="box">
              <div className="box-body space-y-5">
                <label className="ti-form-label">Project Meta Title</label>
                <input
                  type="text"
                  name="project_meta_title"
                  value={values.project_meta_title}
                  onChange={handleInputChange}
                  className="ti-form-input"
                />
              </div>
            </div>

            <div className="box">
              <div className="box-body space-y-5">
                <label className="ti-form-label">Project Meta Description</label>
                <input
                  type="text"
                  name="meta_des"
                  value={values.meta_des}
                  onChange={handleInputChange}
                  className="ti-form-input"
                />
              </div>
            </div>

            {/* Async Select */}
            <div className="box">
              <div className="box-header">
                <h5 className="box-title">Content</h5>
              </div>
              <div className="box-body">
                <AsyncSelect
                  isMulti
                  onChange={handleChange}
                  value={selectedValue}
                  loadOptions={FetchCategory}
                  cacheOptions
                  defaultOptions
                  getOptionLabel={(e) => e.layout_label}
                  getOptionValue={(e) => e.pc_id}
                />
              </div>
            </div>
          </div>
        </div>


            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12">
                <div className="box xl:overflow-auto">
                  <div className="box-header flex">
                    <h5 className="box-title">Add Content</h5>
                   <button
  type="button"
  onClick={() => setAddNewSpecificationField(true)}
  className="text-primary"
>
  Add new field +
</button>
                  </div>
                  <div className="">
                    <div className="overflow-auto table-bordered">
                      <div className="app-container">
                        <form>
                          <div className="table-bordered whitespace-nowrap rounded-sm overflow-auto">
                            <table className="ti-custom-table ti-custom-table-head">
                              <thead className="border">
                                <tr>
                                  <th className="w-1">#</th>
                                  {/* <th>Image</th> */}
                                  <th className="">Layout label</th>
                                  {/* <th>Content</th> */}
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {addNewSpecificationFieldData &&
                                  addNewSpecificationFieldData.map(
                                    (row, index) => (
                                      <tr key={index}>
                                        <td>{index}</td>
                                        <td>
                                          <div>
                                            {row.img &&
                                              row.img.map((pathFile, i) => {
                                                return (
                                                  <img
                                                    key={i}
                                                    src={`${
                                                      import.meta.env
                                                        .VITE_CMS_URL
                                                    }api/transform/${pathFile}`}
                                                    className="col-span-4 h-12  rounded-t-sm"
                                                  />
                                                );
                                              })}
                                          </div>
                                        </td>
                                        <td>{row.title}</td>
                                        <td>{row.content}</td>
                                        <td className="flex justify-start">
                                          <div className="hs-tooltip ti-main-tooltip">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleDeleteClick(index)
                                              }
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
                                                  transform:
                                                    "translate(985px, -281px)",
                                                }}
                                              >
                                                Delete
                                              </span>
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    )
                                  )}
                              </tbody>
                            </table>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

        {/* Submit Button */}
        <div className="grid grid-cols-12 mt-4">
          <div className="col-span-12">
            <div className="box">
              <div className="box-footer bg-transparent">
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleProjectSubmit}
                    className="ti-btn ti-btn-primary"
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
    </div>
  );
  
};

export default ProjectCreate;
