import { expect, test } from "@playwright/test";

test("calculates a browser-only Guna report", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Date of birth").first().fill("1990-01-01");
  await page.getByLabel("Birth time").first().fill("12:00");
  await page.getByLabel("Date of birth").nth(1).fill("1992-03-20");
  await page.getByLabel("Birth time").nth(1).fill("08:45");
  await page.getByRole("button", { name: "Calculate Guna Milan" }).click();

  await expect(page.getByRole("heading", { name: /traditional match|review/i })).toBeVisible();
  await expect(page.getByText("/ 36")).toBeVisible();
  await expect(page.getByText("Nadi")).toBeVisible();
});
