import Joi from "joi";

const authSchema = Joi.object({
  fullName: Joi.string().required(),
  userName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.ref("password"),
  gender: Joi.string().valid("male", "female").required(),
});

export default authSchema;
