import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatError = (error: any) => {
	if (error.name === "ZodError") {
		let fieldErrors = {} as Record<string, string>;
		Object.keys(error.errors).map((field) => {
			fieldErrors[error.errors[field].path[0]] = error.errors[field].message;
		});
		return fieldErrors;
	} else {
		return typeof error.message === "string"
			? error.message
			: JSON.stringify(error.message);
	}
};
