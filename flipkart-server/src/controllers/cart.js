const Cart = require("../models/cart");

exports.addItemToCart = (req, res) => {
    const { user } = req;
    const { cartItems } = req.body;

    Cart.findOne({ user: user._id })
        .exec((error, cart) => {
            if (error) {
                return res.status(400).json({ error });
            }

            if (cart) {
                // If cart already exists then update cart quantity.
                const item = cart.cartItems.find((cartItem) => cartItem.product == cartItems.product);

                let condition, update;

                if (item) {
                    condition = { user: user._id, "cartItems.product": cartItems.product };
                    update = {
                        "$set": {
                            "cartItems.$": {
                                ...cartItems,
                                quantity: item.quantity + cartItems.quantity
                            } 
                        }
                    };

                } else {
                    condition = { user: user._id };
                    update = {
                        "$push": {
                            "cartItems": [ cartItems ] 
                        }
                    };
                }

                Cart.findOneAndUpdate(condition, update)
                    .exec((error, _cart) => {
                        if (error) {
                            return res.status(400).json({ error });
                        }

                        if (_cart) {
                            return res.status(201).json({ cart: _cart });
                        }
                    });
            } else {
                // If cart not exist then create a new cart.
                const cart = new Cart({
                    user: user._id,
                    cartItems,
                });
            
                cart.save((error, cart) => {
                    if (error) {
                        return res.status(400).json({ error });
                    }
                    
                    if (cart) {
                        return res.status(201).json({ cart });
                    }
                });
            }
        });
}