
const mongoose = require('mongoose')
const Product = require('../model/product.model');


exports.getallProduct = ((req, res) => {
    Product.find()
    .select('name price _id productImage')
        .exec()
        .then(doc => {
            const response = {
                count: doc.length,
                product: doc.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage:doc.productImage,
                        request: {
                            type: 'GET',
                            url: "http://localhost:3000/product/" + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ err: err })
        })
})

exports.postProduct = ((req, res) => {
    const product = new Product(
        {
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
            productImage:req.file.path
        }
    );
    // console.log('yes do')
    product
        .save()
        .then(result => {
            console.log(result)
            res.status(200).json({
                Message: ' create new product',
                createProduct: {
                    name:result.name,
                    price:result.price,
                    _id:result._id,
                    request:{
                        type:'GET',
                        url:"http://localhost:3000/product/" + result._id
                    }
                }

            })
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)

        })

})

exports.postProductImage = ((req, res) => {
    // console.log(req.file)
    const product = new Product(
        {
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
            productImage:req.file.path

        }
    );
    // console.log('yes do')
    product
        .save()
        .then(result => {
            console.log(result)
            res.status(200).json({
                Message: ' create new product',
                createProduct: {
                    name:result.name,
                    price:result.price,
                    _id:result._id,
                    productImage:result.productImage,
                    request:{
                        type:'GET',
                        url:"http://localhost:3000/product/" + result._id
                    }
                }

            })
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)

        })

})


exports.getProductById = ((req, res) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    product:doc,
                    request:{
                        type:'GET',
                        description:"get all product",
                        url:"http://localhost:3000/product/"
                    }
                });
            } else {
                res.status(500).json({ message: 'no valid entry for this id' })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)

        })

})

exports.deleteProduct = ((req, res) => {
    const id = req.params.productId
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message:'product deleted successfully',
                request:{
                    type:'POST',
                    url:"http://localhost:3000/product/"
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

exports.updateProduct = ((req, res) => {
    const id = req.params.productId
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                Message: 'update product successfully',
                    request:{
                        type:'GET',
                        url:"http://localhost:3000/product/" + id
                    }
                
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
})