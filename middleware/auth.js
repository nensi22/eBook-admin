import jwt from "jsonwebtoken";
import logger from "../config/logger.js";
import { handleError, handleResponse } from "../handler/index.js";
import config from "../config/index.js";

export const verifyAdmin = async (req, res, next) => {
  logger.info("Verify Admin Controller");
  try {
    if (req.session.admin) {
      if (req.session.admin.isDemoAdmin) {
        return handleResponse({
          res,
          msg: `You can't perform this action because you are Demo Admin`,
          data: { reloadRequired: false },
        });
      } else {
        next();
      }
    } else {
      res.redirect("/");
    }
  } catch (error) {
    logger.error(error);
    return handleError({
      res,
      statusCode: error.statusCode ?? 500,
      err_msg: error.message,
    });
  }
};
