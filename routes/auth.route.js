const { Router } = require('express');
const authController = require('../controllers/auth.controller.js');
const router = Router();
// const auth = require('../middleware/auth');

router.post('/register', authController.signUp);
router.post('/login', authController.login);
router.get('/user', auth, authController.getUser);

module.exports = router;