const { Router } = require("express");
const bookController = require("../controllers/book.controller.js");
const verifyJwt = require("../middleware/verifyJwt.js");
const router = Router();



router.use(verifyJwt);

router.get("/books", bookController.getBooks);
router.post("/books", bookController.createBook);
router.put("/books/:id", bookController.updateBook);
router.delete("/books/:id", bookController.deleteBook);

module.exports = router;
