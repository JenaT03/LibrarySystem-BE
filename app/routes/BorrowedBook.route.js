const express = require("express");
const borrowedBooks = require("../controllers/BorrowedBook.controller");

const router = express.Router();

router.route("/").post(borrowedBooks.create);

router
  .route("/:id")
  .put(borrowedBooks.updateState)
  .delete(borrowedBooks.delete);

router.route("/:state").get(borrowedBooks.getByState);
module.exports = router;
