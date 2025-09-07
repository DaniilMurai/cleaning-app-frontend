import { HintsResponse } from "@/api/admin";
import { Button, Dialog, Typography } from "@/ui";
import { ScrollView, View } from "react-native";
import React, { useState } from "react";
import ImageShower from "../forms/common/ImageShower";
import { StyleSheet } from "react-native-unistyles";
import { useTranslation } from "react-i18next";

interface HintsModalProps {
	visible: boolean;
	onClose: () => void;
	hints: HintsResponse[];
}

export default function HintsModal({ visible, onClose, hints }: HintsModalProps) {
	const { t } = useTranslation();
	const [activeIndex, setActiveIndex] = useState(0);
	const hint = hints[activeIndex];

	return (
		<Dialog
			scrollView
			onClose={onClose}
			visible={visible}
			card
			actions={
				<Button
					onPress={onClose}
					style={styles.closeButton}
					color={"secondary"}
					variant={"outlined"}
				>
					{t("common.close")}
				</Button>
			}
			header={
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.scrollContainer}
				>
					{hints.map((hint, index) => (
						<Button
							variant={activeIndex === index ? "contained" : "outlined"}
							onPress={() => setActiveIndex(index)}
							style={styles.tabButton}
						>
							{hint.title}
						</Button>
					))}
				</ScrollView>
			}
		>
			<View style={styles.contentContainer}>
				<Typography color={styles.labels.color}>
					{t("components.tasksList.title")}
				</Typography>
				<Typography>{hint.title || t("common.noTitle")}</Typography>
				<Typography color={styles.labels.color}>
					{t("components.tasksList.description")}
				</Typography>
				<Typography>{hint.text || t("common.noDescription")}</Typography>
				<ImageShower media={hint.media_links ?? []} />
			</View>
		</Dialog>
	);
}

const styles = StyleSheet.create(theme => ({
	contentContainer: {
		flex: 1,
		gap: theme.spacing(2),
	},
	labels: {
		color: theme.colors.disabled.text,
	},
	scrollContainer: {
		// justifyContent: "center",
	},
	closeButton: {
		alignSelf: "flex-end",
	},
	tabButton: {
		marginRight: theme.spacing(1),
		paddingHorizontal: theme.spacing(3),
		paddingVertical: theme.spacing(1),
		borderRadius: theme.borderRadius(6),
	},
}));
