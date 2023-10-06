const { Router } = require("express");
const orderController = require("../controllers/order.controller.js");
const router = Router();

const auth = require("../middleware/auth.js");

// router.use(auth);

router.post("/order/:userId", orderController.placeOrder);
router.get("/order/:userId", orderController.getOrder);

module.exports = router;
