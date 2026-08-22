import { verifyAdmin } from '@middleware/Auth.middleware';
import upload from '@middleware/Multer.middleware';
import express from 'express';
import { CreateTour, DeleteTour, GetTours, GetToursDetails, UpdateTour } from './Tour.controller';
import { TourIdValidation, TourValidation } from './Tour.validation';
import { Validate } from '@middleware/Validation.middleware';

const Route=express.Router();

Route.get('/tour?page=:page&limit=:limit',Validate(TourValidation),GetTours);
Route.get('/tour/:id',Validate(TourIdValidation),GetToursDetails);
Route.post('/tour',verifyAdmin,upload.array('image',10),CreateTour);
Route.put('/tour/:id',Validate(TourIdValidation),verifyAdmin,upload.array('image',10),UpdateTour);
Route.delete('/tour/:id',Validate(TourIdValidation),verifyAdmin,DeleteTour);

export default Route;