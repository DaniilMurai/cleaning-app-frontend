import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button } from "@/ui";
import Typography from "@/ui/Typography";
import { useRef, useState } from "react";
import Popper from "@/ui/Popper";

export default function Index() {
	const popperAnchorRef = useRef<View>(null);
	const [popperVisible, setPopperVisible] = useState(false);

	return (
		<View style={styles.container}>
			<Typography variant={"h1"} color={"primary"}>
				H1
			</Typography>
			<Typography variant={"h2"} color={"secondary"}>
				H2
			</Typography>
			<Typography variant={"h3"} color={"info"}>
				H3
			</Typography>
			<Typography variant={"h4"} color={"warning"}>
				H4
			</Typography>
			<Typography variant={"h5"} color={"error"}>
				H5
			</Typography>
			<Typography variant={"h6"} color={"text.secondary"}>
				H6
			</Typography>
			<Typography variant={"subtitle1"}>Subtitle1</Typography>
			<Typography variant={"subtitle2"}>Subtitle2</Typography>
			<Typography variant={"body1"}>Body1</Typography>
			<Typography variant={"body2"}>Body2</Typography>
			<Typography>Привет, Это страница Home</Typography>
			<View style={styles.buttons}>
				<Button variant={"text"}>Text</Button>
				<Button variant={"outlined"}>Outlined</Button>
				<Button variant={"tint"}>tint</Button>
				<Button variant={"contained"}>contained</Button>
			</View>

			<Button ref={popperAnchorRef} onPress={() => setPopperVisible(true)}>
				Open Popper
			</Button>

			<Popper visible={popperVisible} setVisible={setPopperVisible}>
				TEST
			</Popper>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		gap: theme.spacing(2),
		backgroundColor: theme.colors.background.main,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	buttons: {
		flexDirection: "row",
		gap: theme.spacing(2),
		flexWrap: "wrap",
	},
}));
