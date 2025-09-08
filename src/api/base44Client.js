import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68a8bf89009497f8d44a9fe3", 
  requiresAuth: true // Ensure authentication is required for all operations
});
