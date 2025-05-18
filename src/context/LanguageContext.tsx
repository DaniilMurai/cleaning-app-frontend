// src/context/LanguageContext.tsx
import React, { createContext, useContext, useState } from "react";
import i18n from "../localization";

interface LanguageContextProps {
	currentLanguage: string;
	changeLanguage: (lang: string) => void;
	availableLanguages: { code: string; name: string }[];
}

const LanguageContext = createContext<LanguageContextProps>({
	currentLanguage: "de",
	changeLanguage: () => {},
	availableLanguages: [
		{ code: "de", name: "De" },
		{ code: "ru", name: "Ru" },
	],
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

	const availableLanguages = [
		{ code: "de", name: "De" },
		{ code: "ru", name: "Ru" },
	];

	const changeLanguage = (lang: string) => {
		i18n.changeLanguage(lang);
		setCurrentLanguage(lang);
	};

	return (
		<LanguageContext.Provider value={{ currentLanguage, changeLanguage, availableLanguages }}>
			{children}
		</LanguageContext.Provider>
	);
};

export const useLanguage = () => useContext(LanguageContext);
