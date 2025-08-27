import * as Yup from "yup";

export const profileValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  profilePicture: Yup.mixed().notRequired(),
});
