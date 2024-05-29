const express=require('express')
const router=express.Router()

const userController=require('../Controllers/UserController')

router.post('/signup',userController.signupPost)


module.exports=router