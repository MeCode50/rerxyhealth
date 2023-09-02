import * as Yup from "yup";

export const validate_product = Yup.object().shape({
  image: Yup.string().required(),
  title: Yup.string().required(),
  amount: Yup.number().required(),
  delivery: Yup.string().required(),
  description: Yup.string().required(),
  howToUse: Yup.string().required(),
  quantity: Yup.number().required(),
  productCategory: Yup.string().required(),
});
