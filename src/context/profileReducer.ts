export interface ProfileData {
  name: string;
  email: string;
  profilePicture: File | null;
}

export interface ProfileState {
  profileData: ProfileData;
}

export type ProfileAction =
  | { type: "SET_PROFILE"; payload: ProfileData }
  | { type: "UPDATE_PROFILE"; payload: ProfileData };

const LOCAL_STORAGE_KEY = "profileData";

const fileToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const saveProfileToLocalStorage = async (data: ProfileData) => {
  const parsedProfilePicture = data.profilePicture
    ? await fileToBase64(data.profilePicture)
    : null;

  const parsedData = data.profilePicture
    ? { ...data, profilePicture: parsedProfilePicture }
    : data;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsedData));
};

export const initialState: ProfileState = {
  profileData: {
    name: "",
    email: "",
    profilePicture: null,
  },
};

export function profileReducer(
  state: ProfileState,
  action: ProfileAction
): ProfileState {
  switch (action.type) {
    case "SET_PROFILE":
    case "UPDATE_PROFILE":
      saveProfileToLocalStorage(action.payload);
      return { ...state, profileData: action.payload };
    default:
      return state;
  }
}
