"use server";

import { formatError } from "../utils";

export const sendOtp = async ({
	otpChannel,
	otpContact,
}: {
	otpChannel: string;
	otpContact: string;
}) => {
	try {
		if (!otpChannel || !otpContact) {
			throw new Error("OTP channel and contact are required.");
		}
		const response = await fetch("/api/send-otp", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ otpChannel, otpContact }),
		});

		const data = await response.json();
		console.log("Response data:", data);

		if (!response.ok || !data.success) {
			throw new Error(data.message || "Failed to send OTP");
		}

		return {
			success: true,
			message: `OTP ${data.otp}`,
			otpSessionId: data.otpSessionId,
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
};

export const verifyOtp = async ({
	otpSessionId,
	otp,
}: {
	otpSessionId: string;
	otp: string;
}) => {
	try {
		if (!otpSessionId || !otp) {
			throw new Error("OTP confirmation info not provided.");
		}
		const response = await fetch("/api/verify-otp", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ otpSessionId, otp }),
		});
		return {
			success: true,
			message: "OTP verification complete.",
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
};
