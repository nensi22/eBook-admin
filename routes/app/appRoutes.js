import express from "express";

import * as appController from "./appController.js";
import { verifyAdmin } from "../../middleware/auth.js";

const appRoutes = express.Router();

appRoutes.get("/", appController.renderLogin);
appRoutes.get("/dashboard", verifyAdmin, appController.renderDashboard);
appRoutes.get(
  "/settings/app-setting",
  verifyAdmin,
  appController.renderAppSetting,
);
appRoutes.get(
  "/settings/ads-setting",
  verifyAdmin,
  appController.renderAdsSetting,
);
appRoutes.get("/adminSettings", verifyAdmin, appController.renderAdminSetting);
appRoutes.get("/categories", verifyAdmin, appController.renderCategories);
appRoutes.get("/authors", verifyAdmin, appController.renderAuthors);
appRoutes.get("/languages", verifyAdmin, appController.renderLanguages);

export default appRoutes;
