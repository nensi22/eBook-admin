import mongoose from "mongoose";

const languageSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  versionKey: false,
  timestamps: true,
});

const LanguageModel = mongoose.model("Language", languageSchema);

export { LanguageModel };
