import React from "react";
import { themes } from "@/unistyles";
import "../unistyles";
// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" translate="no">
			<head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, shrink-to-fit=no"
				/>

				{/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
				{/*<ScrollViewStyleReset />*/}

				{/* Using raw CSS styles as an escape-hatch to ensure the background color never flickers in dark-mode. */}
				<style dangerouslySetInnerHTML={{ __html: style }} />
				{/* Add any additional <head> elements that you want globally available on web... */}
			</head>
			<body>{children}</body>
		</html>
	);
}

const style = `
	html {
		height: 100%;
	}
	#root {
		display: flex;
		width: 100%;
		height: 100%;
	}
	body {
		overflow: hidden;
		height: 100%;
		width: 100%;
		display: flex;
		background-color: ${themes.light.colors.background.main}!important;
	}
	@media (prefers-color-scheme: dark) {
		body {
			background-color: ${themes.dark.colors.background.main}!important
	    }
	}
	@font-face {
	  font-family: 'FontAwesome5_Solid';
	  src: url('../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome5_Solid.ttf') format('truetype');
	}
	@font-face {
	  font-family: 'FontAwesome5_Brands';
	  src: url('../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome5_Brands.ttf') format('truetype');
	}
	@font-face {
	  font-family: 'FontAwesome5_Regular';
	  src: url('../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome5_Regular.ttf') format('truetype');
	}
	/* Add other icon fonts if needed */

}`;
