
import mongoose from 'mongoose'

import dotenv from 'dotenv'
dotenv.config()

mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err.message);
  });
