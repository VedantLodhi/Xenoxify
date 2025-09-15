// Shopify Configuration
module.exports = {
  // Your Shopify App Credentials
  apiKey: '5013237d82a781ddc5a203f3927be7c3',
  apiSecret: 'bd48db258164438da0a52614ad22e20d',
  
  // App URLs
  appUrl: 'https://xenoxify.com',
  redirectUri: 'https://xenoxify.com/api/auth/callback',
  
  // Required Scopes
  scopes: [
    'read_products',
    'write_products', 
    'read_customers',
    'write_customers',
    'read_orders',
    'write_orders'
  ],
  
  // Service Account
  serviceAccount: 'delivery@shopify-pubsub-webhooks.iam.gserviceaccount.com',
  
  // API Version
  apiVersion: '2023-10',
  
  // Webhook Topics
  webhookTopics: [
    'products/create',
    'products/update', 
    'products/delete',
    'customers/create',
    'customers/update',
    'orders/create',
    'orders/updated',
    'orders/paid'
  ],
  
  // Rate Limiting
  rateLimit: {
    requests: 2,
    window: 1000 // 1 second
  }
};

