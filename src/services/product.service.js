"use strict";

/* product_name: {
  type: String,
  required: true,
},
product_thumb: {
  type: String,
  required: true,
},
product_description: String,
product_price: {
  type: Number,
  required: true,
},
product_quantity: {
  type: Number,
  required: true,
},
product_type: {
  type: String,
  required: true,
  enum: ["Electronics", "Clothing", "Furniture"],
},
product_attributes: {
  type: Schema.Types.Mixed,
  required: true,
}, */

const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronic } = require("../models/product.model");

// Following factory design pattern

/* 
  1. Create product factory class
*/

class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case "Clothing":
        return new Clothing(payload).createProduct();
      case "Electronics":
        return new Electronics(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid product type: ${type}`);
    }
  }
}

/* 
  2. Create base product class
*/
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_shop,
    product_price,
    product_quantity,
    product_type,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_shop = product_shop;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    return await product.create({
      ...this,
      _id: product_id,
    });
  }
}

/* 
  3. Create specific product type class extends base class
*/

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Create new clothing product failed!");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Create new product failed!");

    return newProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronics = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronics) throw new BadRequestError("Create new electronic product failed!");

    const newProduct = await super.createProduct(newElectronics._id);
    if (!newProduct) throw new BadRequestError("Create new product failed!");

    return newProduct;
  }
}

module.exports = ProductFactory;
