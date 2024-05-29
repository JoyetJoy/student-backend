const signupModel = require('../Models/UserSignupmodel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
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

      const userExist = await signupModel.findOne({ email });
      if (userExist) {
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
      const { email, password } = req.body;
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

      const payload = {
        userId: userExist._id,
        userName: userExist.username,
        role: 'user',
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET);
      return res.status(200).json({ token });

    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  },
  userhomeGet: async (req, res) => {
    try {
      const courseData = await Coursemodel.find({});
      res.status(200).json({ success: true, courses: courseData });
    } catch (err) {
      console.log("courseGet", err);
      res.status(400).json({ success: false });
    }
  },
  profileGet: async (req, res) => {
    try {
      const id = req.query.id;
      const userData = await signupModel.findById(id);
      if (!userData) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json({ success: true, userdata: userData });
    } catch (err) {
      console.log("profileGet error:", err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },
  addstudentPost: async (req, res) => {
    try {
      const { coursename, fees, description,duration, instructor } = req.body;
      const course = new signupModel({
        Coursename:coursename,
        Fees:fees,
        Description :description,
        Duration:duration, 
        Instructor:instructor
      });
      await course.save();
      res.status(200).json({ success: true });
    } catch (err) {
      console.log("course post", err);
    }
  },
  updateProfile: async (req, res) => {
    try {
      const id = req.query.id;
      const { username,email,phonenumber } = req.body;
      const update = await signupModel.updateOne(
        { _id: id },
        {
          $set: {
            username,
            email,
            phonenumber
          },
        },
        { new: true }
      );

      res.status(200).json({ success: true });
    } catch (err) {
      console.log(" error in editprofile post", err);
    }
  },
  deleteProfile: async (req, res) => {
    try {
      const id = req.params.id;console.log(id);
      await signupModel.deleteOne({ _id: id });
      res.status(200).json({ success: true });
    } catch (err) {
      console.log("deleteprofile", err);
    }
  },
};
