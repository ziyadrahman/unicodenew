import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';
import cookieParser from 'cookie-parser'
import generateUniqueCode from './utils/codeGenerator.js'; // Import code generator
import CodeData from './models/formData.js'; // Mongoose model
import Dataroute from './Routes/dataRoutes.js';
import './db/connect.js'; // Import the database connection
import UserRouter from './Routes/UserRoute.js';



const app = express();


app.use(express.json());
app.use(cookieParser()); // To parse JSON requests
app.use(
  cors({
    origin: 'https://unicode-mu.vercel.app',
    credentials: true
  })
);


// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// =====================
// Routes
// =====================

/**
 * @route   POST /api/upload-csv
 * @desc    Upload CSV file and save records to MongoDB
 * @access  Public
 */
app.post('/api/upload-csv', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const filePath = path.join(__dirname, req.file.path);
    const records = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Log the parsed data for debugging
        console.log('Parsed CSV row:', data);

        // Adjust these keys as per your CSV structure
        const record = {
          branchName: data.branchName,
          category: data.category,
          subCategory: data.subCategory,
          half: data.half,
          year: data.year,
          itemCode: data.itemCode,
          size: data.size,
          // quantity is optional; if not provided, it will be calculated based on grouping
          quantity: data.quantity ? parseInt(data.quantity, 10) : null,
        };
        records.push(record);
      })
      .on('end', async () => {
        try {
          const { savedRecords, failedRecords } = await saveRecordsCSV(records);
          // Optionally delete the uploaded file after processing
          fs.unlinkSync(filePath);
          res.status(200).json({
            message: 'File processed successfully!',
            totalRecords: records.length,
            savedRecordsCount: savedRecords.length,
            failedRecordsCount: failedRecords.length,
            savedRecords,
            failedRecords
          });
        } catch (err) {
          console.error('Error saving records:', err);
          res.status(500).json({ error: err.message || 'Failed to process CSV data' });
        }
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err);
        res.status(500).json({ error: 'Error reading CSV file.' });
      });
  } catch (error) {
    console.error('Error processing file:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * @route   POST /api/upload
 * @desc    Upload JSON data (array of records) and save to MongoDB
 * @access  Public
 */
app.use('/api', Dataroute)
app.use('/api/user', UserRouter)









/**
 * @route   GET /api/fetch-data
 * @desc    Fetch all records from MongoDB and return grouped data
 * @access  Public
 */


// =====================
// Helper Functions
// =====================

/**
 * Save an array of records to MongoDB for CSV uploads
 * Groups records by prefix and calculates quantity
 * @param {Array} records - Array of record objects
 * @returns {Object} - Object containing arrays of saved and failed records
 */
async function saveRecordsCSV(records) {
  const prefixMap = new Map();

  // Group records by prefix
  records.forEach((record, index) => {
    const { branchName, category, subCategory, half, year, itemCode, size } = record;

    // Construct the prefix based on your specific logic
    const prefix = `${category}${subCategory}${half}${year}${itemCode}${size}`;

    if (prefixMap.has(prefix)) {
      prefixMap.get(prefix).push({ ...record, originalIndex: index + 1 });
    } else {
      prefixMap.set(prefix, [{ ...record, originalIndex: index + 1 }]);
    }
  });

  const groupedRecords = Array.from(prefixMap.entries()).map(([prefix, groupRecords]) => {
    return {
      prefix,
      records: groupRecords,
      quantity: groupRecords.length,
    };
  });

  const savedRecords = [];
  const failedRecords = [];

  // Process each group
  for (const group of groupedRecords) {
    const { records: groupRecords, quantity, prefix } = group;

    try {
      // Generate unique codes based on quantity
      const generatedCodes = await Promise.all(
        Array.from({ length: quantity }).map(() => generateUniqueCode())
      );

      // Construct final codes by appending unique codes
      const finalCodes = generatedCodes.map((uniqueCode) => `${prefix}${uniqueCode}`);

      // Assuming all records in the group have the same fields except 'codes'
      const { branchName, category, subCategory, half, year, itemCode, size } = groupRecords[0];

      const newData = new CodeData({
        branchName,
        category,
        subCategory,
        half,
        year: parseInt(year, 10),
        itemCode,
        size: parseInt(size, 10),
        quantity,
        codes: finalCodes, // Store final calculated codes
      });

      await newData.save();

      // If saved successfully, add to savedRecords with some identifier
      savedRecords.push({
        prefix,
        quantity,
        savedAt: newData.createdAt,
      });
    } catch (saveError) {
      console.error(`Error saving group with prefix ${prefix}:`, saveError);

      // Add to failedRecords with detailed information
      groupRecords.forEach(record => {
        failedRecords.push({
          originalIndex: record.originalIndex,
          recordData: record,
          error: saveError.message || 'Unknown error',
        });
      });
    }
  }

  return { savedRecords, failedRecords };
}

/**
 * Save an array of records to MongoDB for manual uploads
 * Processes each record individually
 * @param {Array} records - Array of record objects
 * @returns {Object} - Object containing arrays of saved and failed records
 */
async function saveRecordsManual(records) {
  const savedRecords = [];
  const failedRecords = [];

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const { branchName, category, subCategory, half, year, itemCode, size, quantity } = record;

    // Validate required fields
    if (!branchName || !category || !subCategory || !half || !year || !itemCode || !size || !quantity) {
      failedRecords.push({
        index: i + 1,
        record,
        error: 'Missing required fields.',
      });
      continue;
    }

    // Ensure year is 2-digit
    if (!/^\d{2}$/.test(String(year))) {
      failedRecords.push({
        index: i + 1,
        record,
        error: 'Invalid year format. Expected a 2-digit number.',
      });
      continue;
    }

    const parsedYear = parseInt(year, 10);
    const parsedSize = parseInt(size, 10);
    const parsedQuantity = parseInt(quantity, 10);

    if (isNaN(parsedYear) || isNaN(parsedSize) || isNaN(parsedQuantity)) {
      failedRecords.push({
        index: i + 1,
        record,
        error: 'Invalid numeric values for year, size, or quantity.',
      });
      continue;
    }

    try {
      // Generate unique codes for the quantity
      const generatedCodes = await Promise.all(
        Array.from({ length: parsedQuantity }).map(() => generateUniqueCode())
      );

      // Generate final calculated codes
      const finalCodes = generatedCodes.map((uniqueCode) =>
        `${subCategory}${category}${half}${year}${itemCode}${size}${uniqueCode}`
      );

      const newData = new CodeData({
        branchName,
        category,
        subCategory,
        half,
        year: parsedYear,
        itemCode,
        size: parsedSize,
        quantity: parsedQuantity,
        codes: finalCodes, // Store final calculated codes
      });

      await newData.save();

      savedRecords.push({
        index: i + 1,
        record: newData,
      });
    } catch (saveError) {
      console.error(`Error saving record ${i + 1}:`, saveError.message);
      failedRecords.push({
        index: i + 1,
        record,
        error: saveError.message || 'Failed to save record.',
      });
    }
  }

  return { savedRecords, failedRecords };
}

// =====================
// Start Server
// =====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
