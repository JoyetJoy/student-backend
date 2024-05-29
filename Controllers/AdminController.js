const signupModel = require('../Models/AdminSignupmodel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const SecretKey = process.env.SECRET_KEY;
const Coursemodel=require('../Models/Coursemodel')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

module.exports = {
  signupPost: async (req, res) => {
    try {
      const { username, email, phonenumber, password, confirmpassword } = req.body;

      console.log(`Received signup data: ${JSON.stringify(req.body)}`);

      // Validate input
      if (!username || !email || !password || !phonenumber) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (password !== confirmpassword) {
        return res.status(400).json({ message: 'Password and Confirm Password are not the same' });
      }

      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email' });
      }

      if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Please enter a valid password' });
      }

      const adminExist = await signupModel.findOne({ email });
      if (adminExist) {
        return res.status(400).json({ message: 'Email is already registered' });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      const newUser = new signupModel({
        username,
        email,
        phonenumber,
        password: hashedPassword,
      });

      await newUser.save();
      return res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  loginPost: async (req, res) => {
    try {
      const { email, password ,secretKey} = req.body;
      console.log(`Received login data: ${JSON.stringify(req.body)}`);

      const userExist = await signupModel.findOne({ email });
      if (!userExist) {
        console.log('User does not exist');
        return res.status(400).json({ success: false, message: 'Please create an account' });
      }
      const passmatch = await bcryptjs.compare(password, userExist.password);
      if (!passmatch) {
        return res.status(400).json({ success: false, message: 'Incorrect password' });
      }  
      if(secretKey!==SecretKey){
        return res.status(400).json ({success:false,message:'Incorrect secretkey'})
      }
      const payload = {
        userId: userExist._id,
        userName: userExist.username,
        role: 'admin',
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      return res.status(200).json({ token });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  coursePost: async (req, res) => {
    try {
      const { coursename, fees, description, instructor } = req.body;
      const course = new Coursemodel({
        Coursename:coursename,
        Fees:fees,
        Description :description, 
        Instructor:instructor
      });
      await course.save();
      res.status(200).json({ success: true });
    } catch (err) {
      console.log("course post", err);
    }
  },
  courseGet: async (req, res) => {
    try {
      const courseData = await Coursemodel.find({});
      res.status(200).json({ success: true, courses: courseData });
    } catch (err) {
      console.log("courseGet", err);
      res.status(400).json({ success: false });
    }
  },
};
