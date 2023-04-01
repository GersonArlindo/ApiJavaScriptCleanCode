const { Router } = require("express");
const { check } = require("express-validator");
const {
  getHeaderBills,
  getHeaderBillById,
  createHeaderBill,
  updateHeaderBill,

} = require("../controllers/headerBill.controller");

const { validateJWT, validateFields, isAdminRole } = require("../middleware");

const router = Router();

router.get("/", getHeaderBills);

router.get(
  "/:id",
  [
    check("id", "is not a mongoID").isMongoId(),
    validateFields,
  ],
  getHeaderBillById
);

router.post(
  "/",
  [
     check("user", "user is mandatory").not().isEmpty(),
     check("user", "is not a mongoID").isMongoId(),
     validateJWT,
     validateFields,
  ],
  createHeaderBill
);

router.put(
  "/:id",
  [
    validateJWT,
    check("id", "is not a mongoID").isMongoId(),
    validateFields,
  ],
  updateHeaderBill
);

module.exports = router;
