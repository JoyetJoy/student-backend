// Import necessary modules and dependencies
const express = require('express'); // Express framework for building web applications
const mongoose = require('mongoose'); // Mongoose for MongoDB object modeling
const app = express(); // Create an Express application instance
const port = process.env.PORT || 3000; // Set the port from environment variable or default to 3000
const cors = require('cors'); // CORS middleware to enable Cross-Origin Resource Sharing
const dotenv = require('dotenv').config(); // dotenv for loading environment variables from a .env file

// Middleware to parse URL-encoded data and JSON data
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data with the querystring library
app.use(express.json()); // Parse incoming JSON requests and put the parsed data in req.body

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Enable CORS for all routes
app.use(cors());

// Import route handlers
const userRouter = require('./routers/userRouter'); // Router for user-related routes
const adminRouter = require('./routers/adminRouter'); // Router for admin-related routes

// Mount the routers on specific base paths
app.use('/', userRouter); // Mount userRouter at the root path
app.use('/admin', adminRouter); // Mount adminRouter at the '/admin' path

// Connect to the MongoDB database using Mongoose 
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to the database'); // Log success message upon successful database connection

    // Start the server after a successful database connection
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`); // Log the server URL
    });
})
.catch((err) => {
    console.error('Database connection error:', err); // Log any errors that occur during database connection
});
