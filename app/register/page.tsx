"use client";
import { useContext, useState } from "react";
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
import { RegisterContext, RegisterContextType } from "./layout";

import {
	SignUpUser,
	signUpUserSchema,
	validateUserInformation,
} from "@/lib/actions/user.actions";

function RegistrationStepOne() {
	const [termsAccepted, setTermsAccepted] = useState(false);
	const [privacyPolicyAccepted, setPrivacyPolicyAcceptance] = useState(false);
	const [privTermsChecked, setPrivTermsChecked] = useState(false);
	const { formData, setFormData } = useContext(
		RegisterContext
	) as RegisterContextType;

	console.log("formData", formData);

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
		const formDataObj = validateUserInformation(formData);
		console.log("formDataObj", formDataObj);
	};

	return (
		<div className="w-full max-w-3xl mx-auto p-6">
			<h1 className="text-4xl font-serif mb-1 text-center">Registration</h1>
			<p className="text-right text-gray-600 mb-4">Step 1 of 3</p>

			<p className="text-gray-700 mb-6">
				Please enter below information to create your account.
			</p>

			<div className="mb-8">
				<h2 className="text-xl font-serif border-b border-gray-200 pb-2 mb-4">
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
							className="w-full"
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
							className="w-full"
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
					</div>
				</div>
			</div>

			<div className="mb-8">
				<h2 className="text-xl font-serif border-b border-gray-200 pb-2 mb-4">
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
							className="w-full"
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
								className="rounded-l-none"
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
				className="w-full bg-green-800 hover:bg-green-900 text-white py-6"
				disabled={!privTermsChecked || !termsAccepted || !privacyPolicyAccepted}
				onClick={validateUserInfo}
			>
				NEXT
			</Button>
		</div>
	);
}

export default RegistrationStepOne;
