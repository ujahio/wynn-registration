import { NextResponse, NextRequest } from "next/server";
import { encryptOTP, generateOTP } from "@/lib/utils";
import { prisma } from "@/db/prisma";

export async function POST(req: NextRequest, res: NextResponse) {
	try {
		const event = await req.json();
		const { otpChannel, otpVal } = event;

		const otp = generateOTP();
		const otpHash = encryptOTP(otp);

		// TODO: Send the OTP to the user via SMS/Email
		// Console only exists for the sake of demonstration.
		// This will not be a production-ready implementation
		console.log(`OTP for ${otpChannel}: ${otp}`);

		// TODO: check if the contact has already been sent an OTP

		const result = await prisma.oTPStore.create({
			data: {
				contact: otpChannel,
				otpHash,
				expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
				created_at: new Date(),
			},
		});
		return NextResponse.json({
			status: 200,
			success: true,
			otpSessionId: result.id,
		});
	} catch (error) {
		console.error("Error sending OTP:", error);
		return NextResponse.json({
			status: 500,
			success: false,
			message: "Failed to send OTP",
		});
	}
}
