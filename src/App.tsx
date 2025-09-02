import React, { useEffect } from "react";

import "./App.css";
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
      <header>
        <h1>Profile Management App</h1>

        {state?.signedIn?.signedIn && (
          <button className="SignOutButton" onClick={handleSignOut}>
            Sign Out
          </button>
        )}
      </header>

      {state?.signedIn?.signedIn ? (
        <div className="Name">{state?.profile?.profileData?.name ?? ""}</div>
      ) : (
        <div className="SignIn">
          <p>Please sign in.</p>

          <Formik
            initialValues={{ name: "", email: "" }}
            onSubmit={(values) => {
              handleSignIn(values);
            }}
            validationSchema={signInValidationSchema}
          >
            {({ isValid, isSubmitting }) => (
              <Form>
                <div>
                  <label>Name:</label>

                  <Field name="name" />

                  <ErrorMessage name="name" component="div" />
                </div>

                <div>
                  <label>Email:</label>

                  <Field name="email" type="email" />

                  <ErrorMessage name="email" component="div" />
                </div>

                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="SignInButton"
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
