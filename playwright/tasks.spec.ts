import { test, expect } from '@playwright/test';

test.describe('Tasks app - messy tests (Playwright)', () => {
  test('validation shows error if title missing', async ({ page }) => {
    await page.goto('/');
    await page.locator('button').first().click();
    await expect(page.locator('#titleError')).toBeVisible();
  });

  test('add task and check priority badge', async ({ page }) => {
    await page.goto('/');
    await page.locator('input').first().fill('Write tests');
    await page.locator('textarea').fill('some desc');
    await page.locator('input[type="date"]').fill('2025-10-01');
    await page.locator('select').first().selectOption('high');
    await page.locator('button').first().click();

    await page.waitForTimeout(300);

    page.getByText('Write tests');
    await expect(page.locator('.badge.high')).toBeVisible();
  });

  test('complete and filter', async ({ page }) => {
    await page.goto('/');
    await page.locator('#title').fill('A task');
    await page.locator('#save').click();
    await page.waitForTimeout(200);

    await page.locator('#title').fill('B task');
    await page.locator('#save').click();
    await page.waitForTimeout(200);

    await page.locator('input[type="checkbox"]').first().check();
    await page.locator('select').nth(1).selectOption('completed');

    page.getByText('A task');
  });

  test('edit flow', async ({ page }) => {
    await page.goto('/');
    await page.locator('#title').fill('Original');
    await page.locator('#save').click();
    await page.waitForTimeout(200);

    await page.getByText('Edit').click();
    await page.locator('#title').fill('');
    await page.locator('#title').fill('Edited');
    await page.locator('#save').click();
    page.getByText('Edited');
  });

  test('delete task', async ({ page }) => {
    await page.goto('/');
    await page.locator('#title').fill('Will be deleted');
    await page.locator('#save').click();
    await page.waitForTimeout(200);

    await page.getByText('Delete').click();
    await expect(page.getByText('Will be deleted')).toHaveCount(0);
  });
});
