let express = require('express');
let mongoose = require('mongoose');
let Product = require('../models/product');
let userModel = require('../models/user');
let User = userModel.User;
let Store = require('../models/store');

/* GET display product add page */
module.exports.displayAddProduct = (req, res, next) => {
  res.render('products/add', {
    title: 'Add Product',
    displayName: req.user ? req.user.displayName : ""
  });
};

/* POST add a new product model */
module.exports.processAddProduct = (req, res, next) => {
  let id = req.params.id;
  let newProduct = Product({
    "productName": req.body.productName.trim(),
    "type": req.body.type.trim(),
    "about": req.body.about.trim(),
    "price": req.body.price,
    "condition": req.body.condition.trim(),
    "storeId": id
  });

  Product.create(newProduct, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
    else {
      res.redirect('/store-list/detail/' + id);
    }
  });
};

/* GET display the edit product page */
module.exports.displayEditProduct = (req, res, next) => {
  let id = req.params.id;
  Product.findById(id, (err, productToEdit) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
    else {
      res.render('products/edit', {
        title: "Edit Product", product: productToEdit,
        displayName: req.user ? req.user.displayName : "",
      });
    }
  });
};

/* POST update product */
module.exports.processEditProduct = (req, res, next) => {

  let id = req.params.id;
  Product.findById(id, (err, productToEdit) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
    else {
      let updatedProduct = Product({
        "_id": id,
        "productName": req.body.productName.trim(),
        "type": req.body.type.trim(),
        "about": req.body.about.trim(),
        "price": req.body.price,
        "condition": req.body.condition.trim(),
        "storeId": productToEdit.storeId
      });
      Product.updateOne({ _id: id }, updatedProduct, (err) => {
        if (err) {
          console.log(err);
          res.end(err);
        }
        else {
          res.redirect('/store-list/detail/' + productToEdit.storeId);
        }
      });
    }
  });

};
/* Perform the deletion */
module.exports.performDelete = (req, res, next) => {
  let id = req.params.id;
  Product.findById(id, (err, product) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
    else {
      let storeId = product.storeId;
      Product.deleteOne({ _id: id }, (err) => {
        if (err) {
          console.log(err);
          res.end(err);
        }
        else {
          res.redirect('/store-list/detail/' + storeId);
        };
      });
    }
  });

};