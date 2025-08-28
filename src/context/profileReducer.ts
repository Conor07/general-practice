export interface ProfileData {
  name: string;
  email: string;
  profilePicture: File | null;
}

export interface ProfileState {
  profileData: ProfileData;
  profileHistory?: ProfileHistory;
}

export type ProfileHistoryEntry = ProfileData & { timestamp: number };
export type ProfileHistory = ProfileHistoryEntry[];

export type ProfileAction =
  | { type: "SET_PROFILE"; payload: ProfileData }
  | { type: "UPDATE_PROFILE"; payload: ProfileData }
  | {
      type: "UPDATE_PROFILE_HISTORY";
      payload: ProfileHistory;
    }
  | {
      type: "CLEAR_PROFILE_HISTORY";
    };

export const PROFILE_DATA_LOCAL_STORAGE_KEY = "profileData";
export const PROFILE_HISTORY_LOCAL_STORAGE_KEY = "profileHistoryData";

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
  localStorage.setItem(
    PROFILE_DATA_LOCAL_STORAGE_KEY,
    JSON.stringify(parsedData)
  );
};

const parseHistoryEntry = async (entry: ProfileHistoryEntry) => {
  console.log("entry: ", entry);

  const parsedProfilePicture = entry.profilePicture
    ? await fileToBase64(entry.profilePicture)
    : null;

  return {
    ...entry,
    profilePicture: parsedProfilePicture,
  };
};

const saveProfileHistoryToLocalStorage = async (data: ProfileHistory) => {
  const parsedHistoryData = await Promise.all(
    data.map((entry) => parseHistoryEntry(entry))
  );

  console.log("parsedHistoryData: ", parsedHistoryData);

  localStorage.setItem(
    PROFILE_HISTORY_LOCAL_STORAGE_KEY,
    JSON.stringify(parsedHistoryData)
  );
};

const clearProfileHistoryInLocalStorage = () => {
  localStorage.removeItem(PROFILE_HISTORY_LOCAL_STORAGE_KEY);
};

export const initialState: ProfileState = {
  profileData: {
    name: "",
    email: "",
    profilePicture: null,
  },
  profileHistory: [],
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
    case "UPDATE_PROFILE_HISTORY":
      saveProfileHistoryToLocalStorage(action.payload);
      return { ...state, profileHistory: action.payload };
    case "CLEAR_PROFILE_HISTORY":
      clearProfileHistoryInLocalStorage();
      return {
        ...state,
        profileHistory: [],
      };
    default:
      return state;
  }
}
