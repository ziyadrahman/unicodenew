import User from "../models/Usermodel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config()
export const userSignup = async (req, res) => {
    try {
        const { fullName, email, password, userName } = req.body;

        // Check if all fields are provided
        if (!fullName || !email || !password || !userName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the email is already registered
        const checkEmailUser = await User.findOne({ email });
        if (checkEmailUser) {
            return res.status(400).json({ message: 'User email already registered', email });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user
        const newUser = await User.create({
            fullName,
            email,
            userName,
            password: hashedPassword,
        });

        // Send a success response with user details (excluding password)
        res.status(201).json({
            message: 'User signup successful',
            user: {
                fullName: newUser.fullName,
                userName: newUser.userName,
                email: newUser.email,
            },
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

}


export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if email is registered
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User email not registered' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }




        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, userName: user.userName },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set token in a cookie
    res.cookie('token', token, {
  httpOnly: true, 
  secure: true, // Set to true in production to enforce HTTPS
  sameSite: 'none', // Allows cross-origin requests
});


        // Send response
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                userName: user.userName,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


export const userLogout = (req, res) => {
    try {

        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== 'development',
        });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during logout', error: error.message });
    }
};



export const verifyJWT = async (req, res) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user in the database
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send user data
        res.status(200).json({ message: "Token is valid", user });
    } catch (error) {
        console.error("JWT verification error:", error.message);
        res.status(401).json({ message: "Invalid or expired token", error: error.message });
    }
};
