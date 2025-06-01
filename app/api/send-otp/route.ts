import { NextResponse, NextRequest } from "next/server";
import { encryptOTP, generateOTP } from "@/lib/utils";
import { prisma } from "@/db/prisma";

/**
 * Handles the POST request to send an OTP to a user.
 *
 * @async
 * @function POST
 * @param {NextRequest} req - The incoming HTTP request object.
 * @returns {Promise<NextResponse>} - The HTTP response containing the OTP session ID and OTP.
 *
 * @throws {Error} If the OTP channel or contact is missing, if an OTP already exists, or if there is an issue creating the OTP session.
 *
 * @example
 * // Request body:
 * {
 *   "otpChannel": "email",
 *   "otpContact": "user@example.com"
 * }
 *
 * // Successful response:
 * {
 *   "success": true,
 *   "otpSessionId": "12345",
 *   "otp": "678910"
 * }
 *
 * // Error response:
 * {
 *   "success": false,
 *   "message": "Failed to send OTP"
 * }
 */
export async function POST(req: NextRequest) {
	try {
		const event: {
			otpChannel: string;
			otpContact: string;
		} = await req.json();

		const { otpChannel, otpContact } = event;

		if (!otpChannel || !otpContact) {
			console.error("OTP channel and value are required.");
			throw new Error("Failed to send OTP");
		}

		const existingOtp = await prisma.oTPStore.findFirst({
			where: {
				channel: otpChannel,
				contact: otpContact,
				expires_at: { gt: new Date() },
			},
		});

		if (existingOtp) {
			console.error("An OTP has already been sent to this contact.");
			throw new Error("Failed to send OTP");
		}

		const otp = generateOTP();
		const otpHash = encryptOTP(otp);

		const otpStoreItem = await prisma.oTPStore.create({
			data: {
				channel: otpChannel,
				contact: otpContact,
				otpHash,
				expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 mins
				created_at: new Date(),
			},
		});

		if (!otpStoreItem.id) {
			throw new Error("Failed to create OTP session");
		}
		return NextResponse.json(
			{
				success: true,
				otpSessionId: otpStoreItem.id,
				otp,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error sending OTP:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to send OTP",
			},
			{ status: 500 }
		);
	}
}
