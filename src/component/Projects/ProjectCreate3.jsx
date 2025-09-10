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

  const [managerOpener, setManagerOpener] = useState(false);
  const [addNewSpecificationField, setAddNewSpecificationField] =
    useState(false);
  const [addNewSpecificationFieldData, setAddNewSpecificationFieldData] =
    useState([]);
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");
  const [value3, setValue3] = useState("");
  const [value4, setValue4] = useState("");
  const [value5, setValue5] = useState("");
  const [amenities, setAmenities] = useState();
  const [loc, setLoc] = useState();
  const [cat, setCat] = useState();
  const [subcat, setSubCat] = useState();
  const [pstatus, setStatus] = useState();
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedValue2, setSelectedValue2] = useState(null);
  const [selectedValue3, setSelectedValue3] = useState(null);
  const [selectedValue4, setSelectedValue4] = useState(null);
  const [selectedValue5, setSelectedValue5] = useState(null);
  const [selectedValue7, setSelectedValue7] = useState(null);   ///////////////
  const [video, setVideo] = useState([]);
  const [image, setImage] = useState([]);
  const [files, setFiles] = useState([]);
  const [listi, setListi] = useState([]);
  const [pdf, setPdf] = useState([]);
  const [plans, setPlans] = useState([]);
  const [values, setValues] = useState({
    project_desc: "",
    project_meta_desc: "",
    project_meta_title: "",
    project_slug: "",
    project_title: "",
    ps_id: "",
    gallery_images: [],
    cover_type: "",
    cover_url: [],
    plans: [],
    short_des: "",
    brochure: "",
    video: "",
    cat_id: "",
    pa_id: [],
    pl_id: "",
    po_id: "",
    status: 0,
    is_latest: 0,
    listing_image: [],
    sub_category_id: [],
    longitude: 0,
    latitude: 0,
    iframe_link: "",
    rera_id: "",
  });

  const FetchCategory = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_CMS_URL}api/getall-amenities`
    );
    const data = await res.json();
    const result = data.data;
    if (!result) {
      toast.error("result not found");
      return [];
    }
    return result;
  };

  const FetchCategory2 = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_CMS_URL}api/get-all-location`
    );
    const data = await res.json();
    const result = data.data;
    if (!result) {
      toast.error("result not found");
      return [];
    }
    return result;
  };

  const FetchCategory3 = async () => {
    const res = await fetch(`${import.meta.env.VITE_CMS_URL}api/get-all-ps`);
    const data = await res.json();
    const result = data.data;
    if (!result) {
      toast.error("result not found");
      return [];
    }
    return result;
  };
  const FetchCategory4 = async () => {
    const res = await fetch(`${import.meta.env.VITE_CMS_URL}api/getall-pcat`);
    const data = await res.json();
    const result = data.data;
    if (!result) {
      toast.error("result not found");
      return [];
    }
    return result;
  };




  const FetchCategory7 = async () => {
    const res = await fetch(`${import.meta.env.VITE_CMS_URL}api/getall-pcat`);
    const data = await res.json();
    const result = data.data;
    if (!result) {
      toast.error("result not found");
      return [];
    }
    return result;
  };


const FetchCategory5 = async () => {
  const res = await fetch(`${import.meta.env.VITE_CMS_URL}api/getallsub_category`
  );
  const data = await res.json();
  const result = data.data;
  if (!result) {
    toast.error("result not found");
    return [];
  }
  return result;
};
  

  const handleSelectInputChange = (value) => {
    setValue(value);
  };

  const handleSelectInputChange2 = (value) => {
    setValue2(value);
  };

  const handleSelectInputChange3 = (value) => {
    setValue3(value);
  };

  const handleSelectInputChange4 = (value) => {
    setValue4(value);
  };

  const handleSelectInputChange7 = (value) => {
    setValue4(value);
  };  ///////////////////

  const handleSelectInputChange5 = (value) => {
    setValue5(value);
  };

  const handleChange = (value) => {
    setSelectedValue(value);
    let select = value.map((vl) => vl.amenities_id);
    setAmenities(select);
  };

  const handleChange2 = (value) => {
    setSelectedValue2(value);
    let select = value.pl_id;
    setLoc(select);
  };

  const handleChange3 = (value) => {
    setSelectedValue3(value);
    let select = value.ps_id;
    setStatus(select);
  };

  const handleChange4 = (value) => {
    setSelectedValue4(value);
    let select = value.map((vl) => vl.cat_id);
    setCat(select);
  };

  const handleChange7 = (value) => {
    setSelectedValue7(value);
    let select = value.map((vl) => vl.cat_id);
    setCat(select);
  };


  const handleChange5 = (value) => {
    setSelectedValue5(value);
    let select = value.map((vl) => vl.sub_cat_id);
    setSubCat(select);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prv) => (prv = { ...values, [name]: value }));
  };

  const handleProjectSubmit = () => {
    if (
      !(
        values.project_title &&
        values.project_meta_title &&
        values.project_meta_desc &&
        values.project_slug &&
        values.cover_url?.length > 0 &&
        values.short_des &&
        cat &&
        amenities?.length > 0 &&
        loc
      )
    ) {
      console.log(values);

      toast.error("Please Fill all the fields!");
      return;
    }

    const data = {
      ...values,
      icon: JSON.stringify(values.cover_url),
      gallery_images: JSON.stringify(values.gallery_images),
    };
    fetch(`${import.meta.env.VITE_CMS_URL}api/createproject`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        ...data,
        cat_id: cat,
        pa_id: JSON.stringify(amenities),
        ps_id: JSON.stringify(pstatus),
        sub_category_id:JSON.stringify(subcat),
        pl_id: JSON.stringify(loc),
        gallery_images: JSON.stringify(values.gallery_images),
        video: values.video ? JSON.stringify(values.video) : null,
        listing_image: JSON.stringify(values.listing_image),
        plans: JSON.stringify(values.plans),
        cover_url: JSON.stringify(data.cover_url),
        specification_data: addNewSpecificationFieldData
          ? JSON.stringify(addNewSpecificationFieldData)
          : [],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          toast.success("Project Created succesfully");
          navigate("/cms/projects/list");
        } else {
          toast.error("Failed to update");
        }
      });
  };

  useEffect(() => {
    setValues({ ...values, cover_url: image, plans: plans });
  }, [image]);

  useEffect(() => {
    setValues({ ...values, plans: plans });
  }, [plans]);

  useEffect(() => {
    setValue({ ...values, video: video });
  }, [video]);

  useEffect(() => {
    setValues({
      ...values,
      gallery_images: files,
      listing_image: listi,
      brochure: pdf,
      video: video,
    });
  }, [files, listi, pdf, video]);

  const handleDeleteClick = (index) => {
    const updatedData = addNewSpecificationFieldData.filter(
      (_, i) => i !== index
    );
    setAddNewSpecificationFieldData(updatedData);
  };

  return (
    values && (
      <>
        {managerOpener === 1 ? (
          <Filemanagermain
            file={image}
            ratio={1920 / 780}
            fileSetter={setImage}
            openSetter={setManagerOpener}
          />
        ) : managerOpener === 2 ? (
          <Filemanagermain
            file={files}
            ratio={1190 / 700}
            fileSetter={setFiles}
            openSetter={setManagerOpener}
          />
        ) : managerOpener === 3 ? (
          <Filemanagermain
            file={listi}
            ratio={410 / 505}
            fileSetter={setListi}
            openSetter={setManagerOpener}
          />
        ) : managerOpener === 4 ? (
          <Filemanagermain
            file={pdf}
            fileSetter={setPdf}
            openSetter={setManagerOpener}
          />
        ) : managerOpener === 5 ? (
          <Filemanagermain
            file={plans}
            ratio={785 / 785}
            fileSetter={setPlans}
            openSetter={setManagerOpener}
          />
        ) : managerOpener === 6 ? (
          <Filemanagermain
            file={video}
            fileSetter={setVideo}
            openSetter={setManagerOpener}
          />
        ) : addNewSpecificationField ? (
          <AddSpecification
            openSetter={setAddNewSpecificationField}
            file={addNewSpecificationFieldData}
            fileSetter={setAddNewSpecificationFieldData}
          />
        ) : (
          <div>
            <PageHeader
              currentpage="Create New Project"
              activepage="Pages"
              mainpage="Create New Project"
            />
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-12 xxl:col-span-8">
                <div className="box">
                  <div className="box-body space-y-5">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Project Title
                    </label>
                    <input
                      type="text"
                      name="project_title"
                      value={values.project_title}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      id="input-label1"
                      className="ti-form-input"
                      placeholder="Project Title"
                    />
                  </div>
                </div>
                <div className="box">
                  <div className="box-body space-y-5">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Project Meta Description
                    </label>
                    <textarea
                      rows={4}
                      name="project_meta_desc"
                      value={values.project_meta_desc}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      className="ti-form-input"
                      placeholder="Project Meta Description"
                    ></textarea>
                  </div>
                </div>
                <div className="box">
                  <div className="box-body space-y-5">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Project Short Description
                    </label>
                    <textarea
                      rows={4}
                      name="short_des"
                      value={values.short_des}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      className="ti-form-input"
                      placeholder="Project Short Description"
                    ></textarea>
                  </div>
                </div>
                <div className="box">
                  <div className="box-body space-y-5">
                    <label htmlFor="input-label1" className="ti-form-label">
                      iFrame Link
                    </label>
                    <textarea
                      rows={4}
                      name="iframe_link"
                      value={values.iframe_link}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      className="ti-form-input"
                      placeholder="Project iFrame Link of project's location"
                    ></textarea>
                  </div>
                </div>
                <div className="box">
                  <div className="box-header">Video</div>
                  <div className="box-body space-y-4">
                    {values.video && values.video.length > 0 ? (
                      <>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                            onClick={() => setManagerOpener(6)}
                          >
                            Change Video <i className="ti ti-video-plus"></i>
                          </button>
                          <button
                            type="button"
                            className="ti-btn rounded-md ti-btn-outline ti-btn-outline-danger"
                            onClick={() => {
                              setValues({ ...values, video: "" });
                              toast.success("Video removed successfully");
                            }}
                          >
                            Remove Video <i className="ti ti-trash"></i>
                          </button>
                        </div>
                        <video
                          controls
                          className="box-img-top h-52 rounded-t-sm"
                        >
                          <source
                            src={`${import.meta.env.VITE_CMS_URL}${
                              values.video
                            }`}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                        onClick={() => setManagerOpener(6)}
                      >
                        Add Video <i className="ti ti-video-plus"></i>
                      </button>
                    )}
                  </div>
                </div>
                <div className="box">
                  <div className="box-body space-y-5">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Rera Id
                    </label>
                    <input
                      type="text"
                      name="rera_id"
                      value={values.rera_id}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      id="input-label1"
                      className="ti-form-input"
                      placeholder="Enter Rera Id"
                    />
                  </div>
                </div>
                <div className="box">
                  <div className="box-body space-y-5">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Latitude
                    </label>
                    <input
                      type="number"
                      name="latitude"
                      value={values.latitude}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      id="input-label1"
                      className="ti-form-input"
                      placeholder="Enter Latitude for project's lcoation"
                    />
                  </div>
                </div>
                <div className="box">
                  <div className="box-body space-y-5">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Longitude
                    </label>
                    <input
                      type="number"
                      name="longitude"
                      value={values.longitude}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      id="input-label1"
                      className="ti-form-input"
                      placeholder="Enter Longitude for project's lcoation"
                    />
                  </div>
                </div>
                <div className="box">
                  <div className="box-header">Cover Url</div>
                  <div
                    className="box-body space-y-4"
                    onClick={() => setManagerOpener(1)}
                  >
                    {values.cover_url ? (
                      <>
                        <button
                          type="button"
                          className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                        >
                          Change Image <i className="ti ti-file-plus "></i>
                        </button>
                        {values.cover_url.length > 0 && (
                          <img
                            src={`${
                              import.meta.env.VITE_CMS_URL
                            }api/transform/${values.cover_url}`}
                            className="box-img-top h-52 rounded-t-sm"
                            alt="cover image"
                          />
                        )}
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
                </div>
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Gallery Image</h5>
                  </div>
                  <div className="box-body">
                    <div>
                      <label className="block">
                        <button
                          onClick={() => setManagerOpener(2)}
                          className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                        >
                          Change Image <i className="ti ti-file-plus "></i>
                        </button>
                        <div className="grid grid-cols-12 gap-x-2">
                          {values.gallery_images &&
                            values.gallery_images.map((pathFile) => {
                              return (
                                <img
                                  src={`${
                                    import.meta.env.VITE_CMS_URL
                                  }api/transform/${pathFile}`}
                                  className="col-span-4 h-32 rounded-t-sm"
                                />
                              );
                            })}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Listing Image</h5>
                  </div>
                  <div className="box-body">
                    <div>
                      <label className="block">
                        <button
                          onClick={() => setManagerOpener(3)}
                          className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                        >
                          Change Image <i className="ti ti-file-plus "></i>
                        </button>
                        <div className="grid grid-cols-12 gap-x-2">
                          {values.listing_image &&
                            values.listing_image.map((pathFile) => {
                              return (
                                <img
                                  src={`${
                                    import.meta.env.VITE_CMS_URL
                                  }api/transform/${pathFile}`}
                                  className="col-span-4 h-32 rounded-t-sm"
                                />
                              );
                            })}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Plans Images</h5>
                  </div>
                  <div className="box-body">
                    <div>
                      <label className="block">
                        <button
                          onClick={() => setManagerOpener(5)}
                          className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                        >
                          Change Image <i className="ti ti-file-plus "></i>
                        </button>
                        <div className="grid grid-cols-12 gap-x-2">
                          {values.plans &&
                            values.plans.map((pathFile) => {
                              return (
                                <img
                                  src={`${
                                    import.meta.env.VITE_CMS_URL
                                  }api/transform/${pathFile}`}
                                  className="col-span-4 h-32 rounded-t-sm"
                                />
                              );
                            })}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
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
                      classNamePrefix="react-select"
                      options={[
                        { value: 1, label: "Enable" },
                        { value: 0, label: "Disable" },
                      ]}
                      onChange={(val) => {
                        setValues(
                          (prv) => (prv = { ...values, status: val.value })
                        );
                      }}
                      placeholder="Open this select menu"
                    />
                  </div>
                </div>
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Latest Project</h5>
                  </div>
                  <div className="box-body">
                    <Select
                      value={[
                        values.is_latest === 1
                          ? { value: 1, label: "Yes" }
                          : { value: 0, label: "No" },
                      ]}
                      classNamePrefix="react-select"
                      options={[
                        { value: 1, label: "Yes" },
                        { value: 0, label: "No" },
                      ]}
                      onChange={(val) => {
                        setValues(
                          (prv) => (prv = { ...values, is_latest: val.value })
                        );
                      }}
                      placeholder="Open this select menu"
                    />
                  </div>
                </div>
                <div className="box">
                  <div className="box-body space-y-5">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Project Meta Title
                    </label>
                    <input
                      type="text"
                      name="project_meta_title"
                      value={values.project_meta_title}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      className="ti-form-input"
                      placeholder="Project Meta Title"
                    ></input>
                  </div>
                </div>
                <div className="box">
                  <div className="box-body space-y-5">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Project Slug
                    </label>
                    <input
                      type="text"
                      name="project_slug"
                      value={values.project_slug}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      className="ti-form-input"
                      placeholder="Project Slug"
                    ></input>
                  </div>
                </div>
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Cover Type</h5>
                  </div>
                  <div className="box-body">
                    <Select
                      value={[
                        values.cover_type === 1
                          ? { value: 1, label: "Image" }
                          : { value: 0, label: "Video" },
                      ]}
                      classNamePrefix="react-select"
                      options={[
                        { value: 1, label: "Image" },
                        { value: 0, label: "Video" },
                      ]}
                      onChange={(val) => {
                        setValues(
                          (prv) => (prv = { ...values, cover_type: val.value })
                        );
                      }}
                      placeholder="Open this select menu"
                    />
                  </div>
                </div>
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Amenities</h5>
                  </div>
                  <div className="box-body">
                    <AsyncSelect
                      className="blog-tag2 z-50"
                      isMulti
                      onChange={handleChange}
                      value={selectedValue}
                      loadOptions={FetchCategory}
                      cacheOptions
                      defaultOptions
                      getOptionLabel={(e) => e.name}
                      getOptionValue={(e) => e.amenities_id}
                      onInputChange={handleSelectInputChange}
                    />
                  </div>
                </div>
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Locations</h5>
                  </div>
                  <div className="box-body">
                    <AsyncSelect
                      className="blog-tag2 z-50"
                      onChange={handleChange2}
                      value={selectedValue2}
                      loadOptions={FetchCategory2}
                      cacheOptions
                      defaultOptions
                      getOptionLabel={(e) => e.name}
                      getOptionValue={(e) => e.pl_id}
                      onInputChange={handleSelectInputChange2}
                    />
                  </div>
                </div>
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Project Status</h5>
                  </div>
                  <div className="box-body">
                    <AsyncSelect
                      className="blog-tag2 z-50"
                      onChange={handleChange3}
                      value={selectedValue3}
                      loadOptions={FetchCategory3}
                      cacheOptions
                      defaultOptions
                      getOptionLabel={(e) => e.name}
                      getOptionValue={(e) => e.ps_id}
                      onInputChange={handleSelectInputChange3}
                    />
                  </div>
                </div>
             


                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Category</h5>
                  </div>
                  <div className="box-body">
                    <AsyncSelect
                      className="blog-tag2 z-50"
                      isMulti
                      onChange={handleChange4}
                      value={selectedValue4}
                      loadOptions={FetchCategory4}
                      cacheOptions
                      defaultOptions
                      getOptionLabel={(e) => e.cat_title}
                      getOptionValue={(e) => e.cat_id}
                      onInputChange={handleSelectInputChange4}
                    />
                  </div>
                </div> 

                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Category</h5>
                  </div>
                  <div className="box-body">
                    <AsyncSelect
                      className="blog-tag2 z-50"
                      isMulti
                      onChange={handleChange7}
                      value={selectedValue7}
                      loadOptions={FetchCategory7}
                      cacheOptions
                      defaultOptions
                      getOptionLabel={(e) => e.cat_title}
                      getOptionValue={(e) => e.cat_id}
                      onInputChange={handleSelectInputChange5}
                    />
                  </div>
                </div> 
 
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Sub Category</h5>
                  </div>
                  <div className="box-body">
                    <AsyncSelect
                      className="blog-tag2 z-50"
                      isMulti
                      onChange={handleChange5}
                      value={selectedValue5}
                      loadOptions={FetchCategory5}
                      cacheOptions
                      defaultOptions
                      getOptionLabel={(e) => e.title}
                      getOptionValue={(e) => e.sub_cat_id}
                      onInputChange={handleSelectInputChange5}
                    />
                  </div>
                </div> 
                {/* <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Sub Category</h5>
                  </div>
                  <div className="box-body">
                    <AsyncSelect
                      className="blog-tag2 z-40"
                      onChange={handleChange5}
                      value={selectedValue5}
                      loadOptions={FetchCategory5}
                      cacheOptions
                      defaultOptions
                      getOptionLabel={(e) => e.title}
                      getOptionValue={(e) => e.sub_cat_id}
                      onInputChange={handleSelectInputChange5}
                    />
                  </div>
                </div> */}
                <div className="box">
                  <div className="box-header">Brochure</div>
                  <div className="box-body space-y-4">
                    {values.brochure && values.brochure.length > 0 ? (
                      <>
                        <button
                          type="button"
                          className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                          onClick={() => setManagerOpener(4)}
                        >
                          Change File <i className="ti ti-file-plus "></i>
                        </button>

                        {values.brochure && values.brochure.length > 0 && (
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                            <i className="ri-file-pdf-line text-xl text-red-500"></i>
                            <label
                              htmlFor="input-label1"
                              className="ti-form-label text-sm text-gray-700"
                            >
                              {values.brochure[0]}
                            </label>
                            <button
                              type="button"
                              className="ml-auto p-1 text-gray-500 hover:text-red-500 transition-colors"
                              onClick={() => {
                                setValues({ ...values, brochure: "" });
                                toast.success("Brochure removed successfully.");
                              }}
                            >
                              <i className="ri-close-line text-lg"></i>
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <button
                        type="button"
                        className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                        onClick={() => setManagerOpener(4)}
                      >
                        Add File <i className="ti ti-file-plus "></i>
                      </button>
                    )}
                  </div>
                </div>
                <div className="box">
                  <div className="box-body space-y-5">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Project Overview
                    </label>
                    <textarea
                      rows={4}
                      name="over_view"
                      value={values.over_view}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      className="ti-form-input"
                      placeholder="Project Overview"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-12">
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Project Specification</h5>
                  </div>
                  <div className="box-body">
                    <SunEditor
                      name="specification"
                      setContents={values.specification}
                      onChange={(e) =>
                        setValues((prv) => (prv = { ...prv, specification: e }))
                      }
                      setOptions={{
                        buttonList: [
                          ["undo", "redo"],
                          ["font", "fontSize"],
                          ["paragraphStyle", "blockquote"],
                          [
                            "bold",
                            "underline",
                            "italic",
                            "strike",
                            "subscript",
                            "superscript",
                          ],
                          ["fontColor", "hiliteColor"],
                          ["align", "list", "lineHeight"],
                          ["outdent", "indent"],
                          ["table", "horizontalRule", "link", "image", "video"],
                          ["preview", "print"],
                          ["removeFormat"],
                        ],
                        defaultTag: "div",
                        minHeight: "300px",
                        showPathLabel: false,
                        attributesWhitelist: {
                          all: "style",
                          table: "cellpadding|width|cellspacing|height|style",
                          tr: "valign|style",
                          td: "styleinsert|height|style",
                          img: "title|alt|src|style",
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-12">
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Project Description</h5>
                  </div>
                  <div className="box-body">
                    <SunEditor
                      setContents={values.project_desc}
                      onChange={(e) =>
                        setValues((prv) => (prv = { ...prv, project_desc: e }))
                      }
                      setOptions={{
                        buttonList: [
                          ["undo", "redo"],
                          ["font", "fontSize"],
                          ["paragraphStyle", "blockquote"],
                          [
                            "bold",
                            "underline",
                            "italic",
                            "strike",
                            "subscript",
                            "superscript",
                          ],
                          ["fontColor", "hiliteColor"],
                          ["align", "list", "lineHeight"],
                          ["outdent", "indent"],
                          ["table", "horizontalRule", "link", "image", "video"],
                          ["preview", "print"],
                          ["removeFormat"],
                        ],
                        defaultTag: "div",
                        minHeight: "300px",
                        showPathLabel: false,
                        attributesWhitelist: {
                          all: "style",
                          table: "cellpadding|width|cellspacing|height|style",
                          tr: "valign|style",
                          td: "styleinsert|height|style",
                          img: "title|alt|src|style",
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12">
                <div className="box xl:overflow-auto">
                  <div className="box-header flex">
                    <h5 className="box-title">Add Specification Data</h5>
                    <button>
                      <button onClick={() => setAddNewSpecificationField(true)}>
                        <span className="text-primary">Add new field +</span>
                      </button>
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
                                  <th>Image</th>
                                  <th className="">Title</th>
                                  <th>Content</th>
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
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-12">
                <div className="box">
                  <div className="box-footer bg-transparent">
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={handleProjectSubmit}
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
        )}
      </>
    )
  );
};
export default ProjectCreate;
