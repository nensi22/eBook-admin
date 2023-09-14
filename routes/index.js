import express from "express";

import adminRoutes from "./admin/adminRoutes.js";
import appRoutes from "./app/appRoutes.js";

const mainRoutes = express.Router();

mainRoutes.use("/admin", adminRoutes);
mainRoutes.use("/", appRoutes);

export default mainRoutes;
