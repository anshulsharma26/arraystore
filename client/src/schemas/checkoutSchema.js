import * as yup from 'yup';

export const checkoutSchema = yup.object({
  street: yup.string().required('Street address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  postalCode: yup
    .string()
    .matches(/^\d{5,6}$/, 'Enter a valid postal code')
    .required('Postal code is required'),
  country: yup.string().required('Country is required'),
});
