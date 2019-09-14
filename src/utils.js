import React from "react";
import { Dimensions, Linking, NativeModules } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import RNFS, { DocumentDirectoryPath } from "react-native-fs";
import * as RNLocalize from "react-native-localize";
import date from "date-and-time";
import i18n from "./i18n";
import Tts from "react-native-tts";
import Voice from "react-native-voice";
import { updateTrends } from "./Database/db";

export const APP_NAME = "cbt";

export let DB_NAME = APP_NAME + ".db";

export const DOWNLOAD = "/storage/emulated/0/Download/";

export const PLAY_URL =
  "https://play.google.com/store/apps/details?id=xxx.xxx." + APP_NAME;

export const automaticRef = React.createRef();

export const cbtRef = React.createRef();

export const configRef = React.createRef();

export const diaryRef = React.createRef();

export const restructureRef = React.createRef();

export const trendsRef = React.createRef();

export const locale = NativeModules.I18nManager.localeIdentifier;

export const screenWidth = Dimensions.get("window").width;

export const Settings = {
  adProviders: [],
  dictation: false,
  incremental: false,
  isRequestLocationInEeaOrUnknown: false,
  locale: "en",
  pieChart: false,
  viewPortHeight: 592, // Moto G4
  viewPortWidth: 360 // Moto G4
};

export const themes = {
  dark: {
    backgroundColor: "#000000",
    barStyle: "light-content",
    borderColor: "#404040",
    color: "#e0e0e0",
    link: "#8080ff",
    tabBarBgColor: "#181818"
  },
  light: {
    backgroundColor: "#ffffff",
    barStyle: "dark-content",
    borderColor: "#c0c0c0",
    color: "#000000",
    link: "blue",
    tabBarBgColor: "#f4f4f4"
  }
};

export const ThemeContext = React.createContext({
  theme: themes.light,
  toggleTheme: () => {}
});

export function browser(url) {
  Linking.openURL(url);
}

export const getData = async (key, callback) => {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value) {
      callback(value);
    }
  } catch (e) {}
};

export const setData = async (key, value) => {
  try {
    AsyncStorage.setItem(key, value);
  } catch (e) {}
};

export function speak(words, cb) {
  if (!words) {
    return;
  }

  try {
    Tts.getInitStatus()
      .then(() => {
        Tts.speak(words);
      })
      .finally(() => {
        cb && cb();
      });
  } catch (e) {}
}

export const startRecognizing = async () => {
  try {
    await Voice.start(locale);
  } catch (e) {}
};

export const stopRecognizing = async () => {
  try {
    await Voice.stop();
  } catch (e) {}
};

export const cancelRecognizing = async () => {
  try {
    await Voice.cancel();
  } catch (e) {}
};

export const destroyRecognizer = async () => {
  try {
    await Voice.destroy();
  } catch (e) {}
};

export const countElements = arr => {
  if (!arr) {
    return {};
  }

  const counts = {};
  arr.map(e => (counts[e] = 1 + (counts[e] || 0)));
  return counts;
};

export const getDayFirstTs = (delta = 0) => {
  const day = date.addDays(new Date(), delta);
  return new Date(
    Date.UTC(day.getFullYear(), day.getMonth(), day.getDate())
  ).getTime();
};

export const getDayLastTs = (delta = 0) => {
  const day = date.addDayss(new Date(), delta);
  return new Date(
    Date.UTC(day.getFullYear(), day.getMonth(), day.getDate() + 1).getTime()
  );
};

export const getMonthFirstTs = (delta = 0) => {
  const month = date.addMonths(new Date(), delta);
  return new Date(Date.UTC(month.getFullYear(), month.getMonth(), 1)).getTime();
};

export const getMonthLastTs = (delta = 0) => {
  const month = date.addMonths(new Date(), delta);
  return new Date(
    Date.UTC(month.getFullYear(), month.getMonth() + 1, 1)
  ).getTime();
};

export const getMonthLast = (delta = 0) => {
  const month = date.addMonths(new Date(), delta);
  return new Date(Date.UTC(month.getFullYear(), month.getMonth() + 1, 1));
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export const getMonth = ts => {
  return MONTHS[new Date(ts).getMonth()];
};

export const getMonths = delta => {
  if (delta >= 0) {
    return [];
  }

  const months = [];

  for (let i = delta; i <= 0; i++) {
    const month = date.addMonths(new Date(), i);
    months.push(MONTHS[month.getMonth()]);
  }

  return months;
};

export const getDB = () => {
  return getDBPath() + DB_NAME;
};

export const getDBPath = () => {
  return (
    DocumentDirectoryPath.slice(0, DocumentDirectoryPath.lastIndexOf("/")) + "/"
  );
};

export const getDistortion = key => {
  switch (key) {
    case "allOrNothing":
      return i18n.t("diary.dist_all");

    case "alwaysRight":
      return i18n.t("diary.dist_right");

    case "change":
      return i18n.t("diary.dist_change");

    case "disqualifying":
      return i18n.t("diary.dist_disq");

    case "emotional":
      return i18n.t("diary.dist_emo");

    case "fairness":
      return i18n.t("diary.dist_fair");

    case "fortune":
      return i18n.t("diary.dist_fortune");

    case "labeling":
      return i18n.t("diary.dist_label");

    case "mindReading":
      return i18n.t("diary.dist_mind");

    case "minimization":
      return i18n.t("diary.dist_min");

    case "personalization":
      return i18n.t("diary.dist_person");

    case "selective":
      return i18n.t("diary.dist_sel");

    case "should":
      return i18n.t("diary.dist_should");

    default:
      return key;
  }
};

// init

(async () => {
  try {
    RNFS.exists(getDBPath() + "watermelon.db")
      .then(exists => {
        if (exists) {
          DB_NAME = "watermelon.db";
        }
      })
      .catch(err => {});
  } catch (e) {}

  try {
    Settings.locale = RNLocalize.getLocales()[0].languageCode;
  } catch (e) {}

  try {
    getData("incremental", incremental => {
      Settings.incremental = incremental === "true";
    });

    getData("pieChart", pieChart => {
      Settings.pieChart = pieChart === "true";
    });
  } catch (e) {}

  try {
    updateTrends();
    Tts.setDucking(true);
  } catch (e) {}
})();
