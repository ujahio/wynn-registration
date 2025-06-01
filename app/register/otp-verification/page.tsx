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
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-4xl font-serif mb-1 text-center text-gray-900">
							Registration
						</h1>
						<p className="text-right text-gray-600 mb-4 text-sm">Step 3 of 3</p>
					</div>

					<p className="text-gray-700 mb-6 text-base">
						Please enter below information to create your account.
					</p>

					<div className="mb-8">
						<h2 className="text-xl font-serif border-b-2 border-gray-300 pb-2 mb-4 text-gray-800">
							OTP Verification
						</h2>

						<Card className="border border-gray-200 rounded-lg bg-white">
							<CardHeader className="text-center pt-4 pb-2">
								<CardTitle className="text-2xl font-semibold text-gray-900 mb-1">
									{`Please check your ${
										formData.otpChannel === "email" ? "email" : "phone number"
									}`}
								</CardTitle>
								<CardDescription className="text-gray-500 text-sm">
									<p>
										{`We sent a code to: ${
											formData.otpChannel === "email"
												? formData.email
												: formData.phone
										}`}
									</p>
								</CardDescription>
							</CardHeader>

							<CardContent className="pt-4 pb-4 flex flex-col items-center">
								<FormField
									control={form.control}
									name="otp"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<InputOTP maxLength={6} {...field}>
													<InputOTPGroup className="flex justify-center space-x-2 mb-2">
														<InputOTPSlot
															index={0}
															className="w-12 h-12 border-2 rounded-md bg-white text-xl text-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
															style={{
																borderColor: "#674D3A",
																lineHeight: "3rem",
															}}
														/>
														<InputOTPSlot
															index={1}
															className="w-12 h-12 border-2 rounded-md bg-white text-xl text-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
															style={{
																borderColor: "#674D3A",
																lineHeight: "3rem",
															}}
														/>
														<InputOTPSlot
															index={2}
															className="w-12 h-12 border-2 rounded-md bg-white text-xl text-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
															style={{
																borderColor: "#674D3A",
																lineHeight: "3rem",
															}}
														/>
													</InputOTPGroup>

													<InputOTPSeparator className="mx-2" />

													<InputOTPGroup className="flex justify-center space-x-2 mb-2">
														<InputOTPSlot
															index={3}
															className="w-12 h-12 border-2 rounded-md bg-white text-xl text-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
															style={{
																borderColor: "#674D3A",
																lineHeight: "3rem",
															}}
														/>
														<InputOTPSlot
															index={4}
															className="w-12 h-12 border-2 rounded-md bg-white text-xl text-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
															style={{
																borderColor: "#674D3A",
																lineHeight: "3rem",
															}}
														/>
														<InputOTPSlot
															index={5}
															className="w-12 h-12 border-2 rounded-md bg-white text-xl text-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
															style={{
																borderColor: "#674D3A",
																lineHeight: "3rem",
															}}
														/>
													</InputOTPGroup>
												</InputOTP>
											</FormControl>

											<FormDescription className="text-center text-gray-500 text-sm mt-2">
												Didn’t get a code?{" "}
												<a
													onClick={() => {}}
													className="text-blue-600 underline hover:text-blue-700 cursor-pointer"
												>
													Click to resend.
												</a>
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>
						<div className="flex justify-between mt-4">
							<Button
								onClick={router.back}
								className=" bg-green-800 hover:bg-green-900 text-white py-6 w-48 h-16"
							>
								Back
							</Button>
							<Button
								disabled={isPending}
								type="submit"
								className=" bg-green-800 hover:bg-green-900 text-white py-6 w-48 h-16"
							>
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
