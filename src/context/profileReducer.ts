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
  | { type: "PROFILE/SET_PROFILE"; payload: ProfileData }
  | { type: "PROFILE/UPDATE_PROFILE"; payload: ProfileData }
  | {
      type: "PROFILE/UPDATE_PROFILE_HISTORY";
      payload: ProfileHistory;
    }
  | {
      type: "PROFILE/CLEAR_PROFILE_HISTORY";
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

  localStorage.setItem(
    PROFILE_HISTORY_LOCAL_STORAGE_KEY,
    JSON.stringify(parsedHistoryData)
  );
};

const clearProfileHistoryInLocalStorage = () => {
  localStorage.removeItem(PROFILE_HISTORY_LOCAL_STORAGE_KEY);
};

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

export const fallbackProfileState: ProfileState = {
  profileData: {
    name: "",
    email: "",
    profilePicture: null,
  },
  profileHistory: [],
};

const getInitialProfileState = (): ProfileState => {
  const storedProfileData = localStorage.getItem(
    PROFILE_DATA_LOCAL_STORAGE_KEY
  );

  const storedProfileDataHistory = localStorage.getItem(
    PROFILE_HISTORY_LOCAL_STORAGE_KEY
  );

  let finalProfileData = null;

  let finalProfileHistoryData = null;

  if (storedProfileData) {
    try {
      const parsedProfileData = JSON.parse(storedProfileData);
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
        : fallbackProfileState.profileData;
    } catch {
      finalProfileData = fallbackProfileState.profileData;
    }
  }

  if (storedProfileDataHistory) {
    try {
      const parsedProfileHistoryData = storedProfileDataHistory
        ? JSON.parse(storedProfileDataHistory)
        : null;

      finalProfileHistoryData = parsedProfileHistoryData
        ? parsedProfileHistoryData.map((item: any) => {
            return {
              ...item,
              profilePicture: item.profilePicture
                ? base64ToFile(item.profilePicture, "profilePicture.png")
                : null,
            };
          })
        : fallbackProfileState.profileHistory;
    } catch {
      finalProfileHistoryData = fallbackProfileState.profileHistory;
    }

    return {
      profileData: finalProfileData,
      profileHistory: finalProfileHistoryData,
    };
  }

  return fallbackProfileState;
};

export const initialProfileState: ProfileState = getInitialProfileState();

export function profileReducer(
  state: ProfileState,
  action: ProfileAction
): ProfileState {
  switch (action.type) {
    case "PROFILE/SET_PROFILE":
    case "PROFILE/UPDATE_PROFILE":
      saveProfileToLocalStorage(action.payload);
      return { ...state, profileData: action.payload };
    case "PROFILE/UPDATE_PROFILE_HISTORY":
      saveProfileHistoryToLocalStorage(action.payload);
      return { ...state, profileHistory: action.payload };
    case "PROFILE/CLEAR_PROFILE_HISTORY":
      clearProfileHistoryInLocalStorage();
      return {
        ...state,
        profileHistory: [],
      };
    default:
      return state;
  }
}
