"use client";

import { useState, useEffect } from "react";

import RegistrationStepTwo from "./step2";
import RegistrationStepOne from "./step1";

export default function Home() {
	const [userCredsVerified, setVerifiedUserCredentials] = useState(false);

	useEffect(() => {
		setVerifiedUserCredentials(false);
	}, []);

	return !userCredsVerified ? (
		<RegistrationStepOne
			setVerifiedUserCredentials={setVerifiedUserCredentials}
		/>
	) : (
		<RegistrationStepTwo />
	);
}
