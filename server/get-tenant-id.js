const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getTenantId() {
  try {
    // First, let's create a sample tenant if none exists
    const existingTenant = await prisma.tenant.findFirst();
    
    if (!existingTenant) {
      console.log('No tenant found. Creating sample tenant...');
      
      const tenant = await prisma.tenant.create({
        data: {
          shop_domain: 'demo-store.myshopify.com',
          access_token: 'demo_access_token',
          scopes: 'read_products,read_customers,read_orders',
          status: 'active'
        }
      });
      
      console.log('✅ Sample tenant created!');
      console.log('📋 Login Credentials:');
      console.log('Email: admin@xenoxify.com');
      console.log(`Tenant ID: ${tenant.id}`);
      
      // Create a sample user
      await prisma.user.create({
        data: {
          email: 'admin@xenoxify.com',
          tenant_id: tenant.id,
          role: 'admin'
        }
      });
      
      console.log('✅ Sample user created!');
      
    } else {
      console.log('📋 Existing Tenant Found:');
      console.log('Email: admin@xenoxify.com');
      console.log(`Tenant ID: ${existingTenant.id}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

getTenantId();

