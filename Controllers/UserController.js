const signupModel = require('../Models/UserSignupmodel'); // Model for user sign-up details
const bcryptjs = require('bcryptjs'); // Library for hashing passwords
const jwt = require('jsonwebtoken'); // Library for creating and verifying JWT tokens
const dotenv = require('dotenv').config(); // dotenv for loading environment variables from a .env file
const Coursemodel = require('../Models/Coursemodel'); // Model for course details

// Regular expressions for validating email and password formats
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

module.exports = {
  // Handler for user signup
  signupPost: async (req, res) => {
    try {
      const { username, email, phonenumber, password, confirmpassword } = req.body;
      
      console.log(`Received signup data: ${JSON.stringify(req.body)}`); // Log received data

      // Validate input fields
      if (!username || !email || !password || !phonenumber) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if password and confirm password match
      if (password !== confirmpassword) {
        return res.status(400).json({ message: 'Password and Confirm Password are not the same' });
      }

      // Validate email format
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email' });
      }

      // Validate password format
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Please enter a valid password' });
      }

      // Check if user with the same email already exists
      const userExist = await signupModel.findOne({ email });
      if (userExist) {
        return res.status(400).json({ message: 'Email is already registered' });
      }

      // Hash the password
      const hashedPassword = await bcryptjs.hash(password, 10);
      // Create a new user
      const newUser = new signupModel({
        username,
        email,
        phonenumber,
        password: hashedPassword,
      });

      // Save the new user to the database
      await newUser.save();
      return res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Handler for user login
  loginPost: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(`Received login data: ${JSON.stringify(req.body)}`); // Log received data

      // Check if user exists
      const userExist = await signupModel.findOne({ email });
      if (!userExist) {
        console.log('User does not exist');
        return res.status(400).json({ success: false, message: 'Please create an account' });
      }

      // Compare entered password with hashed password
      const passmatch = await bcryptjs.compare(password, userExist.password);
      if (!passmatch) {
        return res.status(400).json({ success: false, message: 'Incorrect password' });
      }

      // Create JWT payload
      const payload = {
        userId: userExist._id,
        userName: userExist.username,
        role: 'user',
      };

      // Sign the JWT token
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      return res.status(200).json({ token });

    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Handler for getting user home data (e.g., courses)
  userhomeGet: async (req, res) => {
    try {
      const courseData = await Coursemodel.find({}); // Fetch all course data
      res.status(200).json({ success: true, courses: courseData });
    } catch (err) {
      console.log("courseGet", err);
      res.status(400).json({ success: false });
    }
  },

  // Handler for getting user profile by ID
  profileGet: async (req, res) => {
    try {
      const id = req.query.id;
      const userData = await signupModel.findById(id); // Fetch user data by ID
      if (!userData) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json({ success: true, userdata: userData });
    } catch (err) {
      console.log("profileGet error:", err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  // Handler for adding a new student (course)
  addstudentPost: async (req, res) => {
    try {
      const { coursename, fees, description, duration, instructor } = req.body;
      // Create a new course
      const course = new Coursemodel({
        Coursename: coursename,
        Fees: fees,
        Description: description,
        Duration: duration,
        Instructor: instructor
      });
      // Save the new course to the database
      await course.save();
      res.status(200).json({ success: true });
    } catch (err) {
      console.log("course post", err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  // Handler for updating user profile
  updateProfile: async (req, res) => {
    try {
      const id = req.query.id;
      const { username, email, phonenumber } = req.body;
      // Update user data by ID
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
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  // Handler for deleting user profile by ID
  deleteProfile: async (req, res) => {
    try {
      const id = req.params.id;
      console.log(id); // Log ID of the profile to be deleted
      await signupModel.deleteOne({ _id: id }); // Delete user data by ID
      res.status(200).json({ success: true });
    } catch (err) {
      console.log("deleteprofile", err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },
};
