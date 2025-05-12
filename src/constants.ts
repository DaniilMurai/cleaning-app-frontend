export const DEFAULT_LANG = process.env.EXPO_PUBLIC_DEFAULT_LANG || "en";
export const ApiUrl =
	process.env.EXPO_PUBLIC_API_URL || "https://cleaningcompanybackend.onrender.com/";

// Добавьте проверку
console.log("API URL:", ApiUrl);
if (!ApiUrl) {
	console.error("API URL is not defined!");
}
