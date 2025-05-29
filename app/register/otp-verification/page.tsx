"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useContext, useTransition } from "react";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { verifyOtp } from "@/lib/actions/registration.action";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { FormSchema } from "@/lib/validators";
import { RegisterContextType, SignUpUser } from "@/lib/types";
import { useRouter } from "next/navigation";
import { RegisterContext } from "../registerContext";

function OTPVerification() {
	const { formData, setFormData } = useContext(
		RegisterContext
	) as RegisterContextType;
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			otp: "",
		},
	});

	const handleConfirmation = (values: { otp: string }) => {
		const { otp } = values;
		startTransition(async () => {
			const result = await verifyOtp({
				otpSessionId: formData.otpSessionId as string,
				otp,
			});

			if (!result.success) {
				toast.error(result.message);
				return;
			}

			// NOTE: The verification ticket is saved in the frontend for demonstration purposes.
			// In a real application, we would use this ticket to register the user on the backend.
			// If there is time, I'll work on the backend registration flow.
			setFormData((f: SignUpUser) => ({
				...f,
				verificationTicket: result.verificationTicket as string,
			}));

			toast.success(result.message);
		});
	};
	return (
		<Form {...form}>
			<form method="post" onSubmit={form.handleSubmit(handleConfirmation)}>
				<div className="w-full max-w-3xl mx-auto p-6">
					<h1 className="text-4xl font-serif mb-1 text-center">Registration</h1>
					<p className="text-right text-gray-600 mb-4">Step 3 of 3</p>
					<p className="text-gray-700 mb-6">
						Please enter below information to create your account.
					</p>
					<div className="mb-8">
						<h2 className="text-xl font-serif border-b border-gray-200 pb-2 mb-4">
							OTP Verification
						</h2>
						<Card>
							<CardHeader>
								<CardTitle>{`Please check your ${
									formData.otpChannel === "email" ? "email" : "phone number"
								}`}</CardTitle>
								<CardDescription>
									<p>{`We sent a code to: ${
										formData.otpChannel === "email"
											? formData.email
											: formData.phone
									}`}</p>
								</CardDescription>
							</CardHeader>
							<CardContent>
								<FormField
									control={form.control}
									name="otp"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<InputOTP maxLength={6} {...field}>
													<InputOTPGroup>
														<InputOTPSlot index={0} />
														<InputOTPSlot index={1} />
														<InputOTPSlot index={2} />
													</InputOTPGroup>
													<InputOTPSeparator />
													<InputOTPGroup>
														<InputOTPSlot index={3} />
														<InputOTPSlot index={4} />
														<InputOTPSlot index={5} />
													</InputOTPGroup>
												</InputOTP>
											</FormControl>
											<FormDescription>
												Didn't get a code? Click to resend{" "}
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>
						<div className="flex justify-between mt-3">
							<Button onClick={router.back}>Back</Button>
							<Button disabled={isPending} type="submit">
								{isPending ? "Submitting..." : "Next"}
							</Button>
						</div>
					</div>
				</div>
			</form>
		</Form>
	);
}

export default OTPVerification;
