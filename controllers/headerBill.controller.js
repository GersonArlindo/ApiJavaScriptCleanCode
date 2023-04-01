const { response, request } = require("express");
const { HeaderBill } = require("../models");

const getHeaderBills = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };
  const [headerbills, total] = await Promise.all([
    HeaderBill.find(query)
      .populate("user", "name")
      .skip(from)
      .limit(limit),
      HeaderBill.countDocuments(query),
  ]);
  res.status(200).json({
    total,
    headerbills,
  });
};

const getHeaderBillById = async (req = request, res = response) => {
  const { id } = req.params;
  const headerbill = await HeaderBill.findById(id)
    .populate("user", "name")
  res.status(200).json(headerbill);
};

const createHeaderBill = async (req, res = response) => {
  const { status, user, ...body } = req.body;
  const data = {
    ...body,
    user: req.user._id,
  };
  const headerbill = new HeaderBill(data);
  await headerbill.save();
  res.status(200).json(headerbill);
};

const updateHeaderBill = async (req, res) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;
  data.user = req.user._id;
  const headerbill = await HeaderBill.findByIdAndUpdate(id, data, { new: true });
  res.json(headerbill);
};


module.exports = {
  getHeaderBills,
  getHeaderBillById,
  createHeaderBill,
  updateHeaderBill
};
