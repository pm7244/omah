import React, { useEffect, useState } from "react";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import Filemanagermain from "../fileManager/filemanagermain";

const ProfileSettings = () => {
  const [profileImage, setProfileImage] = useState([]);
  const [managerOpener, setManagerOpener] = useState(false);
  const [values, setValues] = useState({
    username: "",
    full_name: "",
    email: "",
    profile_image: "",
    phone: "",
    address: "",
    bio: "",
    status: 1,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getbyidusers/1`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.data[0]) {
          const userData = data.data[0];
          const profileImageData = userData.profile_image
            ? JSON.parse(userData.profile_image)
            : [];
          setProfileImage(profileImageData);
          setValues({
            username: userData.username || "",
            full_name: userData.full_name || "",
            email: userData.email || "",
            profile_image: profileImageData,
            phone: userData.phone || "",
            address: userData.address || "",
            bio: userData.bio || "",
            status: userData.status ?? 1,
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        toast.error("Failed to fetch profile data");
      });
  };

  useEffect(() => {
    setValues((prev) => ({ ...prev, profile_image: profileImage }));
  }, [profileImage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "status" ? parseInt(value) : value;
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const {
      username,
      full_name,
      email,
      phone,
      address,
      bio,
      status,
    } = values;

    if (!username || !full_name || !email) {
      toast.error("Please fill all the required fields");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    const data = {
      username,
      full_name,
      email,
      phone: phone || "",
      address: address || "",
      bio: bio || "",
      profile_image: JSON.stringify(profileImage),
      status,
    };

    fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidusers/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        setIsLoading(false);
        if (res.status) {
          toast.success("Profile updated successfully");
          // Refresh header profile data
          window.dispatchEvent(new Event('profileUpdated'));
        } else {
          toast.error(res.message || "Update failed");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("Update error:", err);
        toast.error("Failed to update profile");
      });
  };

  const handlePasswordUpdate = () => {
    const { current_password, new_password, confirm_password } = passwordData;

    if (!current_password || !new_password || !confirm_password) {
      toast.error("Please fill all password fields");
      return;
    }

    if (new_password !== confirm_password) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (new_password.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    const data = {
      current_password,
      new_password,
    };

    fetch(`${import.meta.env.VITE_CMS_URL}api/updatepassword/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        setIsLoading(false);
        if (res.status) {
          toast.success("Password updated successfully");
          setPasswordData({
            current_password: "",
            new_password: "",
            confirm_password: "",
          });
        } else {
          toast.error(res.message || "Password update failed");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("Password update error:", err);
        toast.error("Failed to update password");
      });
  };

  return (
    <div>
      {managerOpener === true ? (
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
            currentpage="Profile Settings"
            activepage="Account"
            mainpage="Profile Settings"
          />
          
          <div className="grid grid-cols-12 gap-x-6">
            {/* Profile Information */}
            <div className="col-span-12 xl:col-span-8">
              <div className="box">
                <div className="box-header">
                  <h5 className="box-title">Profile Information</h5>
                </div>
                <div className="box-body space-y-4">
                  {/* Profile Image Section */}
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      {profileImage && profileImage.length > 0 ? (
                        <img
                          src={`${import.meta.env.VITE_CMS_URL}api/transform/${profileImage[0]}`}
                          className="h-32 w-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                          alt="Profile Image"
                        />
                      ) : (
                        <div className="h-32 w-32 rounded-full bg-primary/10 border-4 border-gray-200 shadow-lg flex items-center justify-center">
                          <i className="ti ti-user text-5xl text-primary"></i>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setManagerOpener(true)}
                        className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/80 transition-colors"
                      >
                        <i className="ti ti-camera text-sm"></i>
                      </button>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setManagerOpener(true)}
                        className="ti-btn ti-btn-outline ti-btn-outline-primary"
                      >
                        {profileImage && profileImage.length > 0
                          ? "Change Photo"
                          : "Upload Photo"}
                      </button>
                      {profileImage && profileImage.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setProfileImage([])}
                          className="ti-btn ti-btn-outline ti-btn-outline-danger ml-2"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <label className="ti-form-label">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={values.phone}
                        onChange={handleInputChange}
                        className="ti-form-input"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="ti-form-label">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={values.address}
                      onChange={handleInputChange}
                      className="ti-form-input"
                      placeholder="Enter address"
                    />
                  </div>

                  <div>
                    <label className="ti-form-label">Bio</label>
                    <textarea
                      name="bio"
                      value={values.bio}
                      onChange={handleInputChange}
                      className="ti-form-input"
                      placeholder="Enter bio"
                      rows="4"
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

                <div className="box-footer text-end bg-transparent">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="ti-btn ti-btn-primary"
                  >
                    {isLoading ? (
                      <>
                        <i className="ti ti-loader animate-spin mr-2"></i>
                        Updating...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="col-span-12 xl:col-span-4">
              <div className="box">
                <div className="box-header">
                  <h5 className="box-title">Change Password</h5>
                </div>
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
                </div>

                <div className="box-footer text-end bg-transparent">
                  <button
                    type="button"
                    onClick={handlePasswordUpdate}
                    disabled={isLoading}
                    className="ti-btn ti-btn-secondary"
                  >
                    {isLoading ? (
                      <>
                        <i className="ti ti-loader animate-spin mr-2"></i>
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="box mt-6">
                <div className="box-header">
                  <h5 className="box-title">Quick Actions</h5>
                </div>
                <div className="box-body space-y-3">
                  <a
                    href="/cms/"
                    className="flex items-center p-3 rounded-md border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <i className="ti ti-dashboard text-lg text-gray-500 group-hover:text-primary mr-3"></i>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary">
                      Dashboard
                    </span>
                  </a>
                  
                  <a
                    href="/cms/pages/home"
                    className="flex items-center p-3 rounded-md border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <i className="ti ti-home text-lg text-gray-500 group-hover:text-primary mr-3"></i>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary">
                      Home Page
                    </span>
                  </a>
                  
                  <a
                    href="/cms/general/managerList"
                    className="flex items-center p-3 rounded-md border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <i className="ti ti-folder text-lg text-gray-500 group-hover:text-primary mr-3"></i>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary">
                      File Manager
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
