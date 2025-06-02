import { sendOtpRequest, verifyOtpRequest } from "./index";
import { headers } from "next/headers";

jest.mock("next/headers", () => ({
	headers: jest.fn(),
}));

global.fetch = jest.fn();

describe("OTP Services", () => {
	const mockHost = "test.com";
	const mockHeadersInstance = {
		get: jest.fn(() => mockHost),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(headers as jest.Mock).mockReturnValue(mockHeadersInstance);
		mockHeadersInstance.get.mockReturnValue(mockHost);
	});

	describe("sendOtpRequest", () => {
		const mockOtpParams = {
			otpChannel: "email",
			otpContact: "test@example.com",
		};

		it("should send OTP request successfully", async () => {
			const mockResponse = {
				success: true,
				otpSessionId: "mock-session-id",
				otp: "123456",
			};

			(global.fetch as jest.Mock).mockResolvedValueOnce({
				json: jest.fn().mockResolvedValueOnce(mockResponse),
			});

			const result = await sendOtpRequest(mockOtpParams);

			expect(headers).toHaveBeenCalled();
			expect(mockHeadersInstance.get).toHaveBeenCalledWith("host");
			expect(global.fetch).toHaveBeenCalledWith(
				"https://test.com/api/send-otp",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(mockOtpParams),
				}
			);
			expect(result).toEqual(mockResponse);
		});

		it("should throw an error when OTP channel is missing", async () => {
			const invalidParams = {
				otpChannel: "",
				otpContact: "test@example.com",
			};

			await expect(sendOtpRequest(invalidParams)).rejects.toThrow(
				"Error sending OTP"
			);
			expect(global.fetch).not.toHaveBeenCalled();
		});

		it("should throw an error when OTP contact is missing", async () => {
			const invalidParams = {
				otpChannel: "email",
				otpContact: "",
			};

			await expect(sendOtpRequest(invalidParams)).rejects.toThrow(
				"Error sending OTP"
			);
			expect(global.fetch).not.toHaveBeenCalled();
		});

		it("should throw an error when API returns unsuccessful response", async () => {
			const errorResponse = {
				success: false,
				message: "Failed to send OTP",
			};

			(global.fetch as jest.Mock).mockResolvedValueOnce({
				json: jest.fn().mockResolvedValueOnce(errorResponse),
			});

			await expect(sendOtpRequest(mockOtpParams)).rejects.toThrow(
				"Failed to send OTP"
			);
			expect(global.fetch).toHaveBeenCalledTimes(1);
		});
	});

	describe("verifyOtpRequest", () => {
		const mockVerifyParams = {
			otpSessionId: "mock-session-id",
			otp: "123456",
		};

		it("should verify OTP request successfully", async () => {
			const mockResponse = {
				success: true,
				message: "OTP verified.",
				verificationTicket: "mock-ticket",
			};

			(global.fetch as jest.Mock).mockResolvedValueOnce({
				json: jest.fn().mockResolvedValueOnce(mockResponse),
			});

			const result = await verifyOtpRequest(mockVerifyParams);

			expect(headers).toHaveBeenCalled();
			expect(mockHeadersInstance.get).toHaveBeenCalledWith("host");
			expect(global.fetch).toHaveBeenCalledWith(
				"https://test.com/api/verify-otp",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(mockVerifyParams),
				}
			);
			expect(result).toEqual(mockResponse);
		});

		it("should throw an error when OTP session ID is missing", async () => {
			const invalidParams = {
				otpSessionId: "",
				otp: "123456",
			};

			await expect(verifyOtpRequest(invalidParams)).rejects.toThrow(
				"Error verifying  OTP"
			);
			expect(global.fetch).not.toHaveBeenCalled();
		});

		it("should throw an error when OTP is missing", async () => {
			const invalidParams = {
				otpSessionId: "mock-session-id",
				otp: "",
			};

			await expect(verifyOtpRequest(invalidParams)).rejects.toThrow(
				"Error verifying  OTP"
			);
			expect(global.fetch).not.toHaveBeenCalled();
		});

		it("should throw an error when API returns unsuccessful response", async () => {
			const errorResponse = {
				success: false,
				message: "Failed to verify OTP",
			};

			(global.fetch as jest.Mock).mockResolvedValueOnce({
				json: jest.fn().mockResolvedValueOnce(errorResponse),
			});

			await expect(verifyOtpRequest(mockVerifyParams)).rejects.toThrow(
				"Failed to verify OTP"
			);
			expect(global.fetch).toHaveBeenCalledTimes(1);
		});
	});

	describe("POST_OTP_REQUEST_SERVICE", () => {
		it("should use http protocol for localhost", async () => {
			mockHeadersInstance.get.mockReturnValueOnce("localhost:3000");
			const mockResponse = { success: true };

			(global.fetch as jest.Mock).mockResolvedValueOnce({
				json: jest.fn().mockResolvedValueOnce(mockResponse),
			});

			await sendOtpRequest({
				otpChannel: "email",
				otpContact: "test@example.com",
			});

			expect(global.fetch).toHaveBeenCalledWith(
				"http://localhost:3000/api/send-otp",
				expect.any(Object)
			);
		});

		it("should use https protocol for non-localhost domains", async () => {
			mockHeadersInstance.get.mockReturnValueOnce("example.com");
			const mockResponse = { success: true };

			(global.fetch as jest.Mock).mockResolvedValueOnce({
				json: jest.fn().mockResolvedValueOnce(mockResponse),
			});

			await sendOtpRequest({
				otpChannel: "email",
				otpContact: "test@example.com",
			});

			expect(global.fetch).toHaveBeenCalledWith(
				"https://example.com/api/send-otp",
				expect.any(Object)
			);
		});
	});
});
