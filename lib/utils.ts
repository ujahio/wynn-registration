import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatError = (error: any) => {
	if (error.name === "ZodError") {
		console.log("eerror.errors", error.errors);
		console.log("eerror.errors obj", Object.keys(error.errors));

		const fieldErrors = Object.keys(error.errors).map((field) => ({
			message: error.errors[field].message,
			path: error.errors[field].path[0],
		}));
		return fieldErrors;
	} else {
		return typeof error.message === "string"
			? error.message
			: JSON.stringify(error.message);
	}
};
