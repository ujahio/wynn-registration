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

export type SignUpUser = z.infer<typeof signUpUserSchema>;

export const validateUserInformation = async (
	prevState: unknown,
	formData: FormData
) => {
	const formEntries = Array.from(formData.entries());
	console.log("Form data entries:", formEntries);
	try {
		const firstName = formData.get("first_name") as string;
		const lastName = formData.get("last_name") as string;
		const gender = formData.get("gender") as string;
		const country = formData.get("country") as string;
		const email = formData.get("email") as string;
		const phone = formData.get("phone") as string;

		const validatedData = signUpUserSchema.parse({
			firstName,
			lastName,
			gender,
			country,
			email,
			phone,
		});

		console.log("Validated data:", validatedData);

		return {
			success: true,
			message: "Ready to send OTP for verification",
			data: validatedData as SignUpUser,
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
};
