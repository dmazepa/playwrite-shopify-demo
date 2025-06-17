import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  // Add any global cleanup logic here
}

export default globalTeardown; 