import i18n from "i18n-js";

import de from "./Locales/de.json";
import en from "./Locales/en.json";

i18n.defaultLocale = "en";
i18n.locale = "en";
i18n.fallbacks = true;
i18n.translations = { de, en };

export default i18n;
