"use client";
import { useContext, useTransition } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { sendOtp } from "@/lib/actions/registration.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RegisterContextType, SignUpUser } from "@/lib/types";
import { RegisterContext } from "../registerContext";

function OTPSelections() {
	const { formData, setFormData } = useContext(
		RegisterContext
	) as RegisterContextType;
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	// TODO: route user to registration page if users loses registration details

	const handleConfirmation = () => {
		startTransition(async () => {
			if (!formData.otpChannel) {
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

			setFormData((f: SignUpUser) => ({
				...f,
				otpSessionId: result.otpSessionId,
			}));

			toast.success(result.message, {
				action: {
					label: "Copy",
					onClick: () => {
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
			<div className="flex justify-between items-center mb-10">
				<h1 className="text-5xl font-serif" data-testid="registration-header">
					Registration
				</h1>
				<p className="text-xl text-gray-600" data-testid="step-indicator">
					Step 2 of 3
				</p>
			</div>

			<p className="text-gray-700 mb-8 text-lg">
				Please enter below information to create your account.
			</p>
			<div className="mb-12">
				<h2
					className="text-2xl font-serif border-b border-gray-300 pb-3 mb-6"
					data-testid="otp-verification-section"
				>
					OTP Verification
				</h2>
				<Card className="border-0 shadow-md">
					<CardHeader className="text-center pb-2">
						<CardTitle className="text-3xl font-serif" data-testid="card-title">
							Send Code
						</CardTitle>
						<CardDescription className="text-center mt-4 text-lg text-gray-500">
							How would you like to receive the code?
						</CardDescription>
					</CardHeader>
					<CardContent className="py-6">
						<div className="flex justify-center items-center gap-16">
							<div className="flex items-center space-x-3">
								<div className="relative">
									<Checkbox
										id="phone"
										className="rounded-full h-6 w-6 border-2"
										data-testid="checkbox-phone"
										checked={formData.otpChannel === "phone"}
										onCheckedChange={(checked) => {
											setFormData((f: SignUpUser) => ({
												...f,
												otpChannel: checked ? "phone" : null,
											}));
										}}
									/>
								</div>
								<label
									htmlFor="phone"
									className="text-lg"
									data-testid="phone-option-text"
								>
									Send to Phone
								</label>
							</div>

							<div className="flex items-center space-x-3">
								<div className="relative">
									<Checkbox
										id="email"
										className="rounded-full h-6 w-6 border-2"
										data-testid="checkbox-email"
										checked={formData.otpChannel === "email"}
										onCheckedChange={(checked) => {
											setFormData((f: SignUpUser) => ({
												...f,
												otpChannel: checked ? "email" : null,
											}));
										}}
									/>
								</div>
								<label
									htmlFor="email"
									className="text-lg"
									data-testid="email-option-text"
								>
									Send to Email
								</label>
							</div>
						</div>
					</CardContent>
				</Card>
				<div className="flex justify-between mt-6">
					<Button
						variant="outline"
						className="w-[180px] h-[60px] text-lg border-2 font-medium"
						data-testid="back-button"
						onClick={router.back}
					>
						BACK
					</Button>
					<Button
						className="w-[180px] h-[60px] text-lg font-medium bg-teal-700 hover:bg-teal-800"
						data-testid="next-button"
						disabled={isPending}
						onClick={handleConfirmation}
					>
						{isPending ? "Submitting..." : "NEXT"}
					</Button>
				</div>
			</div>
		</div>
	);
}

export default OTPSelections;
