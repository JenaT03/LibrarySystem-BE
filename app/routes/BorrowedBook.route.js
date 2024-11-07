const express = require("express");
const borrowedBooks = require("../controllers/BorrowedBook.controller");

const router = express.Router();

router.route("/").post(borrowedBooks.create).get(borrowedBooks.getAll);

router
  .route("/:id")
  .put(borrowedBooks.updateState)
  .delete(borrowedBooks.delete)
  .get(borrowedBooks.getAllOfReader);

router.route("/state/:state").get(borrowedBooks.getByState);
router.route("/borrows/overdue").get(borrowedBooks.getOverDueBorrows);
router
  .route("/borrows/out-of-stock-books")
  .get(borrowedBooks.getOutOfStockBooks);

module.exports = router;
