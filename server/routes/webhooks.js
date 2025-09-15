const express = require('express');
const router = express.Router();

// Example webhook route
router.post('/order-created', (req, res) => {
  console.log('Webhook received:', req.body);
  res.status(200).send('Webhook received');
});

module.exports = router;

