import { ActivityIndicator, View } from "react-native";
import React from "react";

export default function Loading() {
	return (
		<View
			style={{
				display: "flex",
				margin: "auto",
			}}
		>
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<ActivityIndicator size="large" />
			</View>
		</View>
	);
}
