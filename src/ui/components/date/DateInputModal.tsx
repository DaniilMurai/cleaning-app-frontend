// src/ui/components/common/DateInputModal.tsx

import React, { useState } from "react";
import { Modal, View } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs, { Dayjs } from "dayjs";
import { Button } from "@/ui";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native-unistyles";

interface Props {
	isVisible: boolean;
	/**
	 * Определяет логику отображения в DatePicker:
	 * - "date"    → показываем выбор только даты
	 * - "time"    → показываем выбор только времени (часы + минуты)
	 * - "datetime"→ показываем выбор даты + времени
	 */
	mode: "date" | "time" | "datetime";

	/**
	 * Этот проп оставляем, чтобы при вызове из TaskTimer можно было
	 * указать любой HTML-тип для <input>, но после изменений он больше
	 * ни на что не влияет (сам DatePicker мы показываем в Modal).
	 * Однако, чтобы не ломать существующий вызов, сохраняем его в Props.
	 */

	onConfirm: (date: Date) => void;
	onCancel: () => void;
	maximumDate?: Date;
}

export default function DateInputModal({
	isVisible,
	mode,
	onConfirm,
	onCancel,
	maximumDate,
}: Props) {
	const { t } = useTranslation();

	// локальный стейт для выбранной даты/времени (dayjs-инстанс).
	const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

	if (!isVisible) {
		return null;
	}

	/**
	 * Унифицированный модальный DatePicker для всех платформ (Android, iOS, Web).
	 *
	 * Мы используем Modal, который поверх всего остального.
	 * Внутри – компонент <DatePicker> из react-native-ui-datepicker.
	 *
	 * Если mode === "time", то передаём timePicker={true} + начальное представление "time";
	 * если mode === "date", показываем выбор даты (timePicker=false, initialView не задан);
	 * если mode === "datetime", можем обойтись default-режимом (calendar → потом можно переключиться на время).
	 *
	 * Обратите внимание: у react-native-ui-datepicker нет пропсов minimumDate/maximumDate
	 * в single-режиме, поэтому ограничение по максимальной дате мы не пропускаем напрямую —
	 * можно при подтверждении проверять вручную (но здесь просто оставим возможность
	 * передать maximumDate в случае, если понадобится).
	 */

	// Вызывается, когда пользователь нажал «Confirm»
	const handleConfirm = () => {
		onConfirm(selectedDate.toDate());
	};

	return (
		<Modal visible={isVisible} transparent onRequestClose={onCancel}>
			<View style={styles.modalOverlay}>
				<View style={styles.pickerContainer}>
					<DateTimePicker
						mode="single"
						styles={{ header: styles.buttonPrevNext }}
						date={selectedDate}
						// Когда дата/время меняются, переводим в dayjs и сохраняем
						onChange={({ date }) => {
							// DateType может быть Date | string | dayjs, но safe to wrap через dayjs()
							setSelectedDate(dayjs(date as Date));
						}}
						// Если нужно выбирать только время (часы+минуты):
						timePicker={true}
						maxDate={maximumDate}
						// Устанавливаем начальный вид: либо «time», либо «date»
						initialView={mode === "time" ? "time" : undefined}
						// Пропсы minimumDate/maxDate в single-режиме отсутствуют.
						// При необходимости ограничить выбор вручную, можно проверять selectedDate в handleConfirm.
					/>

					<View style={styles.buttonRow}>
						<Button variant="text" onPress={onCancel}>
							{t("common.cancel")}
						</Button>

						<Button variant="contained" onPress={handleConfirm}>
							{t("common.confirm")}
						</Button>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create(theme => ({
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.4)",
		justifyContent: "center",
		alignItems: "center",
	},
	pickerContainer: {
		backgroundColor: "#F5FCFF",
		borderRadius: 12,
		padding: 20,
		width: "90%",
		maxWidth: 400,
	},
	buttonRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 16,
	},
	pickerNumbers: {
		color: theme.colors.text.primary,
	},
	buttonPrevNext: {
		backgroundColor: theme.colors.primary.main,
	},
}));
