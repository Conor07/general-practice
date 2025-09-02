export interface SignedInState {
  signedIn: boolean;
}

export const SIGNED_IN_STORAGE_KEY = "signedIn";

export type SignedInAction =
  | { type: "SIGNED_IN/SIGN_IN" }
  | { type: "SIGNED_IN/SIGN_OUT" };

export const getInitialSignedInState = (): SignedInState => {
  const storedSignedIn = localStorage.getItem(SIGNED_IN_STORAGE_KEY);

  return {
    signedIn: storedSignedIn ? storedSignedIn === "true" : false,
  };
};

export const initialSignedInState: SignedInState = getInitialSignedInState();

export function signedInReducer(
  state: SignedInState,
  action: SignedInAction
): SignedInState {
  console.log("signedInReducer action: ", action);
  switch (action.type) {
    case "SIGNED_IN/SIGN_IN":
      return { ...state, signedIn: true };
    case "SIGNED_IN/SIGN_OUT":
      return { ...state, signedIn: false };
    default:
      return state;
  }
}
