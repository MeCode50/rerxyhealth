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
});

const validate_login = Yup.object().shape({
  email: Yup.string().required().email(),
  password: Yup.string().required(),
});
export { createUserValidation, validate_login };
