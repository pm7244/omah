import React, { useEffect, useState } from "react";
import Select from "react-select";
import PageHeader from "../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Filemanagermain from "../pagecomponent/fileManager/filemanagermain";
import SunEditor from "suneditor-react";
import AddSpecification from "./AddNewSpecification";

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [managerOpener, setManagerOpener] = useState(false);
  const [addNewSpecificationField, setAddNewSpecificationField] =
    useState(false);
  const [addNewSpecificationFieldData, setAddNewSpecificationFieldData] =
    useState([]);
  const [image, setImage] = useState([]);
  const [files, setFiles] = useState([]);
  const [listi, setListi] = useState([]);
  const [video, setVideo] = useState([]);
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
    status: "",
    is_latest: "",
    listing_image: [],
    sub_category_id: "",
    // sub_category_id: [],
    latitude: "",
    longitude: "",
    iframe_link: "",
    rera_id: "",
  });

  // const fetchData = () => {
  //   if (!id) {
  //     toast.error("Enter Valid ID");
  //     return;
  //   }
  //   fetch(`${import.meta.env.VITE_CMS_URL}api/getbyidproject/${id}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const rawUrl = JSON.parse(data.data[0].cover_url);
  //       const imgs = JSON.parse(data.data[0].gallery_images);
  //       const listi_img = JSON.parse(data.data[0].listing_image);
  //       const pl = JSON.parse(data.data[0].plans);
  //       const amenities_id = JSON.parse(data.data[0].amenities_id); 
  //       const sub_category_id = JSON.parse(data.data[0].sub_category_id);
  //       const vdo = JSON.parse(data.data[0].video);
  //       setAddNewSpecificationFieldData(
  //         JSON.parse(decodeURIComponent(data.data[0].specification_data))
  //       );
  //       setImage(rawUrl);
  //       setFiles(imgs);
  //       setListi(listi_img);
  //       setPlans(pl);
  //       setVideo(vdo);
  //       setPdf(data.data[0].brochure);
  //       setValues({
  //         ...data.data[0],
  //         cover_url: rawUrl,
  //         gallery_images: imgs,
  //         listing_image: listi_img,
  //         plans: pl,
  //         amenities_id: amenities_id,
  //         sub_category_id : sub_category_id,
  //         video: vdo,
  //       });
  //     })
  //     .catch((err) => toast.error(err.message));
  // };

  const fetchData = () => {
    if (!id) {
      toast.error("Enter Valid ID");
      return;
    }
  
    fetch(`${import.meta.env.VITE_CMS_URL}api/getbyidproject/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
  
        if (!data || !data.data || !data.data[0]) {
          toast.error("Invalid API response");
          return;
        }
  
        try {
          const safeParse = (str, defaultValue = []) => {
            try {
              const parsed = JSON.parse(str);
              return Array.isArray(parsed) ? parsed : defaultValue;
            } catch {
              return defaultValue;
            }
          };

          const rawUrl = safeParse(data.data[0].cover_url);
          const imgs = Array.isArray(data.data[0].gallery_images)
            ? data.data[0].gallery_images
            : safeParse(data.data[0].gallery_images);
          const listi_img = safeParse(data.data[0].listing_image);
          const pl = safeParse(data.data[0].plans);
          const amenities_id = safeParse(data.data[0].amenities_id);
          const vdo = safeParse(data.data[0].video);
  
          console.log("Parsed gallery_images:", imgs);
  
          const decodedSpecification = decodeURIComponent(
            data.data[0].specification_data || "{}"
          );
  
          setAddNewSpecificationFieldData(safeParse(decodedSpecification));
          setImage(rawUrl);
          setFiles(imgs);
          setListi(listi_img);
          setPlans(pl);
          setVideo(vdo);
          setPdf(data.data[0].brochure);
  
          setValues({
            ...data.data[0],
            cover_url: rawUrl,
            gallery_images: imgs,
            listing_image: listi_img,
            plans: pl,
            amenities_id,
            sub_category_id: data.data[0].sub_category_id || "",
            video: vdo,
          });
        } catch (error) {
          console.error("Parsing error:", error);
          toast.error("Error parsing API response");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error(err.message);
      });
  };




  const [options1, setOptions1] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [options3, setOptions3] = useState([]);
  const [options4, setOptions4] = useState([]);
  const [options5, setOptions5] = useState([]);

  const fetchDefaultAmenities = async () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getall-amenities`)
      .then((res) => res.json())
      .then((data) => {
        const formattedOptions = data.data.map((item) => ({
          value: item.amenities_id,
          label: item.name,
        }));
        setOptions1(formattedOptions);
      });
  };

  const FetchCategory2 = async () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/get-all-location`)
      .then((res) => res.json())
      .then((data) => {
        const formattedOptions = data.data.map((item) => ({
          value: item.pl_id,
          label: item.name,
        }));
        setOptions2(formattedOptions);
      });
  };

  const FetchCategory3 = async () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/get-all-ps`)
      .then((res) => res.json())
      .then((data) => {
        const formattedOptions = data.data.map((item) => ({
          value: item.ps_id,
          label: item.name,
        }));
        setOptions3(formattedOptions);
      });
  };

  const FetchCategory4 = async () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getall-pcat`)
      .then((res) => res.json())
      .then((data) => {
        const formattedOptions = data.data.map((item) => ({
          value: item.cat_id,
          label: item.cat_title,
        }));
        setOptions4(formattedOptions);
      });
  };

  const FetchCategory5 = async () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallsub_category`)
      .then((res) => res.json())
      .then((data) => {
        const formattedOptions = data.data.map((item) => ({
          value: item.sub_cat_id,
          label: item.title,
        }));
        setOptions5(formattedOptions);
      });
  };

  // const FetchCategory5 = async () => {
  //   fetch(`${import.meta.env.VITE_CMS_URL}api/getallsubcategory`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const formattedOptions = data.data.map((item) => ({
  //         value: item.psub_id,
  //         label: item.sub_cat_id,
  //       }));
  //       setOptions5(formattedOptions);
  //     });
  // };

  useEffect(() => {
    fetchDefaultAmenities();
    FetchCategory2();
    FetchCategory3();
    FetchCategory4();
    FetchCategory5();
  }, []);


  

  const handleSelectChange = (id, selectedOption) => {
    if (id === "sub_category_id") {
      const selectedValues = selectedOption.map((op) => op.value); 
      setValues((prev) => ({
          ...prev,
          sub_category_id: selectedValues,  
      }));
  } else if (id === "amenities_id") {
      const val = selectedOption.map((op) => op.value);
      setValues((prev) => ({
          ...prev,
          amenities_id: val,
      }));
  } else if (id === "project_location_id") {
      setValues((prev) => ({
        ...prev,
        project_location_id: selectedOption ? selectedOption.value : null,
      }));
    } else if (id === "project_status") {
      setValues((prev) => ({
        ...prev,
        project_status: selectedOption ? selectedOption.value : null,
      }));
    } else if (id === "category_id") {
      setValues((prev) => ({
        ...prev,
        category_id: selectedOption ? selectedOption.value : null,
      }));
    }
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
        values.short_des
      )
    ) {
      toast.error("Please Fill all the fields!");
      return;
    }

    const data = {
      ...values,
      icon: JSON.stringify(values.cover_url),
      gallery_images: JSON.stringify(values.gallery_images),
    };
    fetch(`${import.meta.env.VITE_CMS_URL}api/updateProject/${id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        ...data,
        category_id: values.category_id,
        amenities_id: JSON.stringify(values.amenities_id),
       sub_category_id: JSON.stringify(values.sub_category_id),
      //sub_category_id: values.sub_category_id, //////////////////////////////////
        ps_id: JSON.stringify(values.project_status),
        pl_id: JSON.stringify(values.project_location_id),
        // sub_category_id: JSON.stringify(values.sub_category_id),
        gallery_images: JSON.stringify(values.gallery_images),
        listing_image: JSON.stringify(values.listing_image),
        plans: JSON.stringify(values.plans),
        cover_url: JSON.stringify(data.cover_url),
        video: values.video ? JSON.stringify(values.video) : null,
        specification_data: addNewSpecificationFieldData
          ? JSON.stringify(addNewSpecificationFieldData)
          : [],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          toast.success("Project Updated succesfully");
          navigate("/cms/projects/list");
        } else {
          toast.error(data.message);
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setValues({ ...values, cover_url: image, plans: plans });
  }, [image]);

  useEffect(() => {
    setValues({ ...values, plans: plans });
  }, [plans]);

  useEffect(() => {
    setValues({ ...values, video: video });
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
            ratio={values.cover_dimension}
            fileSetter={setImage}
            openSetter={setManagerOpener}
          />
        ) : managerOpener === 2 ? (
          <Filemanagermain
            file={files}
            ratio={values.gallery_dimension}
            fileSetter={setFiles}
            openSetter={setManagerOpener}
          />
        ) : managerOpener === 3 ? (
          <Filemanagermain
            file={listi}
            ratio={values.listing_dimension}
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
            ratio={values.plans_dimension}
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
              currentpage="Edit Project "
              activepage="Pages"
              mainpage="Edit Project "
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
                      placeholder="Enter iFRame link of project's location"
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
                      placeholder="Enter Latitude for project's location"
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
                      placeholder="Enter Longitude for project's location"
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
                    <Select
                      isMulti
                      name="amenities_id"
                      value={options1.filter(
                        (option) =>
                          values.amenities_id &&
                          values.amenities_id.includes(option.value)
                      )}
                      onChange={(selected) =>
                        handleSelectChange("amenities_id", selected)
                      }
                      options={options1}
                      placeholder="Select an option"
                    />
                  </div>
                </div>
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Locations</h5>
                  </div>
                  <div className="box-body">
                    <Select
                      name="project_location_id"
                      value={options2.find(
                        (options2) =>
                          options2.value === values.project_location_id
                      )}
                      onChange={(selected) =>
                        handleSelectChange("project_location_id", selected)
                      }
                      options={options2}
                    />
                  </div>
                </div>
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Project Status</h5>
                  </div>
                  <div className="box-body">
                    <Select
                      name="project_status"
                      value={options3.find(
                        (options3) => options3.value === values.project_status
                      )}
                      onChange={(selected) =>
                        handleSelectChange("project_status", selected)
                      }
                      options={options3}
                    />
                  </div>
                </div>
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Category</h5>
                  </div>
                  <div className="box-body">
                    <Select
                      name="category_id"
                      value={options4.find(
                        (options4) => options4.value == values.category_id
                      )}
                      onChange={(selected) =>
                        handleSelectChange("category_id", selected)
                      }
                      options={options4}
                    />
                  </div>
                </div>
                {/* <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Sub-Category</h5>
                  </div>
                  <div className="box-body">
                    <Select
                      name="sub_category_id"
                      value={options5.find(
                        (options5) => options5.value == values.sub_category_id
                      )}
                      onChange={(selected) =>
                        handleSelectChange("sub_category_id", selected)
                      }
                      options={options5}
                    />
                  </div>
                </div> */}


                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Sub-Category</h5>
                  </div>
                  <div className="box-body">
                    <Select
                      isMulti
                      name="sub_category_id"
                      value={options5.filter(
                        (option) =>
                          Array.isArray(values.sub_category_id) &&
                          values.sub_category_id.includes(option.value)
                      )}
                      onChange={(selected) =>
                        handleSelectChange("sub_category_id", selected)
                      }
                      options={options5}
                      placeholder="Select an option"
                    />
                  </div>
                </div> 


                <div className="box">
                  <div className="box-header">Brochure</div>
                  <div className="box-body space-y-4">
                    {values.brochure ? (
                      <>
                        <button
                          type="button"
                          className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                          onClick={() => setManagerOpener(4)}
                        >
                          Change File <i className="ti ti-file-plus "></i>
                        </button>

                        {values.brochure.length > 0 && (
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                            <i className="ri-file-pdf-line text-xl text-red-500"></i>
                            <label
                              htmlFor="input-label1"
                              className="ti-form-label text-sm text-gray-700"
                            >
                              {values.brochure}
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
                      name="project_desc"
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
                  <div>
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

export default ProjectEdit;
