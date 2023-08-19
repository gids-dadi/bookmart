const { Router } = require("express");
const bookController = require("../controllers/book.controller.js");
const auth = require("../middleware/auth.js");
const router = Router();

router.use(auth);

router.get("/books", bookController.getBooks);
router.get("/books/:id", bookController.getBook);
router.post("/books", bookController.createBook);
router.put("/books/:id", bookController.updateBook);
router.delete("/books/:id", bookController.deleteBook);

module.exports = router;
