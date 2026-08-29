import { expect, test } from "@playwright/test";

test("fills coordinates from the offline Rajkot city match", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Birthplace").first().fill("Rajkot");

  await expect(page.getByLabel("Birthplace").first()).toHaveValue(
    "Rajkot, Gujarat, India"
  );
  await expect(page.getByLabel("Latitude").first()).toHaveValue("22.29161");
  await expect(page.getByLabel("Longitude").first()).toHaveValue("70.79322");
  await expect(page.getByLabel("Timezone").first()).toHaveValue("+05:30");
});

test("calculates a browser-only Guna report", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Date of birth").first().fill("1990-01-01");
  await page.getByLabel("Birth time").first().fill("12:00");
  await page.getByLabel("Date of birth").nth(1).fill("1992-03-20");
  await page.getByLabel("Birth time").nth(1).fill("08:45");
  await page.getByRole("button", { name: "Calculate Guna Milan" }).click();

  await expect(page.getByRole("heading", { name: /traditional match|review/i })).toBeVisible();
  await expect(page.getByText("/ 36")).toBeVisible();
  await expect(page.getByText("Nadi", { exact: true })).toBeVisible();
});
