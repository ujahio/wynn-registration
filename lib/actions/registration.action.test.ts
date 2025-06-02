import { sendOtp, verifyOtp } from "./registration.action";
import { sendOtpRequest, verifyOtpRequest } from "../services";
import { formatError } from "../utils";

jest.mock("../services", () => ({
	sendOtpRequest: jest.fn(),
	verifyOtpRequest: jest.fn(),
}));

jest.mock("../utils", () => ({
	formatError: jest.fn((error) => `Formatted: ${error.message}`),
}));

describe("Registration Actions", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("sendOtp", () => {
		const mockOtpParams = {
			otpChannel: "sms",
			otpContact: "+1234567890",
		};

		const mockOtpResponse = {
			otp: "123456",
			otpSessionId: "test-session-id",
		};

		test("should return success response when OTP is sent successfully", async () => {
			(
				sendOtpRequest as jest.MockedFunction<typeof sendOtpRequest>
			).mockResolvedValue(mockOtpResponse);

			const result = await sendOtp(mockOtpParams);

			expect(sendOtpRequest).toHaveBeenCalledWith(mockOtpParams);
			expect(result).toEqual({
				success: true,
				message: `OTP ${mockOtpResponse.otp}`,
				otpSessionId: mockOtpResponse.otpSessionId,
			});
		});

		test("should return error response when OTP sending fails", async () => {
			const mockError = new Error("Failed to send OTP");
			(
				sendOtpRequest as jest.MockedFunction<typeof sendOtpRequest>
			).mockRejectedValue(mockError);

			const result = await sendOtp(mockOtpParams);

			expect(sendOtpRequest).toHaveBeenCalledWith(mockOtpParams);
			expect(formatError).toHaveBeenCalledWith(mockError);
			expect(result).toEqual({
				success: false,
				message: "Formatted: Failed to send OTP",
			});
		});
	});

	describe("verifyOtp", () => {
		const mockVerifyParams = {
			otpSessionId: "test-session-id",
			otp: "123456",
		};

		const mockVerifyResponse = {
			verificationTicket: "test-verification-ticket",
		};

		test("should return success response when OTP verification is successful", async () => {
			(
				verifyOtpRequest as jest.MockedFunction<typeof verifyOtpRequest>
			).mockResolvedValue(mockVerifyResponse);

			const result = await verifyOtp(mockVerifyParams);

			expect(verifyOtpRequest).toHaveBeenCalledWith(mockVerifyParams);
			expect(result).toEqual({
				success: true,
				message: "OTP verification complete.",
				verificationTicket: mockVerifyResponse.verificationTicket,
			});
		});

		test("should return error response when OTP verification fails", async () => {
			const mockError = new Error("Invalid OTP");
			(
				verifyOtpRequest as jest.MockedFunction<typeof verifyOtpRequest>
			).mockRejectedValue(mockError);

			const result = await verifyOtp(mockVerifyParams);

			expect(verifyOtpRequest).toHaveBeenCalledWith(mockVerifyParams);
			expect(formatError).toHaveBeenCalledWith(mockError);
			expect(result).toEqual({
				success: false,
				message: "Formatted: Invalid OTP",
			});
		});
	});
});
