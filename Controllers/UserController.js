const signupModel = require('../Models/UserSignupmodel');
const bcryptjs = require('bcryptjs');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;


module.exports={
    signupPost : async (req, res) => {
        try {
        const {username, email, phonenumber, password,confirmpassword} = req.body;
        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = new signupModel({
        username,
        email,
        phonenumber,
        password: hashedPassword,
        });

        const validatingemail = emailRegex.test(email);
        const validatingpassword = passwordRegex.test(password);
        const signupDatas = await signupModel.find();
        // Check if user already exists
        const userExist = await signupModel.findOne({ email });console.log(userExist);
        if (userExist) {
        return res.status(400).json({ message: 'Email is already registered' });
        }else if (!username || !email || !password || !phonenumber) {
        return res.status(400).json({ message: 'All fields are required' });
        } else if(password!==confirmpassword){
            return res.status(400).json({ message: 'Password and Confirm Password are not same'})
        }else if (!validatingemail) {
        return res.status(400).json({ message: 'Please enter a valid email' });
        } else if (!validatingpassword) {
        return res.status(400).json({ message: 'Please enter a valid password' });
        } else {
        await newUser.save();
        return res.status(201).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
    },
    
}
