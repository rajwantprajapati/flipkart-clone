const shortId = require('shortid');
const slugify = require('slugify');

const Product = require('../models/product');

exports.addProduct = (req, res) => {
    const { files, body} = req;
    const {
        name,
        price,
        description,
        category,
        quantity
    } = body;

    let productPictures = [];

    if (files.length) {
        productPictures = files.map(file => ({ img: file.filename }));
    }

    // res.status(200).json({ file: files, body: body });
    const product = new Product({
        name,
        slug: slugify(name),
        price,
        description,
        productPictures,
        category,
        createdBy: req.user._id,
        quantity,
    });

    product.save((error, product) => {
        if (error) {
            return res.status(400).json({ error })
        }

        if (product) {
            res.status(201).json({ product });
        }
    });
}