import * as Yup from "yup";

export const validate_completeProfile = Yup.object().shape({
  username: Yup.string().required().max(15, "Username is too long"),
  matricNumber: Yup.string().required(),
});
