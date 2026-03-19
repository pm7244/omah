import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import Filemanagermain from "../fileManager/filemanagermain";

const CreateTeam = () => {
  const navigate = useNavigate();
  
  const [values, setValues] = useState({
    name: "",
    designation: "",
    image: "",
    status: 1
  });
  
  const [teamImage, setTeamImage] = useState([]);
  const [managerOpener, setManagerOpener] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  // Update values when image state changes
  React.useEffect(() => {
    if (teamImage && teamImage.length > 0) {
      setValues(prev => ({ ...prev, image: JSON.stringify(teamImage) }));
    } else {
      setValues(prev => ({ ...prev, image: "" }));
    }
  }, [teamImage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!values.name.trim()) {
      toast.error("Team name is required");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_CMS_URL}api/createteam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast.success("Team created successfully");
        navigate("/cms/pages/web_team");
      } else {
        toast.error("Failed to create team");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while creating team");
    }
  };

  const handleCancel = () => {
    navigate("/cms/pages/web_team");
  };

  return managerOpener ? (
    <Filemanagermain
      file={teamImage}
      fileSetter={setTeamImage}
      openSetter={setManagerOpener}
      maxFiles={1}
      ratio={370/460}
      type="image"
    />
  ) : (
    <div>
      <PageHeader currentpage="Create Team" activepage="Web Team" mainpage="Create Team" />
      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12 xxl:col-span-12">
          <div className="box">
            <div className="box-header">
              <h5 className="box-title">Create New Team</h5>
            </div>
            <div className="box-body space-y-5">
              {/* Team Name */}
              <div>
                <label className="ti-form-label">Team Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleInputChange}
                  className="ti-form-input"
                  placeholder="Enter Team Name"
                  required
                />
              </div>

              {/* Post/Position */}
              <div>
                <label className="ti-form-label">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={values.designation}
                  onChange={handleInputChange}
                  className="ti-form-input"
                  placeholder="Enter Designation"
                />
              </div>

              {/* Team Image */}
              <div>
                <label className="ti-form-label">Team Image</label>
                <div className="space-y-2">
                  <button
                    type="button"
                    className="ti-btn ti-btn-outline-primary w-full"
                    onClick={() => setManagerOpener(true)}
                  >
                    {teamImage.length > 0 ? "Change Team Image" : "Select Team Image"}
                  </button>
                  {teamImage.length > 0 && (
                    <div className="relative inline-block">
                      <img
                        src={`${import.meta.env.VITE_CMS_URL}api/transform/${teamImage[0]}`}
                        className="w-32 h-32 rounded object-cover border"
                        alt="Team"
                      />
                      <button
                        type="button"
                        onClick={() => setTeamImage([])}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  )}
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
                  Create Team
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
