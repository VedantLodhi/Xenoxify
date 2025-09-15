const express = require('express');
const router = express.Router();

// Test route (keep your existing one)
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route working!' });
});

// POST /api/auth/login - The route your frontend needs
router.post('/login', async (req, res) => {
  try {
    const { email, tenantId } = req.body;
    
    console.log('Login attempt:', { email, tenantId }); // Debug log
    
    // Basic validation
    if (!email || !tenantId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and tenant ID are required' 
      });
    }

    // For development - accept any dev tenant
    if (tenantId.startsWith('dev-')) {
      // Mock successful login with dummy user data
      const dummyUser = {
        id: 1,
        email: email,
        tenantId: tenantId,
        role: 'admin',
        name: 'Dev User',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Generate a simple token for dev
      const token = `dev-token-${Date.now()}`;

      console.log('Dev login successful for:', email); // Debug log

      return res.json({
        success: true,
        user: dummyUser,
        token: token,
        message: 'Login successful (development mode)'
      });
    }

    // For non-dev tenants, return error for now
    return res.status(400).json({
      success: false,
      message: 'Only development tenants are supported currently'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;