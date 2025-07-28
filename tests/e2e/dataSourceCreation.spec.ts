import { test, expect, Page } from '@playwright/test';

test.describe('Data Source Creation', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
    
    // Login if required
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Navigate to data sources page
    await page.waitForURL('**/dashboard');
    await page.click('[data-testid="nav-data-sources"]');
    await page.waitForURL('**/data-sources');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('should create a new HTTP data source', async () => {
    // Click new data source button
    await page.click('[data-testid="new-data-source-button"]');
    await page.waitForURL('**/data-sources/new');

    // Fill out the form
    await page.fill('[name="name"]', 'Test API Endpoint');
    await page.selectOption('[name="protocol"]', 'http');
    
    // Wait for protocol-specific fields to appear
    await page.waitForSelector('[name="connectionDetails.url"]');
    await page.fill('[name="connectionDetails.url"]', 'https://api.example.com');
    await page.selectOption('[name="connectionDetails.method"]', 'GET');
    
    // Test connection
    await page.click('[data-testid="test-connection-button"]');
    await page.waitForSelector('[data-testid="connection-test-result"]');
    
    // Submit form
    await page.click('[data-testid="submit-button"]');
    
    // Verify redirect and success message
    await page.waitForURL('**/data-sources');
    await expect(page.locator('[data-testid="success-notification"]')).toContainText(
      'Data source created successfully'
    );
    
    // Verify new data source appears in list
    await expect(page.locator('[data-testid="data-source-card"]')).toContainText(
      'Test API Endpoint'
    );
  });

  test('should create a WebSocket data source', async () => {
    await page.click('[data-testid="new-data-source-button"]');
    await page.waitForURL('**/data-sources/new');

    await page.fill('[name="name"]', 'WebSocket Stream');
    await page.selectOption('[name="protocol"]', 'websocket');
    
    await page.waitForSelector('[name="connectionDetails.url"]');
    await page.fill('[name="connectionDetails.url"]', 'wss://ws.example.com');
    await page.fill('[name="connectionDetails.reconnectInterval"]', '5000');
    
    await page.click('[data-testid="submit-button"]');
    await page.waitForURL('**/data-sources');
    
    await expect(page.locator('[data-testid="data-source-card"]')).toContainText(
      'WebSocket Stream'
    );
  });

  test('should validate form inputs', async () => {
    await page.click('[data-testid="new-data-source-button"]');
    
    // Try to submit empty form
    await page.click('[data-testid="submit-button"]');
    
    // Check for validation errors
    await expect(page.locator('[data-testid="name-error"]')).toContainText(
      'Name is required'
    );
    
    // Fill name with invalid characters
    await page.fill('[name="name"]', 'Test@#$%');
    await page.click('[data-testid="submit-button"]');
    
    await expect(page.locator('[data-testid="name-error"]')).toContainText(
      'Name can only contain letters, numbers, spaces, hyphens and underscores'
    );
    
    // Select HTTP protocol and check URL validation
    await page.selectOption('[name="protocol"]', 'http');
    await page.fill('[name="connectionDetails.url"]', 'not-a-url');
    await page.click('[data-testid="submit-button"]');
    
    await expect(page.locator('[data-testid="url-error"]')).toContainText(
      'Must be a valid URL'
    );
  });

  test('should handle connection test failures', async () => {
    await page.click('[data-testid="new-data-source-button"]');
    
    await page.fill('[name="name"]', 'Failing Connection');
    await page.selectOption('[name="protocol"]', 'http');
    await page.fill('[name="connectionDetails.url"]', 'https://invalid.example.com');
    
    // Mock API to return failure
    await page.route('**/api/data-sources/test-connection', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Connection failed: Host not reachable',
        }),
      });
    });
    
    await page.click('[data-testid="test-connection-button"]');
    
    await expect(page.locator('[data-testid="connection-test-result"]')).toContainText(
      'Connection failed: Host not reachable'
    );
    await expect(page.locator('[data-testid="connection-test-result"]')).toHaveClass(
      /error/
    );
  });

  test('should edit existing data source', async () => {
    // Create a data source first
    await page.evaluate(() => {
      localStorage.setItem('dataSources', JSON.stringify([{
        id: '1',
        name: 'Existing Source',
        protocol: 'http',
        connectionDetails: { url: 'https://api.old.com' },
      }]));
    });
    
    await page.reload();
    
    // Click edit button on existing data source
    await page.click('[data-testid="data-source-edit-1"]');
    await page.waitForURL('**/data-sources/1/edit');
    
    // Verify form is populated
    await expect(page.locator('[name="name"]')).toHaveValue('Existing Source');
    await expect(page.locator('[name="connectionDetails.url"]')).toHaveValue(
      'https://api.old.com'
    );
    
    // Update values
    await page.fill('[name="name"]', 'Updated Source');
    await page.fill('[name="connectionDetails.url"]', 'https://api.new.com');
    
    await page.click('[data-testid="submit-button"]');
    await page.waitForURL('**/data-sources');
    
    // Verify updates
    await expect(page.locator('[data-testid="data-source-card"]')).toContainText(
      'Updated Source'
    );
  });

  test('should delete data source with confirmation', async () => {
    // Create a data source
    await page.evaluate(() => {
      localStorage.setItem('dataSources', JSON.stringify([{
        id: '1',
        name: 'To Be Deleted',
        protocol: 'http',
        connectionDetails: { url: 'https://api.example.com' },
      }]));
    });
    
    await page.reload();
    
    // Click delete button
    await page.click('[data-testid="data-source-delete-1"]');
    
    // Confirm deletion in dialog
    await page.click('[data-testid="confirm-delete-button"]');
    
    // Verify data source is removed
    await expect(page.locator('[data-testid="data-source-card"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="empty-state"]')).toContainText(
      'No data sources found'
    );
  });
});