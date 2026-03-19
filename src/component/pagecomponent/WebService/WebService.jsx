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

const WebPreProjects = () => {
  const navigate = useNavigate();

  // Hero section state
  const [values, setValues] = useState({
    hero_image: [],
    hero_title: "",
    hero_des: "",
    meta_title: "",
    meta_description: "",
    title: "",
    slug: "",
    short_description: "",
    description: "",
    sort_order: "",
    status: 1,
  });

  // Content management state
  const [contentData, setContentData] = useState([]);
  const [showContentForm, setShowContentForm] = useState(false);
  const [currentContent, setCurrentContent] = useState({
    title: "",
    des: "",
  });
  const [contentImage, setContentImage] = useState([]);
  const [editingContentIndex, setEditingContentIndex] = useState(null);

  // File manager states
  const [heroImage, setHeroImage] = useState([]);
  const [managerOpener, setManagerOpener] = useState(0);

  useEffect(() => {
    fetchHeroData();
    fetchContentData();
  }, []);

  const fetchHeroData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallwebpreprojects`)
      .then((res) => res.json())
      .then((data) => {
        const resData = data.data[0] || {};
        const heroImageData = resData.hero_image
          ? JSON.parse(resData.hero_image)
          : [];
        setHeroImage(heroImageData);
        setValues({
          ...resData,
          hero_image: heroImageData,
        });
      })
      .catch((err) => toast.error(err.message));
  };

  const fetchContentData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallservicecontent`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.data) {
          const formattedData = data.data.map((item) => ({
            ...item,
            image: item.image ? JSON.parse(item.image) : [],
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
    setCurrentContent((prev) => ({ ...prev, image: contentImage }));
  }, [contentImage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "hero_title") {
        newState.slug = value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/\?/g, "-");
      }
      return newState;
    });
  };

  const handleHeroSubmit = () => {
    const data = {
      ...values,
      hero_image: JSON.stringify(heroImage),
    };

    fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidwebpreprojects/1`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("Service hero section updated successfully");
      })
      .catch((err) => toast.error("Error: " + err.message));
  };

  // Content management functions
  const handleContentInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddContent = () => {
    if (!contentImage.length) {
      toast.error("Please select an image");
      return;
    }

    // Prepare payload for API
    const contentPayload = {
      image: contentImage,
      title: currentContent.title || "",
      des: currentContent.des || "",
      status: 1,
    };

    const apiUrl =
      editingContentIndex !== null && contentData[editingContentIndex]?.sc_id
        ? `${import.meta.env.VITE_CMS_URL}api/updatebyidservicecontent/${contentData[editingContentIndex].sc_id
        }`
        : `${import.meta.env.VITE_CMS_URL}api/createservicecontent`;

    const method =
      editingContentIndex !== null && contentData[editingContentIndex]?.sc_id
        ? "PUT"
        : "POST";

    fetch(apiUrl, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contentPayload),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status) {
          toast.success(
            editingContentIndex !== null
              ? "Content updated successfully"
              : "Content added successfully"
          );
          fetchContentData(); // Refresh data
          resetContentForm();
        } else {
          toast.error(
            result.message || result.error || "Failed to save content"
          );
        }
      })
      .catch((err) => {
        console.error("Content save error:", err);
        toast.error("Failed to save content");
      });
  };

  const resetContentForm = () => {
    setCurrentContent({
      title: "",
      des: "",
    });
    setContentImage([]);
    setShowContentForm(false);
    setEditingContentIndex(null);
  };

  const handleEditContent = (index) => {
    const content = contentData[index];
    setCurrentContent({
      title: content.title || "",
      des: content.des || "",
    });

    const imageData = content.image || [];
    setContentImage(imageData);

    setEditingContentIndex(index);
    setShowContentForm(true);
  };

  const handleDeleteContent = (index) => {
    const content = contentData[index];
    if (window.confirm("Are you sure you want to delete this content?")) {
      if (content.sc_id) {
        fetch(
          `${import.meta.env.VITE_CMS_URL}api/deletebyidservicecontent/${content.sc_id
          }`,
          {
            method: "DELETE",
          }
        )
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
      }
    }
  };

  const handleMoveContent = async (index, direction) => {
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= contentData.length) {
      return; // Can't move beyond boundaries
    }

    // Create a copy of the array and swap items
    const updatedContent = [...contentData];
    [updatedContent[index], updatedContent[newIndex]] = [
      updatedContent[newIndex],
      updatedContent[index],
    ];

    // Update local state immediately for UI feedback
    setContentData(updatedContent);

    // Update sort_order in database using the correct API endpoint
    try {
      const item1 = updatedContent[index];
      const item2 = updatedContent[newIndex];

      if (item1.sc_id && item2.sc_id) {
        // Update sort_order for both items using the correct API endpoint
        const promises = [
          fetch(
            `${import.meta.env.VITE_CMS_URL}api/updateservicecontentorder`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                sc_id: item1.sc_id,
                sort_order: index + 1, // New position for first item
              }),
            }
          ),
          fetch(
            `${import.meta.env.VITE_CMS_URL}api/updateservicecontentorder`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                sc_id: item2.sc_id,
                sort_order: newIndex + 1, // New position for second item
              }),
            }
          ),
        ];

        const results = await Promise.all(promises);
        const allSuccessful = results.every((response) => response.ok);

        if (allSuccessful) {
          toast.success(`Content moved ${direction} successfully`);
          // Update the sort_order in local state to match database
          const finalUpdatedContent = updatedContent.map((item, idx) => ({
            ...item,
            sort_order: idx + 1,
          }));
          setContentData(finalUpdatedContent);
        } else {
          throw new Error("Failed to update database");
        }
      } else {
        toast.success(`Content moved ${direction} successfully (local only)`);
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
        {managerOpener === 1 ? (
          <Filemanagermain
            file={heroImage}
            fileSetter={setHeroImage}
            openSetter={setManagerOpener}
            maxFiles={1}
            ratio={16 / 9}
            type="image"
          />
        ) : managerOpener === 2 ? (
          <Filemanagermain
            file={contentImage}
            fileSetter={setContentImage}
            openSetter={setManagerOpener}
            maxFiles={1}
            ratio={16 / 9}
            type="image"
          />
        ) : (
          <div>
            <PageHeader
              currentpage="Web Service"
              activepage="Pages"
              mainpage="Web Service"
            />

            {/* Hero Section */}
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-12 xxl:col-span-8">
                {/* Hero Image */}
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Hero Image</h5>
                  </div>
                  <div className="box-body">
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setManagerOpener(1)}
className="ti-btn ti-btn-outline-primary w-full text-center"
                      >
                        {heroImage.length > 0
                          ? "Change Hero Image"
                          : "Upload Hero Image"}
                      </button>
                      {heroImage.length > 0 && (
                        <div className="space-y-3">
                          {heroImage.map((img, index) => (
                            <div key={index} className="relative w-full">
                              <img
                                src={`${import.meta.env.VITE_CMS_URL}api/transform/${img}`}
                                className="w-full h-32 object-cover rounded-md border"
                                alt="Hero"
                              />
                              <button
                                type="button"
                                onClick={() => setHeroImage([])}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>
                </div>

                {/* Hero Title */}
                <div className="box">
                  <div className="box-body space-y-5">
                    <label htmlFor="hero_title" className="ti-form-label">
                      Hero Title
                    </label>
                    <input
                      type="text"
                      name="hero_title"
                      value={values.hero_title}
                      onChange={handleInputChange}
                      id="hero_title"
                      className="ti-form-input"
                      placeholder="Enter Hero Title"
                    />
                  </div>
                </div>

                {/* Hero Description */}
                <div className="box">
                  <div className="box-body space-y-5">
                    <label htmlFor="hero_des" className="ti-form-label">
                      Hero Description
                    </label>
                    <textarea
                      value={values.hero_des}
                      onChange={handleInputChange}
                      name="hero_des"
                      id="hero_des"
                      className="ti-form-input"
                      rows="3"
                      placeholder="Enter Hero Description"
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
                    <label htmlFor="meta_description" className="ti-form-label">
                      Meta Description
                    </label>
                    <textarea
                      value={values.meta_description}
                      onChange={handleInputChange}
                      name="meta_description"
                      id="meta_description"
                      className="ti-form-input"
                      rows="3"
                      placeholder="Enter Meta Description"
                    />
                  </div>
                </div>
              </div>

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
                      disabled
                      id="slug"
                      className="ti-form-input"
                      placeholder="Auto-generated slug"
                    />
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
                      value={{
                        value: values.status,
                        label: values.status === 1 ? "Enable" : "Disable",
                      }}
                      classNamePrefix="react-select"
                      options={[
                        { value: 1, label: "Enable" },
                        { value: 0, label: "Disable" },
                      ]}
                      onChange={(val) =>
                        setValues((prev) => ({
                          ...prev,
                          status: val.value,
                        }))
                      }
                      placeholder="Select status"
                    />
                  </div>
                  <div className="box-footer text-end bg-transparent mt-4">
                    <button
                      type="button"
                      onClick={handleHeroSubmit}
                      className="ti-btn ti-btn-primary"
                    >
                      Submit
                    </button>
                  </div>
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
                      onClick={() => navigate("/cms/pages/service/create")}
                      className="ti-btn ti-btn-primary"
                    >
                      <i className="ti ti-plus mr-2"></i>Add New Content
                    </button>
                  </div>

                  {/* Content Form */}
                  {showContentForm && (
                    <div className="box-body border-b">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12">
                          <div className="grid grid-cols-12 gap-4">
                            {/* Title */}
                            <div className="col-span-12">
                              <label className="ti-form-label text-sm font-medium">
                                Title
                              </label>
                              <input
                                type="text"
                                name="title"
                                value={currentContent.title}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter title..."
                              />
                            </div>

                            {/* Description */}
                            <div className="col-span-12">
                              <label className="ti-form-label text-sm font-medium">
                                Description
                              </label>
                              <textarea
                                name="des"
                                value={currentContent.des}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter description..."
                                rows="4"
                              />
                            </div>

                            {/* Image Upload */}
                            <div className="col-span-12">
                              <label className="ti-form-label text-sm font-medium">
                                Upload Image
                              </label>
                              <div className="space-y-2">
                                <button
                                  type="button"
                                  onClick={() => setManagerOpener(2)}
                                  className="ti-btn ti-btn-outline-primary ti-btn-sm"
                                >
                                  {contentImage.length > 0
                                    ? "Change Image"
                                    : "Select Image"}
                                </button>
                                {contentImage.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {contentImage.map((img, index) => (
                                      <div key={index} className="relative">
                                        <img
                                          src={`${import.meta.env.VITE_CMS_URL
                                            }api/transform/${img}`}
                                          className="h-16 w-20 rounded-sm object-cover border"
                                          alt="Preview"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setContentImage([])}
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
                      </div>
                    </div>
                  )}

                  {/* Content Table */}
                  <div className="overflow-auto table-bordered">
                    <table className="ti-custom-table ti-custom-table-head">
                      <thead className="border">
                        <tr>
                          <th className="w-1">#</th>
                          <th>Image</th>
                          <th>Title</th>
                          <th>Description</th>
                          <th>Meta Title</th>
                          <th>Meta Description</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contentData.map((item, index) => (
                          <tr key={item.sc_id || index}>
                            <td>{index + 1}</td>
                            <td>
                              {item.image && item.image.length > 0 ? (
                                <img
                                  src={`${import.meta.env.VITE_CMS_URL
                                    }api/transform/${item.image[0]}`}
                                  className="h-12 w-16 rounded-sm object-cover border cursor-pointer"
                                  alt="Content"
                                  onClick={() =>
                                    window.open(
                                      `${import.meta.env.VITE_CMS_URL
                                      }api/transform/${item.image[0]}`,
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
                                {item.title || "No title"}
                              </div>
                            </td>
                            <td>
                              <div className="max-w-32 truncate text-sm">
                                {item.des || "No description"}
                              </div>
                            </td>
                            <td>
                              <div className="max-w-32 truncate text-sm">
                                {item.meta_title || "No meta title"}
                              </div>
                            </td>
                            <td>
                              <div className="max-w-32 truncate text-sm">
                                {item.meta_des || "No meta description"}
                              </div>
                            </td>
                            <td>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleMoveContent(index, "up")}
                                  disabled={index === 0}
                                  className={`ti-btn ti-btn-soft-info ti-btn-sm ${index === 0
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                    }`}
                                  title="Move Up"
                                >
                                  <i className="ti ti-arrow-up"></i>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleMoveContent(index, "down")
                                  }
                                  disabled={index === contentData.length - 1}
                                  className={`ti-btn ti-btn-soft-info ti-btn-sm ${index === contentData.length - 1
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                    }`}
                                  title="Move Down"
                                >
                                  <i className="ti ti-arrow-down"></i>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(
                                      `/cms/pages/service/edit/${item.sc_id}`
                                    )
                                  }
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
                              colSpan="7"
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
                              onClick={handleHeroSubmit}
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

export default WebPreProjects;
