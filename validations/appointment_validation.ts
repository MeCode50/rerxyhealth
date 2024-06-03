import * as Yup from "yup";

const validate_create_appointment = Yup.object().shape({
  startTime: Yup.string().required(),
  period: Yup.string().required(),
  endTime: Yup.string().required(),
  appointmentType: Yup.string().required(),
  doctorsId: Yup.string().required(),
});

export { validate_create_appointment };
