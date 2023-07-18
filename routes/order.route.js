const { Router } = require('express');
const orderController = require('../controllers/order.controller.js');
const router = Router();

const verifyJwt = require("../middleware/verifyJwt.js");

router.use(verifyJwt);

router.get('/order/:id',orderController.checkOrder);
router.post('/order/:id',orderController.placeOrder);

module.exports = router;