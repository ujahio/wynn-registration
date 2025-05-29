"use client";

import { createContext, useState } from "react";
import { RegisterContextType, SignUpUser } from "@/lib/types";

export const RegisterContext = createContext<RegisterContextType | null>(null);

export function RegisterContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [formData, setFormData] = useState<SignUpUser>({
		email: "",
		phone: "",
		otpChannel: null,
		otpSessionId: null,
		firstName: "",
		lastName: "",
		gender: "",
		country: "",
		verificationTicket: null,
	});

	return (
		<RegisterContext.Provider value={{ formData, setFormData }}>
			{children}
		</RegisterContext.Provider>
	);
}
