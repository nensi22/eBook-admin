import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import MongoDBStoreModule from "connect-mongodb-session";

import db from "./models/dbConnection.js";
import config from "./config/index.js";
import { AdminModel } from "./models/admin.js";
import mainRoutes from "./routes/index.js";
import { generateEncryptedPassword } from "./helper/common.js";
import { SettingModel } from "./models/setting.js";

const app = express();

const MongoDBStore = MongoDBStoreModule(session);

const store = new MongoDBStore({
  uri: config.db.uri,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "admin");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("admin/public"));
app.use("/uploads", express.static("admin/uploads"));
app.use(express.json());

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: store,
}));

app.use(mainRoutes);

db.once("open", async () => {
  console.log("Database connected successfully");

  const checkAdmin = await AdminModel.countDocuments();
  const password = "admin";

  if (checkAdmin === 0) {
    const hashedPassword = await generateEncryptedPassword(password);
    const admin = new AdminModel({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      isDemoAdmin: false,
    });

    await admin.save();
    console.log("admin created : ", admin);
  }
  const setting = await SettingModel.findOne();

  if (!setting) {
    await SettingModel.create({});
    console.log("App Setting created");
  }

  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
});

db.on("error", (err) => {
  console.error("Database connection error:", err);
  process.exit(1);
});
