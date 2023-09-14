import Joi from "joi";

import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  lastLogin: {
    type: Date,
  },
  isDemoAdmin: {
    type: Boolean,
    default: true,
  },
}, {
  versionKey: false,
  timestamps: true,
});

const AdminModel = mongoose.model("Admin", adminSchema);

const adminValidation = (body) => {
  const Schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  });
  return Schema.validate();
};

export { AdminModel, adminValidation };
