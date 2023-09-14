import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  categoryImage: {
    type: String,
  },
  isFeature: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  versionKey: false,
  timestamps: true,
});

const CategoryModel = mongoose.model("Categories", categorySchema);

export { CategoryModel };
