const { Router } = require('express');
const orderController = require('../controllers/order.controller.js');
const router = Router();

router.get('/order/:id',orderController.checkOrder);
router.post('/order/:id',orderController.placeOrder);

module.exports = router;