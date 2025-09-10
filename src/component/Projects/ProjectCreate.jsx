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
  const [addNewSpecificationField, setAddNewSpecificationField] =
    useState(false);
  const [addNewSpecificationFieldData, setAddNewSpecificationFieldData] =
    useState([]);
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

  // Enhanced content management states matching database structure
  const [contentData, setContentData] = useState([]);
  const [currentContent, setCurrentContent] = useState({
    layoutType: "",
    layout_label: "",
    img1: [],
    img2: [],
    big_img: [],
    text: "",
    sort_order: 1,
    status: 1
  });
  const [editingContentIndex, setEditingContentIndex] = useState(null);
  const [isEditingContent, setIsEditingContent] = useState(false);

  // Image states for different content types
  const [contentImg1, setContentImg1] = useState([]);
  const [contentImg2, setContentImg2] = useState([]);
  const [contentBigImg, setContentBigImg] = useState([]);

  // Layout types matching your database
  const layoutTypes = [
    { value: 1, label: "image-with-text", name: "Image With Text" },
    { value: 2, label: "double-image", name: "Double Image" },
    { value: 3, label: "fullwidth-image", name: "Full Width Image" },
    { value: 4, label: "text-only", name: "Text Only" },
    { value: 5, label: "gallery", name: "Gallery" }
  ];

  const [selectedLayoutType, setSelectedLayoutType] = useState(null);

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
      const res = await fetch(
        `${import.meta.env.VITE_CMS_URL}api/getallcontain`
      );
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
    if (!values.name) {
      toast.error("Please fill the project name field!");
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
      content_data: contentData.length > 0 ? JSON.stringify(contentData) : []
    };

    try {
      console.log("Creating project with data:", data);
      
      const res = await fetch(
        `${import.meta.env.VITE_CMS_URL}api/createproject`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(data),
        }
      );

      // Check if response is ok
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      console.log("Full Project creation result:", result);
      
      if (result.status === true || result.success === true) {
        let projectId = null;
        
        // Try different ways to get the project ID from the response
        // Check all possible response formats
        if (result.project_id) {
          projectId = result.project_id;
        } else if (result.data && result.data.insertId) {
          projectId = result.data.insertId;
        } else if (result.data && result.data.project_id) {
          projectId = result.data.project_id;
        } else if (result.insertId) {
          projectId = result.insertId;
        } else if (result.id) {
          projectId = result.id;
        } else if (result.data && result.data.id) {
          projectId = result.data.id;
        } else if (result.lastInsertId) {
          projectId = result.lastInsertId;
        } else if (result.data && result.data.lastInsertId) {
          projectId = result.data.lastInsertId;
        }
        
        console.log("Extracted project ID:", projectId);
        console.log("Content data to create:", contentData);
        
        if (projectId && contentData.length > 0) {
          console.log(`Creating ${contentData.length} content items for project ID: ${projectId}`);
          try {
            await createProjectContent(projectId);
            toast.success("Project and Content Created Successfully");
          } catch (contentError) {
            console.error("Content creation failed:", contentError);
            toast.warning("Project created successfully, but some content failed to save. Please edit the project to add content.");
          }
        } else if (projectId) {
          toast.success("Project Created Successfully");
        } else {
          console.error("Could not extract project ID from response:", result);
          toast.warning("Project may have been created but content could not be linked. Please check the project list.");
        }
        
        navigate("/cms/projects/list");
      } else {
        console.error("Project creation failed:", result);
        toast.error(result.message || result.error || "Failed to create project");
      }
    } catch (err) {
      console.error("Project creation error:", err);
      if (err.message.includes('Failed to fetch')) {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error("Error occurred while creating project: " + err.message);
      }
    }
  };

  // Function to create project content with p_id (let pc_id auto-increment)
  const createProjectContent = async (projectId) => {
    try {
      const contentPromises = contentData.map(async (content, index) => {
        const contentPayload = {
          p_id: projectId, // Foreign key to project table
          layoutType: content.layoutType,
          layout_label: content.layout_label,
          img1: content.img1, // Already JSON stringified in handleAddContent
          img2: content.img2 || null,
          text: content.text || null,
          big_img: content.big_img || "",
          sort_order: index + 1,
          status: 1
        };

        console.log("Creating content item with payload:", contentPayload);

        const response = await fetch(
          `${import.meta.env.VITE_CMS_URL}api/createcontain`,
          {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify(contentPayload),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(`Content creation result for item ${index + 1}:`, result);
        if (result.data && result.data.pc_id) {
          console.log(`✅ Content created with auto-generated pc_id: ${result.data.pc_id}`);
        } else if (result.pc_id) {
          console.log(`✅ Content created with auto-generated pc_id: ${result.pc_id}`);
        }
        return result;
      });

      const results = await Promise.all(contentPromises);
      const failedCreations = results.filter(result => !result.status && !result.success);
      
      if (failedCreations.length > 0) {
        console.warn("Some content items failed to create:", failedCreations);
        throw new Error(`${failedCreations.length} content items failed to create`);
      } else {
        console.log("All content items created successfully");
        
        // Show the auto-generated pc_id values
        const pcIds = results.map(result => {
          if (result.data && result.data.pc_id) {
            return result.data.pc_id;
          } else if (result.pc_id) {
            return result.pc_id;
          }
          return null;
        }).filter(id => id !== null);
        
        console.log("Auto-generated pc_id values:", pcIds);
        toast.success(`${contentData.length} content items created successfully with pc_id: ${pcIds.join(', ')}`);
      }
    } catch (error) {
      console.error("Error creating project content:", error);
      throw error; // Re-throw to be caught by the calling function
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
    toast.success("Specification deleted successfully");
  };

  // Content management functions
  const handleLayoutTypeChange = (selectedOption) => {
    console.log("Layout type changed:", selectedOption);
    setSelectedLayoutType(selectedOption);
    setCurrentContent(prev => ({
      ...prev,
      layoutType: selectedOption.value,
      layout_label: selectedOption.label
    }));
    
    // Reset images when changing layout type
    setContentImg1([]);
    setContentImg2([]);
    setContentBigImg([]);
  };

  const handleAddContent = () => {
    console.log("=== handleAddContent called ===");
    console.log("selectedLayoutType:", selectedLayoutType);
    console.log("currentContent:", currentContent);
    console.log("contentImg1:", contentImg1);
    console.log("contentImg2:", contentImg2);
    console.log("contentBigImg:", contentBigImg);

    if (!selectedLayoutType) {
      toast.error("Please select a layout type");
      return;
    }

    // Validation based on layout type
    const layoutLabel = selectedLayoutType.label;
    let isValid = true;
    let errorMessage = "";

    switch (layoutLabel) {
      case "image-with-text":
        if (contentImg1.length === 0) {
          isValid = false;
          errorMessage = "Image is required for Image with Text layout";
        } else if (!currentContent.text || !currentContent.text.trim()) {
          isValid = false;
          errorMessage = "Text is required for Image with Text layout";
        }
        break;
      case "double-image":
        if (contentImg1.length === 0 || contentImg2.length === 0) {
          isValid = false;
          errorMessage = "Both images are required for Double Image layout";
        }
        break;
      case "fullwidth-image":
        if (contentBigImg.length === 0) {
          isValid = false;
          errorMessage = "Big image is required for Full Width Image layout";
        }
        break;
      case "text-only":
        if (!currentContent.text || !currentContent.text.trim()) {
          isValid = false;
          errorMessage = "Text is required for Text Only layout";
        }
        break;
      case "gallery":
        if (contentImg1.length === 0) {
          isValid = false;
          errorMessage = "At least one image is required for Gallery layout";
        }
        break;
      default:
        isValid = false;
        errorMessage = "Invalid layout type selected";
    }

    if (!isValid) {
      toast.error(errorMessage);
      return;
    }

    const newContentItem = {
      id: Date.now(),
      layoutType: selectedLayoutType.value,
      layout_label: selectedLayoutType.label,
      img1: JSON.stringify(contentImg1),
      img2: contentImg2.length > 0 ? JSON.stringify(contentImg2) : null,
      big_img: contentBigImg.length > 0 ? JSON.stringify(contentBigImg) : "",
      text: currentContent.text || null,
      sort_order: contentData.length + 1,
      status: 1,
      created_at: new Date().toISOString()
    };

    console.log("newContentItem:", newContentItem);

    if (isEditingContent && editingContentIndex !== null) {
      // Update existing content
      const updatedData = [...contentData];
      updatedData[editingContentIndex] = { 
        ...newContentItem, 
        id: contentData[editingContentIndex].id,
        updated_at: new Date().toISOString()
      };
      setContentData(updatedData);
      toast.success("Content updated successfully");
    } else {
      // Add new content
      setContentData(prev => {
        const newData = [...prev, newContentItem];
        console.log("New contentData:", newData);
        return newData;
      });
      toast.success("Content added successfully");
    }

    // Reset form
    resetContentForm();
  };

  const resetContentForm = () => {
    console.log("=== resetContentForm called ===");
    
    setSelectedLayoutType(null);
    setCurrentContent({
      layoutType: "",
      layout_label: "",
      img1: [],
      img2: [],
      big_img: [],
      text: "",
      sort_order: 1,
      status: 1
    });
    setContentImg1([]);
    setContentImg2([]);
    setContentBigImg([]);
    setIsEditingContent(false);
    setEditingContentIndex(null);
    setAddNewSpecificationField(false);
    
    console.log("Form reset complete");
  };

  const handleEditContent = (index) => {
    console.log("=== handleEditContent called ===");
    console.log("Editing index:", index);
    
    const item = contentData[index];
    console.log("Item to edit:", item);
    
    // Find and set the layout type
    const layoutType = layoutTypes.find(lt => lt.value === item.layoutType);
    console.log("Found layout type:", layoutType);
    
    setSelectedLayoutType(layoutType);
    setCurrentContent({
      layoutType: item.layoutType,
      layout_label: item.layout_label,
      text: item.text || "",
      sort_order: item.sort_order,
      status: item.status
    });
    
    // Parse and set images
    try {
      const img1Data = item.img1 ? JSON.parse(item.img1) : [];
      const img2Data = item.img2 ? JSON.parse(item.img2) : [];
      const bigImgData = item.big_img ? JSON.parse(item.big_img) : [];
      
      console.log("Setting images:", { img1Data, img2Data, bigImgData });
      
      setContentImg1(img1Data);
      setContentImg2(img2Data);
      setContentBigImg(bigImgData);
    } catch (e) {
      console.error("Error parsing images:", e);
      setContentImg1([]);
      setContentImg2([]);
      setContentBigImg([]);
    }
    
    setEditingContentIndex(index);
    setIsEditingContent(true);
    setAddNewSpecificationField(true);
    
    console.log("Edit mode activated");
  };

  const handleDeleteContent = (index) => {
    console.log("=== handleDeleteContent called ===");
    console.log("Deleting index:", index);
    
    if (window.confirm("Are you sure you want to delete this content?")) {
      const updatedData = contentData.filter((_, i) => i !== index);
      setContentData(updatedData);
      toast.success("Content deleted successfully");
      console.log("Content deleted, new data:", updatedData);
    }
  };

  const handleMoveContent = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= contentData.length) {
      return; // Can't move beyond boundaries
    }

    // Create a copy of the array and swap items
    const updatedContent = [...contentData];
    [updatedContent[index], updatedContent[newIndex]] = [updatedContent[newIndex], updatedContent[index]];
    
    // Update sort_order for both items
    updatedContent[index].sort_order = index + 1;
    updatedContent[newIndex].sort_order = newIndex + 1;
    
    // Update local state
    setContentData(updatedContent);
    toast.success(`Content moved ${direction} successfully`);
  };

  // Update currentContent when images change
  useEffect(() => {
    setCurrentContent(prev => ({
      ...prev,
      img1: contentImg1,
      img2: contentImg2,
      big_img: contentBigImg
    }));
  }, [contentImg1, contentImg2, contentBigImg]);

  // Debug contentData changes
  useEffect(() => {
    console.log("contentData updated:", contentData);
  }, [contentData]);

  return (
    <>
      {(managerOpener === 1 || managerOpener === 3 || managerOpener === 5 || managerOpener === 6 || managerOpener === 7 || managerOpener === 8 || managerOpener === 9) ? (
        <>
          {managerOpener === 1 && (
            <Filemanagermain
              file={image}
              ratio={1920 / 780}
              fileSetter={setImage}
              openSetter={setManagerOpener}
              type="image"
            />
          )}
          {managerOpener === 3 && (
            <Filemanagermain
              file={listi}
              ratio={410 / 505}
              fileSetter={setListi}
              openSetter={setManagerOpener}
              type="image"
            />
          )}
          {managerOpener === 5 && (
            <Filemanagermain
              file={files}
              fileSetter={setFiles}
              openSetter={setManagerOpener}
              ratio={1}
              type="image"
            />
          )}
          {managerOpener === 6 && (
            <Filemanagermain
              file={video}
              fileSetter={setVideo}
              openSetter={setManagerOpener}
              // type="video" // Uncomment if your file manager supports video filtering
            />
          )}
          {/* Content Image Managers */}
          {managerOpener === 7 && (
            <Filemanagermain
              file={contentImg1}
              fileSetter={setContentImg1}
              openSetter={setManagerOpener}
              maxFiles={selectedLayoutType?.label === "gallery" ? 10 : 1}
              ratio={1 / 1}
              type="image"
            />
          )}
          {managerOpener === 8 && (
            <Filemanagermain
              file={contentImg2}
              fileSetter={setContentImg2}
              openSetter={setManagerOpener}
              maxFiles={1}
              ratio={16 / 9}
              type="image"
            />
          )}
          {managerOpener === 9 && (
            <Filemanagermain
              file={contentBigImg}
              fileSetter={setContentBigImg}
              openSetter={setManagerOpener}
              maxFiles={1}
              ratio={21 / 9}
              type="image"
            />
          )}
          {managerOpener === 101 && (
            <Filemanagermain
              file={JSON.parse(newSpec.img1)}
              fileSetter={(files) => {
                setNewSpec((prev) => ({ ...prev, img1: JSON.stringify(files) }));
                setManagerOpener(false);
              }}
              openSetter={setManagerOpener}
              ratio={1}
              type="image"
            />
          )}
          {managerOpener === 102 && (
            <Filemanagermain
              file={JSON.parse(newSpec.img2)}
              fileSetter={(files) => {
                setNewSpec((prev) => ({ ...prev, img2: JSON.stringify(files) }));
                setManagerOpener(false);
              }}
              openSetter={setManagerOpener}
              ratio={1}
              type="image"
            />
          )}
        </>
      ) : (
        <div>
          <PageHeader
            currentpage="Create New Project"
            activepage="Pages"
            mainpage="Create New Project"
          />
          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-12 xxl:col-span-8">
              {/* Name */}
              <div className="box">
                <div className="box-body space-y-5">
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

              {/* Video */}
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
                        src={`${
                          import.meta.env.VITE_CMS_URL
                        }api/transform/${img}`}
                        className="col-span-4 h-32 rounded-t-sm"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Images */}
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
                        src={`${
                          import.meta.env.VITE_CMS_URL
                        }api/transform/${img}`}
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

              {/* Meta Fields */}
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
                  <label className="ti-form-label">
                    Project Meta Description
                  </label>
                  <input
                    type="text"
                    name="meta_des"
                    value={values.meta_des}
                    onChange={handleInputChange}
                    className="ti-form-input"
                  />
                </div>
              </div>

              {/* Content Select */}
              {/* <div className="box">
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
              </div> */}
            </div>
          </div>

          {/* Specification Table */}
          {/* <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <div className="box xl:overflow-auto">
                <div className="box-header flex justify-between">
                  <h5 className="box-title">Add Content</h5>
                  <button
                    type="button"
                    onClick={() => setAddNewSpecificationField(true)}
                    className="text-primary"
                  >
                    Add new field +
                  </button>
                </div>
                <div className="overflow-auto table-bordered">
                  <div className="app-container">
                    <table className="ti-custom-table ti-custom-table-head">
                      <thead className="border">
                        <tr>
                          <th className="w-1">#</th>
                          <th>Layout label</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {addNewSpecificationFieldData.map((row, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <div>
                                {row.img?.map((img, i) => (
                                  <img
                                    key={i}
                                    src={`${import.meta.env.VITE_CMS_URL}api/transform/${img}`}
                                    className="col-span-4 h-12 rounded-t-sm"
                                  />
                                ))}
                              </div>
                            </td>
                            <td>{row.title}</td>
                            <td className="flex justify-start">
                              <button
                                type="button"
                                onClick={() => handleDeleteClick(index)}
                                className="ti-btn ti-btn-soft-danger"
                              >
                                <i className="ti ti-trash"></i> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Enhanced Content Management System */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <div className="box xl:overflow-auto">
                <div className="box-header flex justify-between items-center">
                  <h5 className="box-title">Content Management</h5>
                  <button
                    type="button"
                    onClick={() => {
                      console.log("Add Content button clicked");
                      setAddNewSpecificationField(true);
                      // Don't reset form, just open it
                      setIsEditingContent(false);
                      setEditingContentIndex(null);
                    }}
                    className="ti-btn ti-btn-primary"
                  >
                    <i className="ti ti-plus mr-2"></i>Add Content
                  </button>
                </div>

                {/* Content Form */}
                {addNewSpecificationField && (
                  <div className="box-body border-b">
                    <div className="grid grid-cols-12 gap-4">
                      {/* Layout Type Selection */}
                      <div className="col-span-12 md:col-span-6 lg:col-span-3">
                        <label className="ti-form-label text-sm font-medium">
                          Layout Type <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={selectedLayoutType}
                          onChange={handleLayoutTypeChange}
                          options={layoutTypes}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.value}
                          placeholder="Select layout type..."
                          className="text-sm"
                        />
                      </div>

                      {/* Dynamic Content Fields based on Layout Type */}
                      {selectedLayoutType && (
                        <>
                          {/* Image 1 - For image-with-text, double-image, gallery */}
                          {(selectedLayoutType.label === "image-with-text" || selectedLayoutType.label === "double-image" || selectedLayoutType.label === "gallery") && (
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                              <label className="ti-form-label text-sm font-medium">
                                {selectedLayoutType.label === "gallery" ? "Gallery Images" : "Image 1"} <span className="text-red-500">*</span>
                              </label>
                              <div className="space-y-2">
                                <button
                                  type="button"
                                  onClick={() => setManagerOpener(7)}
                                  className="ti-btn ti-btn-outline-primary ti-btn-sm w-full"
                                >
                                  {contentImg1.length > 0 ? 
                                    (selectedLayoutType.label === "gallery" ? `Change Images (${contentImg1.length})` : "Change Image") : 
                                    (selectedLayoutType.label === "gallery" ? "Select Images" : "Select Image")
                                  }
                                </button>
                                {contentImg1.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {contentImg1.slice(0, 3).map((img, index) => (
                                      <div key={index} className="relative inline-block">
                                        <img
                                          src={`${import.meta.env.VITE_CMS_URL}api/transform/${img}`}
                                          className="h-12 w-12 rounded-sm object-cover border"
                                          alt={`Preview ${index + 1}`}
                                        />
                                      </div>
                                    ))}
                                    {contentImg1.length > 3 && (
                                      <div className="h-12 w-12 bg-gray-200 rounded-sm flex items-center justify-center text-xs">
                                        +{contentImg1.length - 3}
                                      </div>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => setContentImg1([])}
                                      className="h-12 w-12 bg-red-500 text-white rounded-sm flex items-center justify-center text-xs hover:bg-red-600"
                                      title="Remove all images"
                                    >
                                      ×
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Image 2 - For double-image only */}
                          {selectedLayoutType.label === "double-image" && (
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                              <label className="ti-form-label text-sm font-medium">
                                Image 2 <span className="text-red-500">*</span>
                              </label>
                              <div className="space-y-2">
                                <button
                                  type="button"
                                  onClick={() => setManagerOpener(8)}
                                  className="ti-btn ti-btn-outline-primary ti-btn-sm w-full"
                                >
                                  {contentImg2.length > 0 ? "Change Image 2" : "Select Image 2"}
                                </button>
                                {contentImg2.length > 0 && (
                                  <div className="relative inline-block">
                                    <img
                                      src={`${import.meta.env.VITE_CMS_URL}api/transform/${contentImg2[0]}`}
                                      className="h-16 w-20 rounded-sm object-cover border"
                                      alt="Preview"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setContentImg2([])}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                    >
                                      ×
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Big Image - For fullwidth-image */}
                          {selectedLayoutType.label === "fullwidth-image" && (
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                              <label className="ti-form-label text-sm font-medium">
                                Full Width Image <span className="text-red-500">*</span>
                              </label>
                              <div className="space-y-2">
                                <button
                                  type="button"
                                  onClick={() => setManagerOpener(9)}
                                  className="ti-btn ti-btn-outline-primary ti-btn-sm w-full"
                                >
                                  {contentBigImg.length > 0 ? "Change Big Image" : "Select Big Image"}
                                </button>
                                {contentBigImg.length > 0 && (
                                  <div className="relative inline-block">
                                    <img
                                      src={`${import.meta.env.VITE_CMS_URL}api/transform/${contentBigImg[0]}`}
                                      className="h-16 w-24 rounded-sm object-cover border"
                                      alt="Preview"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setContentBigImg([])}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                    >
                                      ×
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Text Content */}
                          {(selectedLayoutType.label === "image-with-text" || selectedLayoutType.label === "text-only") && (
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                              <label className="ti-form-label text-sm font-medium">
                                Text Content <span className="text-red-500">*</span>
                              </label>
                              <textarea
                                className="ti-form-input text-sm"
                                placeholder="Enter text content..."
                                rows="4"
                                value={currentContent.text || ""}
                                onChange={(e) => {
                                  console.log("Text content changed:", e.target.value);
                                  setCurrentContent((prev) => ({
                                    ...prev,
                                    text: e.target.value,
                                  }));
                                }}
                              />
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="col-span-12 lg:col-span-3 flex items-end">
                            <div className="space-y-2 w-full">
                              <button
                                type="button"
                                onClick={() => {
                                  console.log("Add/Update Content button clicked");
                                  console.log("Current state before handleAddContent:");
                                  console.log("- selectedLayoutType:", selectedLayoutType);
                                  console.log("- currentContent:", currentContent);
                                  console.log("- contentImg1:", contentImg1);
                                  console.log("- contentImg2:", contentImg2);
                                  console.log("- contentBigImg:", contentBigImg);
                                  handleAddContent();
                                }}
                                className="ti-btn ti-btn-primary ti-btn-sm w-full"
                              >
                                {isEditingContent ? "Update Content" : "Add Content"}
                              </button>
                              <button
                                type="button"
                                onClick={resetContentForm}
                                className="ti-btn ti-btn-outline-secondary ti-btn-sm w-full"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </>
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
                        <th>Layout Type</th>
                        <th>Image 1</th>
                        <th>Image 2</th>
                        <th>Big Image</th>
                        <th>Text Content</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contentData.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>
                            <span className="badge bg-primary text-white px-2 py-1 rounded text-xs">
                              {layoutTypes.find(lt => lt.value === item.layoutType)?.name || item.layout_label}
                            </span>
                          </td>
                          <td>
                            {item.img1 && JSON.parse(item.img1).length > 0 ? (
                              <div className="relative group">
                                <img
                                  src={`${import.meta.env.VITE_CMS_URL}api/transform/${JSON.parse(item.img1)[0]}`}
                                  className="h-12 w-16 rounded-sm object-cover border cursor-pointer"
                                  alt="Image 1"
                                  onClick={() => window.open(`${import.meta.env.VITE_CMS_URL}api/transform/${JSON.parse(item.img1)[0]}`, '_blank')}
                                />
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">No image</span>
                            )}
                          </td>
                          <td>
                            {item.img2 && JSON.parse(item.img2).length > 0 ? (
                              <div className="relative group">
                                <img
                                  src={`${import.meta.env.VITE_CMS_URL}api/transform/${JSON.parse(item.img2)[0]}`}
                                  className="h-12 w-16 rounded-sm object-cover border cursor-pointer"
                                  alt="Image 2"
                                  onClick={() => window.open(`${import.meta.env.VITE_CMS_URL}api/transform/${JSON.parse(item.img2)[0]}`, '_blank')}
                                />
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">N/A</span>
                            )}
                          </td>
                          <td>
                            {item.big_img && JSON.parse(item.big_img).length > 0 ? (
                              <div className="relative group">
                                <img
                                  src={`${import.meta.env.VITE_CMS_URL}api/transform/${JSON.parse(item.big_img)[0]}`}
                                  className="h-12 w-20 rounded-sm object-cover border cursor-pointer"
                                  alt="Big Image"
                                  onClick={() => window.open(`${import.meta.env.VITE_CMS_URL}api/transform/${JSON.parse(item.big_img)[0]}`, '_blank')}
                                />
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">N/A</span>
                            )}
                          </td>
                          <td>
                            <div className="max-w-32 truncate text-sm">
                              {item.text || "No text"}
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
                      {/* {contentData.length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center text-gray-500 py-8">
                            No content added yet. Click "Add Content" to get started.
                          </td>
                        </tr>
                      )} */}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="box-footer bg-gray-50">
                  <div className="flex justify-between items-center">
                    {/* <div className="text-sm text-gray-600">
                      Total Content Items: <span className="font-semibold text-primary">{contentData.length}</span>
                    </div>
                    {contentData.length > 0 && (
                      <div className="text-xs text-gray-500">
                        Ready for submission
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* Submit */}
          <div className="grid grid-cols-12 mt-Q">
            <div className="col-span-12">
              <div className="box">
                <div className="box-footer bg-transparent">
                  <div className="flex items-center justify-end gap-2">
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
      )}
    </>
  );
};

export default ProjectCreate;
