const { ObjectId } = require("mongodb");

class Book_Service {
  constructor(client) {
    this.Book = client.db().collection("books");
  }

  extractBookData(payload) {
    const book = {
      title: payload.title,
      author: payload.author,
      category: payload.category,
      quantity: payload.quantity,
      year: payload.year,
      price: payload.price,
      img: payload.img,
      publisherId: payload.publisherId,
    };
    Object.keys(book).forEach(
      (key) => book[key] === undefined && delete book[key]
    );
    return book;
  }

  async create(payload) {
    const book = this.extractBookData(payload);
    const result = await this.Book.findOneAndUpdate(
      { title: book.title, author: book.author },
      { $set: book },
      { returnDocument: "after", upsert: true } // Neu khong tim thay thi se tao moi
    );
    return result;
  }

  async find(filter) {
    const cursor = await this.Book.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      title: { $regex: new RegExp(name), $options: "i" }, //toán tử regex-trong MongoDB cho phép tìm doc mà name chứa chuổi con khớp với biểu thức chính quy được tạo bởi new RegExp(name), op i ko phân biệt hoa thường
    });
  }
  async findById(id) {
    return await this.Book.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null, // kiểm tra xem id có hợp lệ hay không nếu có nó sẽ tạo ra và tìm kiếm bằng _id
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractBookData(payload);
    const result = await this.Book.findOneAndUpdate(
      filter,
      { $set: update }, // chỉ cập nhật các doc trong updtate
      { returnDocument: "after" }
    );
    return result; // chứa doc được update success còn không thì là null
  }

  async delete(id) {
    const result = await this.Book.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
}

module.exports = Book_Service;
