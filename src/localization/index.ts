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

i18n.use(initReactI18next).init({
	resources,
	// Определяем язык устройства или используем английский по умолчанию
	lng: Localization.locale.split("-")[0] || "ru",
	fallbackLng: "ru",
	interpolation: {
		escapeValue: false, // не экранировать HTML в переводах
	},
});

export default i18n;
