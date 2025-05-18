import Card from "@/ui/Card";
import { StyleSheet } from "react-native-unistyles";
import Typography from "@/ui/Typography";
import { Button } from "@/ui";
import { Alert, Platform, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";

interface GetLinkFormProps {
	linkName: string;
	link: string;
	onClose: () => void;
}

export default function GetLinkForm({ linkName, link, onClose }: GetLinkFormProps) {
	const [error, setError] = useState<string | null>(null);
	return (
		<Card size={"medium"} style={styles.container}>
			<Typography variant="body1">
				{linkName}: {link}
			</Typography>
			{error && <Typography style={styles.error}>{error}</Typography>}

			<View style={styles.buttonsContainer}>
				<Button
					onPress={async () => {
						setError(null);
						// Для веб
						try {
							if (Platform.OS === "web") {
								navigator.clipboard.writeText(link);
							} else {
								// Для React Native потребуется установка пакета
								await Clipboard.setStringAsync(link);
							}
							if (Platform.OS === "web") {
								window.alert("Link copied to clipboard!");
							} else {
								Alert.alert("Success", "Link copied to clipboard!");
							}
						} catch (e) {
							setError("Error copying link to clipboard");
						}
					}}
				>
					Copy link
				</Button>
				<Button onPress={onClose}>Close</Button>
			</View>
		</Card>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		padding: theme.spacing(3),
		maxWidth: 600,
		width: "100%",
		alignSelf: "center",
	},
	title: {
		marginBottom: theme.spacing(3),
	},
	input: {
		marginBottom: theme.spacing(2),
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: theme.spacing(2),
		marginTop: theme.spacing(3),
	},
	error: {
		color: theme.colors.error.main,
	},
}));
