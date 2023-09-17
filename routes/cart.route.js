const { Router } = require('express');
const cartController = require('../controllers/cart.controller.js');
const router = Router();

const auth = require("../middleware/auth.js");

router.use(auth);

router.get('/cart/:id',cartController.getBooksInCart);
router.post('/cart/:id',cartController.addBookToCart);
router.put('/cart/:id',cartController.updateCart);
router.delete('/cart/:userId/:bookId',cartController.deleteBookInCart);

module.exports = router;