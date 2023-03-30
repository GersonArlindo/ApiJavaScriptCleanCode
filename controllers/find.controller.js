const { response, request } = require("express");
const allowedCollections = ["user", "category", "role", "product"];
const { User, Product, Role, Category } = require("../models");

const { ObjectId } = require("mongoose").Types;

const findUsers = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);
  if (isMongoId) {
    const user = await User.findById(term);
    return res.json({ results: user ? [user] : [] });
  }
  const regex = new RegExp(term, "i");
  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ status: true }],
  });
  return res.json({ results: users });
};

const findCategories = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);
  if (isMongoId) {
    const category = await Category.findById(term);
    return res.json({ results: category ? [category] : [] });
  }
  const regex = new RegExp(term, "i");
  const categories = await Category.find({ name: regex, status: true });
  return res.json({ results: categories });
};

const findProducts = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);
  if (isMongoId) {
    const product = await Product.findById(term);
    return res.json({ results: product ? [product] : [] });
  }
  const regex = new RegExp(term, "i");
  const products = await Product.find({ name: regex, status: true }).populate(
    "category",
    "name"
  );
  return res.json({ results: products });
};

const find = (req, res = response) => {
  const { collection, term } = req.params;

  if (!allowedCollections.includes(collection))
    return res
      .status(400)
      .json({ msg: `Allowed collections: ${allowedCollections}` });

  switch (collection) {
    case "user":
      findUsers(term, res);
      break;
    case "product":
      findProducts(term, res);
      break;
    case "category":
      findCategories(term, res);
      break;
    case "role":
      break;
    default:
      res
        .status(500)
        .json({ msg: `Allowed collections: ${allowedCollections}` });
  }
};

module.exports = { find };
