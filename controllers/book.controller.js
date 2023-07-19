const Book = require('../models/book.model')

const getBooks = (req, res) => {
  Book.find()
    .sort({ date: -1 })
    .then((books) => res.json(books));
};

const createBook = (req, res) => {
  const newBook = new Book(req.body);
  newBook.save().then((book) => res.json(book));
};

const updateBook = (req, res) => {
  Book.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function (
    book
  ) {
    Book.findOne({ _id: req.params.id }).then(function (book) {
      res.json(book);
    });
  });
};


const deleteBook = (req, res) => {
  Book.findByIdAndDelete({ _id: req.params.id }).then(function (book) {
    res.json({ success: true });
  });
};


module.exports = {
  getBooks,
  createBook,
  updateBook,
  deleteBook
};
