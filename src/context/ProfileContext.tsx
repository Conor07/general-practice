import React, { createContext, useReducer, ReactNode } from "react";
import {
  profileReducer,
  initialState,
  ProfileState,
  ProfileAction,
} from "./profileReducer";

const LOCAL_STORAGE_KEY = "profileData";

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
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);

      return {
        profileData: {
          ...parsed,
          profilePicture: parsed.profilePicture
            ? base64ToFile(parsed.profilePicture, "profilePicture.png")
            : null,
        },
      };
    } catch {
      return initialState;
    }
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
