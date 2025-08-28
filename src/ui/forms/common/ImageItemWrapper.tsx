// ImageItemWrapper.tsx
import React, { useState } from "react";
import { Image, Modal, Pressable, useWindowDimensions, View } from "react-native";
import Gallery from "react-native-awesome-gallery";
import { StyleSheet } from "react-native-unistyles";

interface Props {
	uri: string;
	images: string[];
	index: number;
	children?: React.ReactNode;
}

export default function ImageItemWrapper({ uri, images, index, children }: Props) {
	const { width, height } = useWindowDimensions();
	const [visible, setVisible] = useState(false);

	return (
		<>
			<Pressable onPress={() => setVisible(true)}>
				<Image source={{ uri }} style={styles.image} />
			</Pressable>

			{children}

			<Modal visible={visible} transparent onRequestClose={() => setVisible(false)}>
				<View style={styles.modalBackdrop}>
					<Gallery
						data={images}
						initialIndex={index}
						containerDimensions={{ width, height }}
						pinchEnabled
						swipeEnabled
						loop
						onSwipeToClose={() => setVisible(false)}
						doubleTapScale={3}
						maxScale={6}
						renderItem={({ item, setImageDimensions }) => (
							<Image
								source={{ uri: item }}
								style={{ width: "100%", height: "100%" }}
								resizeMode="contain"
								onLoad={({ nativeEvent }) => {
									const src = nativeEvent?.source;
									if (src?.width && src?.height) {
										setImageDimensions({
											width: src.width,
											height: src.height,
										});
									}
								}}
							/>
						)}
					/>
				</View>
			</Modal>
		</>
	);
}

const styles = StyleSheet.create(theme => ({
	image: { width: 100, height: 100, borderRadius: 8 },
	modalBackdrop: { flex: 1, backgroundColor: "black" },
}));
