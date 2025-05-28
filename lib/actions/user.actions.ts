import { formatError } from "../utils";
import { z } from "zod";

// TODO: Move validatioon to layout or step 1 component
export const signUpUserSchema = z.object({
	firstName: z.string().min(1, "First Name must be at least 3 characters long"),
	lastName: z.string().min(1, "Last Name must be at least 3 characters long"),
	gender: z.string().min(1, "Gender must be selected"),
	country: z.string().min(3, "Country must be selected"),
	phone: z.string().min(3, "Phone must be selected"),
	email: z.string().email("Invalid email address"),
});

export type SignUpUser = z.infer<typeof signUpUserSchema> & {
	otpChannel?: "email" | "phone" | null;
	otpSessionId?: string | null;
	verificationTicket?: string | null;
};

export const validateUserInformation = (formData: SignUpUser) => {
	try {
		const validatedData = signUpUserSchema.parse(formData);
		return {
			success: true,
			message: "Ready to send OTP for verification",
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
};

export const sendOtp = async ({
	otpChannel,
	otpVal,
}: {
	otpChannel: string;
	otpVal: string;
}) => {
	try {
		const response = await fetch("/api/send-otp", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ otpChannel, otpVal }),
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(`Failed to send OTP: ${errorData.message}`);
		}
		const res = await response.json();
		return {
			success: true,
			message: "OTP sent successfully",
			otpSessionId: res.otpSessionId,
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
};
