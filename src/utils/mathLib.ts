import { optionalWhiteSpace } from "./indent";

export function toMathPow(left: string, right: string) {
	return `Math:pow(${left},${optionalWhiteSpace()}${right})`;
}
