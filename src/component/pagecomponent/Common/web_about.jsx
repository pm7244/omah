import React, { useEffect, useState } from "react";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import Filemanagermain from "../fileManager/filemanagermain";
import Select from "react-select";

const About = () => {
  const [heroImage, setHeroImage] = useState([]);
  const [managerOpener, setManagerOpener] = useState(false);
  const [values, setValues] = useState({
    hero_image: "",
    hero_title: "",
    hero_des: "",
    short_id: "",
    status: 1,
    meta_title: "",
    meta_des: "",
  });

  // Content management states
  const [contentData, setContentData] = useState([]);
  const [showContentForm, setShowContentForm] = useState(false);
  const [currentContent, setCurrentContent] = useState({
    content_type: "",
    layout: "",
    image1: [],
    image1_title: "",
    image1_des: "",
    text_title: "",
    text_des: "",
  });
  const [contentImage1, setContentImage1] = useState([]);
  const [contentImageText, setContentImageText] = useState([]);
  const [editingContentIndex, setEditingContentIndex] = useState(null);

  // Content type options
  const contentTypeOptions = [
    { value: "text-image", label: "Text with Image" },
    { value: "image1", label: "Full Image" },
  ];

  // Layout options for text-image type
  const layoutOptions = [
    { value: "text-left", label: "Text Left" },
    { value: "text-right", label: "Text Right" },
  ];

  useEffect(() => {
    fetchAboutData();
    fetchContentData();
  }, []);

  const fetchAboutData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallabout`)
      .then((res) => res.json())
      .then((data) => {
        const resData = data.data[0] || {};
        const heroImageData = resData.hero_image
          ? JSON.parse(resData.hero_image)
          : [];
        setHeroImage(heroImageData);
        setValues({
          hero_image: heroImageData,
          hero_title: resData.hero_title || "",
          hero_des: resData.hero_des || "",
          short_id: resData.short_id || "",
          status: resData.status ?? 1,
          meta_title: resData.meta_title || "",
          meta_des: resData.meta_des || "",
        });
      })
      .catch((err) => toast.error(err.message));
  };

  const fetchContentData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallaboutcontent`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.data) {
          const formattedData = data.data.map(item => ({
            ...item,
            image1: item.image ? JSON.parse(item.image) : [],
            content_type: item.type || "text-image",
            layout: item.layout || "default",
            // Map database fields to expected frontend fields
            image1_title: item.title || "",
            image1_des: item.des || "",
            text_title: item.title || "",
            text_des: item.des || ""
          }));
          setContentData(formattedData);
        } else {
          setContentData([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch content data:", err);
        toast.error("Failed to fetch content data");
        setContentData([]);
      });
  };

  useEffect(() => {
    setValues((prev) => ({ ...prev, hero_image: heroImage }));
  }, [heroImage]);

  useEffect(() => {
    setCurrentContent((prev) => ({ ...prev, image1: contentImage1 }));
  }, [contentImage1]);

  useEffect(() => {
    setCurrentContent((prev) => ({ ...prev, text_image: contentImageText }));
  }, [contentImageText]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "status" ? parseInt(value) : value;
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = () => {
    const {
      hero_image,
      hero_title,
      hero_des,
      short_id,
      status,
      meta_title,
      meta_des,
    } = values;

    if (
      !heroImage ||
      heroImage.length === 0 ||
      !hero_title ||
      !hero_des ||
      !short_id ||
      !meta_title ||
      !meta_des
    ) {
      toast.error("Please fill all the required fields");
      return;
    }

    const data = {
      hero_image: JSON.stringify(heroImage),
      hero_title,
      hero_des,
      short_id,
      status,
      meta_title,
      meta_des,
    };

    fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidabout/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status) toast.success("About data updated");
        else toast.error("Update failed");
      })
      .catch((err) => toast.error(err.message));
  };

  // Content management functions
  const handleContentInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentTypeChange = (selectedOption) => {
    setCurrentContent((prev) => ({
      ...prev,
      content_type: selectedOption.value,
      layout: selectedOption.value === "text-image" ? "text-left" : "default", // Set default layout
      // Reset form fields when content type changes
      image1_title: "",
      image1_des: "",
      text_title: "",
      text_des: "",
    }));
    // Reset image states
    setContentImageText([]);
    setContentImage1([]);
  };

  const handleAddContent = () => {
    const { content_type, layout } = currentContent;

    if (!content_type) {
      toast.error("Please select a content type");
      return;
    }

    // Validate layout for text-image type
    if (content_type === "text-image" && !layout) {
      toast.error("Please select a layout");
      return;
    }

    // Validate and prepare data based on content type
    let imageData = [];
    let title = "";
    let description = "";
    let finalLayout = "default";

    if (content_type === "image1") {
      // For Full Image: image is required, title and description are optional
      if (!contentImage1.length) {
        toast.error("Please select an image");
        return;
      }
      imageData = contentImage1;
      title = currentContent.image1_title || "";
      description = currentContent.image1_des || "";
      finalLayout = "default";
    } else if (content_type === "text-image") {
      // For text with image: image and layout are required, title and description are optional
      if (!contentImageText.length) {
        toast.error("Please select an image");
        return;
      }
      if (!layout) {
        toast.error("Please select a layout");
        return;
      }
      imageData = contentImageText;
      title = currentContent.text_title || "";
      description = currentContent.text_des || "";
      finalLayout = layout;
    }

    // Prepare payload for API with correct field names
    const contentPayload = {
      type: content_type,
      image: imageData,                  // Send image data directly to backend
      layout: finalLayout,               // Send layout to backend
      title: title,                      // Send title directly to backend  
      des: description,                  // Send description directly to backend
      sort_order: editingContentIndex !== null ? 
        contentData[editingContentIndex].sort_order || (contentData.length + 1).toString() : 
        (contentData.length + 1).toString(), // Assign next sort order
      status: 1
    };

    const apiUrl = editingContentIndex !== null && contentData[editingContentIndex]?.ac_id
      ? `${import.meta.env.VITE_CMS_URL}api/updatebyidaboutcontent/${contentData[editingContentIndex].ac_id}`
      : `${import.meta.env.VITE_CMS_URL}api/createaboutcontent`;
      
    const method = editingContentIndex !== null && contentData[editingContentIndex]?.ac_id ? "PUT" : "POST";

    console.log("Sending payload:", contentPayload);

    fetch(apiUrl, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contentPayload),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("API Response:", result);
        if (result.status) {
          toast.success(editingContentIndex !== null ? "Content updated successfully" : "Content added successfully");
          fetchContentData(); // Refresh data
          resetContentForm();
        } else {
          toast.error(result.message || result.error || "Failed to save content");
        }
      })
      .catch((err) => {
        console.error("Content save error:", err);
        toast.error("Failed to save content");
      });
  };

  const resetContentForm = () => {
    setCurrentContent({
      content_type: "",
      layout: "",
      image1_title: "",
      image1_des: "",
      text_title: "",
      text_des: "",
    });
    
    setContentImageText([]);
    setContentImage1([]);
    setShowContentForm(false);
    setEditingContentIndex(null);
  };

  const handleEditContent = (index) => {
    const content = contentData[index];
    setCurrentContent({
      content_type: content.type || content.content_type,
      layout: content.layout || "default",
      image1_title: content.image1_title || content.title || "",
      image1_des: content.image1_des || content.des || "",
      text_title: content.text_title || content.title || "",
      text_des: content.text_des || content.des || "",
    });
    
    const imageData = content.image1 || [];
    if (content.type === "image1" || content.content_type === "image1") {
      setContentImage1(imageData);
      setContentImageText([]);
    } else {
      setContentImageText(imageData);
      setContentImage1([]);
    }
    
    setEditingContentIndex(index);
    setShowContentForm(true);
  };

  const handleDeleteContent = (index) => {
    const content = contentData[index];
    if (window.confirm("Are you sure you want to delete this content?")) {
      if (content.ac_id) {
        // Delete from database
        fetch(`${import.meta.env.VITE_CMS_URL}api/deletebyidaboutcontent/${content.ac_id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.status) {
              toast.success("Content deleted successfully");
              fetchContentData(); // Refresh data
            } else {
              toast.error(result.message || "Failed to delete content");
            }
          })
          .catch((err) => {
            console.error("Delete error:", err);
            toast.error("Failed to delete content");
          });
      } else {
        // Remove from local state only (for unsaved content)
        const updatedContent = contentData.filter((_, i) => i !== index);
        setContentData(updatedContent);
        toast.success("Content removed");
      }
    }
  };

  const handleMoveContent = async (index, direction) => {
    console.log(`=== Moving content ${direction} ===`);
    console.log('Original index:', index);
    console.log('Content data length:', contentData.length);
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    console.log('New index:', newIndex);
    
    if (newIndex < 0 || newIndex >= contentData.length) {
      console.log('Cannot move beyond boundaries');
      return; // Can't move beyond boundaries
    }

    // Create a copy of the array and swap items
    const updatedContent = [...contentData];
    console.log('Before swap - Item1:', updatedContent[index]);
    console.log('Before swap - Item2:', updatedContent[newIndex]);
    
    [updatedContent[index], updatedContent[newIndex]] = [updatedContent[newIndex], updatedContent[index]];
    
    console.log('After swap - Item1:', updatedContent[index]);
    console.log('After swap - Item2:', updatedContent[newIndex]);
    
    // Update local state immediately for UI feedback
    setContentData(updatedContent);

    // Update sort_order in database for both items
    try {
      const item1 = updatedContent[index];
      const item2 = updatedContent[newIndex];
      
      if (item1.ac_id && item2.ac_id) {
        // Prepare proper image data
        const getImageData = (item) => {
          if (item.type === "image1" && item.image1) {
            return Array.isArray(item.image1) ? item.image1 : JSON.parse(item.image1);
          } else if (item.type === "text-image" && item.image1) {
            return Array.isArray(item.image1) ? item.image1 : JSON.parse(item.image1);
          }
          return item.image ? (Array.isArray(item.image) ? item.image : JSON.parse(item.image || '[]')) : [];
        };

        const updateData1 = {
          type: item1.type,
          image: getImageData(item1),
          layout: item1.layout || "default",
          title: item1.type === "image1" ? (item1.image1_title || '') : (item1.text_title || ''),
          des: item1.type === "image1" ? (item1.image1_des || '') : (item1.text_des || ''),
          sort_order: (index + 1).toString(),
          status: item1.status || 1
        };

        const updateData2 = {
          type: item2.type,
          image: getImageData(item2),
          layout: item2.layout || "default",
          title: item2.type === "image1" ? (item2.image1_title || '') : (item2.text_title || ''),
          des: item2.type === "image1" ? (item2.image1_des || '') : (item2.text_des || ''),
          sort_order: (newIndex + 1).toString(),
          status: item2.status || 1
        };

        console.log('Update data 1:', updateData1);
        console.log('Update data 2:', updateData2);

        // Update sort_order for both items
        const promises = [
          fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidaboutcontent/${item1.ac_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData1),
          }),
          fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidaboutcontent/${item2.ac_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData2),
          })
        ];
        
        const results = await Promise.all(promises);
        console.log('Update results:', results);
        
        const allSuccessful = results.every(response => response.ok);
        
        if (allSuccessful) {
          console.log('All updates successful');
          toast.success(`Content moved ${direction} successfully`);
          fetchContentData(); // Refresh to get updated order from database
        } else {
          console.error('Some updates failed');
          throw new Error('Failed to update database');
        }
      }
    } catch (error) {
      console.error("Error updating content order:", error);
      toast.error("Failed to update content order");
      // Revert local state on error
      fetchContentData();
    }
  };

  return (
    values && (
      <>
        {managerOpener === true ? (
          <Filemanagermain
            file={heroImage}
            fileSetter={setHeroImage}
            openSetter={setManagerOpener}
            maxFiles={1}
            ratio={16 / 9}
            type="image"
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
          <div>
            <PageHeader
              currentpage="About"
              activepage="Pages"
              mainpage="About"
            />
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-12 xxl:col-span-8">
                <div className="box mt-5">
                  <div className="box-body space-y-4">
                    <label className="ti-form-label">Hero Image</label>
                    <div>
                      <button
                        type="button"
                        onClick={() => setManagerOpener(true)}
                        className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary mb-3"
                      >
                        {heroImage && heroImage.length > 0
                          ? "Change Image"
                          : "Add Image"}{" "}
                        <i className="ti ti-file-plus"></i>
                      </button>
                      {heroImage && heroImage.length > 0 && (
                        <div className="mt-2">
                          <img
                            src={`${
                              import.meta.env.VITE_CMS_URL
                            }api/transform/${heroImage[0]}`}
                            className="box-img-top h-40 w-full rounded-t-sm object-cover"
                            alt="Hero Image"
                          />
                          <button
                            type="button"
                            onClick={() => setHeroImage([])}
                            className="mt-2 ti-btn ti-btn-sm ti-btn-danger"
                          >
                            Remove Image
                          </button>
                        </div>
                      )}
                    </div>

                    <label className="ti-form-label">Hero Title</label>
                    <input
                      type="text"
                      name="hero_title"
                      value={values.hero_title}
                      onChange={handleInputChange}
                      className="ti-form-input"
                      placeholder="Enter hero title"
                    />

                    <label className="ti-form-label">Hero Description</label>
                    <textarea
                      name="hero_des"
                      value={values.hero_des}
                      onChange={handleInputChange}
                      className="ti-form-input"
                      placeholder="Enter hero description"
                      rows="3"
                    />

                    <label className="ti-form-label">Short ID</label>
                    <input
                      type="text"
                      name="short_id"
                      value={values.short_id}
                      onChange={handleInputChange}
                      className="ti-form-input"
                    />

                    <label className="ti-form-label">Status</label>
                    <select
                      name="status"
                      value={values.status}
                      onChange={handleInputChange}
                      className="ti-form-input"
                    >
                      <option value={1}>Enable</option>
                      <option value={0}>Disable</option>
                    </select>

                    <label className="ti-form-label">Meta Title</label>
                    <input
                      type="text"
                      name="meta_title"
                      value={values.meta_title}
                      onChange={handleInputChange}
                      className="ti-form-input"
                    />

                    <label className="ti-form-label">Meta Description</label>
                    <textarea
                      name="meta_des"
                      value={values.meta_des}
                      onChange={handleInputChange}
                      className="ti-form-input"
                    />
                  </div>

                  <div className="box-footer text-end bg-transparent mt-4">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="ti-btn ti-btn-primary"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
                        <div className="col-span-12 md:col-span-6">
                          <label className="ti-form-label text-sm font-medium">
                            Content Type{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Select
                            value={contentTypeOptions.find(
                              (opt) =>
                                opt.value === currentContent.content_type
                            )}
                            onChange={handleContentTypeChange}
                            options={contentTypeOptions}
                            placeholder="Select content type..."
                            styles={{
                              control: (provided) => ({
                                ...provided,
                                minHeight: '35px',
                                fontSize: '14px',
                              }),
                              option: (provided) => ({
                                ...provided,
                                fontSize: '14px',
                              }),
                            }}
                          />
                        </div>

                        {/* Layout Selection - Show only for text-image type */}
                        {currentContent.content_type === "text-image" && (
                          <div className="col-span-12 md:col-span-6">
                            <label className="ti-form-label text-sm font-medium">
                              Layout{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <Select
                              value={layoutOptions.find(
                                (opt) => opt.value === currentContent.layout
                              )}
                              onChange={(selectedOption) =>
                                setCurrentContent((prev) => ({
                                  ...prev,
                                  layout: selectedOption.value,
                                }))
                              }
                              options={layoutOptions}
                              placeholder="Select layout..."
                              styles={{
                                control: (provided) => ({
                                  ...provided,
                                  minHeight: '35px',
                                  fontSize: '14px',
                                }),
                                option: (provided) => ({
                                  ...provided,
                                  fontSize: '14px',
                                }),
                              }}
                            />
                          </div>
                        )}

                        {/* Dynamic Fields based on Content Type */}
                        {currentContent.content_type && (
                          <div className="col-span-12">
                            <div className="grid grid-cols-12 gap-4">
                              {/* TEXT-IMAGE TYPE FIELDS - Only text fields and image upload */}
                              {currentContent.content_type === "text-image" && (
                                <>
                                  {/* Text Title */}
                                  <div className="col-span-12">
                                    <label className="ti-form-label text-sm font-medium">
                                      Title{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      name="text_title"
                                      value={currentContent.text_title}
                                      onChange={handleContentInputChange}
                                      className="ti-form-input text-sm"
                                      placeholder="Enter title..."
                                    />
                                  </div>

                                  {/* Text Description */}
                                  <div className="col-span-12">
                                    <label className="ti-form-label text-sm font-medium">
                                      Description{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                      name="text_des"
                                      value={currentContent.text_des}
                                      onChange={handleContentInputChange}
                                      className="ti-form-input text-sm"
                                      placeholder="Enter description..."
                                      rows="4"
                                    />
                                  </div>

                                  {/* Image Upload */}
                                  <div className="col-span-12">
                                    <label className="ti-form-label text-sm font-medium">
                                      Upload Image{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <div className="space-y-2">
                                      <button
                                        type="button"
                                        onClick={() => setManagerOpener(5)}
                                        className="ti-btn ti-btn-outline-primary ti-btn-sm"
                                      >
                                        {contentImageText.length > 0
                                          ? "Change Image"
                                          : "Select Image"}
                                      </button>
                                      {contentImageText.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                          {contentImageText.map(
                                            (img, index) => (
                                              <div
                                                key={index}
                                                className="relative"
                                              >
                                                <img
                                                  src={`${
                                                    import.meta.env
                                                      .VITE_CMS_URL
                                                  }api/transform/${img}`}
                                                  className="h-16 w-20 rounded-sm object-cover border"
                                                  alt="Preview"
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    setContentImageText([])
                                                  }
                                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                >
                                                  ×
                                                </button>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </>
                              )}

                              {/* IMAGE1 TYPE FIELDS - Full width image, title, description */}
                              {currentContent.content_type === "image1" && (
                                <>
                                  {/* Full Width Image Upload */}
                                  <div className="col-span-12">
                                    <label className="ti-form-label text-sm font-medium">
                                      Upload Image{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <div className="space-y-2">
                                      <button
                                        type="button"
                                        onClick={() => setManagerOpener(3)}
                                        className="ti-btn ti-btn-outline-primary ti-btn-sm"
                                      >
                                        {contentImage1.length > 0
                                          ? "Change Image"
                                          : "Select Image"}
                                      </button>
                                      {contentImage1.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                          {contentImage1.map((img, index) => (
                                            <div
                                              key={index}
                                              className="relative"
                                            >
                                              <img
                                                src={`${
                                                  import.meta.env.VITE_CMS_URL
                                                }api/transform/${img}`}
                                                className="h-16 w-20 rounded-sm object-cover border"
                                                alt="Preview"
                                              />
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  setContentImage1([])
                                                }
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

                                  {/* Title */}
                                  <div className="col-span-12">
                                    <label className="ti-form-label text-sm font-medium">
                                      Title{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      name="image1_title"
                                      value={currentContent.image1_title}
                                      onChange={handleContentInputChange}
                                      className="ti-form-input text-sm"
                                      placeholder="Enter title..."
                                    />
                                  </div>

                                  {/* Description */}
                                  <div className="col-span-12">
                                    <label className="ti-form-label text-sm font-medium">
                                      Description{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                      name="image1_des"
                                      value={currentContent.image1_des}
                                      onChange={handleContentInputChange}
                                      className="ti-form-input text-sm"
                                      placeholder="Enter description..."
                                      rows="4"
                                    />
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
                                  {editingContentIndex !== null
                                    ? "Update Content"
                                    : "Add Content"}
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
                          <th>Layout</th>
                          <th>Image</th>
                          <th>Title</th>
                          <th>Description</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contentData.map((item, index) => (
                          <tr key={item.ac_id || index}>
                            <td>{index + 1}</td>
                            <td>
                              <span className="badge bg-primary text-white px-2 py-1 rounded text-xs">
                                {contentTypeOptions.find(
                                  (opt) => opt.value === item.type
                                )?.label || item.type}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-secondary text-white px-2 py-1 rounded text-xs">
                                {item.layout === "text-left" 
                                  ? "Text Left" 
                                  : item.layout === "text-right" 
                                  ? "Text Right" 
                                  : "Default"}
                              </span>
                            </td>
                            <td>
                              {item.image1 && item.image1.length > 0 ? (
                                <img
                                  src={`${
                                    import.meta.env.VITE_CMS_URL
                                  }api/transform/${item.image1[0]}`}
                                  className="h-12 w-16 rounded-sm object-cover border cursor-pointer"
                                  alt="Content"
                                  onClick={() =>
                                    window.open(
                                      `${
                                        import.meta.env.VITE_CMS_URL
                                      }api/transform/${item.image1[0]}`,
                                      "_blank"
                                    )
                                  }
                                />
                              ) : (
                                <span className="text-gray-400 text-sm">
                                  No image
                                </span>
                              )}
                            </td>
                            <td>
                              <div className="max-w-32 truncate text-sm">
                                {item.type === "image1"
                                  ? item.image1_title
                                  : item.type === "text-image"
                                  ? item.text_title
                                  : "No title"}
                              </div>
                            </td>
                            <td>
                              <div className="max-w-32 truncate text-sm">
                                {item.type === "image1"
                                  ? item.image1_des
                                  : item.type === "text-image"
                                  ? item.text_des
                                  : "No description"}
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
                            <td
                              colSpan="6"
                              className="text-center text-gray-500 py-8"
                            >
                              No content available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-12 mt-6">
                    <div className="col-span-12">
                      <div className="box">
                        <div className="box-footer bg-transparent">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={handleSubmit}
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
              </div>
            </div>
          </div>
        )}
      </>
    )
  );
};

export default About;
