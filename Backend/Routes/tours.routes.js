import express from 'express';
import { getTours, getToursData, MakeTour, UpdateTour } from '../Controller/tours.controller.js';
import { upload } from '../middlewares/multer.middlewate.js';

const router=express.Router();

router.get('/',getTours);
router.get('/{id}',getToursData);
router.post('/',upload.array('image'),MakeTour);
router.put('/{id}',upload.array('image'),UpdateTour);
router.delete('/{id}',UpdateTour);

export default router;