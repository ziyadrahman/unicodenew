import express from 'express'
import { userLogin, userLogout, userSignup, verifyJWT } from '../controller/userController.js'
const router = express.Router()

router.post('/signup', userSignup).post('/login', userLogin).get('/logout', userLogout).get('/verifyjwt', verifyJWT)


export default router