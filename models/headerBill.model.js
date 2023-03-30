const { Schema, model } = require("mongoose");

const HeaderBillSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  gran_total: {
    type: Number,
    required: true,
    default: 0,
  },
  date_created: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

HeaderBillSchema.methods.toJSON = function () {
  const { __v, status, ...data } = this.toObject();
  return data;
};

module.exports = model("HeaderBill", HeaderBillSchema);