import React from "react";
import { getRandomProfile, getProfileByIndex } from "../assets/dummy-profiles/profiles";

const UserProfileAvatar = ({ userId, userName, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  };

  const profileImage = userId ? getProfileByIndex(userId) : getRandomProfile();

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
      <img
        src={profileImage}
        alt={userName || "User Profile"}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to initials if image fails to load
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div 
        className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold"
        style={{ display: 'none' }}
      >
        {userName ? userName.charAt(0).toUpperCase() : "U"}
      </div>
    </div>
  );
};

export default UserProfileAvatar;
