const BorrowedBookService = require("../services/BorrowedBook.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  const { bookId, readerId, borrowDate } = req.body;

  if (!category) {
    return next(new ApiError(400, "Loại sách không được để trống"));
  }
  if (!img) {
    return next(new ApiError(400, "Hình ảnh không được để trống"));
  }
  if (quantity <= 0) {
    return next(new ApiError(400, "Số lượng phải là số lớn hơn 0"));
  }
  if (!price) {
    return next(new ApiError(400, "Giá tiền không được để trống"));
  }
  if (!publisherId) {
    return next(new ApiError(400, "Nhà xuất bản không được để trống"));
  }
  const currentYear = new Date().getFullYear();
  if (year >= currentYear + 1) {
    return next(new ApiError(400, "Năm xuất bản không hợp lệ"));
  }

  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi xảy ra trong quá trình tạo mới"));
  }
};
