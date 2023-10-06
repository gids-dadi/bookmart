const Cart = require("../models/cart.model");
const Book = require("../models/book.model");

const getBooksInCart = async (req, res) => {
  const userId = req.params.id;
  try {
    let cart = await Cart.findOne({ userId });
    if (cart && cart.books.length > 0) {
      res.send(cart);
    } else {
      res.send({ message: "No book in cart" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

const addBookToCart = async (req, res) => {
  const userId = req.params.id;
  const { bookId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });
    let book = await Book.findOne({ _id: bookId });
    if (!book) {
      res.status(404).send("Book not found!");
    }
    const price = book.price;
    const name = book.title;
    const image = book.image;

    if (cart) {
      // if cart exists for the user
      let bookIndex = cart.books.findIndex((b) => b.bookId == bookId);

      // Check if book exists or not
      if (bookIndex > -1) {
        let bookItem = cart.books[bookIndex];
        bookItem.quantity += quantity;
        cart.items[bookIndex] = bookItem;
      } else {
        cart.books.push({ bookId, name, image, quantity, price });
      }
      cart.bill += quantity * price;
      cart = await cart.save();
      return res.status(201).send(cart);
    } else {
      // no cart exists, create one
      const newCart = await Cart.create({
        userId,
        books: [{ bookId, name, quantity, price }],
        bill: quantity * price,
      });
      return res.status(201).send(newCart);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

const updateCart = async (req, res) => {
  const userId = req.params.id;
  const { bookId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });
    let book = await Book.findOne({ _id: bookId });

    if (!book) {
      return res.status(404).send("book not found");
    }
    if (!cart) {
      return res.status(400).send("Cart not found");
    } else {
      let bookIndex = cart.books.findIndex((i) => i.bookId == bookId);

      //check if book exist or not
      if (bookIndex == -1) {
        return res.status(404).send("Book not found in cart");
      } else {
        let bookItem = cart.books[bookIndex];
        bookItem.quantity = quantity;
        cart.books[bookIndex] = bookItem;
      }
      cart.bill = cart.books.reduce(
        (sum, book) => sum + book.price * book.quantity,
        0
      );
      cart = await cart.save();
      return res.status(201).send(cart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("something went worng!");
  }
};

const deleteBookInCart = async (req, res) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;
  try {
    let cart = await Cart.findOne({ userId });
    let bookIndex = cart.books.findIndex((b) => b.bookId == bookId);
    if (bookIndex > -1) {
      let bookItem = cart.books[bookIndex];
      cart.bill -= bookItem.quantity * bookItem.price;
      cart.books.splice(bookIndex, 1);
    }
    cart = await cart.save();
    return res.status(201).send(cart);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};
module.exports = {
  getBooksInCart,
  addBookToCart,
  updateCart,
  deleteBookInCart,
};
