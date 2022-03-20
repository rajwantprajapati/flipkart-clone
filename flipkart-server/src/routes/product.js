const express = require('express');
const multer = require('multer');
const shortId = require('shortid');
const path = require('path');

const { requireSignIn, adminMiddleware } = require('../common-middleware');
const { addProduct } = require('../controllers/product');
// const {  } = require('../controllers/category');

const Router = express.Router();

// create destination folder and filename to be saved.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), 'uploads'));
    },
    filename: function (req, file, cb) {
      cb(null, shortId.generate() + '-' + file.originalname);
    }
});
  
const upload = multer({ storage: storage })

Router.post(
    '/product/create',
    requireSignIn,
    adminMiddleware,
    upload.array('productPicture'),
    addProduct
);
// Router.get('/category/getCategories', getCategories);

module.exports = Router;