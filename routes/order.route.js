const express = require('express')
const router = express.Router();
const order=require('./../controller/ordercontroller')
const Auth =require('./../middleware/check-auth')

router.get('/',Auth,order.getorder)
router.post('/',Auth,order.postorder)
router.get('/:orderId',Auth,order.getOrderById)
router.delete('/:orderId',Auth,order.deleteOrder)
router.get('/byid/:orderId',Auth,order.getOrderById)



module.exports=router