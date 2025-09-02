export interface SignedInState {
  darkMode: boolean;
}

export type SignedInAction = { type: "TOGGLE_DARK_MODE" };

export const initialSignedInState: SignedInState = {
  darkMode: false,
};

export function signedInReducer(
  state: SignedInState,
  action: SignedInAction
): SignedInState {
  switch (action.type) {
    case "TOGGLE_DARK_MODE":
      return { ...state, darkMode: !state.darkMode };
    default:
      return state;
  }
}
