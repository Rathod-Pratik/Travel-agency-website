import { verifyAdmin } from '@middleware/Auth.middleware';
import upload from '@middleware/Multer.middleware';
import express from 'express';
import { CreateTour, DeleteTour, GetTours, GetToursDetails, UpdateTour } from './Tour.controller';
import { TourIdValidation, TourValidation, UpdateTourValidation } from './Tour.validation';
import { Validate } from '@middleware/Validation.middleware';

const Route=express.Router();

Route.get('/',GetTours);
Route.get('/:id',Validate(TourIdValidation),GetToursDetails);
Route.post('',verifyAdmin,upload.array('image',10),Validate(TourValidation),CreateTour);
Route.put('/:id',Validate(UpdateTourValidation),verifyAdmin,upload.array('image',10),UpdateTour);
Route.delete('/:id',Validate(TourIdValidation),verifyAdmin,DeleteTour);

export default Route;