import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
  authorName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  languages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Language",
    required: true,
  }],
  profilePic: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  versionKey: false,
  timestamps: true,
});

const AuthorModel = mongoose.model("Author", authorSchema);

export { AuthorModel };
