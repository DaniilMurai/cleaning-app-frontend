export function includes<T, U extends readonly T[]>(value: T, ...arr: U): value is U[number] {
	return arr.includes(value);
}
