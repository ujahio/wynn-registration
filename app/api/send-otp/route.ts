import { NextResponse, NextRequest } from "next/server";
import { encryptOTP, generateOTP } from "@/lib/utils";
import { prisma } from "@/db/prisma";

// TODO: WRITE A SCRIPT TO PURGE OLD OTPs
// TODO: Send the OTP to the user via SMS/Email

export async function POST(req: NextRequest, res: NextResponse) {
	try {
		const event = await req.json();
		const { otpChannel, otpContact } = event;

		if (!otpChannel || !otpContact) {
			return NextResponse.json(
				{
					success: false,
					message: "OTP channel and value are required.",
				},
				{ status: 400 }
			);
		}

		const existingOtp = await prisma.oTPStore.findFirst({
			where: {
				channel: otpChannel,
				contact: otpContact,
				expires_at: { gt: new Date() },
			},
		});

		if (existingOtp) {
			// If an OTP already exists for this contact, return an error
			return NextResponse.json(
				{
					success: false,
					message: "An OTP has already been sent to this contact.",
				},
				{ status: 400 }
			);
		}

		const otp = generateOTP();
		const otpHash = encryptOTP(otp);

		const result = await prisma.oTPStore.create({
			data: {
				channel: otpChannel,
				contact: otpContact,
				otpHash,
				expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
				created_at: new Date(),
			},
		});

		// Console.log only exists for the sake of demonstration.
		// This will not be a production-ready implementation
		console.log(`OTP for ${otpChannel}: ${otp}`);

		if (!result) {
			throw new Error("Failed to create OTP session");
		}
		return NextResponse.json(
			{
				success: true,
				otpSessionId: result.id,
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
