import "./select-web.scss";

import { SelectProps } from "@/max_ui/Select/types";
import { useUnistyles } from "react-native-unistyles";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useRef } from "react";
import { isInteger } from "@/core/helpers/numbers.ts";

export default function Select<TValue extends string | number | undefined>({
	value,
	onChange,
	data,
	selectWebWrapperProps,
	selectWebProps,
	selectWebIconWrapperProps,
	size,
}: SelectProps<TValue>) {
	const ref = useRef<HTMLSelectElement | null>(null);
	const { theme } = useUnistyles();

	const sizeStyles = {
		small: { paddingY: theme.spacing(0.5), paddingX: theme.spacing(1), fontSize: 14 },
		medium: { paddingY: theme.spacing(1), paddingX: theme.spacing(1.25), fontSize: 16 },
		large: { paddingY: theme.spacing(1.5), paddingX: theme.spacing(1.5), fontSize: 18 },
	};

	const currentSize = sizeStyles[size || "medium"];

	return (
		<div
			{...selectWebWrapperProps}
			className={"select-wrapper"}
			style={{
				position: "relative",
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				gap: theme.spacing(0.25),
				borderRadius: theme.borderRadius(3),
				backgroundColor: theme.colors.components.input.background,
				borderWidth: 1,
				borderStyle: "solid",
				borderColor: theme.colors.components.input.border,
				outlineColor: theme.colors.components.input.outline,
				...selectWebWrapperProps?.style,
			}}
		>
			<select
				ref={ref}
				value={value}
				onChange={e =>
					onChange &&
					onChange(
						(isInteger(e.target.value)
							? parseInt(e.target.value)
							: e.target.value) as TValue
					)
				}
				{...selectWebProps}
				style={{
					flex: 1,
					paddingLeft: currentSize.paddingX,
					paddingRight: currentSize.paddingX + 12,
					paddingTop: currentSize.paddingY,
					paddingBottom: currentSize.paddingY,
					width: "100%",
					height: "100%",
					maxWidth: "100%",
					borderWidth: 0,

					appearance: "none",
					fontSize: currentSize.fontSize,
					color: theme.colors.text.primary,
					outlineStyle: "none",
					backgroundColor: "transparent",
					// backgroundColor: "#EDEEEF", // из твоего SCSS
					// color: "#02303A",            // из твоего SCSS
					...selectWebProps?.style,
				}}
			>
				{data.map(el => (
					<option
						key={el.value || el.label}
						value={el.value}
						style={{
							backgroundColor: "#EDEEEF", // из твоего SCSS
							color: "#02303A", // из твоего SCSS
						}}
					>
						{el.label}
					</option>
				))}
			</select>
			<div
				{...selectWebIconWrapperProps}
				style={{
					pointerEvents: "none",
					position: "absolute",
					right: theme.spacing(1.25),
					backgroundColor: theme.colors.components.input.background,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					paddingLeft: 2,
					height: "calc(100% - 10px)",
					...selectWebIconWrapperProps?.style,
				}}
			>
				<Ionicons name="chevron-down" size={10} color={theme.colors.text.primary} />
			</div>
		</div>
	);
}
