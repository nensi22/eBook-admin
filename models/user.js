import Joi from "joi";

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  countryCode: {
    type: Number,
    require: true,
  },
  mobile: {
    type: Number,
    require: true,
  },
  profilePic: {
    type: String,
  },
  token: {
    type: String,
    require: true,
  },
  userStatus: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
}, {
  versionKey: false,
  timestamps: true,
});

const UserModel = mongoose.model("User", userSchema);

const userValidation = (body) => {
  const Schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    // token: Joi.string().optional(),
  });
  return Schema.validate();
};

export { UserModel, userValidation };
