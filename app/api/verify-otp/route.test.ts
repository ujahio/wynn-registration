import { NextRequest } from "next/server";
import { POST } from "./route";
import { prisma } from "@/db/prisma";
import { generateVerificationTicket, verifyOTP } from "@/lib/utils";

jest.mock("@/lib/utils", () => ({
	verifyOTP: jest.fn(),
	generateVerificationTicket: jest.fn(() => "mock-verification-ticket"),
}));

jest.mock("@/db/prisma", () => ({
	prisma: {
		oTPStore: {
			findFirst: jest.fn(),
		},
	},
}));

describe("POST /api/verify-otp", () => {
	const mockOtp = "123456";
	const mockSessionId = "mock-session-id";

	beforeEach(() => {
		jest.clearAllMocks();
		process.env.VERIFY_TOKEN_SECRET = "test-secret";
	});

	it("should verify OTP and return a verification ticket when valid", async () => {
		const mockReq = new NextRequest("http://localhost:3000/api/verify-otp", {
			method: "POST",
			body: JSON.stringify({
				otp: mockOtp,
				otpSessionId: mockSessionId,
			}),
		});

		const mockOtpSession = {
			id: mockSessionId,
			contact: "test@example.com",
			channel: "email",
			otpHash: "mock-hash",
			expires_at: new Date(Date.now() + 60000),
			created_at: new Date(),
		};

		(prisma.oTPStore.findFirst as jest.Mock).mockResolvedValue(mockOtpSession);
		(verifyOTP as jest.Mock).mockReturnValue(true);

		const response = await POST(mockReq);
		const responseBody = await response.json();

		expect(response.status).toBe(200);
		expect(responseBody).toEqual({
			success: true,
			message: "OTP verified.",
			verificationTicket: "mock-verification-ticket",
		});

		expect(prisma.oTPStore.findFirst).toHaveBeenCalledWith({
			where: {
				id: mockSessionId,
				expires_at: expect.any(Object),
			},
		});

		expect(verifyOTP).toHaveBeenCalledWith("mock-hash", mockOtp);
		expect(generateVerificationTicket).toHaveBeenCalledWith({
			contact: "test@example.com",
			otpSessionId: mockSessionId,
		});
	});

	it("should return an error when OTP is missing", async () => {
		const mockReq = new NextRequest("http://localhost:3000/api/verify-otp", {
			method: "POST",
			body: JSON.stringify({
				otpSessionId: mockSessionId,
			}),
		});

		const response = await POST(mockReq);
		const responseBody = await response.json();

		expect(response.status).toBe(500);
		expect(responseBody).toEqual({
			success: false,
			message: "Failed to send OTP",
		});

		expect(prisma.oTPStore.findFirst).not.toHaveBeenCalled();
		expect(verifyOTP).not.toHaveBeenCalled();
		expect(generateVerificationTicket).not.toHaveBeenCalled();
	});

	it("should return an error when session ID is missing", async () => {
		const mockReq = new NextRequest("http://localhost:3000/api/verify-otp", {
			method: "POST",
			body: JSON.stringify({
				otp: mockOtp,
			}),
		});

		const response = await POST(mockReq);
		const responseBody = await response.json();

		expect(response.status).toBe(500);
		expect(responseBody).toEqual({
			success: false,
			message: "Failed to send OTP",
		});

		expect(prisma.oTPStore.findFirst).not.toHaveBeenCalled();
		expect(verifyOTP).not.toHaveBeenCalled();
		expect(generateVerificationTicket).not.toHaveBeenCalled();
	});

	it("should return an error when OTP session is not found or expired", async () => {
		const mockReq = new NextRequest("http://localhost:3000/api/verify-otp", {
			method: "POST",
			body: JSON.stringify({
				otp: mockOtp,
				otpSessionId: mockSessionId,
			}),
		});

		(prisma.oTPStore.findFirst as jest.Mock).mockResolvedValue(null);

		const response = await POST(mockReq);
		const responseBody = await response.json();

		expect(response.status).toBe(500);
		expect(responseBody).toEqual({
			success: false,
			message: "Failed to send OTP",
		});

		expect(prisma.oTPStore.findFirst).toHaveBeenCalledTimes(1);
		expect(verifyOTP).not.toHaveBeenCalled();
		expect(generateVerificationTicket).not.toHaveBeenCalled();
	});

	it("should return an error when OTP is invalid", async () => {
		const mockReq = new NextRequest("http://localhost:3000/api/verify-otp", {
			method: "POST",
			body: JSON.stringify({
				otp: mockOtp,
				otpSessionId: mockSessionId,
			}),
		});

		const mockOtpSession = {
			id: mockSessionId,
			contact: "test@example.com",
			channel: "email",
			otpHash: "mock-hash",
			expires_at: new Date(Date.now() + 60000),
			created_at: new Date(),
		};

		(prisma.oTPStore.findFirst as jest.Mock).mockResolvedValue(mockOtpSession);
		(verifyOTP as jest.Mock).mockReturnValue(false);

		const response = await POST(mockReq);
		const responseBody = await response.json();

		expect(response.status).toBe(500);
		expect(responseBody).toEqual({
			success: false,
			message: "Failed to send OTP",
		});

		expect(prisma.oTPStore.findFirst).toHaveBeenCalledTimes(1);
		expect(verifyOTP).toHaveBeenCalledTimes(1);
		expect(generateVerificationTicket).not.toHaveBeenCalled();
	});

	it("should handle database errors gracefully", async () => {
		const mockReq = new NextRequest("http://localhost:3000/api/verify-otp", {
			method: "POST",
			body: JSON.stringify({
				otp: mockOtp,
				otpSessionId: mockSessionId,
			}),
		});

		(prisma.oTPStore.findFirst as jest.Mock).mockRejectedValue(
			new Error("Database error")
		);

		const response = await POST(mockReq);
		const responseBody = await response.json();

		expect(response.status).toBe(500);
		expect(responseBody).toEqual({
			success: false,
			message: "Failed to send OTP",
		});

		expect(prisma.oTPStore.findFirst).toHaveBeenCalledTimes(1);
		expect(verifyOTP).not.toHaveBeenCalled();
		expect(generateVerificationTicket).not.toHaveBeenCalled();
	});
});
