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
        // Fetch all documents from the collection
        const data = await CodeData.find();

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