import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  androidAppLink: {
    type: String,
    default: "",
  },
  iOSAppLink: {
    type: String,
    default: "",
  },
  androidAppVersionCode: {
    type: Number,
    default: 1,
  },
  iOSAppVersionCode: {
    type: Number,
    default: 1,
  },
  androidUpdatePopup: {
    type: Boolean,
    default: false,
  },
  iOSUpdatePopup: {
    type: Boolean,
    default: false,
  },
  androidForceUpdate: {
    type: Boolean,
    default: false,
  },
  iOSForceUpdate: {
    type: Boolean,
    default: false,
  },
  oneSignalAppID: {
    type: String,
    default: "",
  },
  oneSignalSecretKey: {
    type: String,
    default: "",
  },
  userPlaceholder: {
    type: String,
    default: "/dist/img/profilePic/defaultProfilePic.png",
  },
  privacyPolicy: {
    type: String,
    default: "",
  },
  termsOfUse: {
    type: String,
    default: "",
  },
  isAdShow: {
    type: Boolean,
    default: false,
  },
  isVideoAdsShow: {
    type: Boolean,
    default: false,
  },
  isRewardedVideoAdsShow: {
    type: Boolean,
    default: false,
  },
  adCount: {
    type: Number,
    default: 0,
  },
  androidAdMobAppId: {
    type: String,
    default: "",
  },
  androidAdMobBannerId: {
    type: String,
    default: "",
  },
  androidAdMobInterstitialAdId: {
    type: String,
    default: "",
  },
  androidAdMobRewardedVideoAdId: {
    type: String,
    default: "",
  },
  iOSAdMobAppId: {
    type: String,
    default: "",
  },
  iOSAdMobBannerId: {
    type: String,
    default: "",
  },
  iOSAdMobInterstitialAdId: {
    type: String,
    default: "",
  },
  iOSAdMobRewardedVideoAdId: {
    type: String,
    default: "",
  },
  updateAppMessage: {
    type: String,
    default: "",
  },
  appName: {
    type: String,
    default: "Quiz & Earn",
  },
  appIcon: {
    type: String,
    default: "/public/dist/img/appIcon.png",
  },
  copyrightYear: {
    type: String,
    default: "2023",
  },
  appHost: {
    type: String,
    default: "AdminLTE.io",
  },
}, {
  versionKey: false,
  timestamps: true,
  capped: { size: 1 },
});

const SettingModel = mongoose.model("Setting", settingSchema);

export { SettingModel };
