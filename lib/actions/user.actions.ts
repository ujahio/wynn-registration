import { formatError } from "../utils";
import { z } from "zod";

export const signUpUserSchema = z.object({
	firstName: z.string().min(1, "First Name must be at least 3 characters long"),
	lastName: z.string().min(1, "Last Name must be at least 3 characters long"),
	gender: z.string().min(1, "Gender must be selected"),
	country: z.string().min(3, "Country must be selected"),
	phone: z.string().min(3, "Phone must be selected"),
	email: z.string().email("Invalid email address"),
});

export type SignUpUser = z.infer<typeof signUpUserSchema> & {
	otpChannel?: "email" | "sms" | null;
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

export const sendOtp = async (otpChannel: string) => {
	// This function should implement the logic to send OTP
	// For now, we will just return a mock response

	console.log("Sending OTP with data:", otpChannel);

	try {
		return {
			success: true,
			message: "OTP sent successfully",
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
};
