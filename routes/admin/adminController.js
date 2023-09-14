import { unlink } from "fs";
import config from "../../config/index.js";
import logger from "../../config/logger.js";
import { handleError, handleResponse } from "../../handler/index.js";
import {
  compareEncryptedPassword,
  generateEncryptedPassword,
} from "../../helper/common.js";
import { AdminModel, adminValidation } from "../../models/admin.js";
import { SettingModel } from "../../models/setting.js";
import { CategoryModel } from "../../models/categories.js";
import { AuthorModel } from "../../models/authors.js";
import { LanguageModel } from "../../models/languages.js";

export const verifyLogin = async (req, res) => {
  logger.info("at VerifyLogin Controller");
  try {
    const validate = adminValidation(req.body);
    console.log("verifyLogin  req.body:", req.body);
    if (validate.error) {
      return res.render(
        "auth/login",
        handleError({
          // error: validate.error._original,
          err_msg: validate.error._original,
        }),
      );
    }

    const { email, password } = req.body;
    console.log("req.body", req.body);

    const adminDetail = await AdminModel.findOne({ email });
    if (!adminDetail) {
      return res.render(
        "auth/login",
        handleResponse({
          res,
          data: { reloadRequired: true },
          msg: "Invalid Credentials",
        }),
      );
    }

    const validPassword = await compareEncryptedPassword(
      password,
      adminDetail.password,
    );

    if (!validPassword) {
      return res.render(
        "auth/login",
        handleResponse({
          res,
          data: { reloadRequired: true },
          msg: "Invalid Credentials",
        }),
      );
    }

    adminDetail.lastLogin = Date.now();
    await adminDetail.save();

    req.session.admin = {
      _id: adminDetail._id,
      name: adminDetail.name,
      email: adminDetail.email,
      isDemoAdmin: adminDetail.isDemoAdmin,
    };
    return res.redirect("/dashboard");
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

export const logoutAdmin = async (req, res) => {
  logger.info("at Logout Controller");
  try {
    console.log("BEFORE req.session.admin:", req.session.admin);
    req.session.destroy();
    console.log("AFTER req.session.admin:", req.session);
    return res.redirect("/");
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

export const verifyChangePwd = async (req, res) => {
  logger.info("at VerifyChangePwd Controller");
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!req.session.admin) {
      return res.redirect("/");
    }

    const adminId = req.session.admin._id;

    const adminData = await Admin.findById(adminId);

    const validPassword = await compareEncryptedPassword(
      currentPassword,
      adminData.password,
    );

    if (!validPassword) {
      return handleResponse({
        res,
        data: {
          success: false,
          reloadRequired: true,
        },
        msg: "Invalid current password",
      });
    }

    adminData.password = await generateEncryptedPassword(newPassword);
    await adminData.save();

    return handleResponse({
      res,
      data: {
        success: true,
        reloadRequired: true,
      },
      msg: "Password changed successfully",
    });
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

// setting
export const updateAdminSetting = async (req, res) => {
  logger.info("at updateAdminSetting Controller");
  try {
    const { appName, copyrightYear, appHost } = req.body;
    let appIcon = req.file;

    const settingData = await SettingModel.findOne();

    if (settingData) {
      if (appIcon) {
        await unlink(`admin/${settingData.appIcon}`, (err) => {
          if (err) {
            console.error("Error deleting previous file:", err);
            return;
          }
          console.log("deleted previous appIcon");
        });

        settingData.appIcon = `${config.appIconPath}/${req.file.filename}`;

        settingData.appName = req.body.appName;
        settingData.appHost = req.body.appHost;
        settingData.copyrightYear = req.body.copyrightYear;

        await settingData.save();
      } else {
        settingData.appName = appName;
        settingData.appHost = appHost;
        settingData.copyrightYear = copyrightYear;

        await settingData.save();
      }
      console.log("Upadte AdminSetting req.body : ", req.body);

      return handleResponse({
        res,
        data: { reloadRequired: true },
        msg: "Admin settings updated successfully.",
      });
    } else {
      return handleError({
        res,
        err_msg: "Setting not found",
      });
    }
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

export const updateAppSetting = async (req, res) => {
  try {
    const {
      androidAppLink,
      iOSAppLink,
      androidAppVersionCode,
      iOSAppVersionCode,
      androidUpdatePopup,
      iOSUpdatePopup,
      androidForceUpdate,
      iOSForceUpdate,
      oneSignalAppID,
      oneSignalSecretKey,
      updateAppMessage,
      privacyPolicy,
      termsOfUse,
    } = req.body;

    let userPlaceholder = req.file;

    const settingData = await SettingModel.findOne();

    if (settingData) {
      if (userPlaceholder) {
        await unlink(`admin/${settingData.userPlaceholder}`, (err) => {
          if (err) {
            console.error("Error deleting previous file:", err);
            return;
          }
          console.log("Deleted previous userPlaceholder");
        });
        settingData.userPlaceholder =
          `${config.userPlaceHolderPath}/${req.file.filename}`;

        settingData.androidAppLink = req.body.androidAppLink;
        settingData.iOSAppLink = req.body.iOSAppLink;
        settingData.androidAppVersionCode = req.body.androidAppVersionCode;
        settingData.iOSAppVersionCode = req.body.iOSAppVersionCode;
        settingData.androidUpdatePopup = req.body.androidUpdatePopup === "on"
          ? true
          : false;
        settingData.iOSUpdatePopup = req.body.iOSUpdatePopup === "on"
          ? true
          : false;
        settingData.androidForceUpdate = req.body.androidForceUpdate === "on"
          ? true
          : false;
        settingData.iOSForceUpdate = req.body.iOSForceUpdate === "on"
          ? true
          : false;
        settingData.oneSignalAppID = req.body.oneSignalAppID;
        settingData.oneSignalSecretKey = req.body.oneSignalSecretKey;
        settingData.updateAppMessage = req.body.updateAppMessage;
        settingData.privacyPolicy = req.body.privacyPolicy;
        settingData.termsOfUse = req.body.termsOfUse;

        await settingData.save();
      } else {
        settingData.androidAppLink = androidAppLink;
        settingData.iOSAppLink = iOSAppLink;
        settingData.androidAppVersionCode = androidAppVersionCode;
        settingData.iOSAppVersionCode = iOSAppVersionCode;
        settingData.androidUpdatePopup = androidUpdatePopup === "on"
          ? true
          : false;
        settingData.iOSUpdatePopup = iOSUpdatePopup === "on" ? true : false;
        settingData.androidForceUpdate = androidForceUpdate === "on"
          ? true
          : false;
        settingData.iOSForceUpdate = iOSForceUpdate === "on" ? true : false;
        settingData.oneSignalAppID = oneSignalAppID;
        settingData.oneSignalSecretKey = oneSignalSecretKey;
        settingData.updateAppMessage = updateAppMessage;
        settingData.privacyPolicy = privacyPolicy;
        settingData.termsOfUse = termsOfUse;

        await settingData.save();
      }
      console.log("Upadte AppSetting req.body : ", req.body);

      return handleResponse({
        res,
        data: { reloadRequired: true },
        msg: "App settings updated successfully.",
      });
    } else {
      return handleError({
        res,
        err_msg: "Setting not found",
      });
    }
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

export const updateAdsSetting = async (req, res) => {
  logger.info("at updateAdsSetting Controller");
  try {
    const {
      isVideoAdsShow,
      isRewardedVideoAdsShow,
      isAdShow,
      adCount,
      androidAdMobAppId,
      iOSAdMobAppId,
      androidAdMobBannerId,
      iOSAdMobBannerId,
      androidAdMobInterstitialAdId,
      iOSAdMobInterstitialAdId,
      androidAdMobRewardedVideoAdId,
      iOSAdMobRewardedVideoAdId,
    } = req.body;

    const settingData = await SettingModel.findOne();

    if (settingData) {
      settingData.isAdShow = isAdShow === "on" ? true : false;
      settingData.isVideoAdsShow = isVideoAdsShow === "on" ? true : false;
      settingData.isRewardedVideoAdsShow = isRewardedVideoAdsShow === "on"
        ? true
        : false;
      settingData.adCount = adCount;
      settingData.androidAdMobAppId = androidAdMobAppId;
      settingData.androidAdMobBannerId = androidAdMobBannerId;
      settingData.androidAdMobInterstitialAdId = androidAdMobInterstitialAdId;
      settingData.androidAdMobRewardedVideoAdId = androidAdMobRewardedVideoAdId;
      settingData.iOSAdMobAppId = iOSAdMobAppId;
      settingData.iOSAdMobBannerId = iOSAdMobBannerId;
      settingData.iOSAdMobInterstitialAdId = iOSAdMobInterstitialAdId;
      settingData.iOSAdMobRewardedVideoAdId = iOSAdMobRewardedVideoAdId;

      console.log("Upadte AdsSetting req.body : ", req.body);

      await settingData.save();

      return handleResponse({
        res,
        data: { reloadRequired: true },
        msg: "Ads settings updated successfully.",
      });
    } else {
      return handleError({
        res,
        err_msg: "Setting not found",
      });
    }
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

// Category
export const addCategory = async (req, res) => {
  logger.info("at AddCategory Controller");
  try {
    const category = new CategoryModel({
      categoryName: req.body.categoryName,
      categoryImage: `${config.categoryPath}/${req.file.filename}`,
    });
    console.log("Add Category req.body : ", req.body);

    await category.save();

    return handleResponse({
      res,
      data: {
        reloadRequired: true,
      },
      msg: "Category Added Successfully.",
    });
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

export const updateCategory = async (req, res) => {
  logger.info("at updateCategory Controller");
  try {
    const { _id, newCategoryName } = req.body;
    let categoryImage = req.file;

    const categoryData = await CategoryModel.findOne({ _id });

    if (categoryData) {
      if (categoryImage) {
        await unlink(`admin/${categoryData.categoryImage}`, (err) => {
          if (err) {
            console.error("Error deleting previous file:", err);
            return;
          }
          console.log("Deleted previous categoryImage");
        });
        categoryData.categoryImage =
          `${config.categoryPath}/${req.file.filename}`;

        categoryData.categoryName = req.body.newCategoryName;
        await categoryData.save();
      } else {
        categoryData.categoryName = newCategoryName;
        await categoryData.save();
      }
      console.log("Upadte Category req.body : ", req.body);

      return handleResponse({
        res,
        msg: "Category Updated Successfully",
        data: { reloadRequired: true },
      });
    } else {
      return handleError({
        res,
        err_msg: "Category not found",
      });
    }
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

export const updateFeature = async (req, res) => {
  logger.info("at updateFeature Controller");
  try {
    const { _id } = req.params;

    const categoryData = await CategoryModel.findById(_id);

    if (categoryData) {
      categoryData.isFeature = !categoryData.isFeature;

      await categoryData.save();

      return handleResponse({
        res,
        msg: "Category updated successfully",
        data: { reloadRequired: true },
      });
    } else {
      return handleError({
        res,
        err_msg: "Category not found",
      });
    }
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

export const updateCategoryStatus = async (req, res) => {
  logger.info("at updateStatus controller");
  try {
    const { _id } = req.params;

    const categoryData = await CategoryModel.findById(_id);

    if (categoryData) {
      categoryData.isActive = !categoryData.isActive;

      await categoryData.save();

      return handleResponse({
        res,
        msg: "Category updated successfully",
        data: { reloadRequired: true },
      });
    } else {
      return handleError({
        res,
        err_msg: "Category not found",
      });
    }
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  logger.info("at deleteCategory controller");
  try {
    const { _id } = req.params;

    const categoryData = await CategoryModel.findById(_id);

    if (categoryData) {
      if (categoryData.categoryImage != "") {
        await unlink(`admin/${categoryData.categoryImage}`, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
            return;
          }
          console.log("Category Image deleted");
        });
      }

      await CategoryModel.findByIdAndDelete(_id);

      return handleResponse({
        res,
        msg: "Category deleted successfully",
        data: { reloadRequired: true },
      });
    } else {
      return handleError({
        res,
        err_msg: "Category not found",
      });
    }
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

// Author
export const addAuthor = async (req, res) => {
  logger.info("at addAuthor Controller");
  try {
    const languageNames = req.body.languages;
    let languageIds = [];
    if (Array.isArray(languageNames)) {
      languageIds = await LanguageModel.find({
        language: { $in: languageNames },
      }, "_id");
    } else {
      const languageId = await LanguageModel.findOne(
        { language: languageNames },
        "_id",
      );
      languageIds.push(languageId);
    }

    const author = new AuthorModel({
      authorName: req.body.authorName,
      profilePic: `${config.authorProfilePicPath}/${req.file.filename}`,
      description: req.body.description,
      languages: languageIds.map((lang) => lang._id),
    });
    console.log("Add Author req.body : ", req.body);

    await author.save();

    return handleResponse({
      res,
      data: {
        reloadRequired: true,
      },
      msg: "Author Added Successfully.",
    });
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

export const updateAuthor = async (req, res) => {
  logger.info("at updateAuthor Controller");
  try {
    const { _id, newAuthorName, newDescription, newLanguages } = req.body;

    let profilePic = req.file;

    const authorData = await AuthorModel.findOne({ _id });

    if (authorData) {
      if (profilePic) {
        await unlink(`admin/${authorData.profilePic}`, (err) => {
          if (err) {
            console.error("Error deleting previous file:", err);
            return;
          }
          console.log("Deleted previous author profilePic");
        });
        authorData.profilePic =
          `${config.authorProfilePicPath}/${req.file.filename}`;
        authorData.authorName = req.body.newAuthorName;
        authorData.description = req.body.newDescription;
        authorData.languages = req.body.newLanguages;

        await authorData.save();
      } else {
        authorData.authorName = newAuthorName;
        authorData.description = newDescription;
        authorData.languages = newLanguages;
        await authorData.save();
      }
      console.log("Update Author req.body : ", req.body);

      return handleResponse({
        res,
        msg: "Author Updated Successfully",
        data: { reloadRequired: true },
      });
    } else {
      return handleError({
        res,
        err_msg: "Author not found",
      });
    }
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

export const updateAuthorStatus = async (req, res) => {
  logger.info("at updateAuthorStatus controller");
  try {
    const { _id } = req.params;

    const authorData = await AuthorModel.findById(_id);

    if (authorData) {
      authorData.isActive = !authorData.isActive;

      await authorData.save();

      return handleResponse({
        res,
        msg: "Author updated successfully",
        data: { reloadRequired: true },
      });
    } else {
      return handleError({
        res,
        err_msg: "Author not found",
      });
    }
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

export const deleteAuthor = async (req, res) => {
  logger.info("at deleteAuthor controller");
  try {
    const { _id } = req.params;

    const authorData = await AuthorModel.findById(_id);

    if (authorData) {
      if (authorData.profilePic != "") {
        await unlink(`admin/${authorData.profilePic}`, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
            return;
          }
          console.log("Author profilPic deleted");
        });
      }

      await AuthorModel.findByIdAndDelete(_id);

      return handleResponse({
        res,
        data: { reloadRequired: true },
        msg: "Author deleted successfully",
      });
    } else {
      return handleError({
        res,
        err: "Author not found",
      });
    }
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

// language
export const addLanguage = async (req, res) => {
  logger.info("at addLanguage Controller");
  try {
    const language = new LanguageModel({
      language: req.body.language,
    });
    console.log("Add Language req.body : ", req.body);

    await language.save();

    return handleResponse({
      res,
      data: {
        reloadRequired: true,
      },
      msg: "Language Added Successfully.",
    });
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

export const updateLanguage = async (req, res) => {
  logger.info("at updateLanguage Controller");
  try {
    const { _id, newLanguage } = req.body;

    const languageData = await LanguageModel.findOne({ _id });

    if (languageData) {
      languageData.language = newLanguage;
      await languageData.save();

      console.log("Update Language req.body : ", req.body);

      return handleResponse({
        res,
        msg: "Language Updated Successfully",
        data: { reloadRequired: true },
      });
    } else {
      return handleError({
        res,
        err_msg: "Language not found",
      });
    }
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

export const updateLanguageStatus = async (req, res) => {
  logger.info("at updateLanguageStatus controller");
  try {
    const { _id } = req.params;

    const languageData = await LanguageModel.findById(_id);

    if (languageData) {
      languageData.isActive = !languageData.isActive;

      await languageData.save();

      return handleResponse({
        res,
        msg: "Language updated successfully",
        data: { reloadRequired: true },
      });
    } else {
      return handleError({
        res,
        err_msg: "Language not found",
      });
    }
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

export const deleteLanguage = async (req, res) => {
  logger.info("at deleteLanguage controller");
  try {
    const { _id } = req.params;

    const languageData = await LanguageModel.findById(_id);

    if (languageData) {
      await LanguageModel.findByIdAndDelete(_id);

      return handleResponse({
        res,
        data: { reloadRequired: true },
        msg: "Laguage deleted successfully",
      });
    } else {
      return handleError({
        res,
        err: "Language not found",
      });
    }
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};
