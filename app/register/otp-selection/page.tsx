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
import { RegisterContext } from "../layout";
import { sendOtp } from "@/lib/actions/registration.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RegisterContextType, SignUpUser } from "@/lib/types";

function OTPDestinations() {
	const { formData, setFormData } = useContext(
		RegisterContext
	) as RegisterContextType;
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	// TODO: route user to registration page if users loses registration details
	// TODO: handle back button

	const handleConfirmation = () => {
		startTransition(async () => {
			if (!formData.otpChannel) {
				console.error();
				toast.error("Please select a destination for OTP.");

				return;
			}
			const result = await sendOtp({
				otpChannel: formData.otpChannel,
				otpContact: formData[formData.otpChannel as keyof SignUpUser] ?? "",
			});

			if (!result.success) {
				toast.error(result.message);
				return;
			}

			//navigate to verification
			// toast.success(result.message);
			toast.success(result.message, {
				action: {
					label: "Copy",
					onClick: () => {
						// Extract the OTP code from the message (assuming format "OTP 123456")
						const otp = result.message.split(" ")[1];
						navigator.clipboard
							.writeText(otp)
							.then(() => toast.success("OTP copied to clipboard"))
							.catch(() => toast.error("Failed to copy OTP"));
					},
				},
			});
			router.push("/register/otp-verification");
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
							checked={formData.otpChannel === "phone"}
							onCheckedChange={(checked) => {
								setFormData((f: SignUpUser) => ({
									...f,
									otpChannel: checked ? "phone" : null,
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
