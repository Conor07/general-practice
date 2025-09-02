import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AppContext } from "../context/AppContext";
import { profileValidationSchema } from "../validation/profileValidation";
import { ProfileData } from "../context/profileReducer";

const MAX__FILE_SIZE = 250 * 1024; // 250KB

interface EditProfileModalProps {
  onClose?: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
  const { state, dispatch } = useContext(AppContext);
  const { profile } = state;
  const { profileData, profileHistory } = profile;

  const initialValues: ProfileData = {
    name: profileData?.name ?? "",
    email: profileData?.email ?? "",
    profilePicture: profileData?.profilePicture ?? null,
  };

  const fileCorrectSize = (file: File) => {
    if (file.size > MAX__FILE_SIZE) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={profileValidationSchema}
      onSubmit={(values, { resetForm }) => {
        dispatch({ type: "UPDATE_PROFILE", payload: values });

        dispatch({
          type: "UPDATE_PROFILE_HISTORY",
          payload: profileHistory
            ? [{ ...values, timestamp: Date.now() }, ...profileHistory]
            : [
                {
                  ...values,
                  timestamp: Date.now(),
                },
              ],
        });

        resetForm();
        if (onClose) onClose();
      }}
    >
      {({ setFieldValue, setFieldError, isValid, isSubmitting, errors }) => (
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

          <div>
            <label>Profile Picture:</label>

            <input
              name="profilePicture"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.currentTarget.files
                  ? event.currentTarget.files[0]
                  : null;

                if (file) {
                  if (!fileCorrectSize(file)) {
                    setFieldError(
                      "profilePicture",
                      "File size exceeds 250KB limit"
                    );
                  } else {
                    setFieldValue("profilePicture", file);
                  }
                } else {
                  setFieldValue("profilePicture", null);
                }
              }}
            />

            {errors.profilePicture && (
              <div style={{ color: "red" }}>{errors.profilePicture}</div>
            )}
            {/* <ErrorMessage name="profilePicture" component="div" /> */}
          </div>

          <button
            className="CloseModal"
            onClick={() => {
              if (onClose) onClose();
            }}
            disabled={!onClose}
          >
            Cancel
          </button>

          <button disabled={!isValid || isSubmitting} type="submit">
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default EditProfileModal;
