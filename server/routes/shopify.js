const express = require('express');
const router = express.Router();
const shopifyService = require('../services/shopifyService');

// Get customers from Shopify
router.get('/customers', async (req, res) => {
  try {
    const customers = await shopifyService.getCustomers();
    res.json({ 
      success: true, 
      count: customers.length,
      data: customers 
    });
  } catch (error) {
    console.error('Shopify customers error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get orders from Shopify
router.get('/orders', async (req, res) => {
  try {
    const orders = await shopifyService.getOrders();
    res.json({ 
      success: true, 
      count: orders.length,
      data: orders 
    });
  } catch (error) {
    console.error('Shopify orders error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get products from Shopify
router.get('/products', async (req, res) => {
  try {
    const products = await shopifyService.getProducts();
    res.json({ 
      success: true, 
      count: products.length,
      data: products 
    });
  } catch (error) {
    console.error('Shopify products error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Dashboard route - aggregated insights from real Shopify data
router.get('/dashboard', async (req, res) => {
  try {
    const { period = 30 } = req.query; // Default to 30 days

    // Get data from Shopify
    const customers = await shopifyService.getCustomers();
    const orders = await shopifyService.getOrders();
    const products = await shopifyService.getProducts();

    // Helper function to filter data by date period
    const filterByPeriod = (data, days) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      return data.filter(item => {
        const itemDate = new Date(item.created_at || item.updated_at);
        return itemDate >= cutoffDate;
      });
    };

    // Filter orders by period
    const currentPeriodOrders = filterByPeriod(orders, parseInt(period));
    const previousPeriodOrders = filterByPeriod(orders, parseInt(period) * 2)
      .filter(order => {
        const orderDate = new Date(order.created_at);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(period));
        return orderDate < cutoffDate;
      });

    // Calculate basic metrics
    const totalCustomers = customers.length;
    const totalOrders = currentPeriodOrders.length;
    const totalProducts = products.length;
    
    // Calculate revenue metrics
    const totalRevenue = currentPeriodOrders.reduce((sum, order) => {
      return sum + (parseFloat(order.total_price) || 0);
    }, 0);

    const previousRevenue = previousPeriodOrders.reduce((sum, order) => {
      return sum + (parseFloat(order.total_price) || 0);
    }, 0);

    // Calculate growth rate
    const growthRate = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    // Calculate average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get top 5 customers by total spent
    const customerSpending = {};
    orders.forEach(order => {
      const customerId = order.customer?.id;
      if (customerId) {
        customerSpending[customerId] = (customerSpending[customerId] || 0) + parseFloat(order.total_price || 0);
      }
    });

    const topCustomers = customers
      .map(customer => ({
        id: customer.id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        total_spent: customerSpending[customer.id] || 0,
        orders_count: orders.filter(order => order.customer?.id === customer.id).length
      }))
      .sort((a, b) => b.total_spent - a.total_spent)
      .slice(0, 5);

    // Orders by date for chart data (last 30 days)
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const ordersByDate = last30Days.map(date => {
      const ordersOnDate = currentPeriodOrders.filter(order => {
        const orderDate = new Date(order.created_at).toISOString().split('T')[0];
        return orderDate === date;
      });
      
      return {
        date,
        orders: ordersOnDate.length,
        revenue: ordersOnDate.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0)
      };
    });

    // Recent orders (last 10)
    const recentOrders = orders
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10)
      .map(order => ({
        id: order.id,
        order_number: order.order_number,
        customer_name: order.customer ? 
          `${order.customer.first_name} ${order.customer.last_name}` : 
          'Guest',
        total_price: order.total_price,
        created_at: order.created_at,
        financial_status: order.financial_status,
        fulfillment_status: order.fulfillment_status
      }));

    // Order status distribution
    const orderStatusCounts = currentPeriodOrders.reduce((acc, order) => {
      const status = order.fulfillment_status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Monthly revenue trend (last 6 months)
    const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= monthStart && orderDate <= monthEnd;
      });
      
      return {
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthOrders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0),
        orders: monthOrders.length
      };
    });

    const dashboardData = {
      summary: {
        totalCustomers,
        totalOrders,
        totalProducts,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
        growthRate: parseFloat(growthRate.toFixed(2)),
        period: parseInt(period)
      },
      topCustomers,
      ordersByDate,
      recentOrders,
      orderStatusCounts,
      monthlyRevenue,
      metrics: {
        conversionRate: totalCustomers > 0 ? ((totalOrders / totalCustomers) * 100).toFixed(2) : '0.00',
        repeatCustomerRate: customers.length > 0 ? 
          ((customers.filter(c => customerSpending[c.id] > 0).length / customers.length) * 100).toFixed(2) : 
          '0.00'
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get dashboard summary (lightweight version)
router.get('/dashboard/summary', async (req, res) => {
  try {
    const customers = await shopifyService.getCustomers();
    const orders = await shopifyService.getOrders();
    const products = await shopifyService.getProducts();

    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0);

    res.json({
      success: true,
      data: {
        totalCustomers: customers.length,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalRevenue: parseFloat(totalRevenue.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get top customers
router.get('/dashboard/top-customers', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const customers = await shopifyService.getCustomers();
    const orders = await shopifyService.getOrders();

    const customerSpending = {};
    orders.forEach(order => {
      const customerId = order.customer?.id;
      if (customerId) {
        customerSpending[customerId] = (customerSpending[customerId] || 0) + parseFloat(order.total_price || 0);
      }
    });

    const topCustomers = customers
      .map(customer => ({
        ...customer,
        total_spent: customerSpending[customer.id] || 0
      }))
      .sort((a, b) => b.total_spent - a.total_spent)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: topCustomers
    });
  } catch (error) {
    console.error('Top customers error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get orders with date filtering
router.get('/dashboard/orders', async (req, res) => {
  try {
    const { from, to, limit = 50 } = req.query;
    let orders = await shopifyService.getOrders();

    // Filter by date range if provided
    if (from || to) {
      orders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        if (from && orderDate < new Date(from)) return false;
        if (to && orderDate > new Date(to)) return false;
        return true;
      });
    }

    // Limit results
    orders = orders.slice(0, parseInt(limit));

    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0);

    res.json({
      success: true,
      data: {
        orders,
        total: orders.length,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        dateRange: { from, to }
      }
    });
  } catch (error) {
    console.error('Dashboard orders error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;