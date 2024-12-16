import express from 'express'
import { DatasUplaod, FetchData } from '../controller/dataController.js'
const router = express.Router()


router.post('/upload', DatasUplaod).get('/fetch-data', FetchData)

export default router