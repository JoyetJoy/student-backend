const express=require('express')
const router=express.Router()

const adminController=require('../Controllers/AdminController')

router.post('/signup',adminController.signupPost)
router.post('/login',adminController.loginPost)
router.post('/addcourse',adminController.coursePost)
router.get('/courses',adminController.courseGet)

module.exports=router