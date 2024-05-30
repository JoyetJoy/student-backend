const express=require('express')
const router=express.Router()
const verifyToken=require('../middleware/verifyTokens')

const adminController=require('../Controllers/AdminController')

router.post('/signup',adminController.signupPost)
router.post('/login',adminController.loginPost)

router.post('/addcourse',verifyToken,adminController.coursePost)
router.get('/courses',verifyToken,adminController.courseGet)
router.get('/editcourse',verifyToken,adminController.editcourseGet)
router.post('/editcoursepost',verifyToken,adminController.editcoursePost)
router.delete('/deletecourse/:id',verifyToken,adminController.deleteCourse)

module.exports=router