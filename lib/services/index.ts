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

	const response = await POST_OTP_REQUEST_SERVICE({
		body: { otpChannel, otpContact },
		endpoint: "send-otp",
	});

	const data = await response.json();

	if (!data.success) {
		console.error("Error:", data.message);
		throw new Error("Failed to send OTP");
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

	const response = await POST_OTP_REQUEST_SERVICE({
		body: { otpSessionId, otp },
		endpoint: "verify-otp",
	});

	const data = await response.json();

	if (!data.success) {
		console.error("Error:", data.message);
		throw new Error("Failed to verify OTP");
	}

	return data;
};

const POST_OTP_REQUEST_SERVICE = async ({
	body,
	endpoint,
}: {
	body: Record<string, string>;
	endpoint: string;
}) => {
	const headersList = await headers();
	const host = headersList.get("host") || "localhost:3000";
	const protocol = host.includes("localhost") ? "http" : "https";
	const url = `${protocol}://${host}/api/${endpoint}`;

	return await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
};
