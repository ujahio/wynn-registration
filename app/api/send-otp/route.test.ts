import { NextRequest } from "next/server";
import { POST } from "./route";
import { encryptOTP, generateOTP } from "@/lib/utils";
import { prisma } from "@/db/prisma";

jest.mock("@/lib/utils", () => ({
	generateOTP: jest.fn(() => "123456"),
	encryptOTP: jest.fn(() => "mock-salt:mock-hash"),
}));

jest.mock("@/db/prisma", () => ({
	prisma: {
		oTPStore: {
			findFirst: jest.fn(),
			create: jest.fn(),
		},
	},
}));

describe("POST /api/send-otp", () => {
	const mockEmail = "test@example.com";
	const mockChannel = "email";

	beforeEach(() => {
		jest.clearAllMocks();
	});
	it("should successfully send an OTP when provided valid inputs", async () => {
		const mockReq = new NextRequest("http://localhost:3000/api/send-otp", {
			method: "POST",
			body: JSON.stringify({
				otpChannel: mockChannel,
				otpContact: mockEmail,
			}),
		});

		const mockOTPStoreItem = {
			id: "mock-uuid",
			channel: mockChannel,
			contact: mockEmail,
			otpHash: "mock-salt:mock-hash",
			expires_at: new Date(Date.now() + 5 * 60 * 1000),
			created_at: new Date(),
		};
		(prisma.oTPStore.findFirst as jest.Mock).mockResolvedValue(null);
		(prisma.oTPStore.create as jest.Mock).mockResolvedValue(mockOTPStoreItem);
		const response = await POST(mockReq);
		const responseBody = await response.json();

		expect(response.status).toBe(200);
		expect(responseBody).toEqual({
			success: true,
			otpSessionId: "mock-uuid",
			otp: "123456",
		});

		expect(generateOTP).toHaveBeenCalledTimes(1);
		expect(encryptOTP).toHaveBeenCalledWith("123456");

		expect(prisma.oTPStore.findFirst).toHaveBeenCalledWith({
			where: {
				channel: mockChannel,
				contact: mockEmail,
				expires_at: expect.any(Object),
			},
		});

		expect(prisma.oTPStore.create).toHaveBeenCalledWith({
			data: {
				channel: mockChannel,
				contact: mockEmail,
				otpHash: "mock-salt:mock-hash",
				expires_at: expect.any(Date),
				created_at: expect.any(Date),
			},
		});
	});

	it("should return an error when OTP channel is missing", async () => {
		const mockReq = new NextRequest("http://localhost:3000/api/send-otp", {
			method: "POST",
			body: JSON.stringify({
				otpContact: mockEmail,
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
		expect(prisma.oTPStore.create).not.toHaveBeenCalled();
	});

	it("should return an error when OTP contact is missing", async () => {
		const mockReq = new NextRequest("http://localhost:3000/api/send-otp", {
			method: "POST",
			body: JSON.stringify({
				otpChannel: mockChannel,
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
		expect(prisma.oTPStore.create).not.toHaveBeenCalled();
	});

	it("should return an error when an OTP already exists for the contact", async () => {
		const mockReq = new NextRequest("http://localhost:3000/api/send-otp", {
			method: "POST",
			body: JSON.stringify({
				otpChannel: mockChannel,
				otpContact: mockEmail,
			}),
		});

		const existingOTP = {
			id: "existing-uuid",
			channel: mockChannel,
			contact: mockEmail,
			otpHash: "existing-salt:existing-hash",
			expires_at: new Date(Date.now() + 60000),
			created_at: new Date(),
		};

		(prisma.oTPStore.findFirst as jest.Mock).mockResolvedValue(existingOTP);

		const response = await POST(mockReq);
		const responseBody = await response.json();

		expect(response.status).toBe(500);
		expect(responseBody).toEqual({
			success: false,
			message: "Failed to send OTP",
		});

		expect(prisma.oTPStore.findFirst).toHaveBeenCalledTimes(1);
		expect(prisma.oTPStore.create).not.toHaveBeenCalled();
	});

	it("should return an error when OTP session creation fails", async () => {
		const mockReq = new NextRequest("http://localhost:3000/api/send-otp", {
			method: "POST",
			body: JSON.stringify({
				otpChannel: mockChannel,
				otpContact: mockEmail,
			}),
		});

		(prisma.oTPStore.findFirst as jest.Mock).mockResolvedValue(null);
		(prisma.oTPStore.create as jest.Mock).mockResolvedValue({ id: null });

		const response = await POST(mockReq);
		const responseBody = await response.json();

		expect(response.status).toBe(500);
		expect(responseBody).toEqual({
			success: false,
			message: "Failed to send OTP",
		});

		expect(prisma.oTPStore.create).toHaveBeenCalledTimes(1);
	});

	it("should return an error when database operations throw exceptions", async () => {
		const mockReq = new NextRequest("http://localhost:3000/api/send-otp", {
			method: "POST",
			body: JSON.stringify({
				otpChannel: mockChannel,
				otpContact: mockEmail,
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
		expect(prisma.oTPStore.create).not.toHaveBeenCalled();
	});
});
