"use client";
import { useActionState, useContext, useTransition } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { RegisterContext, RegisterContextType } from "../layout";
import { sendOtp, SignUpUser } from "@/lib/actions/user.actions";

function OTPDestinations() {
	const { formData, setFormData } = useContext(
		RegisterContext
	) as RegisterContextType;
	const [isPending, startTransition] = useTransition();

	const handleConfirmation = () => {
		console.log("Sending OTP to:", formData);
		startTransition(async () => {
			const result = await sendOtp(formData.otpChannel);
			console.log("Server action result:", result);
		});
		return true;
	};
	return (
		<div className="w-full max-w-3xl mx-auto p-6">
			<h1 className="text-4xl font-serif mb-1 text-center">Registration</h1>
			<p className="text-right text-gray-600 mb-4">Step 2 of 3</p>'
			<p className="text-gray-700 mb-6">
				Please enter below information to create your account.
			</p>
			<div className="mb-8">
				<h2 className="text-xl font-serif border-b border-gray-200 pb-2 mb-4">
					OTP Verification
				</h2>
				<Card>
					<CardHeader>
						<CardTitle>Send Code</CardTitle>
						<CardDescription>
							<p>How would you like to receive the code?</p>
						</CardDescription>
					</CardHeader>
					<CardContent className="flex justify-between">
						<Checkbox
							id="phone"
							checked={formData.otpChannel === "sms"}
							onCheckedChange={(checked) => {
								setFormData((f: SignUpUser) => ({
									...f,
									otpChannel: checked ? "sms" : null,
								}));
							}}
						/>
						<p>Send to Phone</p>
						<Checkbox
							id="email"
							checked={formData.otpChannel === "email"}
							onCheckedChange={(checked) => {
								setFormData((f: SignUpUser) => ({
									...f,
									otpChannel: checked ? "email" : null,
								}));
							}}
						/>
						<p>Send to Email</p>
					</CardContent>
				</Card>
				<div className="flex justify-between mt-3">
					<Button>Back</Button>
					<Button disabled={isPending} onClick={handleConfirmation}>
						{isPending ? "Submitting..." : "Next"}
					</Button>
				</div>
			</div>
		</div>
	);
}

export default OTPDestinations;
