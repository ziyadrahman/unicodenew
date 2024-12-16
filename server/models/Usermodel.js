import mongoose from 'mongoose';


// Define user schema with role field
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user', // Default to 'user' if not provided
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});





const User = mongoose.model('User', userSchema);

export default User;
