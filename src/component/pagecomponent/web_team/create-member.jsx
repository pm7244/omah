import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import Filemanagermain from "../fileManager/filemanagermain";

const CreateMember = () => {
  const navigate = useNavigate();
  
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  // Update values when image state changes
  React.useEffect(() => {
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
      const response = await fetch(`${import.meta.env.VITE_CMS_URL}api/createmember`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast.success("Team member created successfully");
        navigate("/cms/pages/web_team");
      } else {
        toast.error("Failed to create team member");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while creating team member");
    }
  };

  const handleCancel = () => {
    navigate("/cms/pages/web_team");
  };

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
      <PageHeader currentpage="Create Team Member" activepage="Web Team" mainpage="Create Team Member" />
      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12 xxl:col-span-12">
          <div className="box">
            <div className="box-header">
              <h5 className="box-title">Create New Team Member</h5>
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
                  Create Member
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMember;
