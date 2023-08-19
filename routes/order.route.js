const { Router } = require("express");
const orderController = require("../controllers/order.controller.js");
const router = Router();

const auth = require("../middleware/auth.js");

// router.use(auth);

router.post("/order/:id", orderController.placeOrder);
router.get("/order/:id", orderController.getOrder);

module.exports = router;
