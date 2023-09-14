import express from "express";

import * as adminController from "./adminController.js";
import { verifyAdmin } from "../../middleware/auth.js";
import {
  // appIconeUpload,
  // authorProfileUpload,
  // categoryUpload,
  imageStore,
  // userPlaceHolderUpload,
} from "../../middleware/upload.js";

const adminRoutes = express.Router();

adminRoutes.post("/login", adminController.verifyLogin);
adminRoutes.get("/logout", verifyAdmin, adminController.logoutAdmin);

// settings
adminRoutes.post(
  "/changePassword",
  verifyAdmin,
  adminController.verifyChangePwd,
);

// adminRoutes.post(
//   "/updateAdminSetting",
//   appIconeUpload.single("appIcon"),
//   verifyAdmin,
//   adminController.updateAdminSetting,
// );

adminRoutes.post(
  "/updateAdminSetting",
  imageStore("admin/uploads/app-icons", "appIcon"),
  verifyAdmin,
  adminController.updateAdminSetting,
);

adminRoutes.post(
  "/updateAppSetting",
  imageStore("admin/uploads/userPlaceholder", "userPlaceholder"),
  verifyAdmin,
  adminController.updateAppSetting,
);

adminRoutes.post(
  "/updateAdsSetting",
  verifyAdmin,
  adminController.updateAdsSetting,
);

// category
adminRoutes.post(
  "/addCategory",
  verifyAdmin,
  imageStore("admin/uploads/category", "categoryImage"),
  adminController.addCategory,
);

adminRoutes.post(
  "/updateCategory",
  verifyAdmin,
  imageStore("admin/uploads/category", "newCategoryImage"),
  adminController.updateCategory,
);

adminRoutes.patch(
  "/category/feature/:_id",
  verifyAdmin,
  adminController.updateFeature,
);

adminRoutes.patch(
  "/category/status/:_id",
  verifyAdmin,
  adminController.updateCategoryStatus,
);

adminRoutes.delete(
  "/deleteCategory/:_id",
  verifyAdmin,
  adminController.deleteCategory,
);

// Author
adminRoutes.post(
  "/addAuthor",
  verifyAdmin,
  imageStore("admin/uploads/authorProfile", "profilePic"),
  adminController.addAuthor,
);

adminRoutes.post(
  "/updateAuthor",
  verifyAdmin,
  imageStore("admin/uploads/authorProfile", "newProfilePic"),
  adminController.updateAuthor,
);

adminRoutes.patch(
  "/author/status/:_id",
  verifyAdmin,
  adminController.updateAuthorStatus,
);

adminRoutes.delete(
  "/deleteAuthor/:_id",
  verifyAdmin,
  adminController.deleteAuthor,
);

// language
adminRoutes.post(
  "/addLanguage",
  verifyAdmin,
  adminController.addLanguage,
);

adminRoutes.post(
  "/updateLanguage",
  verifyAdmin,
  adminController.updateLanguage,
);

adminRoutes.patch(
  "/language/status/:_id",
  verifyAdmin,
  adminController.updateLanguageStatus,
);

adminRoutes.delete(
  "/deleteLanguage/:_id",
  verifyAdmin,
  adminController.deleteLanguage,
);

export default adminRoutes;
