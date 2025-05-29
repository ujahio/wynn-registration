import z from "zod";

export const signUpUserSchema = z.object({
	firstName: z.string().min(1, "First Name must be at least 3 characters long"),
	lastName: z.string().min(1, "Last Name must be at least 3 characters long"),
	gender: z.string().min(1, "Gender must be selected"),
	country: z.string().min(3, "Country must be selected"),
	phone: z.string().min(3, "Phone must be selected"),
	email: z.string().email("Invalid email address"),
});

export const FormSchema = z.object({
	otp: z.string().min(6, {
		message: "Your one-time password must be 6 characters.",
	}),
});
