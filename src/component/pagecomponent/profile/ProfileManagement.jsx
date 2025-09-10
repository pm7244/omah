import React, { useState, useEffect } from "react";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import Filemanagermain from "../fileManager/filemanagermain";

const ProfileManagement = () => {
  const [managerOpener, setManagerOpener] = useState(false);
  const [profileImage, setProfileImage] = useState([]);
  const [values, setValues] = useState({
    user_id: 1,
    username: "",
    email: "",
    full_name: "",
    profile_image: "",
    status: 1,
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    setValues((prev) => ({ ...prev, profile_image: profileImage }));
  }, [profileImage]);

  const fetchProfileData = async () => {
    try {
      // For now, we'll use default admin data
      // In a real application, this would fetch from the actual user session
      const defaultProfile = {
        user_id: 1,
        username: "admin",
        email: "admin@omah.com",
        full_name: "Admin User",
        profile_image: "",
        status: 1,
      };
      
      // Try to fetch from backend if available
      try {
        const response = await fetch(`${import.meta.env.VITE_CMS_URL}api/getbyidusers/1`);
        const data = await response.json();
        if (data.status && data.data[0]) {
          const userData = data.data[0];
          const profileImageData = userData.profile_image 
            ? JSON.parse(userData.profile_image) 
            : [];
          
          setProfileImage(profileImageData);
          setValues({
            user_id: userData.user_id || 1,
            username: userData.username || "admin",
            email: userData.email || "admin@omah.com",
            full_name: userData.full_name || "Admin User",
            profile_image: profileImageData,
            status: userData.status || 1,
          });
        } else {
          setValues(defaultProfile);
        }
      } catch (error) {
        console.log("Using default profile data");
        setValues(defaultProfile);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to load profile data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { username, email, full_name, status } = values;

    if (!username || !email || !full_name) {
      toast.error("Please fill all required fields");
      return;
    }

    const updateData = {
      username,
      email: email || "admin@omah.com",
      full_name: full_name || "Admin User",
      profile_image: JSON.stringify(profileImage),
      status,
    };

    try {
      // First, try to update using the existing users API
      const response = await fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidusers/1`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();
      if (result.status) {
        toast.success("Profile updated successfully");
        fetchProfileData();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordSubmit = async () => {
    const { current_password, new_password, confirm_password } = passwordData;

    if (!current_password || !new_password || !confirm_password) {
      toast.error("Please fill all password fields");
      return;
    }

    if (new_password !== confirm_password) {
      toast.error("New passwords do not match");
      return;
    }

    if (new_password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidusers/1`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          password: new_password,
          status: values.status,
        }),
      });

      const result = await response.json();
      if (result.status) {
        toast.success("Password updated successfully");
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
        setShowPasswordForm(false);
      } else {
        toast.error("Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    }
  };

  return (
    values && (
      <>
        {managerOpener ? (
          <Filemanagermain
            file={profileImage}
            fileSetter={setProfileImage}
            openSetter={setManagerOpener}
            maxFiles={1}
            ratio={1}
            type="image"
          />
        ) : (
          <div>
            <PageHeader
              currentpage="Profile Management"
              activepage="Settings"
              mainpage="Profile"
            />
            
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-12 xl:col-span-8">
                {/* Profile Information */}
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Profile Information</h5>
                  </div>
                  <div className="box-body space-y-6">
                    {/* Profile Image */}
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0">
                        {profileImage && profileImage.length > 0 ? (
                          <img
                            src={`${import.meta.env.VITE_CMS_URL}api/transform/${profileImage[0]}`}
                            className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
                            alt="Profile"
                          />
                        ) : (
                          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-gray-200">
                            <i className="ti ti-user text-3xl text-primary"></i>
                          </div>
                        )}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => setManagerOpener(true)}
                          className="ti-btn ti-btn-primary"
                        >
                          {profileImage && profileImage.length > 0
                            ? "Change Image"
                            : "Upload Image"}
                        </button>
                        {profileImage && profileImage.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setProfileImage([])}
                            className="ti-btn ti-btn-outline-danger ml-2"
                          >
                            Remove
                          </button>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                          Recommended: 400x400px, Max: 2MB
                        </p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="ti-form-label">
                          Username <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={values.username}
                          onChange={handleInputChange}
                          className="ti-form-input"
                          placeholder="Enter username"
                        />
                      </div>

                      <div>
                        <label className="ti-form-label">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          value={values.full_name}
                          onChange={handleInputChange}
                          className="ti-form-input"
                          placeholder="Enter full name"
                        />
                      </div>

                      <div>
                        <label className="ti-form-label">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={values.email}
                          onChange={handleInputChange}
                          className="ti-form-input"
                          placeholder="Enter email address"
                        />
                      </div>

                      <div>
                        <label className="ti-form-label">Status</label>
                        <select
                          name="status"
                          value={values.status}
                          onChange={handleInputChange}
                          className="ti-form-input"
                        >
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="box-footer bg-transparent">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="ti-btn ti-btn-primary"
                      >
                        Update Profile
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Management */}
                <div className="box">
                  <div className="box-header">
                    <div className="flex justify-between items-center w-full">
                      <h5 className="box-title">Password Management</h5>
                      <button
                        type="button"
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="ti-btn ti-btn-outline-primary"
                      >
                        {showPasswordForm ? "Cancel" : "Change Password"}
                      </button>
                    </div>
                  </div>
                  
                  {showPasswordForm && (
                    <div className="box-body space-y-4">
                      <div>
                        <label className="ti-form-label">
                          Current Password <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          name="current_password"
                          value={passwordData.current_password}
                          onChange={handlePasswordChange}
                          className="ti-form-input"
                          placeholder="Enter current password"
                        />
                      </div>

                      <div>
                        <label className="ti-form-label">
                          New Password <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          name="new_password"
                          value={passwordData.new_password}
                          onChange={handlePasswordChange}
                          className="ti-form-input"
                          placeholder="Enter new password"
                        />
                      </div>

                      <div>
                        <label className="ti-form-label">
                          Confirm New Password <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          name="confirm_password"
                          value={passwordData.confirm_password}
                          onChange={handlePasswordChange}
                          className="ti-form-input"
                          placeholder="Confirm new password"
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowPasswordForm(false)}
                          className="ti-btn ti-btn-outline-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handlePasswordSubmit}
                          className="ti-btn ti-btn-primary"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Summary */}
              <div className="col-span-12 xl:col-span-4">
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Profile Summary</h5>
                  </div>
                  <div className="box-body">
                    <div className="text-center mb-6">
                      {profileImage && profileImage.length > 0 ? (
                        <img
                          src={`${import.meta.env.VITE_CMS_URL}api/transform/${profileImage[0]}`}
                          className="h-20 w-20 rounded-full object-cover mx-auto border-4 border-gray-200"
                          alt="Profile"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto border-4 border-gray-200">
                          <i className="ti ti-user text-2xl text-primary"></i>
                        </div>
                      )}
                      <h6 className="font-semibold mt-3">{values.full_name || "Admin User"}</h6>
                      <p className="text-gray-500 text-sm">@{values.username}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-medium">{values.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          values.status === 1 
                            ? 'bg-success/10 text-success' 
                            : 'bg-danger/10 text-danger'
                        }`}>
                          {values.status === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">User ID:</span>
                        <span className="font-medium">#{values.user_id}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Quick Actions</h5>
                  </div>
                  <div className="box-body">
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setShowPasswordForm(true)}
                        className="w-full ti-btn ti-btn-outline-primary ti-btn-sm flex items-center justify-center"
                      >
                        <i className="ti ti-lock ltr:mr-2 rtl:ml-2"></i>
                        Change Password
                      </button>
                      <button
                        type="button"
                        onClick={() => setManagerOpener(true)}
                        className="w-full ti-btn ti-btn-outline-secondary ti-btn-sm flex items-center justify-center"
                      >
                        <i className="ti ti-photo ltr:mr-2 rtl:ml-2"></i>
                        Update Photo
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

export default ProfileManagement;
