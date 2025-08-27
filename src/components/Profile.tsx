import React, { useState, useContext, useEffect } from "react";
import { ProfileContext } from "../context/ProfileContext";
import EditProfileModal from "./EditProfileModal";

export default function Profile() {
  const { state, dispatch } = useContext(ProfileContext);
  const { profileData } = state;
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulated fetch using async function
  const fetchProfileData = async () => {
    setLoading(true);
    return new Promise<{ name: string; email: string }>((resolve) =>
      setTimeout(() => {
        resolve({ name: "John Doe", email: "johndoe123@test.com" });
        setLoading(false);
      }, 1000)
    );
  };

  useEffect(() => {
    // Only fetch if no profile data in context (i.e., localStorage was empty)
    if (!profileData.name && !profileData.email) {
      const setProfileData = async () => {
        const fetchedData = await fetchProfileData();
        dispatch({
          type: "SET_PROFILE",
          payload: { ...fetchedData, profilePicture: null },
        });
        setLoading(false);
      };
      setProfileData();
    } else {
      setLoading(false);
    }
  }, [dispatch, profileData.name, profileData.email]);

  return (
    <div>
      {loading && <div className="LoadingProfile">Loading profile...</div>}
      <h2>Profile:</h2>
      <div>Name: {profileData.name}</div>
      <div>Email: {profileData.email}</div>
      <div>
        Profile Picture:{" "}
        {profileData.profilePicture ? (
          <img
            src={URL.createObjectURL(profileData.profilePicture)}
            alt="Profile"
            width={100}
            height={100}
          />
        ) : (
          "No profile picture uploaded"
        )}
      </div>

      <button disabled={loading} onClick={() => setEditProfile(!editProfile)}>
        {editProfile ? "Close Edit" : "Edit Profile"}
      </button>

      {editProfile && (
        <EditProfileModal onClose={() => setEditProfile(false)} />
      )}
    </div>
  );
}
