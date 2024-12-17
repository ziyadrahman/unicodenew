import MainData from "../models/BranchModel.js";
import CodeData from "../models/formData.js";
import generateUniqueCode from "../utils/codeGenerator.js";

export const DatasUplaod = async (req, res) => {
    try {
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ error: 'Invalid payload format. Expected an array of records.' });
        }

        const { savedRecords, failedRecords } = await saveRecordsManual(req.body);
        res.status(200).json({
            message: 'Data processed successfully!',
            totalRecords: req.body.length,
            savedRecordsCount: savedRecords.length,
            failedRecordsCount: failedRecords.length,
            savedRecords,
            failedRecords
        });
    } catch (error) {
        console.error('Error in /api/upload:', error.stack || error.message);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};


export const FetchData = async (req, res) => {
    try {
        // Fetch documents sorted by createdAt in descending order (newest first)
        const data = await CodeData.find().sort({ createdAt: -1 }); // -1 means descending order

        // Group data by unique product details
        const groupedData = data.reduce((acc, item) => {
            const key = `${item.branchName}-${item.category}-${item.subCategory}-${item.half}-${item.year}-${item.itemCode}-${item.size}`;
            if (!acc[key]) {
                acc[key] = {
                    branchName: item.branchName,
                    category: item.category,
                    subCategory: item.subCategory,
                    half: item.half,
                    year: item.year,
                    itemCode: item.itemCode,
                    size: item.size,
                    quantity: item.quantity,
                    codes: [...item.codes],
                };
            } else {
                acc[key].codes.push(...item.codes);
            }

            return acc;
        }, {});

        const groupedArray = Object.values(groupedData);

        res.status(200).json({
            total: groupedArray.length,
            data: groupedArray,
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};


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



export const UpdateBranch = async (req, res) => {
    try {
        const { place } = req.body;

        // Validate input
        if (!place) {
            return res.status(400).json({
                message: "Place is required",
            });
        }

        // Find the existing MainData document or create a new one
        let mainData = await MainData.findOne();
        if (!mainData) {
            mainData = new MainData({
                branches: [{ place }],
                subCategories: [],
                categories: [],
                items: [],
            });
        } else {
            // Prevent duplicate places (optional check)
            const isDuplicate = mainData.branches.some(branch => branch.place === place);
            if (isDuplicate) {
                return res.status(400).json({
                    message: "Branch already exists",
                });
            }

            // Add the new branch
            mainData.branches.push({ place });
        }

        // Save the updated document
        await mainData.save();

        // Send success response
        res.status(201).json({
            message: "Branch added successfully",
            data: mainData,
        });
    } catch (error) {
        console.error("Error adding branch:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};



export const UpdateCategory = async (req, res) => {
    try {
        const { name, code } = req.body;

        if (!name || !code) {
            return res.status(400).json({
                message: "Both name and code are required",
            });
        }

        let mainData = await MainData.findOne();
        if (!mainData) {
            mainData = new MainData({
                branches: [],
                subCategories: [],
                categories: [{ name, code }],
                items: [],
            });
        } else {
            const isDuplicate = mainData.categories.some(category => category.name === name && category.code === code);
            if (isDuplicate) {
                return res.status(400).json({
                    message: "Category already exists",
                });
            }

            mainData.categories.push({ name, code });
        }

        await mainData.save();

        res.status(201).json({
            message: "Category added successfully",
            data: mainData,
        });
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};



export const UpdateSubCategory = async (req, res) => {
    try {
        const { name, code } = req.body;

        if (!name || !code) {
            return res.status(400).json({
                message: "Both name and code are required",
            });
        }

        let mainData = await MainData.findOne();
        if (!mainData) {
            mainData = new MainData({
                branches: [],
                subCategories: [{ name, code }],
                categories: [],
                items: [],
            });
        } else {
            const isDuplicate = mainData.subCategories.some(subCategory => subCategory.name === name && subCategory.code === code);
            if (isDuplicate) {
                return res.status(400).json({
                    message: "Subcategory already exists",
                });
            }

            mainData.subCategories.push({ name, code });
        }

        await mainData.save();

        res.status(201).json({
            message: "Subcategory added successfully",
            data: mainData,
        });
    } catch (error) {
        console.error("Error adding subcategory:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};


export const UpdateItem = async (req, res) => {
    try {
        const { name, code } = req.body;

        // Validate input
        if (!name || !code) {
            return res.status(400).json({
                message: "Both name and code are required",
            });
        }

        // Find the existing MainData document or create a new one
        let mainData = await MainData.findOne();
        if (!mainData) {
            mainData = new MainData({
                branches: [],
                subCategories: [],
                categories: [],
                items: [{ name, code }],
            });
        } else {
            // Prevent duplicate items (optional check)
            const isDuplicate = mainData.items.some(item => item.name === name && item.code === code);
            if (isDuplicate) {
                return res.status(400).json({
                    message: "Item already exists",
                });
            }

            // Add the new item
            mainData.items.push({ name, code });
        }

        // Save the updated document
        await mainData.save();

        // Send success response
        res.status(201).json({
            message: "Item added successfully",
            data: mainData,
        });
    } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};



export const FetchAllData = async (req, res) => {
    try {
        // Fetch all documents from the MainData collection
        const mainData = await MainData.find();

        // If no data is found
        if (!mainData || mainData.length === 0) {
            return res.status(404).json({
                message: "No data found",
            });
        }

        // Send the fetched data as response
        res.status(200).json({
            message: "Data fetched successfully",
            data: mainData,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};
