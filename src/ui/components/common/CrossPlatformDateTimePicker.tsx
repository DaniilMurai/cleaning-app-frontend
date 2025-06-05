import React from "react";
import { Platform, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button } from "@/ui";
import { useTranslation } from "react-i18next";

interface Props {
	isVisible: boolean;
	mode: "date" | "time" | "datetime";
	type: "date" | "datetime" | "time" | "datetime-local";
	onConfirm: (date: Date) => void;
	onCancel: () => void;
	maximumDate?: Date;
}

export default function CrossPlatformDateTimePicker({
	isVisible,
	mode,
	type,
	onConfirm,
	onCancel,
	maximumDate,
}: Props) {
	const { t } = useTranslation();

	if (Platform.OS === "web") {
		if (!isVisible) return null;

		// Форматируем max в зависимости от type
		const maxValue =
			type === "time"
				? maximumDate?.toTimeString().slice(0, 5) // "HH:MM" для type="time"
				: maximumDate?.toISOString().slice(0, -1); // ISO для других типов

		return (
			<View style={{ marginTop: 10 }}>
				<input
					type={type}
					max={maxValue}
					onChange={e => {
						const value = e.target.value;
						if (value) {
							if (type === "time") {
								// Разбиваем "HH:MM" на часы и минуты
								const [hours, minutes] = value.split(":").map(Number);
								const now = new Date();
								// Создаем новый Date с текущей датой и выбранным временем
								const selectedDate = new Date(
									now.getFullYear(),
									now.getMonth(),
									now.getDate(),
									hours,
									minutes
								);
								onConfirm(selectedDate);
							} else {
								// Для других типов (date, datetime-local)
								onConfirm(new Date(value));
							}
						}
					}}
				/>
				<Button variant="text" onPress={onCancel}>
					{t("common.cancel")}
				</Button>
			</View>
		);
	}

	return (
		<DateTimePickerModal
			isVisible={isVisible}
			mode={mode}
			onConfirm={onConfirm}
			onCancel={onCancel}
			maximumDate={maximumDate}
			confirmTextIOS="Выбрать"
			cancelTextIOS="Отмена"
			locale="ru_RU"
		/>
	);
}
