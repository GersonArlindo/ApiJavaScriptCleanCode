const { Category, Product } = require("../models");
const Role = require("../models/role.model");
const User = require("../models/user.model");

const isAValidRole = async (role = "") => {
  const roleExist = await Role.findOne({ role });
  if (!roleExist)
    throw new Error(`Role: ${role} is not registered in Database`);
};

const emailExist = async (email = "") => {
  const emailExist = await User.findOne({ email });
  if (emailExist) throw new Error(`Email already exist in DB`);
};

const userByIdExist = async (id) => {
  const userExist = await User.findById(id);
  if (!userExist) throw new Error(`the Id does not exist`);
};

const categoryExistById = async (id) => {
  const categoryExist = await Category.findById(id);
  if (!categoryExist) throw new Error(`the category Id does not exist`);
};

const productExistById = async (id) => {
  const productExist = await Product.findById(id);
  if (!productExist) throw new Error(`the product Id does not exist`);
};

const allowedCollections = async (collection = "", collections = []) => {
  const isIncluded = collections.includes(collection);
  if (!isIncluded)
    throw new Error(
      `La collection ${collection} is not allowed, ${collections}`
    );
  return true;
};

/*Mis funciones para validar*/
const validateProductUnit = (value, { req }) => {
  const { product_details } = req.body;
  const invalidUnits = product_details.filter((detail) => detail.product_unit > 7);
  if (invalidUnits.length > 0) {
    throw new Error("The product unit must be less than or equal to 7");
  }
  return true;
};

const validateDistinctProducts = (value, { req }) => {
  const { product_details } = req.body;
  const distinctProductIds = new Set(product_details.map((detail) => detail.product_id));
  if (distinctProductIds.size > 10) {
    throw new Error("Only up to 10 different products can be purchased");
  }
  return true;
};

module.exports = {
  isAValidRole,
  emailExist,
  userByIdExist,
  categoryExistById,
  productExistById,
  allowedCollections,
  validateProductUnit,
  validateDistinctProducts
};
