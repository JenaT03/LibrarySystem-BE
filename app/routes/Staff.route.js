const express = require("express");
const staffs = require("../controllers/Staff.controller");

const router = express.Router();

router.route("/").get(staffs.getAll).post(staffs.create);

router
  .route("/:id")
  .get(staffs.getById)
  .put(staffs.update)
  .delete(staffs.delete);

module.exports = router;
