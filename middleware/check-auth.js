const {JWK_KEY}=require('../config/config')
const jwt =require('jsonwebtoken');

module.exports=(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        // console.log(token)
        const decoded=jwt.verify(token,JWK_KEY);
        req.userdata=decoded;
        next();
    }
    catch(error){
        console.log(error)
        return res.status(401).json({
            
            message:'Auth failed'
        })
    }
}