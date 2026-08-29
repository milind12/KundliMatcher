import { expect, test } from "@playwright/test";

test("imports and reviews a text biodata PDF locally", async ({ page }) => {
  await page.setContent(`
    <h1>Marriage Biodata</h1>
    <p>Name: Rahul Sharma</p>
    <p>Date of Birth: 14/02/1992</p>
    <p>Time of Birth: 10:45 PM</p>
    <p>Place of Birth: Rajkot, Gujarat</p>
  `);
  const pdf = await page.pdf();

  await page.goto("/");
  await page.locator('input[type="file"]').first().setInputFiles({
    name: "rahul-biodata.pdf",
    mimeType: "application/pdf",
    buffer: pdf
  });

  await expect(page.getByRole("dialog", { name: "Review extracted details" })).toBeVisible();
  await expect(page.getByRole("dialog").getByLabel("Name")).toHaveValue("Rahul Sharma");
  await expect(page.getByRole("dialog").getByLabel("Date of birth")).toHaveValue(
    "1992-02-14"
  );
  await expect(page.getByRole("dialog").getByLabel("Birth time")).toHaveValue("22:45");
  await expect(page.getByRole("dialog").getByLabel("Birthplace")).toHaveValue(
    "Rajkot, Gujarat, India"
  );

  await page.getByRole("button", { name: "Use these details" }).click();
  await expect(page.getByLabel("Name").first()).toHaveValue("Rahul Sharma");
  await expect(page.getByLabel("Latitude").first()).toHaveValue("22.29161");
});

test("keeps one pinned profile across reloads", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Name").first().fill("Pinned Boy");
  await page.getByLabel("Date of birth").first().fill("1992-02-14");
  await page.getByRole("button", { name: "Keep Boy on device" }).click();

  await expect(page.getByRole("button", { name: "Boy saved" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await page.reload();

  await expect(page.getByLabel("Name").first()).toHaveValue("Pinned Boy");
  await expect(page.getByLabel("Date of birth").first()).toHaveValue("1992-02-14");
  await expect(page.getByRole("button", { name: "Boy saved" })).toBeVisible();
});

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
