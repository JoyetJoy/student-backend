const express = require('express');
const mongoose = require('mongoose'); // Make sure to install mongoose using `npm install mongoose`
const app = express();
const port = process.env.PORT || 3000;
const cors=require('cors');
const dotenv=require('dotenv').config()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(cors())
console.log('hiiii');
// Example route
const userRouter=require('./routers/userRouter')
const adminRouter=require('./routers/adminRouter')

app.use('/',userRouter);
app.use('/admin',adminRouter);


// Connect to the database
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => {
    console.log('Connected to the database');
}).catch((err) => {
    console.error('Database connection error:', err);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});