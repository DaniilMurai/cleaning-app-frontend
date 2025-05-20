import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization"; // если используете Expo
import de from "./languages/de.json";
import ru from "./languages/ru.json";

// Объединяем ресурсы для всех локалей
const resources = {
	de: {
		translation: de,
	},
	ru: {
		translation: ru,
	},
};

const supportedLanguage = ["de", "ru"];
const systemLang = Localization.locale.split("-")[0];
const initialLanguage = supportedLanguage.includes(systemLang) ? systemLang : "ru";

i18n.use(initReactI18next).init({
	resources,
	// Определяем язык устройства или используем английский по умолчанию
	lng: initialLanguage,
	fallbackLng: "ru",
	interpolation: {
		escapeValue: false, // не экранировать HTML в переводах
	},
});

export default i18n;
