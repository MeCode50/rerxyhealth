import * as Yup from "yup";

const validate_create_appointment = Yup.object().shape({
  day: Yup.string().required(),
  period: Yup.string().required(),
  time: Yup.string().required(),
  appointmentType: Yup.string().required(),
  doctorsId: Yup.string().required(),
});

export { validate_create_appointment };
