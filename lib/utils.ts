import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatError = (error: any) => {
	if (error.name === "ZodError") {
		const fieldErrors = Object.keys(error.errors)
			.map((field) => error.errors[field].message)
			.join(". ");
		return fieldErrors;
	} else {
		return typeof error.message === "string"
			? error.message
			: JSON.stringify(error.message);
	}
};
