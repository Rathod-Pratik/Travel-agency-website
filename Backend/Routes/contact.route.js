import express from 'express'
import { AddContact, DeleteContact, GetContact } from '../Controller/contact.controller.js';

const route=express.Router();

route.post('/AddContact',AddContact);
route.get('/GetContact',GetContact);
route.delete('/DeleteContact/:_id',DeleteContact);

export default route