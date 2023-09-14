import multer from "multer";
import config from "../config/index.js";
import fs from "fs";

// let appIconStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, `admin/${config.appIconPath}`);
//   },
//   filename: (req, file, cb) => {
//     let extArray = file.mimetype.split("/");
//     let extension = extArray[extArray.length - 1] === "octet-stream"
//       ? "heic"
//       : extArray[extArray.length - 1];
//     cb(
//       null,
//       `${file.fieldname}-${req.body?.appName}-${Date.now()}.${extension}`,
//     );
//   },
// });
// let appIconeUpload = multer({
//   storage: appIconStorage,
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype == "image/png" ||
//       file.mimetype == "image/jpg" ||
//       file.mimetype == "image/jpeg" ||
//       file.mimetype == "image/x-icon" ||
//       file.mimetype == "application/octet-stream"
//     ) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb("Only .png, .jpg and .jpeg format allowed!");
//     }
//   },
// });

// let userPlaceholderStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, `admin/${config.userPlaceHolderPath}`);
//   },
//   filename: (req, file, cb) => {
//     let extArray = file.mimetype.split("/");
//     let extension = extArray[extArray.length - 1] === "octet-stream"
//       ? "heic"
//       : extArray[extArray.length - 1];
//     cb(
//       null,
//       `${file.fieldname}-${req.body?.userPlaceholder}-${Date.now()}.${extension}`,
//     );
//   },
// });
// let userPlaceHolderUpload = multer({
//   storage: userPlaceholderStorage,
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype == "image/png" ||
//       file.mimetype == "image/jpg" ||
//       file.mimetype == "image/jpeg" ||
//       file.mimetype == "image/x-icon" ||
//       file.mimetype == "application/octet-stream"
//     ) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb("Only .png, .jpg and .jpeg format allowed!");
//     }
//   },
// });

// let categoryStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, `admin/${config.categoryPath}`);
//   },
//   filename: (req, file, cb) => {
//     let extArray = file.mimetype.split("/");
//     let extension = extArray[extArray.length - 1] === "octet-stream"
//       ? "heic"
//       : extArray[extArray.length - 1];
//     cb(
//       null,
//       `${file.fieldname}-${req.body?.categoryName}-${Date.now()}.${extension}`,
//     );
//   },
// });
// let categoryUpload = multer({
//   storage: categoryStorage,
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype == "image/png" ||
//       file.mimetype == "image/jpg" ||
//       file.mimetype == "image/jpeg" ||
//       file.mimetype == "image/x-icon" ||
//       file.mimetype == "application/octet-stream"
//     ) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb("Only .png, .jpg and .jpeg format allowed!");
//     }
//   },
// });

// let authorProfileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, `admin/${config.authorProfilePicPath}`);
//   },
//   filename: (req, file, cb) => {
//     let extArray = file.mimetype.split("/");
//     let extension = extArray[extArray.length - 1] === "octet-stream"
//       ? "heic"
//       : extArray[extArray.length - 1];
//     cb(
//       null,
//       `${file.fieldname}-${req.body?.authorName}-${Date.now()}.${extension}`,
//     );
//   },
// });
// let authorProfileUpload = multer({
//   storage: authorProfileStorage,
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype == "image/png" ||
//       file.mimetype == "image/jpg" ||
//       file.mimetype == "image/jpeg" ||
//       file.mimetype == "image/x-icon" ||
//       file.mimetype == "application/octet-stream"
//     ) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb("Only .png, .jpg and .jpeg format allowed!");
//     }
//   },
// });

// export {
//   appIconeUpload,
//   authorProfileUpload,
//   categoryUpload,
//   userPlaceHolderUpload,
// };

const imageStore =
  (destination, filename, single = "single") => async (req, res, next) => {
    return new Promise((resolve, reject) => {
      const multerStorage = multer.diskStorage({
        destination: (req, file, cb) => {
          fs.mkdirSync(destination, { recursive: true });
          cb(null, destination);
        },
        filename: (req, file, cb) => {
          const ext = file.mimetype.split("/")[1];
          cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
        },
      });
      if (single === "single") {
        multer({ storage: multerStorage }).single(filename)(
          req,
          res,
          next,
        );
      } else {
        multer({ storage: multerStorage }).array(filename)(
          req,
          res,
          next,
        );
      }
    })
      .then(() => next())
      .catch((err) => {
        res.send({ error: err });
      });
  };

export { imageStore };
