import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import Filemanagermain from "../fileManager/filemanagermain";
import { useNavigate } from "react-router-dom";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ServiceCreate = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    parent_id: 0,
    sub_title: "",
    tagline: "",
    title: "",
    card_text: "",
    slug: "",
    des: "",
    sort_order: 0,
    meta_title: "",
    meta_des: "",
    status: 1
  });

  const [image, setImage] = useState([]);
  const [bannerImage, setBannerImage] = useState([]);
  const [sliderImage, setSliderImage] = useState([]);
  const [cardImage, setCardImage] = useState([]);


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
    layout: "",
    text_des: "",
  });
  const [contentImage1, setContentImage1] = useState([]);
  const [contentImage2, setContentImage2] = useState([]);
  const [contentImageText, setContentImageText] = useState([]);
  const [editingContentIndex, setEditingContentIndex] = useState(null);
  const [contentSubmitting, setContentSubmitting] = useState(false);

  // Crop functionality states
  const [cropFile, setCropFile] = useState("");
  const [crop, setCrop] = useState();
  const [showCropModal, setShowCropModal] = useState(false);
  const [activeImageType, setActiveImageType] = useState(""); // "image1", "image2", "imageText"

  // Refs for crop functionality
  const imageRef = useRef(null);
  const previewCanvasRef = useRef(null);

  // Content type options
  const contentTypeOptions = [
    { value: "image1", label: "Image 1 (Single Image)" },
    // { value: "image2", label: "Image 2 (Two Images)" },
    { value: "text-image", label: "Text with Image" },
  ];

  // Fetch parent services (where parent_id = 0)
  useEffect(() => {
    fetchParentServices();
    fetchContentData();
  }, []);

  // Update content images in current content when image arrays change
  useEffect(() => {
    setCurrentContent(prev => ({
      ...prev,
      image1: contentImage1,
      image_2: contentImage2
    }));
  }, [contentImage1, contentImage2]);

  const fetchParentServices = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallservicecontent`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.data) {
          // Filter services where parent_id is 0 and format for Select component
          const parents = data.data
            .filter(item => item.parent_id === 0)
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

  const fetchContentData = () => {
    // For service creation, content management should start empty
    // Content will be added by user and saved to service_content_map table
    setContentData([]);
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
      layout: "",

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

    // Create new content item for local state with proper structure
    const newContentItem = {
      sc_id: editingContentIndex !== null ? contentData[editingContentIndex].sc_id : `temp_${Date.now()}`,
      type: currentContent.content_type, // Use 'type' instead of 'content_type' for consistency
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
      layout: currentContent.layout || "",

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
      setContentData(prev => {
        const newData = [...prev, newContentItem];
        console.log("New content data:", newData); // Debug log
        return newData;
      });
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
      layout: "",
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
      layout: content.layout || "",
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

  const handleMoveContent = async (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= contentData.length) {
      return; // Can't move beyond boundaries
    }

    // Create a copy of the array and swap items
    const updatedContent = [...contentData];
    [updatedContent[index], updatedContent[newIndex]] = [updatedContent[newIndex], updatedContent[index]];

    // Update local state immediately for UI feedback
    setContentData(updatedContent);

    // Update order numbers for the reordered items
    const itemsToUpdate = updatedContent.map((item, idx) => ({
      ...item,
      order_no: idx + 1
    }));

    // If this is for an existing service (has ID), update the database
    if (id && id !== 'add') {
      try {
        // Update the database with new order
        const updatePromises = itemsToUpdate.map(async (item, idx) => {
          if (item.sc_id && !item.sc_id.toString().startsWith('temp_')) {
            return fetch(`${import.meta.env.VITE_CMS_URL}api/updateservicecontentorder`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                sc_id: item.sc_id,
                order_no: idx + 1
              }),
            });
          }
          return Promise.resolve();
        });

        await Promise.all(updatePromises);
        console.log("Database order updated successfully");
      } catch (error) {
        console.error("Error updating database order:", error);
        // Revert the UI change if database update fails
        const revertedContent = [...contentData];
        [revertedContent[newIndex], revertedContent[index]] = [revertedContent[index], revertedContent[newIndex]];
        setContentData(revertedContent);
        toast.error("Failed to update order in database");
        return;
      }
    }

    toast.success(`Content moved ${direction} successfully`);
  };

  // Crop functionality
  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const MinDimension = 170;
    const AspectRatio = 3 / 2; // 3:2 ratio
    const cropWidthInPercent = (MinDimension / width) * 100;

    const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: cropWidthInPercent,
        },
        AspectRatio,
        width,
        height
      ),
      width,
      height
    );
    setCrop(newCrop);
  };

  const handleCropSave = () => {
    if (!previewCanvasRef.current || !imageRef.current || !crop) {
      toast.error("Please make a crop selection");
      return;
    }

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext("2d");

    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

    const pixelCrop = convertToPixelCrop(
      crop,
      imageRef.current.width,
      imageRef.current.height
    );

    const scaledCrop = {
      x: Math.round(pixelCrop.x * scaleX),
      y: Math.round(pixelCrop.y * scaleY),
      width: Math.round(pixelCrop.width * scaleX),
      height: Math.round(pixelCrop.height * scaleY),
    };

    canvas.width = scaledCrop.width;
    canvas.height = scaledCrop.height;

    ctx.drawImage(
      imageRef.current,
      scaledCrop.x,
      scaledCrop.y,
      scaledCrop.width,
      scaledCrop.height,
      0,
      0,
      scaledCrop.width,
      scaledCrop.height
    );

    canvas.toBlob(async (blob) => {
      if (!blob) {
        toast.error("Failed to create cropped image");
        return;
      }

      const formData = new FormData();
      formData.append("files", blob, "cropped-image.jpg");

      try {
        const response = await fetch(`${import.meta.env.VITE_CMS_URL}api/file-upload`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const uploadedFiles = await response.json();
          const fileName = uploadedFiles[0].filename;

          // Set the cropped image to the appropriate state based on activeImageType
          if (activeImageType === "main") {
            setImage([fileName]);
          } else if (activeImageType === "image1") {
            setContentImage1([fileName]);
          } else if (activeImageType === "image2") {
            setContentImage2([fileName]);
          } else if (activeImageType === "imageText") {
            setContentImageText([fileName]);
          }

          toast.success("Image cropped and uploaded successfully");
          setShowCropModal(false);
          setCropFile("");
          setActiveImageType("");
        } else {
          toast.error("Failed to upload cropped image");
        }
      } catch (error) {
        console.error("Error uploading cropped image:", error);
        toast.error("Error uploading cropped image");
      }
    }, "image/jpeg", 0.95);
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setCropFile("");
    setActiveImageType("");
    setCrop();
  };

  // Content Management Submit function
  const handleContentManagementSubmit = async () => {
    if (contentData.length === 0) {
      toast.error("Please add content before submitting");
      return;
    }

    toast.info("Content Management data will be saved when you submit the main form by clicking 'Create Service'");
    return;
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

    // Prevent multiple submissions
    if (e.target.disabled) return;
    e.target.disabled = true;

    // Validation
    if (!values.title.trim()) {
      toast.error("Title is required");
      e.target.disabled = false;
      return;
    }

    if (!values.des.trim()) {
      toast.error("Description is required");
      e.target.disabled = false;
      return;
    }

    const formData = {
      ...values,
      sub_title: values.sub_title || "",
      card_text: values.card_text || "",
      tagline: values.tagline || "",
      image: image,
      video: video,
      banner_image: bannerImage,
      slider: sliderImage,
      card_images: cardImage,

      map_items: contentData.length > 0 ? contentData.map((item, index) => ({
        type: item.content_type || "",
        image1: item.content_type === "text-image" ? item.image1 : item.image1,
        image1_title: item.image1_title || "",
        image1_des: item.image1_des || "",
        image2: item.content_type === "image2" ? item.image_2 : [],
        image2_title: item.image2_title || "",
        image2_des: item.image2_des || "",
        title: item.text_title || item.title || "",
        layout: item.layout || item.layout || "",

        des: item.text_des || item.des || "",
        sort_order: index + 1,
        status: 1
      })) : []
    };

    console.log("Form Data being sent:", formData);
    console.log("Content Data:", contentData);

    fetch(`${import.meta.env.VITE_CMS_URL}api/createservicecontent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          toast.success("Service content created successfully!");
          navigate("/cms/pages/service");
        } else {
          toast.error(data.message || "Failed to create service content");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        toast.error("An error occurred while creating service content");
      })
      .finally(() => {
        e.target.disabled = false;
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
      ratio="3:2"
      type="image"
      cropFile={cropFile}
      setCropFile={(file) => {
        setCropFile(file);
        setActiveImageType("main");
        setShowCropModal(true);
      }}
    />
  ) : managerOpener === 2 ? (
    <Filemanagermain
      file={video}
      fileSetter={setVideo}
      openSetter={setManagerOpener}
      maxFiles={1}
      ratio="16:9"
      type="video"
    />
  ) : managerOpener === 3 ? (
    <Filemanagermain
      file={contentImage1}
      fileSetter={setContentImage1}
      openSetter={setManagerOpener}
      maxFiles={1}
      ratio="3:2"
      type="image"
      cropFile={cropFile}
      setCropFile={(file) => {
        setCropFile(file);
        setActiveImageType("image1");
        setShowCropModal(true);
      }}
    />
  ) : managerOpener === 4 ? (
    <Filemanagermain
      file={contentImage2}
      fileSetter={setContentImage2}
      openSetter={setManagerOpener}
      maxFiles={1}
      ratio="3:2"
      type="image"
      cropFile={cropFile}
      setCropFile={(file) => {
        setCropFile(file);
        setActiveImageType("image2");
        setShowCropModal(true);
      }}
    />
  ) : managerOpener === 5 ? (
    <Filemanagermain
      file={contentImageText}
      fileSetter={setContentImageText}
      openSetter={setManagerOpener}
      maxFiles={1}
      ratio="3:2"
      type="image"
      cropFile={cropFile}
      setCropFile={(file) => {
        setCropFile(file);
        setActiveImageType("imageText");
        setShowCropModal(true);
      }}
    />
  ) :
    managerOpener === 6 ? (
      <Filemanagermain
        file={bannerImage}
        fileSetter={setBannerImage}
        openSetter={setManagerOpener}
        maxFiles={1}
        ratio="16:9"
        type="image"
      />
    ) :
      managerOpener === 7 ? (
        <Filemanagermain
          file={sliderImage}
          fileSetter={setSliderImage}
          openSetter={setManagerOpener}
          maxFiles={1}
          ratio="16:9"
          type="image"
        />)
        :
        managerOpener === 8 ? (
          <Filemanagermain
            file={cardImage}
            fileSetter={setCardImage}
            openSetter={setManagerOpener}
            maxFiles={1}
            ratio="16:9"
            type="image"
          />)
          :
          (
            <>
              <PageHeader
                currentpage="Create Service"
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

                            <div className="box">
                              <div className="box-body space-y-5">
                                <label htmlFor="card_text" className="ti-form-label">
                                  Card Text <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="card_text"
                                  value={values.card_text}
                                  onChange={handleInputChange}
                                  id="card_text"
                                  className="ti-form-input"
                                  placeholder="Enter Card Text"
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

                            <div className="box">
                              <div className="box-header">
                                <h5 className="box-title">Card Image</h5>
                              </div>
                              <div className="box-body space-y-4">
                                <button
                                  type="button"
                                  onClick={() => setManagerOpener(8)}
                                  className="ti-btn ti-btn-outline-primary w-full"
                                >
                                  <i className="ti ti-upload mr-2"></i>
                                  {cardImage.length > 0 ? "Change Image" : "Upload Image"}
                                </button>

                                {cardImage.length > 0 && (
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Preview:</label>
                                    <div className="flex flex-wrap gap-2">
                                      {cardImage.map((img, index) => (
                                        <div key={index} className="relative">
                                          <img
                                            src={`${import.meta.env.VITE_CMS_URL}api/transform/${img}`}
                                            className="h-20 w-24 rounded-sm object-cover border"
                                            alt="Preview"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => setCardImage(prev => prev.filter((_, i) => i !== index))}
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

                            <div className="box">
                              <div className="box-header">
                                <h5 className="box-title">Banner Image</h5>
                              </div>
                              <div className="box-body space-y-4">
                                <button
                                  type="button"
                                  onClick={() => setManagerOpener(6)}
                                  className="ti-btn ti-btn-outline-primary w-full"
                                >
                                  <i className="ti ti-upload mr-2"></i>
                                  {bannerImage.length > 0 ? "Change Image" : "Upload Image"}
                                </button>

                                {bannerImage.length > 0 && (
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Preview:</label>
                                    <div className="flex flex-wrap gap-2">
                                      {bannerImage.map((img, index) => (
                                        <div key={index} className="relative">
                                          <img
                                            src={`${import.meta.env.VITE_CMS_URL}api/transform/${img}`}
                                            className="h-20 w-24 rounded-sm object-cover border"
                                            alt="Preview"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => setBannerImage(prev => prev.filter((_, i) => i !== index))}
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

                            <div className="box">
                              <div className="box-header">
                                <h5 className="box-title">Slider Image</h5>
                              </div>
                              <div className="box-body space-y-4">
                                <button
                                  type="button"
                                  onClick={() => setManagerOpener(7)}
                                  className="ti-btn ti-btn-outline-primary w-full"
                                >
                                  <i className="ti ti-upload mr-2"></i>
                                  {sliderImage.length > 0 ? "Change Image" : "Upload Image"}
                                </button>

                                {sliderImage.length > 0 && (
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Preview:</label>
                                    <div className="flex flex-wrap gap-2">
                                      {sliderImage.map((img, index) => (
                                        <div key={index} className="relative">
                                          <img
                                            src={`${import.meta.env.VITE_CMS_URL}api/transform/${img}`}
                                            className="h-20 w-24 rounded-sm object-cover border"
                                            alt="Preview"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => setSliderImage(prev => prev.filter((_, i) => i !== index))}
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
                                  className="ti-btn ti-btn-outline-secondary w-full hover:bg-[#5A66F1] hover:text-white hover:border-[#5A66F1] transition-colors duration-300"
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
                                    <i className="ti ti-plus mr-2"></i>Create Service
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => navigate("/cms/pages/service")}
                                    className="ti-btn ti-btn-primary"
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

                                    {/* <div className="col-span-12 md:col-span-6">
                                    <label className="ti-form-label text-sm font-medium">
                                      Layout <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      name="layout"
                                      value={currentContent.layout}
                                      onChange={handleContentInputChange}
                                      className="ti-form-input text-sm"
                                      placeholder="Enter Layout title..."
                                    />
                                  </div> */}

                                    <div className="col-span-12 md:col-span-6">
                                      <label className="ti-form-label text-sm font-medium">
                                        Layout <span className="text-red-500">*</span>
                                      </label>

                                      <select
                                        name="layout"
                                        value={currentContent.layout}
                                        onChange={handleContentInputChange}
                                        className="ti-form-input text-sm"
                                      >
                                        <option value="">Select Layout</option>
                                        <option value="layout-1">Layout 1</option>
                                        <option value="layout-2">Layout 2</option>
                                        <option value="layout-3">Layout 3</option>
                                      </select>
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

                                    {/* Image Title */}
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

                                    {/* Image Description */}
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
                            <th>Layout</th>

                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contentData.map((item, index) => (
                            <tr key={item.sc_id}>
                              <td>{index + 1}</td>
                              <td>
                                <span className="badge bg-primary text-white px-2 py-1 rounded text-xs">
                                  {contentTypeOptions.find(opt => opt.value === (item.type || item.content_type))?.label || item.type || item.content_type}
                                </span>
                              </td>
                              <td>
                                {((item.type === "image1" || item.content_type === "image1") && item.image1 && item.image1.length > 0) ? (
                                  <img
                                    src={`${import.meta.env.VITE_CMS_URL}api/transform/${item.image1[0]}`}
                                    className="h-12 w-16 rounded-sm object-cover border cursor-pointer"
                                    alt="Content"
                                    onClick={() => window.open(`${import.meta.env.VITE_CMS_URL}api/transform/${item.image1[0]}`, '_blank')}
                                  />
                                ) : ((item.type === "image2" || item.content_type === "image2") && item.image1 && item.image1.length > 0) ? (
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
                                ) : ((item.type === "text-image" || item.content_type === "text-image") && item.image1 && item.image1.length > 0) ? (
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
                                  {(item.type === "image1" || item.content_type === "image1") ? item.image1_title :
                                    (item.type === "image2" || item.content_type === "image2") ? item.image1_title :
                                      (item.type === "text-image" || item.content_type === "text-image") ? item.text_title :
                                        "No title"}
                                </div>
                              </td>
                              <td>
                                <div className="max-w-40 truncate text-sm">
                                  {(item.type === "image1" || item.content_type === "image1") ? item.image1_des :
                                    (item.type === "image2" || item.content_type === "image2") ? item.image1_des :
                                      (item.type === "text-image" || item.content_type === "text-image") ? item.text_des :
                                        "No description"}
                                </div>
                              </td>
                              <td>
                                <div className="max-w-40 truncate text-sm">
                                  {(item.type === "image1" || item.content_type === "image1") ? item.layout :
                                    (item.type === "image2" || item.content_type === "image2") ? item.layout :
                                      (item.type === "text-image" || item.content_type === "text-image") ? item.layout :
                                        "No layout"}
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
                                No content added yet. Click "Add New Content" to start.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Content Management Submit Button */}
                  {contentData.length > 0 && (
                    <div className="box-footer bg-transparent">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={handleContentManagementSubmit}
                          className="ti-btn ti-btn-primary"
                          disabled={contentSubmitting}
                        >
                          {contentSubmitting ? (
                            <>
                              <i className="ti ti-loader animate-spin mr-2"></i>
                              Saving...
                            </>
                          ) : (
                            'Submit'
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Crop Modal */}
              {showCropModal && (
                <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out fixed top-0 left-0 z-[80] w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="ti-modal-content max-w-4xl w-full mx-4">
                    <div className="p-5">
                      <div className="space-y-5">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Crop Image</h3>
                          <button
                            onClick={handleCropCancel}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <i className="ti ti-x text-xl"></i>
                          </button>
                        </div>

                        {cropFile && (
                          <div className="flex justify-center">
                            <ReactCrop
                              crop={crop}
                              keepSelection
                              aspect={3 / 2}
                              minWidth={170}
                              onChange={(crop, percentCrop) => setCrop(percentCrop)}
                            >
                              <img
                                ref={imageRef}
                                src={`${import.meta.env.VITE_CMS_URL}${cropFile}`}
                                alt="Crop preview"
                                style={{ maxHeight: "70vh", maxWidth: "100%" }}
                                onLoad={onImageLoad}
                              />
                            </ReactCrop>
                          </div>
                        )}

                        <canvas
                          ref={previewCanvasRef}
                          style={{ display: "none" }}
                        />

                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={handleCropCancel}
                            className="ti-btn ti-btn-secondary"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleCropSave}
                            className="ti-btn ti-btn-primary"
                          >
                            Save Crop
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          );
};

export default ServiceCreate;
