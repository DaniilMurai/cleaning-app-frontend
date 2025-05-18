import Card from "@/ui/Card";
import { StyleSheet } from "react-native-unistyles";
import Typography from "@/ui/Typography";
import { Button } from "@/ui";
import { Alert, Platform, View } from "react-native";
import * as Clipboard from "expo-clipboard";

interface GetLinkFormProps {
	linkName: string;
	link: string;
	onClose: () => void;
}

export default function GetLinkForm({ linkName, link, onClose }: GetLinkFormProps) {
	return (
		<Card size={"medium"} style={styles.container}>
			<Typography variant="body1">
				{linkName}: {link}
			</Typography>

			<View style={styles.buttonsContainer}>
				<Button
					onPress={async () => {
						// Для веб
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
}));
