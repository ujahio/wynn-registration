import z from "zod";
import { signUpUserSchema } from "./validators";

export type SignUpUser = z.infer<typeof signUpUserSchema> & {
	otpChannel?: "email" | "phone" | null;
	otpSessionId?: string | null;
	verificationTicket?: string | null;
};
export type RegisterContextType = {
	formData: SignUpUser;
	setFormData: React.Dispatch<React.SetStateAction<SignUpUser>>;
};
