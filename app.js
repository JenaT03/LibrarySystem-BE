const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");
const bookRouter = require("./app/routes/Book.route");
const publisherRouter = require("./app/routes/Publisher.route");
const readerRouter = require("./app/routes/Reader.route");
const staffRouter = require("./app/routes/Staff.route");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Chào bạn nhe" });
});

app.use("/api/book", bookRouter);
app.use("/api/publisher", publisherRouter);
app.use("/api/reader", readerRouter);
app.use("/api/staff", staffRouter);

app.use((req, res, next) => {
  //code ở đây sẽ chạy khoong có route nào được định nghĩa khớp với req, gọi next() để chuyển sang midleware xử lý lỗi
  return next(new ApiError(404, "Resource not found"));
});

// midleware xử lý lỗi
app.use((err, req, res, next) => {
  // Midleware xử lý lỗi tập trung, trong các đoạn code xử lý ở  các route, gọi next(error) sẽ chuyển về midleware xử lý lỗi này
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
