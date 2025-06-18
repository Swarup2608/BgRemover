import express from 'express'
import upload from '../middlewares/multer.js'
import authUser from '../middlewares/auth.js'
import { removeBg } from '../controllers/imageController.js';

const imageRouter = express.Router();

imageRouter.post('/removeBg',upload.single('image'),authUser,removeBg)

export default imageRouter