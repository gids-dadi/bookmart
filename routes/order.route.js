const { Router } = require('express');
const orderController = require('../controllers/order.controller.js');
const router = Router();

router.get('/order/:id',orderController.getOrder);
router.post('/order/:id',orderController.createOrder);

module.exports = router;