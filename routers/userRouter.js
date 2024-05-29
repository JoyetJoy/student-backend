const express=require('express')
const router=express.Router()

const userController=require('../Controllers/UserController')

router.post('/signup',userController.signupPost)
router.post('/login',userController.loginPost)
router.get('/userhome',userController.userhomeGet)
router.get('/profile',userController.profileGet)
router.post('/addstudent',userController.addstudentPost)
router.put('/updateprofile',userController.updateProfile)
router.delete('/deleteprofile/:id',userController.deleteProfile)

module.exports=router