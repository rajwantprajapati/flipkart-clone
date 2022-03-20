const express = require("express");
const { requireSignIn, userMiddleware } = require("../common-middleware");
const { addItemToCart } = require("../controllers/cart");

const router = express.Router();

router.post('/user/cart/addtocart', requireSignIn, userMiddleware, addItemToCart);

module.exports = router;