import express from 'express';
import { getTours, getToursData, MakeTour, UpdateTour,DeleteTour } from '../Controller/tours.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { checkAdminCookie } from '../middlewares/auth.middleware.js';

const router=express.Router();

router.get('/',getTours);
router.get('/data/:_id',getToursData);
router.post('/',checkAdminCookie,upload.array('image'),MakeTour);
router.put('/:_id',checkAdminCookie,upload.array('image'),UpdateTour);
router.delete('/:_id',DeleteTour);

export default router;