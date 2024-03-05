const Joi = require("joi");
const mongoose = require("mongoose");

const signupSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().min(8).required(),
});

const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().min(8).required(),
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  failedLoginAttempts: { type: Number, default: 0 },
  accountLocked: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
  userSchema,
  signupSchema,
  signinSchema,
};
