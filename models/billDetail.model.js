const { Schema, model } = require("mongoose");
const Product = require('./product.model'); // Importamos el modelo de producto

const BillDetailSchema = Schema({
  id_bill: {
    type: Schema.Types.ObjectId,
    ref: "HeaderBill",
  },
  product_details: [{
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "product id is mandatory"],
    },
    product_unit: {
      type: Number,
      required: [true, "product unit id is mandatory"],
      default: 0,
    },
    precio_total: {
      type: Number,
      default: 0,
    }
  }]
});

BillDetailSchema.methods.toJSON = function () {
  const { __v, status, ...data } = this.toObject();
  return data;
};

module.exports = model("BillDetail", BillDetailSchema);