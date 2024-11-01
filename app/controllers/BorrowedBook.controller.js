const BorrowedBookService = require("../services/BorrowedBook.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const borowedBookService = new BorrowedBookService(MongoDB.client);
    const document = await borowedBookService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi xảy ra trong quá trình tạo mới"));
  }
};

exports.updateState = async (req, res, next) => {
  try {
    const borowedBookService = new BorrowedBookService(MongoDB.client);
    const document = await borowedBookService.updateState(
      req.params.id,
      req.body.state,
      req.body.staffId
    );
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn sách"));
    }
    return res.send({
      message: "Cập nhật trạng thái sách thành công",
    });
  } catch (error) {
    console.error(
      `Lỗi cập nhật phiếu mươn sách có ID ${req.params.id}:`,
      error.message
    );
    return next(
      new ApiError(
        500,
        `Lỗi cập nhật phiếu mượn trạng sách có id=${req.params.id}`
      )
    );
  }
};

exports.getByState = async (req, res, next) => {
  try {
    const borowedBookService = new BorrowedBookService(MongoDB.client);
    const document = await borowedBookService.findByState(req.params.state);
    if (!document) {
      return next(
        new ApiError(404, `Không có thẻ nào ở trạng thái = ${req.params.state}`)
      );
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Lỗi khi lấy các thẻ mượn có trang thái =${req.params.state}`
      )
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const borowedBookService = new BorrowedBookService(MongoDB.client);
    const document = await borowedBookService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy thẻ mượn"));
    }
    return res.send({ message: "Đã xóa thẻ mượn sách thành công" });
  } catch (error) {
    return next(new ApiError(500, `Không thể xóa thẻ có id= ${req.params.id}`));
  }
};
