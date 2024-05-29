
//courses schema

const mongoose =require('mongoose')
const Schema ={
    Coursename:{ 
        type: String, 
        require: true 
    },
    Description:{ 
        type: String, 
        require: true 
    },
    Fees:{ 
        type: String,
        require: true 
    },
    Instructor:{ 
        type: String, 
        require: true 
    },

}
const courseSchema=new mongoose.Schema(Schema)
const courseModel =mongoose.model('courses', courseSchema);
module.exports =courseModel;