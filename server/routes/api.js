const express = require('express');
const router = express.Router();
const shopifyService = require('../services/shopifyService');

// Products route with pagination and search
router.get('/products', (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    // Mock products data
    let allProducts = [
      { id: 1, name: "Laptop Pro", price: 1299.99, sku: "LP001", stock: 25, status: "active" },
      { id: 2, name: "Wireless Mouse", price: 29.99, sku: "WM002", stock: 100, status: "active" },
      { id: 3, name: "Keyboard Mechanical", price: 89.99, sku: "KM003", stock: 50, status: "active" },
      { id: 4, name: "Monitor 24 inch", price: 199.99, sku: "M24004", stock: 15, status: "active" },
      { id: 5, name: "USB-C Hub", price: 49.99, sku: "UCH005", stock: 75, status: "active" },
      { id: 6, name: "Webcam HD", price: 79.99, sku: "WHD006", stock: 30, status: "active" },
      { id: 7, name: "Headphones", price: 159.99, sku: "HP007", stock: 40, status: "active" },
      { id: 8, name: "Phone Case", price: 19.99, sku: "PC008", stock: 200, status: "active" },
      { id: 9, name: "Tablet Stand", price: 39.99, sku: "TS009", stock: 60, status: "active" },
      { id: 10, name: "Power Bank", price: 59.99, sku: "PB010", stock: 80, status: "active" }
    ];

    // Filter by search term if provided
    if (search) {
      allProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedProducts = allProducts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(allProducts.length / limitNum);

    res.json({
      products: paginatedProducts,
      page: pageNum,
      limit: limitNum,
      total: allProducts.length,
      totalPages: totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 🔧 ADD: Missing insights routes that your frontend needs

// Dashboard summary route
// router.get('/insights/summary', async (req, res) => {
//   try {
//     const { period = 30 } = req.query; // Default to 30 days
//     const allOrders = await shopifyService.getOrders();
//     const allCustomers = await shopifyService.getCustomers();

//     // Helper function to filter data by date
//     const filterByPeriod = (data, days) => {
//       const cutoffDate = new Date();
//       cutoffDate.setDate(cutoffDate.getDate() - days);
//       return data.filter(item => new Date(item.created_at) >= cutoffDate);
//     };

//     const currentPeriodOrders = filterByPeriod(allOrders, period);
//     const previousPeriodOrders = filterByPeriod(allOrders, period * 2).filter(order => new Date(order.created_at) < (new Date().setDate(new Date().getDate() - period)));

//     const totalRevenue = currentPeriodOrders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
//     const previousRevenue = previousPeriodOrders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);

//     const totalOrders = currentPeriodOrders.length;
//     const totalCustomers = allCustomers.length; // Customers are not easily filtered by order date
//     const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
//     const growthRate = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

//     const summaryData = {
//       totalOrders: totalOrders,
//       totalRevenue: totalRevenue.toFixed(2),
//       totalCustomers: totalCustomers,
//       averageOrderValue: averageOrderValue.toFixed(2),
//       period: period,
//       growthRate: growthRate.toFixed(2),
//       // conversionRate: 3.2 // Requires more data; remains hardcoded
//     };

//     res.json(summaryData);
//   } catch (error) {
//     console.error('Summary fetch error:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// Dashboard summary route
router.get('/insights/summary', async (req, res) => {
  try {
    const { period = 30 } = req.query; 
    const allOrders = await shopifyService.getOrders();
    const allCustomers = await shopifyService.getCustomers();

    const filterByPeriod = (data, days) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      return data.filter(item => new Date(item.created_at) >= cutoffDate);
    };

    const currentPeriodOrders = filterByPeriod(allOrders, period);
    const previousPeriodOrders = filterByPeriod(allOrders, period * 2)
      .filter(order => new Date(order.created_at) < (new Date().setDate(new Date().getDate() - period)));

    const totalRevenue = currentPeriodOrders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
    const previousRevenue = previousPeriodOrders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);

    const totalOrders = currentPeriodOrders.length;
    const totalCustomers = allCustomers.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const growthRate = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    // 🟢 Order Status Distribution
    const orderStatus = currentPeriodOrders.reduce((acc, order) => {
      acc[order.financial_status] = (acc[order.financial_status] || 0) + 1;
      return acc;
    }, {});

    // 🟢 Sales Trend (date wise)
    const salesTrend = currentPeriodOrders.reduce((acc, order) => {
      const date = new Date(order.created_at).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + parseFloat(order.total_price);
      return acc;
    }, {});

    // 🟢 Payment Status
    const paymentStatus = currentPeriodOrders.reduce((acc, order) => {
      acc[order.financial_status] = (acc[order.financial_status] || 0) + 1;
      return acc;
    }, {});

    const summaryData = {
      totalOrders,
      totalRevenue: totalRevenue.toFixed(2),
      totalCustomers,
      averageOrderValue: averageOrderValue.toFixed(2),
      growthRate: growthRate.toFixed(2),
      orderStatus,
      salesTrend,
      paymentStatus
    };

    res.json(summaryData);
  } catch (error) {
    console.error('Summary fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});


// Top customers route
router.get('/insights/top-customers', async (req, res) => {
  try {
    const { limit = 5 } = req.query; // Default to 5 customers
    const allOrders = await shopifyService.getOrders();
    const allCustomers = await shopifyService.getCustomers();

    const customerSpending = {};

    allOrders.forEach(order => {
      const customerId = order.customer?.id;
      if (customerId) {
        customerSpending[customerId] = (customerSpending[customerId] || 0) + parseFloat(order.total_price);
      }
    });

    // Combine customer details with their total spending
    const customersWithSpending = allCustomers.map(customer => ({
      ...customer,
      total_spent: customerSpending[customer.id] || 0
    }));

    // Sort customers by total spending in descending order
    customersWithSpending.sort((a, b) => b.total_spent - a.total_spent);

    // Get the top customers based on the limit
    const topCustomers = customersWithSpending.slice(0, parseInt(limit));

    res.json(topCustomers);
  } catch (error) {
    console.error('Top customers fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Orders route with date filtering
router.get('/insights/orders', async (req, res) => {
  try {
    const { from, to } = req.query;
    const orders = await shopifyService.getOrders();
    
    res.json({
      orders: orders,
      total: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.amount, 0),
      dateRange: { from, to }
    });
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Customers route with pagination and search
router.get('/customers', (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    
    // Mock customers data
    let allCustomers = [
      { id: 1, name: "John Doe", email: "john@example.com", totalOrders: 25, totalSpent: 2500.50, status: "Active", joinDate: "2024-01-15" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", totalOrders: 18, totalSpent: 1800.25, status: "Active", joinDate: "2024-02-20" },
      { id: 3, name: "Mike Johnson", email: "mike@example.com", totalOrders: 32, totalSpent: 3200.75, status: "Active", joinDate: "2024-01-08" },
      { id: 4, name: "Sarah Wilson", email: "sarah@example.com", totalOrders: 12, totalSpent: 1200.00, status: "Active", joinDate: "2024-03-12" },
      { id: 5, name: "Tom Brown", email: "tom@example.com", totalOrders: 8, totalSpent: 800.30, status: "Inactive", joinDate: "2024-04-05" },
      { id: 6, name: "Lisa Garcia", email: "lisa@example.com", totalOrders: 45, totalSpent: 4500.80, status: "VIP", joinDate: "2023-12-10" },
      { id: 7, name: "David Lee", email: "david@example.com", totalOrders: 22, totalSpent: 2200.45, status: "Active", joinDate: "2024-02-28" },
      { id: 8, name: "Emma Davis", email: "emma@example.com", totalOrders: 15, totalSpent: 1500.60, status: "Active", joinDate: "2024-03-20" },
      { id: 9, name: "James Miller", email: "james@example.com", totalOrders: 38, totalSpent: 3800.90, status: "VIP", joinDate: "2023-11-15" },
      { id: 10, name: "Anna Taylor", email: "anna@example.com", totalOrders: 28, totalSpent: 2800.35, status: "Active", joinDate: "2024-01-25" },
      { id: 11, name: "Chris Anderson", email: "chris@example.com", totalOrders: 19, totalSpent: 1900.75, status: "Active", joinDate: "2024-02-14" },
      { id: 12, name: "Maria Rodriguez", email: "maria@example.com", totalOrders: 41, totalSpent: 4100.20, status: "VIP", joinDate: "2023-10-30" },
      { id: 13, name: "Kevin White", email: "kevin@example.com", totalOrders: 6, totalSpent: 600.15, status: "Inactive", joinDate: "2024-04-18" },
      { id: 14, name: "Rachel Green", email: "rachel@example.com", totalOrders: 33, totalSpent: 3300.55, status: "Active", joinDate: "2024-01-05" },
      { id: 15, name: "Paul Clark", email: "paul@example.com", totalOrders: 26, totalSpent: 2600.85, status: "Active", joinDate: "2024-02-08" }
    ];

    // Filter by search term if provided
    if (search) {
      allCustomers = allCustomers.filter(customer => 
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedCustomers = allCustomers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(allCustomers.length / limitNum);

    res.json({
      customers: paginatedCustomers,
      page: pageNum,
      limit: limitNum,
      total: allCustomers.length,
      totalPages: totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1
    });
  } catch (error) {
    console.error('Customers fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Orders route with pagination, search, and filtering
router.get('/orders', (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', status } = req.query;
    
    // Mock orders data
    let allOrders = [
      { id: 1001, customerName: "John Doe", date: "2025-09-13", itemCount: 3, total: 299.97, status: "delivered", paymentStatus: "paid" },
      { id: 1002, customerName: "Jane Smith", date: "2025-09-12", itemCount: 2, total: 159.98, status: "shipped", paymentStatus: "paid" },
      { id: 1003, customerName: "Mike Johnson", date: "2025-09-12", itemCount: 1, total: 89.99, status: "processing", paymentStatus: "paid" },
      { id: 1004, customerName: "Sarah Wilson", date: "2025-09-11", itemCount: 4, total: 449.96, status: "pending", paymentStatus: "pending" },
      { id: 1005, customerName: "Tom Brown", date: "2025-09-11", itemCount: 2, total: 199.98, status: "cancelled", paymentStatus: "refunded" },
      { id: 1006, customerName: "Lisa Garcia", date: "2025-09-10", itemCount: 5, total: 599.95, status: "delivered", paymentStatus: "paid" },
      { id: 1007, customerName: "David Lee", date: "2025-09-10", itemCount: 1, total: 79.99, status: "shipped", paymentStatus: "paid" },
      { id: 1008, customerName: "Emma Davis", date: "2025-09-09", itemCount: 3, total: 279.97, status: "delivered", paymentStatus: "paid" },
      { id: 1009, customerName: "James Miller", date: "2025-09-09", itemCount: 2, total: 139.98, status: "processing", paymentStatus: "paid" },
      { id: 1010, customerName: "Anna Taylor", date: "2025-09-08", itemCount: 6, total: 699.94, status: "pending", paymentStatus: "paid" },
      { id: 1011, customerName: "Chris Anderson", date: "2025-09-08", itemCount: 1, total: 49.99, status: "delivered", paymentStatus: "paid" },
      { id: 1012, customerName: "Maria Rodriguez", date: "2025-09-07", itemCount: 4, total: 399.96, status: "shipped", paymentStatus: "paid" },
      { id: 1013, customerName: "Kevin White", date: "2025-09-07", itemCount: 2, total: 189.98, status: "cancelled", paymentStatus: "refunded" },
      { id: 1014, customerName: "Rachel Green", date: "2025-09-06", itemCount: 3, total: 329.97, status: "delivered", paymentStatus: "paid" },
      { id: 1015, customerName: "Paul Clark", date: "2025-09-06", itemCount: 1, total: 99.99, status: "processing", paymentStatus: "paid" },
      { id: 1016, customerName: "Amy Johnson", date: "2025-09-05", itemCount: 2, total: 219.98, status: "pending", paymentStatus: "pending" },
      { id: 1017, customerName: "Steve Wilson", date: "2025-09-05", itemCount: 5, total: 549.95, status: "shipped", paymentStatus: "paid" },
      { id: 1018, customerName: "Linda Brown", date: "2025-09-04", itemCount: 1, total: 69.99, status: "delivered", paymentStatus: "paid" },
      { id: 1019, customerName: "Mark Davis", date: "2025-09-04", itemCount: 3, total: 389.97, status: "processing", paymentStatus: "paid" },
      { id: 1020, customerName: "Jennifer Lee", date: "2025-09-03", itemCount: 2, total: 179.98, status: "delivered", paymentStatus: "paid" }
    ];

    // Filter by search term if provided
    if (search) {
      allOrders = allOrders.filter(order => 
        order.customerName.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toString().includes(search)
      );
    }

    // Filter by status if provided
    if (status && status !== 'all') {
      allOrders = allOrders.filter(order => order.status === status);
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedOrders = allOrders.slice(startIndex, endIndex);
    const totalPages = Math.ceil(allOrders.length / limitNum);

    // Calculate summary stats
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
    const statusCounts = allOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      orders: paginatedOrders,
      page: pageNum,
      limit: limitNum,
      total: allOrders.length,
      totalPages: totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1,
      summary: {
        totalRevenue,
        statusCounts
      }
    });
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;