// quick-test.js - Save this in your project root and run it
const axios = require('axios');

const SHOP_NAME = 'xenoxify.myshopify.com';  // Fixed format
const ACCESS_TOKEN = '494c3a31ae7ba0b2571d79f7f8dbf8ee';

async function testShopifyNow() {
  console.log('🧪 Testing Shopify connection...');
  console.log('Shop URL:', `https://${SHOP_NAME}`);
  console.log('Access Token:', ACCESS_TOKEN ? 'EXISTS' : 'MISSING');
  
  try {
    // Test shop endpoint first
    const shopResponse = await axios.get(`https://${SHOP_NAME}/admin/api/2023-10/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ SHOP CONNECTION SUCCESS!');
    console.log('Shop Name:', shopResponse.data.shop.name);
    console.log('Shop Domain:', shopResponse.data.shop.domain);
    
    // Test products endpoint
    const productsResponse = await axios.get(`https://${SHOP_NAME}/admin/api/2023-10/products.json?limit=5`, {
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ PRODUCTS ENDPOINT SUCCESS!');
    console.log('Products found:', productsResponse.data.products.length);
    
    if (productsResponse.data.products.length === 0) {
      console.log('⚠️  No products found in your store. Add some products to test properly.');
    }
    
  } catch (error) {
    console.error('❌ CONNECTION FAILED!');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n🔧 401 TROUBLESHOOTING:');
      console.log('1. Check if your Shopify store URL is correct');
      console.log('2. Verify your access token is valid');
      console.log('3. Make sure your private app has read permissions');
      console.log('4. Try regenerating your access token');
    }
    
    if (error.response?.status === 404) {
      console.log('\n🔧 404 TROUBLESHOOTING:');
      console.log('1. Your shop name might be wrong');
      console.log('2. Check if the store exists and is accessible');
    }
  }
}

testShopifyNow();