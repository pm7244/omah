// Dummy profile images for users
export const dummyProfiles = [
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces&auto=format",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces&auto=format",
  "https://images.unsplash.com/photo-1494790108755-2616c619d6e9?w=150&h=150&fit=crop&crop=faces&auto=format",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=faces&auto=format",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=faces&auto=format",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=faces&auto=format",
  "https://images.unsplash.com/photo-1557862921-37829c790f19?w=150&h=150&fit=crop&crop=faces&auto=format",
  "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=faces&auto=format",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces&auto=format",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces&auto=format",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces&auto=format",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces&auto=format",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces&auto=format",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces&auto=format",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces&auto=format"
];

// Function to get a random profile image
export const getRandomProfile = () => {
  return dummyProfiles[Math.floor(Math.random() * dummyProfiles.length)];
};

// Function to get a profile by index (for consistency)
export const getProfileByIndex = (index) => {
  return dummyProfiles[index % dummyProfiles.length];
};
