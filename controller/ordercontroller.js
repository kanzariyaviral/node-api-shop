const mongoose = require('mongoose')
const Order = require('../model/order.model')
const Product = require('../model/product.model')

exports.getorder = ((req, res) => {
    Order.find()
        .select('_id product quantity')
        .populate('product', 'name')
        .exec()
        .then(doc => {
            console.log(doc)
            res.status(200).json({
                count: doc.length,
                order: doc.map(docs => {
                    return {
                        _id: docs._id,
                        quantity: docs.quantity,
                        product: docs.product,
                        request: {
                            type: 'GET',
                            url: "https://node-rest-shop.herokuapp.com/order/" + docs._id
                        }
                    }
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        })
})

exports.postorder = ((req, res) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                productId: req.body.productId

            })
            return order.save();
        })
        .then(result => {
            console.log(result)
            res.status(200).json({result:result,
                request: {
                    type: 'GET',
                    description: "get all order",
                    url: "https://node-rest-shop.herokuapp.com/order/"
                }});
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({
                error: err
            });

        })
})


exports.getOrderById = ((req, res) => {
    const id = req.params.orderId;
    Order.findById(id)
        .select('_id product quantity')
        .populate('product', 'name')
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    order: doc,
                    request: {
                        type: 'GET',
                        description: "get all order",
                        url: "https://node-rest-shop.herokuapp.com/order/"
                    }
                });
            } else {
                res.status(500).json({ message: 'no valid en for this id' })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)

        })

})

exports.deleteOrder = ((req, res) => {
    const id = req.params.orderId
    Order.remove({ _id: id })
        .exec()
        .then(result => {

            res.status(201).json({
                message: 'your order is deleted',
                request: {
                    type: 'POST',
                    url: 'https://node-rest-shop.herokuapp.com/order'

                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                error: err
            })
        })

})


// exports.getOrderByIdwithif = async(req, res) => {
//     const id = req.body.id;
//     await Order.findById(id)
//     console.log('its work')
//         .then(Order => {
//             if (!Order) {
//                 return res.status(404).json({
//                     message: "order not found"
//                 })
//             }
//             res.status(200).json({
//                 order: Order
//             })
//         })
//         .catch(err => {
//             console.log({ error: err })
//             res.status(400).json({ error: err })
//         })
// }
