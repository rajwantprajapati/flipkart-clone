const slugify = require('slugify');

const Category = require('../models/category');

const createCategoryList = (categories, parentId = null) => {
    let category;

    if (parentId === null) {
        // Fetch parent label categories.
        category = categories.filter(category => !category.parentId);
    } else {
        // fetch all the child categories.
        category =  categories.filter(category => category.parentId == parentId);
    }

    const categoryList = category.map((category => ({
        _id: category._id,
        name: category.name,
        slug: category.slug,
        children: createCategoryList(categories, category._id)
    })));

    return categoryList;
}

exports.addCategory = (req, res) => {
    const { name, parentId } = req.body;
    const { file } = req;

    const categoryObj = {
        name,
        slug: slugify(name)
    }

    if (file) {
        categoryObj.categoryImage = process.env.API + '/public/' + file.filename;
    }

    if (parentId) {
        categoryObj.parentId = parentId;
    }

    const category = new Category(categoryObj);

    category.save((error, category) => {
        if (error) {
            res.status(400).json({ error });
        }

        if (category) {
            res.status(201).json({ category });
        }
    });
};

exports.getCategories = (req, res) => {
    Category.find({})
        .exec((error, categories) => {
            if (error) {
                res.status(400).json({ error });
            }

            if (categories) {
                const categoryList = createCategoryList(categories);
                res.status(200).json({ categoryList });
            }
        });
};