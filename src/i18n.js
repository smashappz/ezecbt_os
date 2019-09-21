import i18n from "i18n-js";
import { NativeModules } from "react-native";

import de from "./Locales/de.json";
import en from "./Locales/en.json";

i18n.defaultLocale = "en";

try {
  i18n.locale = NativeModules.I18nManager.localeIdentifier.split("_")[0];
} catch (e) {
  i18n.locale = "en";
}

i18n.fallbacks = true;
i18n.translations = { de, en };

export default i18n;
