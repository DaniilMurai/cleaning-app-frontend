export default function UsePasswordValidator(minLength: number = 8) {
	return (password: string) => {
		if (password.length < minLength) {
			return `Password must be at least ${minLength} characters long`;
		}
	};
}
