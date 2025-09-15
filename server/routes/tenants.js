const express = require('express');
const router = express.Router();

// 🔧 FIX: Add root route for /api/tenants (this was missing)
router.get('/', (req, res) => {
  try {
    // Mock tenant data - replace with actual database query
    const tenants = [
      {
        id: 1,
        name: "Dev Tenant",
        tenantId: "dev-tenant-001",
        status: "active",
        createdAt: new Date(),
        domain: "dev.xenoxify.com"
      }
    ];

    res.json({ 
      success: true,
      tenants: tenants,
      total: tenants.length,
      message: 'Tenants retrieved successfully'
    });
  } catch (error) {
    console.error('Tenants fetch error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Keep your existing route
router.get('/list', (req, res) => {
  res.json({ 
    message: 'Tenants list route working!',
    endpoint: '/api/tenants/list'
  });
});

// Get specific tenant
router.get('/:tenantId', (req, res) => {
  try {
    const { tenantId } = req.params;
    
    // Mock tenant data
    const tenant = {
      id: 1,
      name: "Dev Tenant",
      tenantId: tenantId,
      status: "active",
      createdAt: new Date(),
      domain: "dev.xenoxify.com",
      settings: {
        theme: "dark",
        currency: "USD",
        timezone: "UTC"
      }
    };

    res.json({
      success: true,
      tenant: tenant,
      message: 'Tenant retrieved successfully'
    });
  } catch (error) {
    console.error('Tenant fetch error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;
