import * as Yup from "yup";

const update_password_schema = Yup.object().shape({
  current_password: Yup.string().required(),
  new_password: Yup.string().required(),

  confirm_new_password: Yup.string()
    //@ts-ignore
    .oneOf([Yup.ref("new_password"), null], "Password must match")
    .required(),
});

const update_number_schema = Yup.object().shape({
  new_number: Yup.string().required(" New number is required"),
  old_number: Yup.string().required(" Current number is required"),
});

export { update_password_schema, update_number_schema };
