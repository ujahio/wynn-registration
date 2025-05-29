import { headers } from "next/headers";

export const sendOtpRequest = async ({
	otpChannel,
	otpContact,
}: {
	otpChannel: string;
	otpContact: string;
}) => {
	if (!otpChannel || !otpContact) {
		console.error("OTP channel and contact are required.");
		throw new Error("Error sending OTP");
	}

	const headersList = await headers();
	const host = headersList.get("host") || "localhost:3000";
	const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

	const response = await fetch(`${protocol}://${host}/api/send-otp`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ otpChannel, otpContact }),
	});

	const data = await response.json();

	if (!response.ok || !data.success) {
		console.error("Error sending OTP:", data);
		throw new Error(data.message || "Failed to send OTP");
	}

	return data;
};

export const verifyOtpRequest = async ({
	otpSessionId,
	otp,
}: {
	otpSessionId: string;
	otp: string;
}) => {
	if (!otpSessionId || !otp) {
		console.error("OTP session ID and OTP are required.");
		throw new Error("Error verifying  OTP");
	}

	const headersList = await headers();
	const host = headersList.get("host") || "localhost:3000";
	const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

	const response = await fetch(`${protocol}://${host}/api/verify-otp`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ otpSessionId, otp }),
	});

	const data = await response.json();
	if (!response.ok || !data.success) {
		console.error("Error verifying OTP:", data);
		throw new Error(data.message || "Failed to verify OTP");
	}

	return data;
};
