const mongoose=require('mongoose')

const schema={
    username:{
        type:String,
        required:true
    },  
    email:{
        type:String,
        required:true
    },
    phonenumber:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    verified:{
        type:Boolean,
    },
}

const signupSchema=new mongoose.Schema(schema)
const signupModel=new mongoose.model('studentsignup',signupSchema)
module.exports=signupModel;