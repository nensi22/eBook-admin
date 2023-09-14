import logger from "../../config/logger.js";
import { handleError } from "../../handler/index.js";
import { AdminModel } from "../../models/admin.js";
import { AuthorModel } from "../../models/authors.js";
import { CategoryModel } from "../../models/categories.js";
import { LanguageModel } from "../../models/languages.js";
import { SettingModel } from "../../models/setting.js";

// const ITEMS_PER_PAGE = 1;

export const renderLogin = async (req, res) => {
  logger.info("at RenderLogin Controller");
  try {
    if (req.session.admin) {
      return res.redirect("dashboard");
    } else {
      return res.render("auth/login", {
        data: {
          error: null,
        },
      });
    }
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

export const renderDashboard = async (req, res) => {
  logger.info("at renderDashboard Controller");
  try {
    const adminData = await AdminModel.findOne();
    const settingData = await SettingModel.findOne();
    return res.render("app/dashboard", {
      page: "dashboard",
      setting: settingData,
      admin: adminData,
    });
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

export const renderAppSetting = async (req, res) => {
  logger.info("at renderAppSetting Controller");
  try {
    const adminData = await AdminModel.findOne();
    const settingData = await SettingModel.findOne();
    return res.render("app/appSetting", {
      page: "setting",
      subPage: "appSetting",
      setting: settingData,
      admin: adminData,
    });
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

export const renderAdsSetting = async (req, res) => {
  logger.info("at renderAdsSetting Controller");
  try {
    const adminData = await AdminModel.findOne();
    const settingData = await SettingModel.findOne();
    return res.render("app/adsSetting", {
      page: "setting",
      subPage: "adsSetting",
      setting: settingData,
      admin: adminData,
    });
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

export const renderAdminSetting = async (req, res) => {
  logger.info("at renderAdminSetting Controller");
  try {
    const adminData = await AdminModel.findOne();
    const settingData = await SettingModel.findOne();
    return res.render("app/adminSetting", {
      page: "adminSetting",
      setting: settingData,
      admin: adminData,
    });
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

export const renderCategories = async (req, res) => {
  logger.info("at renderCategories Controller");
  try {
    const adminData = await AdminModel.findOne();
    const settingData = await SettingModel.findOne();
    const categoriesData = await CategoryModel.find();
    return res.render("app/categories", {
      page: "categories",
      categories: categoriesData,
      admin: adminData,
      setting: settingData,
    });
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

export const renderAuthors = async (req, res) => {
  logger.info("at renderAuthors Controller");
  try {
    const adminData = await AdminModel.findOne();
    const authorData = await AuthorModel.find();
    const languageData = await LanguageModel.find();
    const settingData = await SettingModel.findOne();
    return res.render("app/authors", {
      page: "authors",
      authors: authorData,
      admin: adminData,
      setting: settingData,
      languages: languageData,
    });
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};

export const renderLanguages = async (req, res) => {
  logger.info("at renderLanguages Controller");
  try {
    const adminData = await AdminModel.findOne();
    const settingData = await SettingModel.findOne();
    const languageData = await LanguageModel.find();
    return res.render("app/languages", {
      page: "languages",
      languages: languageData,
      admin: adminData,
      setting: settingData,
    });
  } catch (error) {
    logger.error(error);
    return handleError({ res, err: error.message });
  }
};
