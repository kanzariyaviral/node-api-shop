const express = require('express');
const router = express.Router();
const product = require('./../controller/productController')
const multer = require('multer');
const Auth=require('./../middleware/check-auth')

const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
        // new Date().toISOString()+file.originalname
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false)
    }
};


const upload = multer({
    storage: Storage,
    limits:{
        fileSize:1024*1024*5
    },
    fileFilter:fileFilter
});


router.get('/', product.getallProduct);
router.post('/',Auth, product.postProduct);

//post image//
router.post('/image', Auth,upload.single('productImage'), product.postProductImage);

router.get('/:productId', product.getProductById);
router.delete('/:productId',Auth, product.deleteProduct);
router.patch('/:productId',Auth, product.updateProduct)

module.exports = router;