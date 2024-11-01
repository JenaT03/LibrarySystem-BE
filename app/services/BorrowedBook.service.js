const { ObjectId } = require("mongodb");
const moment = require("moment");

class BorrowedBook_Service {
  constructor(client) {
    this.BorrowedBook = client.db().collection("borrowed_books");
  }

  extractBorrowedBookData(payload) {
    const borrowedBook = {
      bookId: payload.bookId,
      staffId: payload.staffId,
      readerId: payload.readerId,
      borrowDate: new Date(payload.borrowDate),
      dueDate: null,
      state: payload.state,
    };

    Object.keys(borrowedBook).forEach(
      (key) => borrowedBook[key] === undefined && delete borrowedBook[key]
    );
    return borrowedBook;
  }

  async create(payload) {
    const borrowedBook = this.extractBorrowedBookData(payload);

    const dueDate = new Date(borrowedBook.borrowDate);
    dueDate.setDate(dueDate.getDate() + 10); // Thêm 10 ngày vào borrowDate
    borrowedBook.dueDate = moment(dueDate).format("YYYY-MM-DD");
    borrowedBook.borrowDate = moment(borrowedBook.borrowDate).format(
      "YYYY-MM-DD"
    );
    const result = await this.BorrowedBook.findOneAndUpdate(
      borrowedBook,
      { $set: borrowedBook },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }

  async findByState(state) {
    return await this.BorrowedBook.find({
      state: state,
    }).toArray();
  }

  // async update(id, payload) {
  //   const filter = {
  //     _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
  //   };
  //   const update = this.extractBorrowedBookData(payload);
  //   const result = await this.BorrowedBook.findOneAndUpdate(
  //     filter,
  //     { $set: update },
  //     { returnDocument: "after" }
  //   );
  //   return result;
  // }

  async updateState(id, newState, staffId) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = {
      $set: { state: newState, staffId: staffId },
    };
    const result = await this.BorrowedBook.findOneAndUpdate(filter, update, {
      returnDocument: "after",
    });
    return result;
  }

  async delete(id) {
    const result = await this.BorrowedBook.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
}

module.exports = BorrowedBook_Service;
