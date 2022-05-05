const express = require('express');
const router = express.Router();
const user = require('./../controller/usercontroller')


router.post('/signup',user.signup)
router.delete('/:id',user.userdelete)
router.post('/signin',user.signin)





module.exports = router;