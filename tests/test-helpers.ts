import { prisma } from "@/db/prisma";
import { Page } from "@playwright/test";

export async function fillAndSubmitUserInfoForm(page: Page): Promise<void> {
	// Fill personal information
	await page.getByTestId("input-first-name").fill("John");
	await page.getByTestId("input-last-name").fill("Doe");

	// Select gender
	await page.getByTestId("select-gender").click();
	await page.getByTestId("male").click();

	// Select country
	await page.getByTestId("select-country").click();
	await page.getByText("United Arab Emirates").click();

	// Fill contact details
	await page.getByTestId("input-email").fill("john.doe@example.com");
	await page.getByTestId("input-phone").fill("5551234567");

	// Accept terms
	await page.getByTestId("terms-link").click();
	await page.getByTestId("privacy-link").click();
	await page.getByTestId("checkbox-terms").check();

	// Submit form
	await page.getByTestId("next-button").click();
}

export async function captureOtpSessionId(page: Page): Promise<string> {
	const sessionIdPromise = new Promise<string>((resolve) => {
		page.once("response", async (response) => {
			if (
				response.url().includes("/register/otp-selection") &&
				response.request().method() === "POST"
			) {
				try {
					const json = await response.json();
					console.log("Response from /register/otp-selection:", json);
					if (json.success && json.otpSessionId) {
						console.log("Captured OTP session ID:", json.otpSessionId);
						resolve(json.otpSessionId);
					} else {
						resolve("");
					}
				} catch (error) {
					console.error("Error parsing response:", error);
					resolve("");
				}
			}
		});
	});

	return sessionIdPromise;
}

export async function cleanupOtpSession(sessionId: string): Promise<void> {
	if (!sessionId) return;

	try {
		await prisma.oTPStore.delete({
			where: { id: sessionId },
		});
		console.log(`Cleaned up OTP session: ${sessionId}`);
	} catch (error) {
		console.error(`Failed to clean up OTP session ${sessionId}:`, error);
	}
}
