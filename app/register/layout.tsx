"use client";

import { createContext, useState } from "react";
import Header from "@/components/header";
import { SignUpUser } from "@/lib/actions/user.actions";

export interface RegisterContextType {
	formData: SignUpUser;
	setFormData: React.Dispatch<React.SetStateAction<SignUpUser>>;
}

export const RegisterContext = createContext<RegisterContextType | null>(null);

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
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
			<div className="flex h-screen flex-col bg-gray-100">
				<Header />
				<main className="flex-1 wrapper">{children}</main>
				{/* <Footer /> */}
			</div>
		</RegisterContext.Provider>
	);
}
