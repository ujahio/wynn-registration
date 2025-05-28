"use client";

import { useState, useEffect } from "react";

import RegistrationStepTwo from "./step2";
import RegistrationStepOne from "./step1";
import { SignUpUser } from "@/lib/actions/user.actions";

const initialUserCreds: SignUpUser = {
	firstName: "",
	lastName: "",
	gender: "",
	country: "",
	phone: "",
	email: "",
};

const userCredsIntialState = {
	success: false,
	user: initialUserCreds,
};

export type UserCredsState = {
	success: boolean;
	user: SignUpUser;
};

export default function Home() {
	const [userCredsVerified, setVerifiedUserCredentials] =
		useState<UserCredsState>(userCredsIntialState);
	const [otpDestination, captureOTPDestination] = useState<string>("");

	useEffect(() => {
		setVerifiedUserCredentials(userCredsIntialState);
		captureOTPDestination("");
	}, []);

	return (
		<>
			{!userCredsVerified.success && (
				<RegistrationStepOne
					setVerifiedUserCredentials={setVerifiedUserCredentials}
				/>
			)}
			{otpDestination === "" && (
				<RegistrationStepTwo captureOTPDestination={captureOTPDestination} />
			)}
		</>
	);
}
