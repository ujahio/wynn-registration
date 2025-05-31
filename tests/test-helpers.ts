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
