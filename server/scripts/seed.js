const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a sample tenant
  const tenant = await prisma.tenant.upsert({
    where: { shop_domain: 'demo-store.myshopify.com' },
    update: {},
    create: {
      shop_domain: 'demo-store.myshopify.com',
      access_token: 'demo_access_token',
      scopes: 'read_products,read_customers,read_orders',
      status: 'active'
    }
  });

  console.log('✅ Created tenant:', tenant.shop_domain);

  // Create a sample user
  const user = await prisma.user.upsert({
    where: { email: 'admin@xenoxify.com' },
    update: {},
    create: {
      email: 'admin@xenoxify.com',
      tenant_id: tenant.id,
      role: 'admin'
    }
  });

  console.log('✅ Created user:', user.email);

  // Create sample products
  const products = [
    {
      id: '1',
      tenant_id: tenant.id,
      title: 'Sample Product 1',
      vendor: 'Demo Vendor',
      product_type: 'Electronics',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
      raw: JSON.stringify({ id: 1, title: 'Sample Product 1' })
    },
    {
      id: '2',
      tenant_id: tenant.id,
      title: 'Sample Product 2',
      vendor: 'Demo Vendor',
      product_type: 'Clothing',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
      raw: JSON.stringify({ id: 2, title: 'Sample Product 2' })
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: {
        id: product.id
      },
      update: product,
      create: product
    });
  }

  console.log('✅ Created sample products');

  // Create sample customers
  const customers = [
    {
      id: '1',
      tenant_id: tenant.id,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      total_spent: 150.00,
      orders_count: 3,
      created_at: new Date(),
      updated_at: new Date(),
      raw: JSON.stringify({ id: 1, first_name: 'John', last_name: 'Doe' })
    },
    {
      id: '2',
      tenant_id: tenant.id,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      total_spent: 275.50,
      orders_count: 5,
      created_at: new Date(),
      updated_at: new Date(),
      raw: JSON.stringify({ id: 2, first_name: 'Jane', last_name: 'Smith' })
    }
  ];

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: {
        id: customer.id
      },
      update: customer,
      create: customer
    });
  }

  console.log('✅ Created sample customers');

  // Create sample orders
  const orders = [
    {
      id: '1',
      tenant_id: tenant.id,
      order_number: '1001',
      total_price: 75.00,
      currency: 'USD',
      customer_id: '1',
      financial_status: 'paid',
      fulfillment_status: 'fulfilled',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      processed_at: new Date(),
      raw: JSON.stringify({ id: 1, order_number: '1001' })
    },
    {
      id: '2',
      tenant_id: tenant.id,
      order_number: '1002',
      total_price: 125.50,
      currency: 'USD',
      customer_id: '2',
      financial_status: 'paid',
      fulfillment_status: 'fulfilled',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      processed_at: new Date(),
      raw: JSON.stringify({ id: 2, order_number: '1002' })
    }
  ];

  for (const order of orders) {
    await prisma.order.upsert({
      where: {
        id: order.id
      },
      update: order,
      create: order
    });
  }

  console.log('✅ Created sample orders');

  console.log('🎉 Database seeded successfully!');
  console.log('\n📋 Sample login credentials:');
  console.log('Email: admin@xenoxify.com');
  console.log(`Tenant ID: ${tenant.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
