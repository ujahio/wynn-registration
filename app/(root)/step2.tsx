import { useState } from "react";
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

function OTPDestinations({
	captureOTPDestination,
}: {
	captureOTPDestination: (destination: string) => void;
}) {
	const [sendToPhoneChecked, setSendToPhone] = useState(false);
	const [sendToEmailChecked, setSendToEmail] = useState(false);
	const handleConfirmation = () => {
		const destination = sendToPhoneChecked ? "phone" : "email";
		captureOTPDestination(destination);
	};
	return (
		<form>
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
								id="terms"
								checked={sendToPhoneChecked}
								onCheckedChange={(checked) => {
									setSendToPhone(checked === true);
								}}
							/>
							<p>Send to Phone</p>
							<Checkbox
								id="terms"
								checked={sendToEmailChecked}
								onCheckedChange={(checked) => {
									setSendToEmail(checked === true);
								}}
							/>
							<p>Send to Email</p>
						</CardContent>
					</Card>
					<div className="flex justify-between mt-3">
						<Button onClick={handleConfirmation}>Back</Button>
						<Button>Next</Button>
					</div>
				</div>
			</div>
		</form>
	);
}

export default OTPDestinations;
