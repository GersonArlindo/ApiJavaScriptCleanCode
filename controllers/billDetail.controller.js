const { response, request } = require("express");
const mongoose = require("mongoose");
const { BillDetail, Product, HeaderBill } = require("../models");

const getBillDetails = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };
  const [billdetails, total] = await Promise.all([
    BillDetail.find(query)
      .populate("product_details.product_id", "name")
      .skip(from)
      .limit(limit),
    BillDetail.countDocuments(query),
  ]);

  res.status(200).json({
    total,
    billdetails,
  });
};

const getBillDetailById = async (req = request, res = response) => {
  const { id } = req.params;
  const billdetail = await BillDetail.findById(id)
  res.status(200).json(billdetail);
};

const createBillDetail = async (req, res = response) => {
  const { status, ...body } = req.body;
  const headerBillDB = await BillDetail.findOne({ id_bill: body.id_bill });
  if (!headerBillDB)
    return res
      .status(404)
      .json({ msg: `the header bill ${headerBillDB} not exists` });

  const promises = body.product_details.map(async (detail) => {
    const { product_id, product_unit } = detail;
    const product = await Product.findById(product_id);
    if (!product) throw new Error(`Product ${product_id} not found`);
    const precio_total = product.precio * product_unit;
    return { product_id, product_unit, precio_total };
  });

  const productDetails = await Promise.all(promises);

  const data = {
    id_bill: body.id_bill,
    product_details: productDetails,
  };

  const billdetail = new BillDetail(data);
  await billdetail.save();
  await updateGranTotal(body.id_bill);
  res.status(200).json(billdetail);
};

async function updateGranTotal(id_bill) {
  try {
    const details = await BillDetail.find({ id_bill });

    let gran_total = 0;
    details.forEach(detail => {
      detail.product_details.forEach(product => {
        gran_total += product.precio_total;
      });
    });

    await HeaderBill.findByIdAndUpdate(id_bill, { gran_total });
    console.log(`Gran total updated for bill ${id_bill}`);
  } catch (error) {
    console.error(error);
  }
}

// const updateProduct = async (req, res) => {
//   const { id } = req.params;
//   const { status, user, ...data } = req.body;

//   data.name = data.name.toUpperCase();
//   data.user = req.user._id;

//   const product = await Product.findByIdAndUpdate(id, data, { new: true });

//   res.json(product);
// };

// const deleteProduct = async (req, res) => {
//   const { id } = req.params;
//   const deletedProduct = await Product.findByIdAndUpdate(
//     id,
//     { status: false },
//     { new: true }
//   );
//   res.json(deletedProduct);
// };

module.exports = {
  getBillDetails,
  getBillDetailById,
  createBillDetail,
};
