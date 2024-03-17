import * as Yup from "yup";
// Create user Yup input validation
const createUserValidation = Yup.object().shape({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  dateOfBirth: Yup.date().required(),
  country: Yup.string().required(),
  phoneNumber: Yup.string().required(),
  schoolName: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(12).required(),
  /*address: Yup.object().shape({
    state: Yup.string().required("State is required"),
    local_government: Yup.string().required("Local government is required"),
    city: Yup.string().required("City is required"),
    street: Yup.string().required("Street is required"),
  }),*/
});

const validate_login = Yup.object().shape({
  email: Yup.string().required().email(),
  password: Yup.string().required(),
});
export { createUserValidation, validate_login };
