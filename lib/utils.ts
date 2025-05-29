import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";
import jwt from "jsonwebtoken";

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
	} else if (
		error.name === "PrismaClientKnownRequestError" &&
		error.code === "P2002"
	) {
		const field = error.meta?.target ? error.meta.target[0] : "Field";
		return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
	} else {
		return typeof error.message === "string"
			? error.message
			: JSON.stringify(error.message);
	}
};

// Generate a random 6-digit OTP
export const generateOTP = (): string => {
	// Ensures leading zeros are preserved by padding to 6 digits
	return Math.floor(100000 + Math.random() * 900000).toString();
};

// Encrypt the OTP using a secure hashing algorithm
export const encryptOTP = (otp: string): string => {
	// Use SHA-256 for secure hashing with a salt
	const salt = crypto.randomBytes(16).toString("hex");
	const hash = crypto.createHmac("sha256", salt).update(otp).digest("hex");

	// Return salt + hash combined so we can verify later
	return `${salt}:${hash}`;
};

export const verifyOTP = (encryptedOtp: string, otp: string): boolean => {
	const [salt, storedHash] = encryptedOtp.split(":");
	if (!salt || !storedHash) return false;

	// Recompute the HMAC using the extracted salt
	const hash = crypto.createHmac("sha256", salt).update(otp).digest("hex");

	return hash === storedHash;
};

export const generateVerificationTicket = ({
	contact,
	otpSessionId,
}: {
	contact: string;
	otpSessionId: string;
}) => {
	const verificationTicket = jwt.sign(
		{
			sub: contact, // email or phone
			type: "verification",
			sessionId: otpSessionId, // the UUID from your OTPStore row
		},
		process.env.VERIFY_TOKEN_SECRET!, // a short-lived HMAC secret
		{ expiresIn: "5m" }
	);

	console.log("Generated verification ticket:", verificationTicket);

	return verificationTicket;
};
