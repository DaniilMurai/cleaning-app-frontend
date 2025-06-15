import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Input, { InputProps } from "../../common/Input";
import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet } from "react-native-unistyles";

const PasswordInput = (props: InputProps) => {
	const [password, setPassword] = useState<string>("");
	const [showPassword, setShowPassword] = useState<boolean>(false);

	return (
		<View>
			<Input
				autoCapitalize={"none"}
				value={password}
				onChangeText={text => setPassword(text)}
				secureTextEntry={!showPassword}
				{...props}
				style={[styles.input, props.style]}
			/>
			<View style={styles.passwordContainer}>
				<TouchableOpacity
					style={styles.eyeIcon}
					onPress={() => setShowPassword(!showPassword)}
				>
					<FontAwesome5
						name={showPassword ? "eye-slash" : "eye"}
						size={20}
						color="gray"
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default PasswordInput;

const styles = StyleSheet.create(theme => ({
	input: {
		marginBottom: theme.spacing(0.5),
	},
	text: {
		marginVertical: theme.spacing(0.5),
	},
	errorText: {
		color: theme.colors.error.main,
	},
	successText: {
		color: theme.colors.success.main,
	},
	passwordContainer: {
		flexDirection: "row-reverse",
	},
	eyeIcon: {
		position: "absolute",
		right: theme.spacing(1),
		top: -theme.spacing(5.5),
		padding: theme.spacing(1),
	},
}));
