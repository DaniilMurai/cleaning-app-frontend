// src/hooks/usePasswordValidation.ts
import { useRef, useState } from "react";

interface PasswordValidationOptions {
	minLength?: number;
	requireSpecialChar?: boolean;
	requireDigit?: boolean;
	requireUppercase?: boolean;
}

export interface PasswordValidationResult {
	isValid: boolean;
	password: string;
	error: string | null;
}

export function usePasswordValidation(options: PasswordValidationOptions = {}) {
	const {
		minLength = 8,
		requireSpecialChar = false,
		requireDigit = false,
		requireUppercase = false,
	} = options;

	const validationRef = useRef<() => PasswordValidationResult | null>(() => null);
	const [validationResult, setValidationResult] = useState<PasswordValidationResult | null>(null);

	const validate = (): PasswordValidationResult | null => {
		const result = validationRef.current();
		setValidationResult(result);
		return result;
	};

	return {
		validationRef,
		validate,
		validationResult,
	};
}
