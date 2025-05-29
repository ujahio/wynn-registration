"use server";

import { formatError } from "../utils";
import { sendOtpRequest, verifyOtpRequest } from "../services";

export const sendOtp = async ({
	otpChannel,
	otpContact,
}: {
	otpChannel: string;
	otpContact: string;
}) => {
	try {
		const response = await sendOtpRequest({
			otpChannel,
			otpContact,
		});

		return {
			success: true,
			message: `OTP ${response.otp}`,
			otpSessionId: response.otpSessionId,
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
		await verifyOtpRequest({
			otp,
			otpSessionId,
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
