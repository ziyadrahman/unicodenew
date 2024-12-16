import mongoose from "mongoose";
const codeSchema = new mongoose.Schema({
  branchName: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  half: { type: String, required: true },
  year: { type: Number, required: true },
  itemCode: { type: String, required: true },
  size: { type: Number, required: true },
  quantity: { type: Number, required: true },
  codes: { type: [String], required: true, unique: true }, // array of generated codes
});

const CodeData = mongoose.model('CodeData', codeSchema);
export default CodeData;
