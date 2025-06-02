import { test, expect } from "@playwright/test";
import {
	captureOtpSessionId,
	cleanupOtpSession,
	fillAndSubmitUserInfoForm,
} from "./test-helpers";

test.describe("Registration Page - OTP Selection", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3000/register/user-info");
		await fillAndSubmitUserInfoForm(page);
		await page.waitForURL("**/register/otp-selection", { timeout: 5000 });
	});

	test("should display correct page structure", async ({ page }) => {
		// Check page title and step indicator
		const registrationHeader = await page.getByTestId("registration-header");
		await expect(registrationHeader).toBeVisible();
		await expect(registrationHeader).toHaveText("Registration");

		const stepIndicator = await page.getByTestId("step-indicator");
		await expect(stepIndicator).toBeVisible();
		await expect(stepIndicator).toHaveText("Step 2 of 3");

		// Check OTP verification section exists
		const sectionHeading = await page.getByTestId("otp-verification-section");
		await expect(sectionHeading).toBeVisible();
		await expect(sectionHeading).toHaveText("OTP Verification");

		// Check card title
		const cardTitle = await page.getByTestId("card-title");
		await expect(cardTitle).toBeVisible();
		await expect(cardTitle).toHaveText("Send Code");

		// Check both OTP options exist
		await expect(page.getByTestId("phone-option-text")).toBeVisible();
		await expect(page.getByTestId("email-option-text")).toBeVisible();
	});

	test("should validate OTP channel selection is required", async ({
		page,
	}) => {
		await page.getByTestId("next-button").click();

		const errorToast = await page.getByText(
			"Please select a destination for OTP."
		);
		await expect(errorToast).toBeVisible();

		await expect(page).toHaveURL(/.*\/register\/otp-selection/);
	});

	// TODO
	/* should select phone option and navigate to verification page */
	/* should select email option and navigate to verification page */

	test("should allow going back to previous step", async ({ page }) => {
		await page.getByTestId("back-button").click();
		await expect(page).toHaveURL(/.*\/register\/user-info/);
	});

	test("should show loading state while submitting", async ({ page }) => {
		await page.getByTestId("checkbox-email").click();

		// Mock the API response to delay
		await page.route("**/api/send-otp", async (route) => {
			// Wait to simulate loading state
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					success: true,
					message: "Your OTP is 123456",
					otpSessionId: "mock-session-id",
				}),
			});
		});

		// Click Next button
		await page.getByTestId("next-button").click();

		// Check for loading state
		await expect(page.getByTestId("next-button")).toContainText("Submitting");
	});
});
