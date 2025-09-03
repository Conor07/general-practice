import "./styles/app.scss";
import "./styles/profile.scss";
import "./styles/editProfileModal.scss";
import "./styles/signIn.scss";

import React, { useEffect } from "react";
import Profile from "./components/Profile";
import { AppContext, AppProvider } from "./context/AppContext";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { signInValidationSchema } from "./validation/signInValidation";
import {
  PROFILE_DATA_LOCAL_STORAGE_KEY,
  PROFILE_HISTORY_LOCAL_STORAGE_KEY,
} from "./context/profileReducer";
import { SIGNED_IN_STORAGE_KEY } from "./context/signedInReducer";

export default function App() {
  const { state, dispatch } = React.useContext(AppContext);

  const [name, setName] = React.useState<string>("");

  const handleSignOut = () => {
    dispatch({ type: "SIGNED_IN/SIGN_OUT" });
    localStorage.removeItem(PROFILE_DATA_LOCAL_STORAGE_KEY);
    localStorage.removeItem(PROFILE_HISTORY_LOCAL_STORAGE_KEY);
    localStorage.setItem(SIGNED_IN_STORAGE_KEY, "false");
    window.location.reload();
  };

  const handleSignIn = (values: { name: string; email: string }) => {
    console.log("handleSignIn: ", handleSignIn);
    dispatch({ type: "SIGNED_IN/SIGN_IN" });
    localStorage.setItem(SIGNED_IN_STORAGE_KEY, "true");
    setTimeout(() => {
      dispatch({
        type: "PROFILE/SET_PROFILE",
        payload: {
          name: values.name,
          email: values.email,
          profilePicture: null,
        },
      });
    }, 0); // Ensures the first dispatch is processed
  };

  useEffect(() => {
    setName(state?.profile?.profileData?.name ?? "User");
  }, [state?.profile?.profileData?.name]);
  return (
    <div className="App">
      <nav className="NavBar">
        <h1>Profile Management App</h1>

        {state?.signedIn?.signedIn && (
          <div className="Name">{state?.profile?.profileData?.name ?? ""}</div>
        )}

        {state?.signedIn?.signedIn && (
          <button className="SignOutButton" onClick={handleSignOut}>
            Sign Out
          </button>
        )}
      </nav>

      {!state?.signedIn?.signedIn && (
        <div className="SignIn">
          <Formik
            initialValues={{ name: "", email: "" }}
            onSubmit={(values) => {
              handleSignIn(values);
            }}
            validationSchema={signInValidationSchema}
          >
            {({ isValid, isSubmitting }) => (
              <Form className="SignInForm">
                <div className="Title">Please sign in.</div>

                <div className="Field">
                  <label>Name:</label>

                  <Field name="name" />

                  <ErrorMessage className="Error" name="name" component="div" />
                </div>

                <div className="Field">
                  <label>Email:</label>

                  <Field name="email" type="email" />

                  <ErrorMessage
                    className="Error"
                    name="email"
                    component="div"
                  />
                </div>

                <button
                  className="SignInButton"
                  type="submit"
                  disabled={!isValid || isSubmitting}
                >
                  Sign In
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}

      {state?.signedIn?.signedIn && <Profile />}
    </div>
  );
}
