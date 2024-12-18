import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';
import cookieParser from 'cookie-parser';
import generateUniqueCode from './utils/codeGenerator.js'; // Import code generator
import CodeData from './models/formData.js'; // Mongoose model
import Dataroute from './Routes/dataRoutes.js';
import './db/connect.js'; // Import the database connection
import UserRouter from './Routes/UserRoute.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import userouter from './Routes/UserRoute.js';
import router from './Routes/dataRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDirectory = path.join(__dirname, 'uploads');

const app = express();

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = ['https://unicodenew.vercel.app'];

app.use(cors({
  origin: allowedOrigins, // Allow requests from this URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
// Ensure the 'uploads' directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'text/csv') {
      return cb(new Error('Only CSV files are allowed'), false);
    }
    cb(null, true);
  },
});

// Routes
app.post('/api/upload-csv', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const filePath = req.file.path;
    const records = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Map CSV fields to expected field names
        const mappedData = {
          branchName: data['branchName'] || data['Branch Name'],
          category: data['Category'],
          subCategory: data['Subcategory'] || data['Sub Category'],
          half: data['Half Value'] || data['Half'],
          year: data['Year'],
          itemCode: data['Item Code'] || data['ItemCode'],
          size: data['Size'],
        };

        // Validate required fields
        const requiredFields = ['branchName', 'category', 'subCategory', 'half', 'year', 'itemCode', 'size'];
        const missingFields = requiredFields.filter((field) => !mappedData[field]);

        if (missingFields.length > 0) {
          console.error('Missing required fields in record:', mappedData, 'Missing:', missingFields);
          return;
        }

        // Parse and validate numeric fields
        const parsedYear = parseInt(mappedData.year, 10);
        const parsedSize = parseInt(mappedData.size, 10);

        if (isNaN(parsedYear) || isNaN(parsedSize)) {
          console.error(`Invalid year or size at prefix: ${mappedData.category}${mappedData.subCategory}${mappedData.half}${mappedData.year}${mappedData.itemCode}${mappedData.size}`);
          return;
        }

        // Add validated record
        records.push({
          ...mappedData,
          year: parsedYear,
          size: parsedSize,
          quantity: data.quantity ? parseInt(data.quantity, 10) : null,
        });
      })
      .on('end', async () => {
        try {
          const { savedRecords, failedRecords } = await saveRecordsCSV(records);
          fs.unlinkSync(filePath);
          res.status(200).json({
            message: 'File processed successfully!',
            totalRecords: records.length,
            savedRecordsCount: savedRecords.length,
            failedRecordsCount: failedRecords.length,
            savedRecords,
            failedRecords,
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
app.use('/api/user',userouter)
app.use('/api',router)
// Helper function
async function saveRecordsCSV(records) {
  const prefixMap = new Map();

  records.forEach((record, index) => {
    const { branchName, category, subCategory, half, year, itemCode, size } = record;
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

  for (const group of groupedRecords) {
    const { records: groupRecords, quantity, prefix } = group;

    try {
      const generatedCodes = await Promise.all(
        Array.from({ length: quantity }).map(() => generateUniqueCode())
      );

      const finalCodes = generatedCodes.map((uniqueCode) => `${prefix}${uniqueCode}`);
      const { branchName, category, subCategory, half, year, itemCode, size } = groupRecords[0];

      const parsedYear = parseInt(year, 10);
      const parsedSize = parseInt(size, 10);

      if (isNaN(parsedYear) || isNaN(parsedSize)) {
        throw new Error(`Invalid values for year or size at prefix: ${prefix}`);
      }

      const newData = new CodeData({
        branchName: branchName || '',
        category: category || '',
        subCategory: subCategory || '',
        half: half || '',
        year: parsedYear,
        itemCode: itemCode || '',
        size: parsedSize,
        quantity,
        codes: finalCodes,
      });

      await newData.save();

      savedRecords.push({
        prefix,
        quantity,
        savedAt: newData.createdAt,
      });
    } catch (saveError) {
      console.error(`Error saving group with prefix ${prefix}:`, saveError);

      groupRecords.forEach((record) => {
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
