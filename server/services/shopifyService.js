const Shopify = require('shopify-api-node');

class ShopifyService {
  constructor() {
    // Debug: Check if env variables are loaded
    console.log('SHOPIFY_SHOP_NAME:', process.env.SHOPIFY_SHOP_NAME);
    console.log('SHOPIFY_ACCESS_TOKEN exists:', !!process.env.SHOPIFY_ACCESS_TOKEN);
    
    if (!process.env.SHOPIFY_SHOP_NAME || !process.env.SHOPIFY_ACCESS_TOKEN) {
      throw new Error('Shopify credentials missing in environment variables');
    }

    this.shopify = new Shopify({
      shopName: process.env.SHOPIFY_SHOP_NAME,
      accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
      // apiKey: process.env.SHOPIFY_API_KEY,
    });
  }

  async getCustomers() {
    try {
      const customers = await this.shopify.customer.list({ limit: 50 });
      return customers;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }


  
 async getOrders() {
    // A more robust GraphQL query to fetch the 50 most recent orders
    // with essential details for a dashboard or order list.
    const query = `
      query GetRecentOrders {
        orders(first: 50, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              name # The order name, e.g., "#1001"
              processedAt # The date and time when the order was processed
              
              # Useful status fields for display
              displayFinancialStatus 
              displayFulfillmentStatus

              # Total price information
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }

              # Customer information
              customer {
                firstName
                lastName
                email
              }

              # A few line items for summary purposes
              lineItems(first: 5) {
                edges {
                  node {
                    title
                    quantity
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
     
      const response = await this.shopify.graphql(query);
     
      const orders = response.orders.edges.map(edge => edge.node);
      
      console.log(`Successfully fetched ${orders.length} orders.`);
      
      return orders;

    } catch (error) {
     
      console.error('Error fetching orders from Shopify:', error);
      
      throw error;
    }
  }

  async getProducts() {
    try {
      const products = await this.shopify.product.list({ limit: 50 });
       console.log(`Fetched ${products.length} products from Shopify`);
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
}

module.exports = new ShopifyService();

// const Shopify = require('shopify-api-node');

// class ShopifyService {
//   constructor() {
//     // Debug: Check if env variables are loaded
//     console.log('SHOPIFY_SHOP_NAME:', process.env.SHOPIFY_SHOP_NAME);
//     console.log('SHOPIFY_ACCESS_TOKEN exists:', !!process.env.SHOPIFY_ACCESS_TOKEN);
    
//     if (!process.env.SHOPIFY_SHOP_NAME || !process.env.SHOPIFY_ACCESS_TOKEN) {
//       throw new Error('Shopify credentials missing in environment variables');
//     }

//     this.shopify = new Shopify({
//       shopName: process.env.SHOPIFY_SHOP_NAME,
//       accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
//     });
//   }

//   async getCustomers() {
//     try {
//       console.log('Fetching customers from Shopify...');
//       const customers = await this.shopify.customer.list({ 
//         limit: 50,
//         fields: 'id,first_name,last_name,email,orders_count,total_spent,created_at,state,phone,verified_email'
//       });
//       console.log(`Successfully fetched ${customers.length} customers`);
//       return customers;
//     } catch (error) {
//       console.error('Error fetching customers:', error);
//       throw error;
//     }
//   }

//   // FIXED: Use REST API instead of GraphQL for consistency
//   async getOrders() {
//     try {
//       console.log('Fetching orders from Shopify...');
//       const orders = await this.shopify.order.list({ 
//         limit: 50,
//         status: 'any',
//         fields: 'id,name,order_number,created_at,updated_at,total_price,current_total_price,financial_status,fulfillment_status,customer,line_items,currency'
//       });
//       console.log(`Successfully fetched ${orders.length} orders`);
//       return orders;
//     } catch (error) {
//       console.error('Error fetching orders from Shopify:', error);
//       throw error;
//     }
//   }

//   async getProducts() {
//     try {
//       console.log('Fetching products from Shopify...');
//       const products = await this.shopify.product.list({ 
//         limit: 50,
//         fields: 'id,title,status,variants,created_at,updated_at'
//       });
//       console.log(`Successfully fetched ${products.length} products from Shopify`);
//       return products;
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       throw error;
//     }
//   }

//   // Helper method to test connection
//   async testConnection() {
//     try {
//       const shop = await this.shopify.shop.get();
//       console.log(`✅ Connected to shop: ${shop.name}`);
//       return { success: true, shop: shop.name };
//     } catch (error) {
//       console.error('❌ Connection test failed:', error.message);
//       return { success: false, error: error.message };
//     }
//   }
// }

// module.exports = new ShopifyService();