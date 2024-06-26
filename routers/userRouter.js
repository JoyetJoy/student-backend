const express=require('express')
const router=express.Router()
const verifyToken=require('../middleware/verifyTokens')

const userController=require('../Controllers/UserController')

router.post('/signup',userController.signupPost)
router.post('/login',userController.loginPost)
router.get('/userhome',verifyToken,userController.userhomeGet)
router.get('/profile',verifyToken,userController.profileGet)
router.post('/addstudent',verifyToken,userController.addstudentPost)
router.put('/updateprofile',verifyToken,userController.updateProfile)
router.delete('/deleteprofile/:id',verifyToken,userController.deleteProfile)

module.exports=router