const { Router } = require('express');
const cartController = require('../controllers/cart.controller.js');
const router = Router();

const verifyJwt = require("../middleware/verifyJwt.js");

// router.use(verifyJwt);

router.get('/cart/:id',cartController.getBooksInCart);
router.post('/cart/:id',cartController.addBookToCart);
router.delete('/cart/:userId/:bookId',cartController.deleteBookInCart);

module.exports = router;