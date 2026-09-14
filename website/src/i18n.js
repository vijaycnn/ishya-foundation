import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translation resources
const resources = {
  en: {
    translation: {
      welcome: "Welcome to our website!",
      about: "About Us",
      contact: "Contact",
    },
  },
  fr: {
    translation: {
      welcome: "Bienvenue sur notre site Web!",
      about: "À propos de nous",
      contact: "Contact",
    },
  },
  hi: {
    translation: {
      welcome: "हमारी वेबसाइट पर आपका स्वागत है!",
      about: "हमारे बारे में",
      contact: "संपर्क करें",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
