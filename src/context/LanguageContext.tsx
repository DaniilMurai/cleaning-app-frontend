// src/context/LanguageContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../localization";
import { Loading } from "@/ui";

interface LanguageContextProps {
	currentLanguage: string;
	changeLanguage: (lang: string) => void;
	availableLanguages: { code: string; name: string }[];
}

const LANGUAGE_STORAGE_KEY = "app_language";

const LanguageContext = createContext<LanguageContextProps>({
	currentLanguage: "ru",
	changeLanguage: () => {},
	availableLanguages: [
		{ code: "de", name: "Deutsch" },
		{ code: "ru", name: "Русский" },
	],
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [currentLanguage, setCurrentLanguage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const availableLanguages = [
		{ code: "de", name: "Deutsch" },
		{ code: "ru", name: "Русский" },
	];

	// Загружаем сохраненный язык при первом рендере
	useEffect(() => {
		const loadSavedLanguage = async () => {
			try {
				const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
				if (savedLanguage) {
					i18n.changeLanguage(savedLanguage);
					setCurrentLanguage(savedLanguage);
				} else {
					setCurrentLanguage(i18n.language);
				}
			} catch (error) {
				console.error("Failed to load language:", error);
				setCurrentLanguage(i18n.language);
			} finally {
				setIsLoading(false);
			}
		};

		loadSavedLanguage();
	}, []);

	const changeLanguage = async (lang: string) => {
		try {
			await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
			i18n.changeLanguage(lang);
			setCurrentLanguage(lang);
		} catch (error) {
			console.error("Failed to save language:", error);
		}
	};

	if (isLoading) {
		// Можно вернуть загрузчик или null
		return <Loading />;
	}

	return (
		<LanguageContext.Provider
			value={{ currentLanguage: currentLanguage || "ru", changeLanguage, availableLanguages }}
		>
			{children}
		</LanguageContext.Provider>
	);
};

export const useLanguage = () => useContext(LanguageContext);
