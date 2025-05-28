import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

function OTP() {
	return (
		<form>
			<div className="w-full max-w-3xl mx-auto p-6">
				<h1 className="text-4xl font-serif mb-1 text-center">Registration</h1>
				<p className="text-right text-gray-600 mb-4">Step 3 of 3</p>'
				<p className="text-gray-700 mb-6">
					Please enter below information to create your account.
				</p>
				<div className="mb-8">
					<h2 className="text-xl font-serif border-b border-gray-200 pb-2 mb-4">
						OTP Verification
					</h2>
					<Card>
						<CardHeader>
							<CardTitle>Please check your email</CardTitle>
							<CardDescription>
								<p>We sent an email to</p>
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p>Card Content</p>
						</CardContent>
						<CardFooter>
							<p>Didn't get a code? Click to resend</p>
						</CardFooter>
					</Card>
				</div>
			</div>
		</form>
	);
}

export default OTP;
