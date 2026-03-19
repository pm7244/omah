import React, { useEffect, useState } from "react";
import Select from "react-select";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import Filemanagermain from "../fileManager/filemanagermain";
import { useNavigate, useParams } from "react-router-dom";

const ServiceEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [values, setValues] = useState({
    parent_id: 0,
    sub_title: "",
    tagline: "",
    title: "",
    slug: "",
    des: "",
    sort_order: 0,
    meta_title: "",
    meta_des: "",
    status: 1
  });

  const [image, setImage] = useState([]);
  const [video, setVideo] = useState([]);
  const [managerOpener, setManagerOpener] = useState(0);
  const [parentOptions, setParentOptions] = useState([]);

  // Content management states
  const [contentData, setContentData] = useState([]);
  const [showContentForm, setShowContentForm] = useState(false);
  const [currentContent, setCurrentContent] = useState({
    content_type: "",
    // Image1 fields (only 1 image)
    image1: [],
    image1_title: "",
    image1_des: "",
    // Image2 fields (2 separate image sections)
    image_2: [],
    image2_title: "",
    image2_des: "",
    // Text-Image fields (text + 1 image)
    text_title: "",
    text_des: "",
  });
  const [contentImage1, setContentImage1] = useState([]);
  const [contentImage2, setContentImage2] = useState([]);
  const [contentImageText, setContentImageText] = useState([]);
  const [editingContentIndex, setEditingContentIndex] = useState(null);

  // Content type options
  const contentTypeOptions = [
    { value: "image1", label: "Image 1 (Single Image)" },
    { value: "image2", label: "Image 2 (Two Images)" },
    { value: "text-image", label: "Text with Image" },
  ];

  // Fetch service data and parent services
  useEffect(() => {
    if (id) {
      fetchServiceData();
      fetchParentServices();
    }
  }, [id]);

  // Update content images in current content when image arrays change
  useEffect(() => {
    setCurrentContent(prev => ({
      ...prev,
      image1: contentImage1,
      image_2: contentImage2
    }));
  }, [contentImage1, contentImage2]);

  const fetchServiceData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getbyidservicecontent/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.data) {
          const serviceData = data.data;
          
          // Set main service values
          setValues({
            parent_id: serviceData.parent_id || 0,
            sub_title: serviceData.sub_title || "",
            tagline: serviceData.tagline || "",
            title: serviceData.title || "",
            slug: serviceData.slug || "",
            des: serviceData.des || "",
            sort_order: serviceData.sort_order || 0,
            meta_title: serviceData.meta_title || "",
            meta_des: serviceData.meta_des || "",
            status: serviceData.status || 1
          });
          
          // Set images and videos
          setImage(serviceData.image || []);
          setVideo(serviceData.video || []);
          
          // Set content management data
          if (serviceData.map_items && serviceData.map_items.length > 0) {
            const formattedMapItems = serviceData.map_items.map(item => ({
              content_type: item.type,
              image1: item.image1 || [],
              image1_title: item.image1_title || "",
              image1_des: item.image1_des || "",
              image_2: item.image2 || [],
              image2_title: item.image2_title || "",
              image2_des: item.image2_des || "",
              text_title: item.title || "",
              text_des: item.des || "",
            }));
            setContentData(formattedMapItems);
          }
        } else {
          toast.error("Service not found");
          navigate("/cms/pages/service");
        }
      })
      .catch((err) => {
        console.error("Error fetching service data:", err);
        toast.error("Failed to fetch service data");
        navigate("/cms/pages/service");
      });
  };

  const fetchParentServices = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallservicecontent`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.data) {
          // Filter services where parent_id is 0 and format for Select component
          const parents = data.data
            .filter(item => item.parent_id === 0 && item.sc_id != id) // Exclude current service
            .map(item => ({
              value: item.sc_id,
              label: item.title || `Service ID: ${item.sc_id}`
            }));
          
          // Add "No Parent" option
          const options = [
            { value: 0, label: "No Parent (Main Service)" },
            ...parents
          ];
          
          setParentOptions(options);
        }
      })
      .catch((err) => {
        console.error("Error fetching parent services:", err);
        toast.error("Failed to fetch parent services");
      });
  };

  // Content management functions
  const handleContentTypeChange = (selectedOption) => {
    setCurrentContent({
      content_type: selectedOption.value,
      image1: [],
      image1_title: "",
      image1_des: "",
      image_2: [],
      image2_title: "",
      image2_des: "",
      text_title: "",
      text_des: "",
    });
    setContentImage1([]);
    setContentImage2([]);
    setContentImageText([]);
    setShowContentForm(true);
    setEditingContentIndex(null);
  };

  const handleContentInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentContent(prev => ({ ...prev, [name]: value }));
  };

  const handleAddContent = () => {
    if (!currentContent.content_type) {
      toast.error("Please select a content type");
      return;
    }

    // Validation based on content type
    if (currentContent.content_type === "image1") {
      if (contentImage1.length !== 1) {
        toast.error("Please upload 1 image for Image1 type");
        return;
      }
      if (!currentContent.image1_title.trim()) {
        toast.error("Please enter Image1 title");
        return;
      }
    }

    if (currentContent.content_type === "image2") {
      if (contentImage1.length !== 1 || contentImage2.length !== 1) {
        toast.error("Please upload exactly 1 image for each section in Image2 type");
        return;
      }
      if (!currentContent.image1_title.trim() || !currentContent.image2_title.trim()) {
        toast.error("Please enter titles for both image sections");
        return;
      }
    }

    if (currentContent.content_type === "text-image") {
      if (contentImageText.length !== 1) {
        toast.error("Please upload 1 image for Text-Image type");
        return;
      }
      if (!currentContent.text_title.trim()) {
        toast.error("Please enter text title");
        return;
      }
    }

    // Create new content item for local state
    const newContentItem = {
      content_type: currentContent.content_type,
      image1: currentContent.content_type === "image1" 
        ? contentImage1 
        : currentContent.content_type === "text-image" 
        ? contentImageText
        : currentContent.content_type === "image2"
        ? contentImage1
        : [],
      image1_title: currentContent.image1_title || "",
      image1_des: currentContent.image1_des || "",
      image_2: currentContent.content_type === "image2" ? contentImage2 : [],
      image2_title: currentContent.image2_title || "",
      image2_des: currentContent.image2_des || "",
      text_title: currentContent.text_title || "",
      text_des: currentContent.text_des || "",
    };

    if (editingContentIndex !== null) {
      // Update existing content
      const updatedContent = [...contentData];
      updatedContent[editingContentIndex] = newContentItem;
      setContentData(updatedContent);
      toast.success("Content updated successfully");
    } else {
      // Add new content
      setContentData(prev => [...prev, newContentItem]);
      toast.success("Content added successfully");
    }
    
    resetContentForm();
  };

  const resetContentForm = () => {
    setCurrentContent({
      content_type: "",
      image1: [],
      image1_title: "",
      image1_des: "",
      image_2: [],
      image2_title: "",
      image2_des: "",
      text_title: "",
      text_des: "",
    });
    setContentImage1([]);
    setContentImage2([]);
    setContentImageText([]);
    setShowContentForm(false);
    setEditingContentIndex(null);
  };

  const handleDeleteContent = (index) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      setContentData(prev => prev.filter((_, i) => i !== index));
      toast.success("Content deleted successfully");
    }
  };

  const handleEditContent = (index) => {
    const content = contentData[index];
    
    setCurrentContent({
      content_type: content.content_type,
      image1_title: content.image1_title || "",
      image1_des: content.image1_des || "",
      image2_title: content.image2_title || "",
      image2_des: content.image2_des || "",
      text_title: content.text_title || "",
      text_des: content.text_des || "",
    });

    // Set images based on content type
    if (content.content_type === "image1") {
      setContentImage1(content.image1 || []);
      setContentImage2([]);
      setContentImageText([]);
    } else if (content.content_type === "image2") {
      setContentImage1(content.image1 || []);
      setContentImage2(content.image_2 || []);
      setContentImageText([]);
    } else if (content.content_type === "text-image") {
      setContentImageText(content.image1 || []);
      setContentImage1([]);
      setContentImage2([]);
    }
    
    setEditingContentIndex(index);
    setShowContentForm(true);
  };

  const handleMoveContent = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= contentData.length) {
      return; // Can't move beyond boundaries
    }

    // Create a copy of the array and swap items
    const updatedContent = [...contentData];
    [updatedContent[index], updatedContent[newIndex]] = [updatedContent[newIndex], updatedContent[index]];
    
    // Update local state immediately for UI feedback
    setContentData(updatedContent);
    toast.success(`Content moved ${direction} successfully`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => {
      const newState = { ...prev, [name]: value };
      
      // Auto-generate slug from title
      if (name === "title") {
        newState.slug = value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
          .replace(/-+/g, "-")
          .trim();
      }
      
      return newState;
    });
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    if (actionMeta.name === "parent_id") {
      setValues(prev => ({ ...prev, parent_id: selectedOption.value }));
    } else if (actionMeta.name === "status") {
      setValues(prev => ({ ...prev, status: selectedOption.value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!values.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!values.des.trim()) {
      toast.error("Description is required");
      return;
    }

    const formData = {
      ...values,
      sub_title: values.sub_title || "",
      tagline: values.tagline || "",
      image: JSON.stringify(image),
      video: JSON.stringify(video),
      map_items: contentData.map((item, index) => ({
        type: item.content_type,
        image1: item.content_type === "text-image" ? item.image1 : item.image1,
        image1_title: item.image1_title || "",
        image1_des: item.image1_des || "",
        image2: item.content_type === "image2" ? item.image_2 : [],
        image2_title: item.image2_title || "",
        image2_des: item.image2_des || "",
        title: item.text_title || "",
        des: item.text_des || "",
        sort_order: index + 1,
        status: 1
      }))
    };

    fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidservicecontent/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          toast.success("Service content updated successfully!");
          navigate("/cms/pages/service");
        } else {
          toast.error(data.message || "Failed to update service content");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        toast.error("An error occurred while updating service content");
      });
  };

  const statusOptions = [
    { value: 1, label: "Active" },
    { value: 0, label: "Inactive" }
  ];

  return managerOpener === 1 ? (
    <Filemanagermain
      file={image}
      fileSetter={setImage}
      openSetter={setManagerOpener}
      maxFiles={1}
      ratio={16 / 9}
      type="image"
    />
  ) : managerOpener === 2 ? (
    <Filemanagermain
      file={video}
      fileSetter={setVideo}
      openSetter={setManagerOpener}
      maxFiles={1}
      ratio={16 / 9}
      type="video"
    />
  ) : managerOpener === 3 ? (
    <Filemanagermain
      file={contentImage1}
      fileSetter={setContentImage1}
      openSetter={setManagerOpener}
      maxFiles={1}
      ratio={16 / 9}
      type="image"
    />
  ) : managerOpener === 4 ? (
    <Filemanagermain
      file={contentImage2}
      fileSetter={setContentImage2}
      openSetter={setManagerOpener}
      maxFiles={1}
      ratio={16 / 9}
      type="image"
    />
  ) : managerOpener === 5 ? (
    <Filemanagermain
      file={contentImageText}
      fileSetter={setContentImageText}
      openSetter={setManagerOpener}
      maxFiles={1}
      ratio={16 / 9}
      type="image"
    />
  ) : (
    <>
      <PageHeader
        currentpage="Edit Service"
        activepage="Pages"
        mainpage="Service"
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => navigate("/cms/pages/service")}
                  className="ti-btn ti-btn-sm mr-3 p-2 rounded-full"
                  style={{ backgroundColor: '#5A66F1', color: 'white' }}
                >
                  <i className="ti ti-arrow-left text-sm"></i>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="box-body">
                <div className="grid grid-cols-12 gap-6">
                  {/* Left Column */}
                  <div className="col-span-12 xxl:col-span-8">
                    
                    {/* Parent Service */}
                    <div className="box">
                      <div className="box-body space-y-5">
                        <label htmlFor="parent_id" className="ti-form-label">
                          Parent Service
                        </label>
                        <Select
                          name="parent_id"
                          options={parentOptions}
                          value={parentOptions.find(option => option.value === values.parent_id)}
                          onChange={handleSelectChange}
                          placeholder="Select Parent Service"
                          className="ti-form-select"
                        />
                        <small className="text-gray-500">
                          Select "No Parent" to create a main service, or choose an existing service to create a sub-service.
                        </small>
                      </div>
                    </div>

                    {/* Sub Title */}
                    <div className="box">
                      <div className="box-body space-y-5">
                        <label htmlFor="sub_title" className="ti-form-label">
                          Sub Title
                        </label>
                        <input
                          type="text"
                          name="sub_title"
                          value={values.sub_title}
                          onChange={handleInputChange}
                          id="sub_title"
                          className="ti-form-input"
                          placeholder="Enter Sub Title"
                        />
                      </div>
                    </div>

                    {/* Tagline */}
                    <div className="box">
                      <div className="box-body space-y-5">
                        <label htmlFor="tagline" className="ti-form-label">
                          Tagline
                        </label>
                        <input
                          type="text"
                          name="tagline"
                          value={values.tagline}
                          onChange={handleInputChange}
                          id="tagline"
                          className="ti-form-input"
                          placeholder="Enter Tagline"
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <div className="box">
                      <div className="box-body space-y-5">
                        <label htmlFor="title" className="ti-form-label">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={values.title}
                          onChange={handleInputChange}
                          id="title"
                          className="ti-form-input"
                          placeholder="Enter Title"
                          required
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="box">
                      <div className="box-body space-y-5">
                        <label htmlFor="des" className="ti-form-label">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="des"
                          value={values.des}
                          onChange={handleInputChange}
                          id="des"
                          className="ti-form-input"
                          rows="6"
                          placeholder="Enter Description"
                          required
                        />
                      </div>
                    </div>

                    {/* Meta Title */}
                    <div className="box">
                      <div className="box-body space-y-5">
                        <label htmlFor="meta_title" className="ti-form-label">
                          Meta Title
                        </label>
                        <input
                          type="text"
                          name="meta_title"
                          value={values.meta_title}
                          onChange={handleInputChange}
                          id="meta_title"
                          className="ti-form-input"
                          placeholder="Enter Meta Title"
                        />
                      </div>
                    </div>

                    {/* Meta Description */}
                    <div className="box">
                      <div className="box-body space-y-5">
                        <label htmlFor="meta_des" className="ti-form-label">
                          Meta Description
                        </label>
                        <textarea
                          name="meta_des"
                          value={values.meta_des}
                          onChange={handleInputChange}
                          id="meta_des"
                          className="ti-form-input"
                          rows="3"
                          placeholder="Enter Meta Description"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="col-span-12 xxl:col-span-4">
                    
                    {/* Slug */}
                    <div className="box">
                      <div className="box-body space-y-4">
                        <label htmlFor="slug" className="ti-form-label">
                          Slug
                        </label>
                        <input
                          type="text"
                          name="slug"
                          value={values.slug}
                          onChange={handleInputChange}
                          id="slug"
                          className="ti-form-input"
                          placeholder="Auto-generated from title"
                        />
                        <small className="text-gray-500">
                          URL-friendly version of the title. Auto-generated but can be modified.
                        </small>
                      </div>
                    </div>

                    {/* Sort Order */}
                    <div className="box">
                      <div className="box-body space-y-4">
                        <label htmlFor="sort_order" className="ti-form-label">
                          Sort Order
                        </label>
                        <input
                          type="number"
                          name="sort_order"
                          value={values.sort_order}
                          onChange={handleInputChange}
                          id="sort_order"
                          className="ti-form-input"
                          placeholder="Enter Sort Order"
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="box">
                      <div className="box-header">
                        <h5 className="box-title">Status</h5>
                      </div>
                      <div className="box-body">
                        <Select
                          name="status"
                          options={statusOptions}
                          value={statusOptions.find(option => option.value === values.status)}
                          onChange={handleSelectChange}
                          placeholder="Select Status"
                          className="ti-form-select"
                        />
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="box">
                      <div className="box-header">
                        <h5 className="box-title">Service Image</h5>
                      </div>
                      <div className="box-body space-y-4">
                        <button
                          type="button"
                          onClick={() => setManagerOpener(1)}
                          className="ti-btn ti-btn-outline-primary w-full"
                        >
                          <i className="ti ti-upload mr-2"></i>
                          {image.length > 0 ? "Change Image" : "Upload Image"}
                        </button>
                        
                        {image.length > 0 && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Preview:</label>
                            <div className="flex flex-wrap gap-2">
                              {image.map((img, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={`${import.meta.env.VITE_CMS_URL}api/transform/${img}`}
                                    className="h-20 w-24 rounded-sm object-cover border"
                                    alt="Preview"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setImage(prev => prev.filter((_, i) => i !== index))}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Video Upload */}
                    <div className="box">
                      <div className="box-header">
                        <h5 className="box-title">Service Video</h5>
                      </div>
                      <div className="box-body space-y-4">
                        <button
                          type="button"
                          onClick={() => setManagerOpener(2)}
                          className="ti-btn ti-btn-primary w-full"
                        >
                          <i className="ti ti-video mr-2"></i>
                          {video.length > 0 ? "Change Video" : "Upload Video"}
                        </button>
                        
                        {video.length > 0 && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Selected Video:</label>
                            <div className="flex flex-wrap gap-2">
                              {video.map((vid, index) => (
                                <div key={index} className="relative bg-gray-100 p-2 rounded">
                                  <span className="text-sm">{vid}</span>
                                  <button
                                    type="button"
                                    onClick={() => setVideo(prev => prev.filter((_, i) => i !== index))}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="box">
                      <div className="box-body">
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            className="ti-btn ti-btn-primary flex-1"
                          >
                            <i className="ti ti-check mr-2"></i>Update Service
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate("/cms/pages/service")}
                            className="ti-btn ti-btn-outline-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Content Management Section */}
      <div className="grid grid-cols-12 gap-x-6 mt-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header flex justify-between items-center">
              <h5 className="box-title">Content Management</h5>
              <button
                type="button"
                onClick={() => {
                  setShowContentForm(true);
                  setEditingContentIndex(null);
                }}
                className="ti-btn ti-btn-primary"
              >
                <i className="ti ti-plus mr-2"></i>Add New Content
              </button>
            </div>

            {/* Content Form */}
            {showContentForm && (
              <div className="box-body border-b">
                <div className="grid grid-cols-12 gap-4">
                  {/* Content Type Selection */}
                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <label className="ti-form-label text-sm font-medium">
                      Content Type <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={contentTypeOptions.find(opt => opt.value === currentContent.content_type)}
                      onChange={handleContentTypeChange}
                      options={contentTypeOptions}
                      placeholder="Select content type..."
                      className="text-sm"
                    />
                  </div>

                  {/* Dynamic Fields based on Content Type */}
                  {currentContent.content_type && (
                    <div className="col-span-12">
                      <div className="grid grid-cols-12 gap-4">
                        
                        {/* IMAGE1 TYPE FIELDS - Only image1 fields without button text/url */}
                        {currentContent.content_type === "image1" && (
                          <>
                            {/* Image1 Upload */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Upload Image <span className="text-red-500">*</span>
                              </label>
                              <div className="space-y-2">
                                <button
                                  type="button"
                                  onClick={() => setManagerOpener(3)}
                                  className="ti-btn ti-btn-outline-primary ti-btn-sm w-full"
                                >
                                  {contentImage1.length > 0 ? "Change Image" : "Select Image"}
                                </button>
                                {contentImage1.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {contentImage1.map((img, index) => (
                                      <div key={index} className="relative">
                                        <img
                                          src={`${import.meta.env.VITE_CMS_URL}api/transform/${img}`}
                                          className="h-16 w-20 rounded-sm object-cover border"
                                          alt="Preview"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setContentImage1([])}
                                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Image1 Title */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Image Title <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="image1_title"
                                value={currentContent.image1_title}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter image title..."
                              />
                            </div>

                            {/* Image1 Description */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Image Description
                              </label>
                              <textarea
                                name="image1_des"
                                value={currentContent.image1_des}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter image description..."
                                rows="3"
                              />
                            </div>
                          </>
                        )}

                        {/* IMAGE2 TYPE FIELDS - Two separate image sections without button text/url */}
                        {currentContent.content_type === "image2" && (
                          <>
                            {/* First Image Section */}
                            <div className="col-span-12">
                              <h6 className="text-sm font-semibold mb-3 text-gray-700 border-b pb-2">First Image Section</h6>
                            </div>
                            
                            {/* First Image Upload */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Upload First Image <span className="text-red-500">*</span>
                              </label>
                              <div className="space-y-2">
                                <button
                                  type="button"
                                  onClick={() => setManagerOpener(3)}
                                  className="ti-btn ti-btn-outline-primary ti-btn-sm w-full"
                                >
                                  {contentImage1.length > 0 ? "Change First Image" : "Select First Image"}
                                </button>
                                {contentImage1.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {contentImage1.map((img, index) => (
                                      <div key={index} className="relative">
                                        <img
                                          src={`${import.meta.env.VITE_CMS_URL}api/transform/${img}`}
                                          className="h-16 w-20 rounded-sm object-cover border"
                                          alt="Preview"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setContentImage1([])}
                                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* First Image Title */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                First Image Title <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="image1_title"
                                value={currentContent.image1_title}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter first image title..."
                              />
                            </div>

                            {/* First Image Description */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                First Image Description
                              </label>
                              <textarea
                                name="image1_des"
                                value={currentContent.image1_des}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter first image description..."
                                rows="3"
                              />
                            </div>

                            {/* Second Image Section */}
                            <div className="col-span-12">
                              <h6 className="text-sm font-semibold mb-3 text-gray-700 mt-6 border-b pb-2">Second Image Section</h6>
                            </div>
                            
                            {/* Second Image Upload */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Upload Second Image <span className="text-red-500">*</span>
                              </label>
                              <div className="space-y-2">
                                <button
                                  type="button"
                                  onClick={() => setManagerOpener(4)}
                                  className="ti-btn ti-btn-outline-primary ti-btn-sm w-full"
                                >
                                  {contentImage2.length > 0 ? "Change Second Image" : "Select Second Image"}
                                </button>
                                {contentImage2.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {contentImage2.map((img, index) => (
                                      <div key={index} className="relative">
                                        <img
                                          src={`${import.meta.env.VITE_CMS_URL}api/transform/${img}`}
                                          className="h-16 w-20 rounded-sm object-cover border"
                                          alt="Preview"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setContentImage2([])}
                                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Second Image Title */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Second Image Title <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="image2_title"
                                value={currentContent.image2_title}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter second image title..."
                              />
                            </div>

                            {/* Second Image Description */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Second Image Description
                              </label>
                              <textarea
                                name="image2_des"
                                value={currentContent.image2_des}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter second image description..."
                                rows="3"
                              />
                            </div>
                          </>
                        )}

                        {/* TEXT-IMAGE TYPE FIELDS - Shows text fields and image1 fields without button/url */}
                        {currentContent.content_type === "text-image" && (
                          <>
                            {/* Text Fields Section */}
                            <div className="col-span-12">
                              <h6 className="text-sm font-semibold mb-3 text-gray-700">Text Section</h6>
                            </div>
                            
                            {/* Text Title */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Text Title <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="text_title"
                                value={currentContent.text_title}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter text title..."
                              />
                            </div>

                            {/* Text Description */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Text Description
                              </label>
                              <textarea
                                name="text_des"
                                value={currentContent.text_des}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter text description..."
                                rows="3"
                              />
                            </div>

                            {/* Image Fields Section */}
                            <div className="col-span-12">
                              <h6 className="text-sm font-semibold mb-3 text-gray-700 mt-4">Image Section</h6>
                            </div>

                            {/* Image Upload */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Upload Image <span className="text-red-500">*</span>
                              </label>
                              <div className="space-y-2">
                                <button
                                  type="button"
                                  onClick={() => setManagerOpener(5)}
                                  className="ti-btn ti-btn-outline-primary ti-btn-sm w-full"
                                >
                                  {contentImageText.length > 0 ? "Change Image" : "Select Image"}
                                </button>
                                {contentImageText.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {contentImageText.map((img, index) => (
                                      <div key={index} className="relative">
                                        <img
                                          src={`${import.meta.env.VITE_CMS_URL}api/transform/${img}`}
                                          className="h-16 w-20 rounded-sm object-cover border"
                                          alt="Preview"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setContentImageText([])}
                                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        )}

                        {/* Action Buttons */}
                        <div className="col-span-12 flex justify-end gap-2 mt-4">
                          <button
                            type="button"
                            onClick={handleAddContent}
                            className="ti-btn ti-btn-primary"
                          >
                            {editingContentIndex !== null ? "Update Content" : "Add Content"}
                          </button>
                          <button
                            type="button"
                            onClick={resetContentForm}
                            className="ti-btn ti-btn-outline-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Content Table */}
            <div className="overflow-auto table-bordered">
              <table className="ti-custom-table ti-custom-table-head">
                <thead className="border">
                  <tr>
                    <th className="w-1">#</th>
                    <th>Content Type</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contentData.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <span className="ti-badge bg-primary/10 text-primary text-xs">
                          {item.content_type === "image1" ? "Image 1" : 
                           item.content_type === "image2" ? "Image 2" : 
                           item.content_type === "text-image" ? "Text & Image" : 
                           item.content_type}
                        </span>
                      </td>
                      <td>
                        {item.content_type === "image2" ? (
                          <div className="flex gap-1">
                            <img
                              src={`${import.meta.env.VITE_CMS_URL}api/transform/${item.image1[0]}`}
                              className="h-12 w-16 rounded-sm object-cover border cursor-pointer"
                              alt="Content 1"
                              onClick={() => window.open(`${import.meta.env.VITE_CMS_URL}api/transform/${item.image1[0]}`, '_blank')}
                            />
                            {item.image_2 && item.image_2.length > 0 && (
                              <img
                                src={`${import.meta.env.VITE_CMS_URL}api/transform/${item.image_2[0]}`}
                                className="h-12 w-16 rounded-sm object-cover border cursor-pointer"
                                alt="Content 2"
                                onClick={() => window.open(`${import.meta.env.VITE_CMS_URL}api/transform/${item.image_2[0]}`, '_blank')}
                              />
                            )}
                          </div>
                        ) : item.content_type === "text-image" && item.image1 && item.image1.length > 0 ? (
                          <img
                            src={`${import.meta.env.VITE_CMS_URL}api/transform/${item.image1[0]}`}
                            className="h-12 w-16 rounded-sm object-cover border cursor-pointer"
                            alt="Content"
                            onClick={() => window.open(`${import.meta.env.VITE_CMS_URL}api/transform/${item.image1[0]}`, '_blank')}
                          />
                        ) : item.content_type === "image1" && item.image1 && item.image1.length > 0 ? (
                          <img
                            src={`${import.meta.env.VITE_CMS_URL}api/transform/${item.image1[0]}`}
                            className="h-12 w-16 rounded-sm object-cover border cursor-pointer"
                            alt="Content"
                            onClick={() => window.open(`${import.meta.env.VITE_CMS_URL}api/transform/${item.image1[0]}`, '_blank')}
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">No image</span>
                        )}
                      </td>
                      <td>
                        <div className="max-w-32 truncate text-sm">
                          {item.content_type === "image1" ? item.image1_title : 
                           item.content_type === "image2" ? item.image1_title : 
                           item.content_type === "text-image" ? item.text_title : 
                           "No title"}
                        </div>
                      </td>
                      <td>
                        <div className="max-w-40 truncate text-sm">
                          {item.content_type === "image1" ? item.image1_des : 
                           item.content_type === "image2" ? item.image1_des : 
                           item.content_type === "text-image" ? item.text_des : 
                           "No description"}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveContent(index, 'up')}
                            disabled={index === 0}
                            className={`ti-btn ti-btn-soft-info ti-btn-sm ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Move Up"
                          >
                            <i className="ti ti-arrow-up"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveContent(index, 'down')}
                            disabled={index === contentData.length - 1}
                            className={`ti-btn ti-btn-soft-info ti-btn-sm ${index === contentData.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Move Down"
                          >
                            <i className="ti ti-arrow-down"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditContent(index)}
                            className="ti-btn ti-btn-soft-primary ti-btn-sm"
                            title="Edit"
                          >
                            <i className="ti ti-edit"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteContent(index)}
                            className="ti-btn ti-btn-soft-danger ti-btn-sm"
                            title="Delete"
                          >
                            <i className="ti ti-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {contentData.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-gray-500 py-8">
                        No content available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceEdit;
