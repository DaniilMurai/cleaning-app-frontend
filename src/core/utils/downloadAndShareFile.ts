import * as FileSystem from "expo-file-system";
import { Alert, Platform } from "react-native";
import * as Sharing from "expo-sharing";
import { AccessTokenStorage } from "@/core/auth/storage";

export default async function downloadAndShareFile(url: string, filename: string) {
	const token = await AccessTokenStorage.get();
	//TODO если не будет токена нужно его обновить, хз как это сделать
	console.log(token);
	if (Platform.OS === "web") {
		try {
			const response = await fetch(url, {
				headers: {
					Authorization: `${token}`,
				},
			});
			const blob = await response.blob();

			const blobUrl = window.URL.createObjectURL(blob);

			const link = document.createElement("a");
			link.href = blobUrl;
			link.download = filename;
			link.click();

			// Очистка
			setTimeout(() => {
				window.URL.revokeObjectURL(blobUrl);
			}, 1000);

			console.log("✅ File downloaded in web");
		} catch (err) {
			console.error("❌ Web download error:", err);
			alert("Ошибка загрузки файла");
		}
	} else {
		try {
			const fileUri = FileSystem.documentDirectory + filename;
			const downloadResumable = FileSystem.createDownloadResumable(url, fileUri, {
				headers: {
					Authorization: `${token}`,
				},
			});

			const downloaded = await downloadResumable.downloadAsync();
			if (!downloaded?.uri) {
				throw "Downloaded file has no URI";
			}

			console.log("✅ File downloaded to:", downloaded.uri);

			if (await Sharing.isAvailableAsync()) {
				await Sharing.shareAsync(downloaded.uri);
			} else {
				Alert.alert("Файл загружен", "Но невозможно открыть меню общего доступа.");
			}
		} catch (e) {
			console.error("❌ Mobile download error:", e);
			Alert.alert("Ошибка: Не удалось загрузить файл");
		}
	}
}
