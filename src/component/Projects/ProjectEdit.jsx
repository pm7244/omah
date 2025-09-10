import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/layoutsection/pageHeader/pageHeader";
import Select from "react-select";
import { toast } from "react-toastify";
import Filemanagermain from "../pagecomponent/fileManager/filemanagermain";
import { useNavigate, useParams } from "react-router-dom";

const EditPreProjects = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState([]);
  const [listing_image, setlisting_image] = useState([]);
  const [managerOpener, setManagerOpener] = useState();

  const [values, setValues] = useState({
    pc_id: [], // This will hold selected amenities
    image: [],
    name: "",
    slug: "",
    image_name: "",
    img_tagline: "",
    video: [],
    v_title: "",
    v_des: "",
    listing_image: [],
    img_title: "",
    img_des: "",
    meta_title: "",
    meta_des: "",
    status: 1,
    p_id: "",
  });

  const [options5, setOptions5] = useState([]); // State to store amenities options

  // Fetch all amenities for the Select dropdown
  const fetchDefaultAmenities = async () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallcontain`)
      .then((res) => res.json())
      .then((data) => {
        const formattedOptions = data.data.map((item) => ({
          value: item.pc_id,
          label: item.layout_label,
        }));
        setOptions5(formattedOptions);
      })
      .catch((err) => toast.error(err.message));
  };

  // Fetch project data by ID
  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getbyidproject/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.status || !data.data || data.data.length === 0) {
          toast.error("Project data not found.");
          return;
        }

        const rawData = data.data[0];

        const rawImage = JSON.parse(rawData.image || "[]");
        const rawListingImage = JSON.parse(rawData.listing_image || "[]");

        setImage(rawImage);
        setlisting_image(rawListingImage);

        setValues({
          ...rawData,
          image: rawImage,
          listing_image: rawListingImage,
          pc_id: rawData.pc_id || [], 
        });
      })
      .catch((err) => toast.error(err.message));
  };


  useEffect(() => {
    fetchData();
    fetchDefaultAmenities(); 
  }, [id]);

 
  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setValues((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "name") {
        newState.slug = value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/\?/g, "-");
      }
      return newState;
    });
  };

  // Handle amenities selection
  const handleAmenitiesChange = (selectedOptions) => {
    const selectedAmenities = selectedOptions ? selectedOptions.map((item) => item.value) : [];
    setValues((prev) => ({ ...prev, pc_id: selectedAmenities }));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!(values.name && values.v_title)) {
      toast.error("Please enter all required fields");
      return;
    }

    try {
      const newData = {
        ...values,
        image: JSON.stringify(values.image),
        listing_image: JSON.stringify(values.listing_image),
      };

      fetch(`${import.meta.env.VITE_CMS_URL}api/updateproject/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            toast.success("Pre-Project updated successfully!");
            navigate("/cms/projects/list");
          } else {
            toast.error(data.message || "Update failed");
          }
        });
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (image && listing_image) {
      setValues((prev) => ({
        ...prev,
        image: [...image],
        listing_image: [...listing_image],
      }));
    }
  }, [image, listing_image]);

  return (
    <div>
      {managerOpener === 2 ? (
        <Filemanagermain
          file={image}
          ratio={1030 / 1285}
          fileSetter={setImage}
          openSetter={setManagerOpener}
        />
      ) : managerOpener === 3 ? (
        <Filemanagermain
          file={listing_image}
          ratio={1960 / 600}
          fileSetter={setlisting_image}
          openSetter={setManagerOpener}
        />
      ) : (
        <>
          <PageHeader currentpage="Project" activepage="Pages" mainpage="Project" />
          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-12">
              <div className="box">
                <div className="box-body space-y-5">

                  {/* Name */}
                  <div>
                    <label className="ti-form-label">Name</label>
                    <input
                      type="text"
                      className="ti-form-input"
                      placeholder="Enter project name"
                      value={values.name}
                      name="name"
                      onChange={handleChangeValue}
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="ti-form-label">Slug</label>
                    <input
                      type="text"
                      className="ti-form-input"
                      name="slug"
                      value={values.slug}
                      disabled
                    />
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="ti-form-label">Content</label>
                    <Select
                      isMulti
                      name="pc_id"
                      options={options5} 
                      value={options5.filter((opt) => values.pc_id.includes(opt.value))}
                      onChange={handleAmenitiesChange}
                      placeholder="Select Amenities"
                    />
                  </div>

                  {/* Image */}
                  <div className="box">
                    <div className="box-header flex justify-between">
                      <h5 className="box-title">Image</h5>
                      <span className="text-sm text-red-500 underline">1 Image allowed only</span>
                    </div>
                    <div className="box-body">
                      <div onClick={() => setManagerOpener(2)}>
                        <button className="ti-btn ti-btn-outline ti-btn-outline-primary">
                          Change Image
                        </button>
                        <div className="grid grid-cols-12 gap-x-2 mt-2">
                          {values.image &&
                            values.image.map((pathFile, i) => (
                              <img
                                key={i}
                                src={`${import.meta.env.VITE_CMS_URL}api/transform/${pathFile}`}
                                className="col-span-4 h-32 rounded"
                              />
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Listing Image */}
                  <div className="box">
                    <div className="box-header flex justify-between">
                      <h5 className="box-title">Cover Image</h5>
                      <span className="text-sm text-red-500 underline">1 Image allowed only</span>
                    </div>
                    <div className="box-body">
                      <div onClick={() => setManagerOpener(3)}>
                        <button className="ti-btn ti-btn-outline ti-btn-outline-primary">
                          Change Cover Image
                        </button>
                        <div className="grid grid-cols-12 gap-x-2 mt-2">
                          {values.listing_image &&
                            values.listing_image.map((pathFile, i) => (
                              <img
                                key={i}
                                src={`${import.meta.env.VITE_CMS_URL}api/transform/${pathFile}`}
                                className="col-span-4 h-32 rounded"
                              />
                            ))}
                        </div>
                      </div>
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
                              className="ti-btn ti-btn-outline ti-btn-outline-primary"
                              onClick={() => setManagerOpener(6)}
                            >
                              Change Video
                            </button>
                            <button
                              type="button"
                              className="ti-btn ti-btn-outline ti-btn-outline-danger"
                              onClick={() =>
                                setValues((prev) => ({
                                  ...prev,
                                  video: [],
                                }))
                              }
                            >
                              Remove Video
                            </button>
                          </div>
                          <video controls className="box-img-top h-52 rounded-t-sm">
                            <source
                              src={`${import.meta.env.VITE_CMS_URL}${values.video}`}
                              type="video/mp4"
                            />
                          </video>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="ti-btn ti-btn-outline ti-btn-outline-primary"
                          onClick={() => setManagerOpener(6)}
                        >
                          Add Video
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Text Inputs */}
                  {[
                    { label: "Image Name", name: "image_name" },
                    { label: "Image Tagline", name: "img_tagline" },
                    { label: "Video Title", name: "v_title" },
                    { label: "Video Description", name: "v_des" },
                    { label: "Image Title", name: "img_title" },
                    { label: "Image Description", name: "img_des" },
                    { label: "Meta Title", name: "meta_title" },
                    { label: "Meta Description", name: "meta_des" },
                  ].map((field, idx) => (
                    <div key={idx}>
                      <label className="ti-form-label">{field.label}</label>
                      <input
                        type="text"
                        className="ti-form-input"
                        placeholder={`Enter ${field.label}`}
                        name={field.name}
                        value={values[field.name]}
                        onChange={handleChangeValue}
                      />
                    </div>
                  ))}

                  {/* Status Dropdown */}
                  <div className="col-span-12">
                    <label className="ti-form-label">Status</label>
                    <Select
                      name="status"
                      options={[
                        { value: 1, label: "Enable" },
                        { value: 0, label: "Disable" },
                      ]}
                      value={
                        values.status === 1
                          ? { value: 1, label: "Enable" }
                          : { value: 0, label: "Disable" }
                      }
                      onChange={(val) =>
                        setValues((prev) => ({ ...prev, status: val.value }))
                      }
                      placeholder="Status"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="box-footer">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="ti-btn ti-btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditPreProjects;
