// const { query } = require('express');
const express = require('express');
const router = express.Router();
const user = require('./../controller/usercontroller')


router.post('/signup',user.signup)
router.delete('/:id',user.userdelete)
router.post('/signin',user.signIn)
router.get('/verify/query',user.verify)

// https://node-rest-shop.herokuapp.com/user/verify/?email=${uemail}&token=${otp}
// https:localhost:8000/user/verify/query?email=${uemail}&token=${otp}


module.exports = router;