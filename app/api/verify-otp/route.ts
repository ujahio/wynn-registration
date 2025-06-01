import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/db/prisma";
import { generateVerificationTicket, verifyOTP } from "@/lib/utils";

/**
 * Handles the POST request to verify an OTP.
 *
 * @async
 * @function POST
 * @param {NextRequest} req - The incoming HTTP request object.
 * @returns {Promise<NextResponse>} - The HTTP response containing the verification ticket if OTP is valid.
 *
 * @throws {Error} If the OTP or OTP session ID is missing, if the OTP session is expired or not found, or if the OTP is invalid.
 *
 * @example
 * // Request body:
 * {
 *   "otp": "123456",
 *   "otpSessionId": "abc123"
 * }
 *
 * // Successful response:
 * {
 *   "success": true,
 *   "message": "OTP verified.",
 *   "verificationTicket": "verification_ticket_string"
 * }
 *
 * // Error response:
 * {
 *   "success": false,
 *   "message": "Failed to verify OTP"
 * }
 */
export async function POST(req: NextRequest) {
	try {
		const event: {
			otp: string;
			otpSessionId: string;
		} = await req.json();
		const { otp, otpSessionId } = event;

		if (!otpSessionId || !otp) {
			console.error("otp and otpSessionId are required.");
			throw new Error("Failed to verify OTP");
		}

		const existingOtpSession = await prisma.oTPStore.findFirst({
			where: {
				id: otpSessionId,
				expires_at: { gt: new Date() },
			},
		});

		if (!existingOtpSession?.id) {
			throw new Error("OTP session not found or expired.");
			// TODO: theres prrobably a need to redirect user to contacts page if otp session is not found or expired
		} else {
			// If an OTP session exists and is still valid, check the OTP
			const isOtpValid = verifyOTP(existingOtpSession.otpHash, otp);
			if (!isOtpValid) {
				throw new Error("Invalid OTP. Please try again.");
			} else {
				const verificationTicket: string = generateVerificationTicket({
					contact: existingOtpSession.contact as "email" | "phone",
					otpSessionId: existingOtpSession.id,
				});
				return NextResponse.json(
					{
						success: true,
						message: "OTP verified.",
						verificationTicket,
					},
					{ status: 200 }
				);
			}
		}
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
