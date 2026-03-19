import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import Filemanagermain from "../fileManager/filemanagermain";

const EditMember = () => {
  const navigate = useNavigate();
  const { m_id } = useParams();
  
  const [values, setValues] = useState({
    name: "",
    position: "",
    image: "",
    instagram: "",
    linkedin: "",
    status: 1
  });
  
  const [memberImage, setMemberImage] = useState([]);
  const [managerOpener, setManagerOpener] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemberData();
  }, [m_id]);

  const fetchMemberData = async () => {
    try {
      console.log("Fetching member with ID:", m_id);
      console.log("API URL:", `${import.meta.env.VITE_CMS_URL}api/getbyidmember/${m_id}`);
      
      const response = await fetch(`${import.meta.env.VITE_CMS_URL}api/getbyidmember/${m_id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      
      if (data.status && data.data) {
        // Backend returns data as array, get first item
        const memberData = Array.isArray(data.data) ? data.data[0] : data.data;
        console.log("Member data:", memberData);
        
        if (!memberData) {
          toast.error("Team member not found");
          navigate("/cms/pages/web_team");
          return;
        }
        
        // Parse image from JSON string
        let imageData = [];
        try {
          if (memberData.image) {
            imageData = JSON.parse(memberData.image);
          }
        } catch (parseError) {
          console.warn("Error parsing image JSON:", parseError);
          // If parsing fails, treat as single image
          if (memberData.image) {
            imageData = [memberData.image];
          }
        }
        
        setMemberImage(imageData);
        setValues({
          name: memberData.name || "",
          position: memberData.position || "",
          image: memberData.image || "",
          instagram: memberData.instagram || "",
          linkedin: memberData.linkedin || "",
          status: memberData.status || 1
        });
      } else {
        console.error("API returned error:", data);
        toast.error(data.message || "Team member not found");
        navigate("/cms/pages/web_team");
      }
    } catch (error) {
      console.error("Error fetching member data:", error);
      toast.error("Failed to fetch member data: " + error.message);
      navigate("/cms/pages/web_team");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  // Update values when image state changes
  useEffect(() => {
    if (memberImage && memberImage.length > 0) {
      setValues(prev => ({ ...prev, image: JSON.stringify(memberImage) }));
    } else {
      setValues(prev => ({ ...prev, image: "" }));
    }
  }, [memberImage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!values.name.trim()) {
      toast.error("Member name is required");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidmember/${m_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast.success("Team member updated successfully");
        navigate("/cms/pages/web_team");
      } else {
        toast.error("Failed to update team member");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while updating team member");
    }
  };

  const handleCancel = () => {
    navigate("/cms/pages/web_team");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading member data...</span>
      </div>
    );
  }

  return managerOpener ? (
    <Filemanagermain
      file={memberImage}
      fileSetter={setMemberImage}
      openSetter={setManagerOpener}
      maxFiles={1}
      ratio={1}
      type="image"
    />
  ) : (
    <div>
      <PageHeader currentpage="Edit Team Member" activepage="Web Team" mainpage="Edit Team Member" />
      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12 xxl:col-span-12">
          <div className="box">
            <div className="box-header">
              <h5 className="box-title">Edit Team Member</h5>
            </div>
            <div className="box-body space-y-5">
              {/* Member Name */}
              <div>
                <label className="ti-form-label">Member Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleInputChange}
                  className="ti-form-input"
                  placeholder="Enter Member Name"
                  required
                />
              </div>

              {/* Position */}
              <div>
                <label className="ti-form-label">Position</label>
                <input
                  type="text"
                  name="position"
                  value={values.position}
                  onChange={handleInputChange}
                  className="ti-form-input"
                  placeholder="Enter Position"
                />
              </div>

            

              {/* Member Image */}
              <div>
                <label className="ti-form-label">Member Image</label>
                <div className="space-y-2">
                  <button
                    type="button"
                    className="ti-btn ti-btn-outline-primary w-full"
                    onClick={() => setManagerOpener(true)}
                  >
                    {memberImage.length > 0 ? "Change Member Image" : "Select Member Image"}
                  </button>
                  {memberImage.length > 0 && (
                    <div className="relative inline-block">
                      <img
                        src={`${import.meta.env.VITE_CMS_URL}api/transform/${memberImage[0]}`}
                        className="w-32 h-32 rounded object-cover border"
                        alt="Member"
                      />
                      <button
                        type="button"
                        onClick={() => setMemberImage([])}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Media Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Instagram */}
                <div>
                  <label className="ti-form-label">Instagram URL</label>
                  <input
                    type="url"
                    name="instagram"
                    value={values.instagram}
                    onChange={handleInputChange}
                    className="ti-form-input"
                    placeholder="https://instagram.com/username"
                  />
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="ti-form-label">LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={values.linkedin}
                    onChange={handleInputChange}
                    className="ti-form-input"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                

              </div>

              {/* Status */}
              <div>
                <label className="ti-form-label">Status</label>
                <Select
                  classNamePrefix="react-select"
                  value={{
                    value: values.status,
                    label: values.status === 1 ? "Active" : "Inactive"
                  }}
                  options={[
                    { value: 1, label: "Active" },
                    { value: 0, label: "Inactive" },
                  ]}
                  onChange={(selected) =>
                    setValues((prev) => ({ ...prev, status: selected.value }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-12 mt-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-footer bg-transparent">
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="ti-btn ti-btn-light"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="ti-btn ti-btn-primary"
                >
                  Update Member
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMember;
