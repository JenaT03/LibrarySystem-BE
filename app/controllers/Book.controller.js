const BookService = require("../services/Book.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Hàm để xử lý khi tạo sách mới
exports.create = async (req, res, next) => {
  const { title, category, img, quantity, year, price, publisherId } = req.body;

  if (!title) {
    return next(new ApiError(400, "Tựa đề không được để trống"));
  }
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

// Hàm để lấy danh sách tất cả sách
exports.getAll = async (req, res, next) => {
  let documents = [];

  try {
    const bookService = new BookService(MongoDB.client);
    const { title } = req.query;

    if (title) {
      documents = await bookService.findByTitle(title);
    } else {
      documents = await bookService.find({});
    }
  } catch (error) {
    console.error("Lỗi lấy sách:", error.message);
    console.error("Stack trace:", error.stack);
    return next(new ApiError(500, "Có lỗi xảy ra trong quá trình lấy sách"));
  }

  return res.send(documents);
};

// Hàm để lấy thông tin chi tiết của một cuốn sách theo ID
exports.getById = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Lỗi lấy sách có id=${req.params.id}`));
  }
};

// Hàm để cập nhật thông tin một cuốn sách
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không thể để rỗng"));
  }

  const { title, category, img, quantity, year, price, publisherId } = req.body;

  if (!req.body?.title) {
    return next(new ApiError(400, "Tựa đề không được để trống"));
  }
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
    const document = await bookService.update(req.params.id, req.body);

    if (!document) {
      console.error(`Sách có ID ${req.params.id} không tìm thấy`);
      return next(new ApiError(404, "Không tìm thấy sách"));
    }

    return res.send({ message: "Cập nhật sách thành công" });
  } catch (error) {
    console.error(`Lỗi cập nhật sách có ID ${req.params.id}:`, error.message);
    console.error(error.stack);

    return next(new ApiError(500, `Lỗi cập nhật sách có id=${req.params.id}`));
  }
};

// Hàm để xóa một cuốn sách
exports.delete = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    return res.send({ message: "Xóa sách thành công" });
  } catch (error) {
    return next(new ApiError(500, `Không thể xóa sách có id=${req.params.id}`));
  }
};
