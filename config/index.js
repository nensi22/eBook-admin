import { config } from "dotenv";

config();

export default {
  port: process.env.PORT,
  db: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      readPreference: "primaryPreferred",
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
  },
  sessionSecret: process.env.SESSION_SECRET,
  jwtSecret: process.env.JWT_SECRET,
  appIconPath: "/uploads/app-icons",
  userPlaceHolderPath: "/uploads/userPlaceHolder",
  categoryPath: "uploads/category",
  authorProfilePicPath: "uploads/authorProfile",
};
