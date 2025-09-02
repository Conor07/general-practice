import {
  profileReducer,
  ProfileState,
  ProfileAction,
  initialProfileState,
} from "./profileReducer";
import {
  signedInReducer,
  SignedInState,
  SignedInAction,
  initialSignedInState,
} from "./signedInReducer";

export interface RootState {
  profile: ProfileState;
  signedIn: SignedInState;
}

export type RootAction = ProfileAction | SignedInAction;

export const initialRootState: RootState = {
  profile: initialProfileState,
  signedIn: initialSignedInState,
};

export function rootReducer(state: RootState, action: RootAction): RootState {
  return {
    profile: profileReducer(state.profile, action as ProfileAction),
    signedIn: signedInReducer(state.signedIn, action as SignedInAction),
  };
}
