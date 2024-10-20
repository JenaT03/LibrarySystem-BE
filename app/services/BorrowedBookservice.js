const { ObjectId } = require("mongodb");

class BorrowedBook_Service {
  constructor(client) {
    this.BorrowedBook = client.db().collection("borrowed_books");
  }

  extractBorrowedBookData(payload) {
    const borrowedBook = {
      bookId: payload.bookId,
      staffId: payload.staffId,
      readerId: payload.readerId,
      borrowDate: new Date(payload.borrowDate), // Ngày mượn tính từ ngày nhập form
      dueDate: null, // ngày trả tính từ 10 ngày sau ngày mượn
      status: "free",
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
    borrowedBook.dueDate = dueDate;

    borrowedBook.status = "borrowed";
    const result = await this.BorrowedBook.findOneAndUpdate(
      borrowedBook,
      { $set: borrowedBook },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }

  async find(filter) {
    const cursor = await this.BorrowedBook.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.BorrowedBook.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractBorrowedBookData(payload);
    const result = await this.BorrowedBook.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
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
