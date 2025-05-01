import express from 'express'
import { AddContact, DeleteContact, GetContact } from '../Controller/contact.controller.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const route=express.Router();

route.post('/AddContact',AddContact);
route.get('/GetContact',verifyAdmin,GetContact);
route.delete('/DeleteContact/:_id',verifyAdmin,DeleteContact);

export default route