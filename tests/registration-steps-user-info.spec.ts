import { test, expect } from "@playwright/test";
import { fillAndSubmitUserInfoForm } from "./test-helpers";

test.describe("Registration Page - User Info", () => {
	test.describe("Registration Page - Structure Tests", async () => {
		test.beforeEach(async ({ page }) => {
			await page.goto("http://localhost:3000/register/user-info");
		});

		test("should display Registration title and Step 1 of 3 indicator", async ({
			page,
		}) => {
			const registrationHeading = await page.getByTestId("registration-header");
			await expect(registrationHeading).toBeVisible();
			await expect(registrationHeading).toHaveText("Registration");

			const stepIndicator = await page.getByTestId("step-indicator");
			await expect(stepIndicator).toBeVisible();
			await expect(stepIndicator).toHaveText("Step 1 of 3");
		});

		test("should display Personal Info and Contact Details sections", async ({
			page,
		}) => {
			const personalInfoHeading = await page.getByTestId(
				"personal-info-section"
			);
			await expect(personalInfoHeading).toBeVisible();
			await expect(personalInfoHeading).toHaveText("Personal Info");

			const contactDetailsHeading = await page.getByTestId(
				"contact-details-section"
			);
			await expect(contactDetailsHeading).toBeVisible();
			await expect(contactDetailsHeading).toHaveText("Contact Details");
		});
	});

	test.describe("Registration Form - Field Validation Tests", () => {
		test.beforeEach(async ({ page }) => {
			await page.goto("http://localhost:3000/register/user-info");
		});

		test("should validate First Name field and show red border when empty", async ({
			page,
		}) => {
			const nextButton = await page.getByTestId("next-button");
			await expect(nextButton).toBeVisible();

			await page.getByTestId("next-button").click();
			await expect(page).toHaveURL("http://localhost:3000/register/user-info");

			const firstNameInput = page.getByTestId("input-first-name");
			const hasBorderRedClass = await firstNameInput.evaluate((el) =>
				el.className.includes("border-red-500")
			);
			expect(hasBorderRedClass).toBeTruthy();

			await firstNameInput.fill("John");
			await page.getByTestId("next-button").click();

			const stillHasBorderRedClass = await firstNameInput.evaluate((el) =>
				el.className.includes("border-red-500")
			);
			expect(stillHasBorderRedClass).toBeFalsy();
			await expect(page).toHaveURL("http://localhost:3000/register/user-info");
		});

		test("should validate Last Name field and show red border when empty", async ({
			page,
		}) => {
			await page.getByTestId("input-first-name").fill("John");
			await page.getByTestId("next-button").click();
			await expect(page).toHaveURL("http://localhost:3000/register/user-info");

			const lastNameInput = page.getByTestId("input-last-name");
			const hasBorderRedClass = await lastNameInput.evaluate((el) =>
				el.className.includes("border-red-500")
			);
			expect(hasBorderRedClass).toBeTruthy();

			await lastNameInput.fill("Doe");
			await page.getByTestId("next-button").click();

			const stillHasBorderRedClass = await lastNameInput.evaluate((el) =>
				el.className.includes("border-red-500")
			);
			expect(stillHasBorderRedClass).toBeFalsy();
			await expect(page).toHaveURL("http://localhost:3000/register/user-info");
		});

		test("should validate Gender selection and show error message", async ({
			page,
		}) => {
			await page.getByTestId("input-first-name").fill("John");
			await page.getByTestId("input-last-name").fill("Doe");
			await page.getByTestId("next-button").click();
			await expect(page).toHaveURL("http://localhost:3000/register/user-info");

			const genderErrorMessage = page.getByTestId("gender-error-message");
			await expect(genderErrorMessage).toBeVisible();
			await expect(genderErrorMessage).toContainText("Gender must be selected");

			await page.getByTestId("select-gender").click();
			await page.getByTestId("male").click();
			await page.getByTestId("next-button").click();
			await expect(genderErrorMessage).not.toBeVisible();
			await expect(page).toHaveURL("http://localhost:3000/register/user-info");
		});

		test("should validate Country selection and show error message", async ({
			page,
		}) => {
			await page.getByTestId("input-first-name").fill("John");
			await page.getByTestId("input-last-name").fill("Doe");
			await page.getByTestId("select-gender").click();
			await page.getByTestId("male").click();
			await page.getByTestId("next-button").click();
			await expect(page).toHaveURL("http://localhost:3000/register/user-info");

			const countryErrorMessage = page.getByTestId("country-error-message");
			await expect(countryErrorMessage).toBeVisible();

			await page.getByTestId("select-country").click();
			await page.getByText("United Arab Emirates").click();
			await page.getByTestId("next-button").click();
			await expect(countryErrorMessage).not.toBeVisible();
			await expect(page).toHaveURL("http://localhost:3000/register/user-info");
		});

		test("should validate Email field format and show red border when invalid", async ({
			page,
		}) => {
			await page.getByTestId("input-first-name").fill("John");
			await page.getByTestId("input-last-name").fill("Doe");
			await page.getByTestId("select-gender").click();
			await page.getByTestId("male").click();
			await page.getByTestId("select-country").click();
			await page.getByText("United Arab Emirates").click();

			await page.getByTestId("input-email").fill("invalid-email");
			await page.getByTestId("next-button").click();
			await expect(page).toHaveURL("http://localhost:3000/register/user-info");

			const emailInput = page.getByTestId("input-email");
			const hasBorderRedClass = await emailInput.evaluate((el) =>
				el.className.includes("border-red-500")
			);
			expect(hasBorderRedClass).toBeTruthy();

			await emailInput.fill("valid@example.com");
			await page.getByTestId("next-button").click();

			const stillHasBorderRedClass = await emailInput.evaluate((el) =>
				el.className.includes("border-red-500")
			);
			expect(stillHasBorderRedClass).toBeFalsy();
			await expect(page).toHaveURL("http://localhost:3000/register/user-info");
		});

		test("should validate Phone number field and show red border when empty", async ({
			page,
		}) => {
			await page.getByTestId("input-first-name").fill("John");
			await page.getByTestId("input-last-name").fill("Doe");
			await page.getByTestId("select-gender").click();
			await page.getByTestId("male").click();
			await page.getByTestId("select-country").click();
			await page.getByText("United Arab Emirates").click();
			await page.getByTestId("input-email").fill("valid@example.com");

			await page.getByTestId("next-button").click();
			await expect(page).toHaveURL("http://localhost:3000/register/user-info");

			const phoneInput = page.getByTestId("input-phone");
			const hasBorderRedClass = await phoneInput.evaluate((el) =>
				el.className.includes("border-red-500")
			);
			expect(hasBorderRedClass).toBeTruthy();

			await phoneInput.fill("5551234567");
			await page.getByTestId("next-button").click();

			const stillHasBorderRedClass = await phoneInput.evaluate((el) =>
				el.className.includes("border-red-500")
			);
			expect(stillHasBorderRedClass).toBeFalsy();
			await expect(page).toHaveURL("http://localhost:3000/register/user-info");
		});
	});

	test.describe("Registration Form - Agreement Tests", () => {
		test.beforeEach(async ({ page }) => {
			await page.goto("http://localhost:3000/register/user-info");
		});

		test("should handle terms and privacy policy acceptance flow", async ({
			page,
		}) => {
			const checkbox = page.getByTestId("checkbox-terms");
			await expect(checkbox).toBeDisabled();

			await page.getByTestId("terms-link").click();
			await expect(checkbox).toBeDisabled();

			await page.getByTestId("privacy-link").click();
			await expect(checkbox).toBeEnabled();

			await checkbox.check();
			await expect(checkbox).toBeChecked();

			const termsLink = page.getByTestId("terms-link");
			const privacyLink = page.getByTestId("privacy-link");

			const termsColor = await termsLink.evaluate((el) => {
				const style = window.getComputedStyle(el);
				return style.color;
			});

			const privacyColor = await privacyLink.evaluate((el) => {
				const style = window.getComputedStyle(el);
				return style.color;
			});

			expect(termsColor).not.toEqual("rgb(22, 101, 52)");
			expect(privacyColor).not.toEqual("rgb(22, 101, 52)");
		});
	});

	test.describe("Registration Form - Complete Submission", () => {
		test.beforeEach(async ({ page }) => {
			await page.goto("http://localhost:3000/register/user-info");
		});

		test("should navigate to OTP selection when form is valid and submitted", async ({
			page,
		}) => {
			await fillAndSubmitUserInfoForm(page);
			await page.waitForURL("**/register/otp-selection", { timeout: 5000 });
			await expect(page).toHaveURL(/.*\/register\/otp-selection/);
		});
	});
});
