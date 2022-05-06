const mongoose =require('mongoose');


const usercreate=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String,
        required:true,
        
    },
    email:{type:String,
        required:true,
        unique:true,
    },
    password:{type:String,
        required:true,
    },
    verfication_token:{
            type:Number,
            require:true
    },
    activeToken:{
        type:Boolean,
        default:false
    }
})
module.exports=mongoose.model('user',usercreate)

