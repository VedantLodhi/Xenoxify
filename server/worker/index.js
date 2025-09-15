const cron = require('node-cron');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Shopify API configuration
const SHOPIFY_API_VERSION = '2023-10';
const BATCH_SIZE = 250;

class DataSyncWorker {
  constructor() {
    this.isRunning = false;
  }

  async start() {
    console.log('🚀 Starting Xenoxify Data Sync Worker...');
    
    // Run initial sync for all active tenants
    await this.syncAllTenants();
    
    // Schedule daily sync at 2 AM
    cron.schedule('0 2 * * *', async () => {
      console.log('⏰ Running scheduled sync...');
      await this.syncAllTenants();
    });
    
    // Schedule hourly incremental sync
    cron.schedule('0 * * * *', async () => {
      console.log('⏰ Running hourly incremental sync...');
      await this.incrementalSync();
    });
    
    console.log('✅ Worker scheduled and running');
  }

  async syncAllTenants() {
    if (this.isRunning) {
      console.log('⏸️ Sync already running, skipping...');
      return;
    }

    this.isRunning = true;
    
    try {
      const tenants = await prisma.tenant.findMany({
        where: { status: 'active' }
      });
      
      console.log(`📊 Found ${tenants.length} active tenants to sync`);
      
      for (const tenant of tenants) {
        try {
          await this.syncTenant(tenant);
        } catch (error) {
          console.error(`❌ Failed to sync tenant ${tenant.shop_domain}:`, error.message);
        }
      }
      
    } catch (error) {
      console.error('❌ Sync all tenants error:', error);
    } finally {
      this.isRunning = false;
    }
  }

  async syncTenant(tenant) {
    console.log(`🔄 Syncing tenant: ${tenant.shop_domain}`);
    
    try {
      // Sync products
      await this.syncProducts(tenant);
      
      // Sync customers
      await this.syncCustomers(tenant);
      
      // Sync orders
      await this.syncOrders(tenant);
      
      // Update tenant last sync time
      await prisma.tenant.update({
        where: { id: tenant.id },
        data: { updated_at: new Date() }
      });
      
      console.log(`✅ Completed sync for ${tenant.shop_domain}`);
      
    } catch (error) {
      console.error(`❌ Tenant sync error for ${tenant.shop_domain}:`, error);
      throw error;
    }
  }

  async syncProducts(tenant) {
    console.log(`📦 Syncing products for ${tenant.shop_domain}`);
    
    let pageInfo = null;
    let hasNextPage = true;
    let totalSynced = 0;
    
    while (hasNextPage) {
      try {
        const url = `https://${tenant.shop_domain}/admin/api/${SHOPIFY_API_VERSION}/products.json`;
        const params = {
          limit: BATCH_SIZE,
          ...(pageInfo && { page_info: pageInfo })
        };
        
        const response = await axios.get(url, {
          headers: {
            'X-Shopify-Access-Token': tenant.access_token
          },
          params
        });
        
        const products = response.data.products;
        
        for (const product of products) {
          await prisma.product.upsert({
            where: {
              id_tenant_id: {
                id: BigInt(product.id),
                tenant_id: tenant.id
              }
            },
            update: {
              title: product.title,
              body_html: product.body_html,
              vendor: product.vendor,
              product_type: product.product_type,
              handle: product.handle,
              status: product.status,
              updated_at: new Date(product.updated_at),
              raw: product
            },
            create: {
              id: BigInt(product.id),
              tenant_id: tenant.id,
              title: product.title,
              body_html: product.body_html,
              vendor: product.vendor,
              product_type: product.product_type,
              handle: product.handle,
              status: product.status,
              created_at: new Date(product.created_at),
              updated_at: new Date(product.updated_at),
              raw: product
            }
          });
        }
        
        totalSynced += products.length;
        pageInfo = response.headers.link?.match(/page_info=([^>]+)/)?.[1];
        hasNextPage = !!pageInfo;
        
        // Rate limiting - Shopify allows 2 requests per second
        await this.sleep(500);
        
      } catch (error) {
        console.error(`❌ Product sync error for ${tenant.shop_domain}:`, error.message);
        break;
      }
    }
    
    console.log(`✅ Synced ${totalSynced} products for ${tenant.shop_domain}`);
  }

  async syncCustomers(tenant) {
    console.log(`👥 Syncing customers for ${tenant.shop_domain}`);
    
    let pageInfo = null;
    let hasNextPage = true;
    let totalSynced = 0;
    
    while (hasNextPage) {
      try {
        const url = `https://${tenant.shop_domain}/admin/api/${SHOPIFY_API_VERSION}/customers.json`;
        const params = {
          limit: BATCH_SIZE,
          ...(pageInfo && { page_info: pageInfo })
        };
        
        const response = await axios.get(url, {
          headers: {
            'X-Shopify-Access-Token': tenant.access_token
          },
          params
        });
        
        const customers = response.data.customers;
        
        for (const customer of customers) {
          await prisma.customer.upsert({
            where: {
              id_tenant_id: {
                id: BigInt(customer.id),
                tenant_id: tenant.id
              }
            },
            update: {
              first_name: customer.first_name,
              last_name: customer.last_name,
              email: customer.email,
              phone: customer.phone,
              total_spent: customer.total_spent ? parseFloat(customer.total_spent) : 0,
              orders_count: customer.orders_count,
              state: customer.state,
              updated_at: new Date(customer.updated_at),
              raw: customer
            },
            create: {
              id: BigInt(customer.id),
              tenant_id: tenant.id,
              first_name: customer.first_name,
              last_name: customer.last_name,
              email: customer.email,
              phone: customer.phone,
              total_spent: customer.total_spent ? parseFloat(customer.total_spent) : 0,
              orders_count: customer.orders_count,
              state: customer.state,
              created_at: new Date(customer.created_at),
              updated_at: new Date(customer.updated_at),
              raw: customer
            }
          });
        }
        
        totalSynced += customers.length;
        pageInfo = response.headers.link?.match(/page_info=([^>]+)/)?.[1];
        hasNextPage = !!pageInfo;
        
        await this.sleep(500);
        
      } catch (error) {
        console.error(`❌ Customer sync error for ${tenant.shop_domain}:`, error.message);
        break;
      }
    }
    
    console.log(`✅ Synced ${totalSynced} customers for ${tenant.shop_domain}`);
  }

  async syncOrders(tenant) {
    console.log(`🛒 Syncing orders for ${tenant.shop_domain}`);
    
    let pageInfo = null;
    let hasNextPage = true;
    let totalSynced = 0;
    
    while (hasNextPage) {
      try {
        const url = `https://${tenant.shop_domain}/admin/api/${SHOPIFY_API_VERSION}/orders.json`;
        const params = {
          limit: BATCH_SIZE,
          status: 'any',
          ...(pageInfo && { page_info: pageInfo })
        };
        
        const response = await axios.get(url, {
          headers: {
            'X-Shopify-Access-Token': tenant.access_token
          },
          params
        });
        
        const orders = response.data.orders;
        
        for (const order of orders) {
          await prisma.order.upsert({
            where: {
              id_tenant_id: {
                id: BigInt(order.id),
                tenant_id: tenant.id
              }
            },
            update: {
              order_number: order.order_number,
              total_price: order.total_price ? parseFloat(order.total_price) : 0,
              currency: order.currency,
              customer_id: order.customer ? BigInt(order.customer.id) : null,
              financial_status: order.financial_status,
              fulfillment_status: order.fulfillment_status,
              processed_at: new Date(),
              raw: order
            },
            create: {
              id: BigInt(order.id),
              tenant_id: tenant.id,
              order_number: order.order_number,
              total_price: order.total_price ? parseFloat(order.total_price) : 0,
              currency: order.currency,
              customer_id: order.customer ? BigInt(order.customer.id) : null,
              financial_status: order.financial_status,
              fulfillment_status: order.fulfillment_status,
              created_at: new Date(order.created_at),
              processed_at: new Date(),
              raw: order
            }
          });
        }
        
        totalSynced += orders.length;
        pageInfo = response.headers.link?.match(/page_info=([^>]+)/)?.[1];
        hasNextPage = !!pageInfo;
        
        await this.sleep(500);
        
      } catch (error) {
        console.error(`❌ Order sync error for ${tenant.shop_domain}:`, error.message);
        break;
      }
    }
    
    console.log(`✅ Synced ${totalSynced} orders for ${tenant.shop_domain}`);
  }

  async incrementalSync() {
    // Sync only recent data (last hour) for better performance
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const tenants = await prisma.tenant.findMany({
      where: { 
        status: 'active',
        updated_at: { gte: oneHourAgo }
      }
    });
    
    for (const tenant of tenants) {
      try {
        await this.syncRecentData(tenant, oneHourAgo);
      } catch (error) {
        console.error(`❌ Incremental sync error for ${tenant.shop_domain}:`, error.message);
      }
    }
  }

  async syncRecentData(tenant, since) {
    // Sync recent orders only for incremental sync
    const url = `https://${tenant.shop_domain}/admin/api/${SHOPIFY_API_VERSION}/orders.json`;
    const params = {
      limit: 250,
      status: 'any',
      created_at_min: since.toISOString()
    };
    
    try {
      const response = await axios.get(url, {
        headers: {
          'X-Shopify-Access-Token': tenant.access_token
        },
        params
      });
      
      const orders = response.data.orders;
      
      for (const order of orders) {
        await prisma.order.upsert({
          where: {
            id_tenant_id: {
              id: BigInt(order.id),
              tenant_id: tenant.id
            }
          },
          update: {
            order_number: order.order_number,
            total_price: order.total_price ? parseFloat(order.total_price) : 0,
            currency: order.currency,
            customer_id: order.customer ? BigInt(order.customer.id) : null,
            financial_status: order.financial_status,
            fulfillment_status: order.fulfillment_status,
            processed_at: new Date(),
            raw: order
          },
          create: {
            id: BigInt(order.id),
            tenant_id: tenant.id,
            order_number: order.order_number,
            total_price: order.total_price ? parseFloat(order.total_price) : 0,
            currency: order.currency,
            customer_id: order.customer ? BigInt(order.customer.id) : null,
            financial_status: order.financial_status,
            fulfillment_status: order.fulfillment_status,
            created_at: new Date(order.created_at),
            processed_at: new Date(),
            raw: order
          }
        });
      }
      
      if (orders.length > 0) {
        console.log(`🔄 Incremental sync: ${orders.length} recent orders for ${tenant.shop_domain}`);
      }
      
    } catch (error) {
      console.error(`❌ Recent data sync error for ${tenant.shop_domain}:`, error.message);
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Start the worker
const worker = new DataSyncWorker();
worker.start().catch(console.error);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down worker gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = DataSyncWorker;

