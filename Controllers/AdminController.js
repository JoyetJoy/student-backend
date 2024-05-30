const signupModel = require('../Models/AdminSignupmodel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const SecretKey = process.env.SECRET_KEY;
const Coursemodel = require('../Models/Coursemodel')

// Regular expressions for email and password validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

module.exports = {
  // Signup function for registering a new admin
  signupPost: async (req, res) => {
    try {
      const { username, email, phonenumber, password, confirmpassword } = req.body;
      
      // Log received signup data for debugging purposes
      console.log(`Received signup data: ${JSON.stringify(req.body)}`);

      // Validate input fields: check if all required fields are present
      if (!username || !email || !password || !phonenumber) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if password and confirm password match
      if (password !== confirmpassword) {
        return res.status(400).json({ message: 'Password and Confirm Password are not the same' });
      }

      // Validate email format using regex
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email' });
      }

      // Validate password format using regex
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Please enter a valid password' });
      }

      // Check if the email is already registered in the database
      const adminExist = await signupModel.findOne({ email });
      if (adminExist) {
        return res.status(400).json({ message: 'Email is already registered' });
      }

      // Hash the password before saving to the database
      const hashedPassword = await bcryptjs.hash(password, 10);
      const newUser = new signupModel({
        username,
        email,
        phonenumber,
        password: hashedPassword,
      });

      // Save the new admin to the database
      await newUser.save();
      return res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
      // Log any errors that occur during signup
      console.error('Signup error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Login function for admin authentication
  loginPost: async (req, res) => {
    try {
      const { email, password, secretKey } = req.body;
      
      // Log received login data for debugging purposes
      console.log(`Received login data: ${JSON.stringify(req.body)}`);

      // Check if the user exists in the database
      const adminExist = await signupModel.findOne({ email });
      if (!adminExist) {
        console.log('User does not exist');
        return res.status(400).json({ success: false, message: 'Please create an account' });
      }

      // Compare the provided password with the hashed password in the database
      const passmatch = await bcryptjs.compare(password, adminExist.password);
      if (!passmatch) {
        return res.status(400).json({ success: false, message: 'Incorrect password' });
      }

      // Verify the provided secret key
      if (secretKey !== SecretKey) {
        return res.status(400).json({ success: false, message: 'Incorrect secret key' });
      }

      // Create a JWT token with the user's information
      const payload = {
        userId: adminExist._id,
        userName: adminExist.username,
        role: 'admin',
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      return res.status(200).json({ token });
    } catch (err) {
      // Log any errors that occur during login
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Function to add a new course
  coursePost: async (req, res) => {
    try {
      const { coursename, fees, description, duration, instructor } = req.body;
      
      // Create a new course instance with the provided data
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
      // Log any errors that occur during course creation
      console.log("course post", err);
    }
  },

  // Function to retrieve all courses
  courseGet: async (req, res) => {
    try {console.log('back');
      // Find all courses in the database
      const courseData = await Coursemodel.find({});
      console.log(courseData,'popopopo');
      // Send the retrieved courses as a response
      res.status(200).json({ success: true, courses: courseData });
    } catch (err) {
      // Log any errors that occur during course retrieval
      console.log("courseGet", err);
      res.status(400).json({ success: false });
    }
  },

  // Function to retrieve a specific course by ID for editing
  editcourseGet: async (req, res) => {
    try {
      const id = req.query.courseId;
      
      // Find the course in the database by its ID
      const courseData = await Coursemodel.findOne({ _id: id });
      console.log(courseData, 'kjj');
      
      // Send the retrieved course data as a response
      res.status(200).json({ success: true, courseData: courseData });
    } catch (err) {
      // Log any errors that occur during course retrieval
      console.log(err);
      res.status(400).json({ success: false });
    }
  },

  // Function to update a specific course by ID
  editcoursePost: async (req, res) => {
    try {
      const id = req.query.courseId;
      const { coursename, description, duration, fees, instructor } = req.body;
      
      // Update the course in the database with the provided data
      const update = await Coursemodel.updateOne(
        { _id: id },
        {
          $set: {
            Coursename: coursename,
            Description: description,
            Duration: duration,
            Fees: fees,
            Instructor: instructor,
          },
        },
        { new: true }
      );

      // Send a success response after updating the course
      res.status(200).json({ success: true });
    } catch (err) {
      // Log any errors that occur during course update
      console.log(" error in editcourse post", err);
    }
  },

  // Function to delete a specific course by ID
  deleteCourse: async (req, res) => {
    try {
      const id = req.params.id;
      
      // Delete the course from the database by its ID
      await Coursemodel.deleteOne({ _id: id });
      
      // Send a success response after deleting the course
      res.status(200).json({ success: true });
    } catch (err) {
      // Log any errors that occur during course deletion
      console.log("deleteCourse", err);
    }
  },
};
