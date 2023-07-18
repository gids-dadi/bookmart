const { Router } = require('express');
const authController = require('../controllers/auth.controller.js');
const router = Router();
const verifyJwt = require("../middleware/verifyJwt.js")

router.post("/register", authController.createUser);
router.post('/login', authController.login);


router.get("/user", verifyJwt, authController.getUser);

module.exports = router;