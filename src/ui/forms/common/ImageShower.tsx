import React from "react";
import { ScrollView, View } from "react-native";
import ImageItemWrapper from "@/ui/forms/common/ImageItemWrapper.tsx";
import { StyleSheet } from "react-native-unistyles";

interface ImageShowerProps {
	media: string[];
}

export default function ImageShower({ media }: ImageShowerProps) {
	return (
		<ScrollView horizontal style={styles.mediaPreviewContainer}>
			{media.map((item, idx) => (
				<View key={idx} style={styles.mediaPreview}>
					<ImageItemWrapper images={media} uri={item} index={idx}></ImageItemWrapper>
				</View>
			))}
		</ScrollView>
	);
}

const styles = StyleSheet.create(theme => ({
	mediaPreviewContainer: { flexDirection: "row" },
	mediaPreview: { marginRight: theme.spacing(1), position: "relative" },
	previewImage: { width: 100, height: 100, borderRadius: theme.borderRadius(2) },
	badge: {
		position: "absolute",
		bottom: 6,
		right: 6,
		// backgroundColor: "rgba(0,0,0,0.6)",
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 6,
	},
	badgeText: { color: "#fff", fontWeight: "600", fontSize: 10 },
	modalBackdrop: {
		flex: 1,
		// backgroundColor: "black"
	},
}));
