"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";

import { getEmojiFlag, countries } from "countries-list";
import { InfoIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { formatError } from "@/lib/utils";
import { signUpUserSchema } from "@/lib/validators";
import { RegisterContextType, SignUpUser } from "@/lib/types";
import { RegisterContext } from "../registerContext";

const validateUserInformation = (formData: SignUpUser) => {
	try {
		signUpUserSchema.parse(formData);
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

function RegistrationStepOne() {
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string>
	>({});

	const [termsAccepted, setTermsAccepted] = useState(false);
	const [privacyPolicyAccepted, setPrivacyPolicyAcceptance] = useState(false);
	const [privTermsChecked, setPrivTermsChecked] = useState(false);
	const { formData, setFormData } = useContext(
		RegisterContext
	) as RegisterContextType;

	const router = useRouter();

	const countryList = Object.entries(countries).map(([code, country]) => ({
		code: code,
		name: country.name,
		emoji: getEmojiFlag(code as any),
	}));

	const handleTermsAndConditionsClick = (e: React.MouseEvent) => {
		e.preventDefault();
		if (!termsAccepted) {
			setTermsAccepted(!termsAccepted);
		}
	};

	const handlePrivacyPolicyClick = (e: React.MouseEvent) => {
		e.preventDefault();
		if (!privacyPolicyAccepted) {
			setPrivacyPolicyAcceptance(!privacyPolicyAccepted);
		}
	};

	const validateUserInfo = () => {
		const result = validateUserInformation(formData);
		console.log("Validation result:", result);
		if (!result.success) {
			setValidationErrors(result.message);
			return;
		}
		setValidationErrors({});
		router.push("/register/otp-selection");
	};

	return (
		<div className="w-full max-w-3xl mx-auto p-6">
			<div className="flex justify-between items-center mb-6">
				<h1
					className="text-4xl font-serif mb-1 text-center"
					data-testid="registration-header"
				>
					Registration
				</h1>
				<p
					className="text-right text-gray-600 mb-4"
					data-testid="step-indicator"
				>
					Step 1 of 3
				</p>
			</div>

			<p className="text-gray-700 mb-6">
				Please enter below information to create your account.
			</p>

			<div className="mb-8">
				<h2
					className="text-xl font-serif border-b border-gray-200 pb-2 mb-4"
					data-testid="personal-info-section"
				>
					Personal Info
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
					<div className="relative">
						<div className="flex items-center justify-between mb-1">
							<Label htmlFor="firstName" className="text-sm">
								First Name <span className="text-red-500">*</span>
							</Label>
							<InfoIcon className="h-5 w-5 text-gray-400" />
						</div>
						<Input
							id="firstName"
							name="firstName"
							type="text"
							value={formData.firstName}
							required
							placeholder="Enter first name..."
							data-testid="input-first-name"
							className={`w-full ${
								"firstName" in validationErrors ? "border-red-500" : ""
							}`}
							onChange={(e) =>
								setFormData((f: SignUpUser) => ({
									...f,
									firstName: e.target.value,
								}))
							}
						/>
					</div>

					<div className="relative">
						<div className="flex items-center justify-between mb-1">
							<Label htmlFor="lastName" className="text-sm">
								Last Name <span className="text-red-500">*</span>
							</Label>
							<InfoIcon className="h-5 w-5 text-gray-400" />
						</div>
						<Input
							id="lastName"
							name="lastName"
							type="text"
							value={formData.lastName}
							onChange={(e) =>
								setFormData((f: SignUpUser) => ({
									...f,
									lastName: e.target.value,
								}))
							}
							required
							placeholder="Enter last name..."
							data-testid="input-last-name"
							className={`w-full ${
								"lastName" in validationErrors ? "border-red-500" : ""
							}`}
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
					<div className="relative">
						<div className="flex items-center justify-between mb-1">
							<Label htmlFor="gender" className="text-sm">
								Gender <span className="text-red-500">*</span>
							</Label>
							<InfoIcon className="h-5 w-5 text-gray-400" />
						</div>
						<Select
							name="gender"
							required
							data-testid="select-gender"
							value={formData.gender}
							onValueChange={(gender) =>
								setFormData((f: SignUpUser) => ({
									...f,
									gender,
								}))
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select gender..." />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="male">Male</SelectItem>
								<SelectItem value="female">Female</SelectItem>
								<SelectItem value="other">Other</SelectItem>
							</SelectContent>
						</Select>
						{"gender" in validationErrors && (
							<p className="text-destructive text-sm">
								{validationErrors.gender}
							</p>
						)}
					</div>

					<div className="relative">
						<div className="flex items-center justify-between mb-1">
							<Label htmlFor="country" className="text-sm">
								Your Residence Country <span className="text-red-500">*</span>
							</Label>
							<InfoIcon className="h-5 w-5 text-gray-400" />
						</div>
						<Select
							name="country"
							required
							data-testid="select-country"
							value={formData.country}
							onValueChange={(country) =>
								setFormData((f: SignUpUser) => ({
									...f,
									country,
								}))
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select residence country..." />
							</SelectTrigger>
							<SelectContent>
								{countryList.map((country) => (
									<SelectItem
										key={country.code}
										value={country.name.toString()}
									>
										{country.emoji} {country.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{"country" in validationErrors && (
							<p className="text-destructive text-sm">
								{validationErrors.country}
							</p>
						)}
					</div>
				</div>
			</div>

			<div className="mb-8">
				<h2
					className="text-xl font-serif border-b border-gray-200 pb-2 mb-4"
					data-testid="contact-details-section"
				>
					Contact Details
				</h2>

				<div className="space-y-6">
					<div className="relative">
						<div className="flex items-center justify-between mb-1">
							<Label htmlFor="email" className="text-sm">
								Email <span className="text-red-500">*</span>
							</Label>
							<InfoIcon className="h-5 w-5 text-gray-400" />
						</div>
						<Input
							id="email"
							name="email"
							type="email"
							required
							placeholder="Enter email address..."
							data-testid="input-email"
							className={`w-full ${
								"email" in validationErrors ? "border-red-500" : ""
							}`}
							value={formData.email}
							onChange={(e) =>
								setFormData((f: SignUpUser) => ({
									...f,
									email: e.target.value,
								}))
							}
						/>
					</div>

					<div className="relative">
						<div className="flex items-center justify-between mb-1">
							<Label htmlFor="phone" className="text-sm">
								Phone Number <span className="text-red-500">*</span>
							</Label>
							<InfoIcon className="h-5 w-5 text-gray-400" />
						</div>
						<div className="flex">
							<div className="flex items-center border rounded-l-md px-3 bg-white border-r-0">
								<div className="mr-2">🇦🇪</div>
								<span>+971</span>
							</div>
							<Input
								id="phone"
								name="phone"
								type="tel"
								required
								data-testid="input-phone"
								className={`rounded-l-none ${
									"phone" in validationErrors ? "border-red-500" : ""
								}`}
								placeholder="(_ _ _) _ _ _"
								value={formData.phone}
								onChange={(e) =>
									setFormData((f: SignUpUser) => ({
										...f,
										phone: e.target.value,
									}))
								}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="flex items-start space-x-2 mb-8">
				<Checkbox
					id="terms"
					checked={privTermsChecked}
					data-testid="checkbox-terms"
					onCheckedChange={(checked) => {
						setPrivTermsChecked(checked === true);
					}}
					disabled={!termsAccepted || !privacyPolicyAccepted}
				/>
				<div className="grid gap-1.5 leading-none">
					<label
						htmlFor="terms"
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						I agree to the{" "}
						<a
							href="#"
							data-testid="terms-link"
							className={`underline ${
								!termsAccepted ? "text-green-800" : "text-gray-400"
							}`}
							onClick={handleTermsAndConditionsClick}
						>
							terms and conditions
						</a>{" "}
						and{" "}
						<a
							href="#"
							data-testid="privacy-link"
							className={`underline ${
								!privacyPolicyAccepted ? "text-green-800" : "text-gray-400"
							}`}
							onClick={handlePrivacyPolicyClick}
						>
							privacy policy
						</a>
						.
					</label>
				</div>
			</div>

			<Button
				type="submit"
				data-testid="next-button"
				className="w-full bg-green-800 hover:bg-green-900 text-white py-6"
				onClick={validateUserInfo}
			>
				NEXT
			</Button>
		</div>
	);
}

export default RegistrationStepOne;
