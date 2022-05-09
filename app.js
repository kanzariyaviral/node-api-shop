const express = require('express');
const app = express();
const productRoutes = require('./routes/product.route')
const orderRoutes = require('./routes/order.route')
const userRoutes =require('./routes/user.route')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const {DB, PORT}=require('./config/config')
const port =PORT || 5000;

app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect(DB)
console.log('connected to database')

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,Authorization"
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,DELET,GET');
        return res.status(200).json({});
    }
    next();
})
app.use('/product', productRoutes)
app.use('/order', orderRoutes)
app.use('/user',userRoutes)

app.use((req, res, next) => {
    const error = new Error(' not found')
    error.status = 404;
    next(error)
})

app.use((error, req, res, next) => {
    console.log(error.message)
    res.status(error.status || 500);
    res.json({
        error: {
            massage: error.message
        }
    });
});


app.listen(port,()=>{
    console.log(`servere use port no ${port}`)
});

