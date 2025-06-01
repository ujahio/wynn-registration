import { NextResponse, NextRequest } from "next/server";
import { encryptOTP, generateOTP } from "@/lib/utils";
import { prisma } from "@/db/prisma";

// TODO: WRITE A SCRIPT TO PURGE OLD OTPs
// TODO: Send the OTP to the user via SMS/Email

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
			// If an OTP already exists for this contact, return an error
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
				expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
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
