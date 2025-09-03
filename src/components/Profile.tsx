import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import EditProfileModal from "./EditProfileModal";

export default function Profile() {
  const { state, dispatch } = useContext(AppContext);
  const { profile, signedIn } = state;
  const { profileData, profileHistory } = profile;
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

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
    if (!profileData?.name && !profileData?.email && signedIn?.signedIn) {
      const setProfileData = async () => {
        const fetchedData = await fetchProfileData();
        dispatch({
          type: "PROFILE/SET_PROFILE",
          payload: { ...fetchedData, profilePicture: null },
        });
        setLoading(false);
      };
      setProfileData();
    } else {
      setLoading(false);
    }
  }, [dispatch, profileData?.name, profileData?.email, signedIn?.signedIn]);

  return (
    <div className="ProfileContainer">
      {loading ? (
        <div className="LoadingProfile">Loading profile...</div>
      ) : (
        <div className="Profile">
          <h2 className="Title">Profile:</h2>

          <div className="Name">Name: {profileData?.name ?? "No Name"}</div>

          <div className="Email">Email: {profileData?.email ?? "No email"}</div>

          <div className="ProfilePicture">
            Profile Picture:{" "}
            {profileData?.profilePicture ? (
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

          <button
            className="EditProfileButton"
            disabled={loading || editProfile}
            onClick={() => setEditProfile(true)}
          >
            Edit Profile
          </button>

          <div className="ProfileHistory">
            <h3 className="HistoryTitle">Profile Update History:</h3>

            <button
              className="ClearProfileHistory"
              onClick={() => {
                dispatch({ type: "PROFILE/CLEAR_PROFILE_HISTORY" });
              }}
              disabled={
                loading ||
                editProfile ||
                !profileHistory ||
                (profileHistory && profileHistory.length === 0)
              }
            >
              Clear Profile History
            </button>

            {profileHistory && profileHistory.length > 0 ? (
              <ul className="ProfileHistoryList">
                {profileHistory.reverse().map((entry, index) => (
                  <li className="ProfileHistoryListItem" key={index}>
                    <div className="Date">
                      <strong>Updated At:</strong>{" "}
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                    <div className="Name">
                      <strong>Name:</strong> {entry.name}
                    </div>
                    <div className="Email">
                      <strong>Email:</strong> {entry.email}
                    </div>
                    <div className="ProfilePicture">
                      <strong>Profile Picture:</strong>{" "}
                      {entry.profilePicture ? (
                        <img
                          src={URL.createObjectURL(entry.profilePicture)}
                          alt="Profile"
                          width={50}
                          height={50}
                        />
                      ) : (
                        "No profile picture"
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="NoProfileHistory">No profile updates yet.</div>
            )}
          </div>
        </div>
      )}

      {editProfile && (
        <EditProfileModal onClose={() => setEditProfile(false)} />
      )}
    </div>
  );
}
