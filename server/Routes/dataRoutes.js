import express from 'express'
import { DatasUplaod, FetchAllData, FetchData, UpdateBranch, UpdateCategory, UpdateItem, UpdateSubCategory } from '../controller/dataController.js'
const router = express.Router()


router.post('/upload', DatasUplaod).post('/add_branch', UpdateBranch).post('/add_category', UpdateCategory).post('/add_subcategory', UpdateSubCategory).post('/add_item', UpdateItem)
router.get('/fetchAllData', FetchAllData).get('/fetch-data', FetchData)

export default router
