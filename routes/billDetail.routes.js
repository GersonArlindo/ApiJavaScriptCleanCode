const { Router } = require("express");
const { check } = require("express-validator");
const {
  getBillDetails,
  getBillDetailById,
  createBillDetail,
} = require("../controllers/billDetail.controller");

const { validateJWT, validateFields } = require("../middleware");
const {
  productExistById,
  validateDistinctProducts,
  validateProductUnit,
} = require("../helpers/db-validators");

const router = Router();

router.get("/", getBillDetails);

router.get(
  "/:id",
  [
    check("id", "is not a mongoID").isMongoId(),
    validateFields,
  ],
  getBillDetailById
);

router.post(
  "/",
  [
    check("product_details")
      .isArray()
      .custom(async (productDetails) => {
        for (const product of productDetails) {
          const { product_id } = product;
          await productExistById(product_id);
        }
      }),
    check("product_details").custom(validateDistinctProducts),
    check("product_unit").custom(validateProductUnit),
    validateJWT,
    validateFields,
  ],
  createBillDetail
);

module.exports = router;
