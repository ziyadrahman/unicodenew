import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
    place: { type: String, required: true },
});

const subCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
});

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
});

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
});

const mainSchema = new mongoose.Schema({
    branches: [branchSchema],
    subCategories: [subCategorySchema],
    categories: [categorySchema],
    items: [itemSchema],
});

const MainData = mongoose.model("MainData", mainSchema);

export default MainData;
