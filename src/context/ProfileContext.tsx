import React, { createContext, useReducer, ReactNode } from "react";
import {
  profileReducer,
  initialState,
  ProfileState,
  ProfileAction,
  PROFILE_DATA_LOCAL_STORAGE_KEY,
  PROFILE_HISTORY_LOCAL_STORAGE_KEY,
  ProfileData,
} from "./profileReducer";

const base64ToFile = (base64: string, filename: string): File => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

const getInitialState = (): ProfileState => {
  const storedProfileData = localStorage.getItem(
    PROFILE_DATA_LOCAL_STORAGE_KEY
  );

  const storedProfileDataHistory = localStorage.getItem(
    PROFILE_HISTORY_LOCAL_STORAGE_KEY
  );

  console.log("storedProfileDataHistory: ", storedProfileDataHistory);

  let finalProfileData = null;

  let finalProfileHistoryData = null;

  if (storedProfileData) {
    try {
      const parsedProfileData = JSON.parse(storedProfileData);

      console.log(
        "parsedProfileData.profilePicture: ",
        parsedProfileData.profilePicture
      );

      finalProfileData = parsedProfileData
        ? {
            ...parsedProfileData,
            profilePicture: parsedProfileData.profilePicture
              ? base64ToFile(
                  parsedProfileData.profilePicture,
                  "profilePicture.png"
                )
              : null,
          }
        : initialState.profileData;
    } catch {
      finalProfileData = initialState.profileData;
    }
  }

  if (storedProfileDataHistory) {
    try {
      const parsedProfileHistoryData = storedProfileDataHistory
        ? JSON.parse(storedProfileDataHistory)
        : null;

      finalProfileHistoryData = parsedProfileHistoryData
        ? parsedProfileHistoryData.map((item: any) => {
            console.log("item: ", item);
            return {
              ...item,
              profilePicture: item.profilePicture
                ? base64ToFile(item.profilePicture, "profilePicture.png")
                : null,
            };
          })
        : initialState.profileHistory;
    } catch {
      finalProfileHistoryData = initialState.profileHistory;
    }

    return {
      profileData: finalProfileData,
      profileHistory: finalProfileHistoryData,
    };
  }

  return initialState;
};

export const ProfileContext = createContext<{
  state: ProfileState;
  dispatch: React.Dispatch<ProfileAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const ProfileProvider = ({ children }: { children?: ReactNode }) => {
  const [state, dispatch] = useReducer(profileReducer, getInitialState());

  return (
    <ProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </ProfileContext.Provider>
  );
};
