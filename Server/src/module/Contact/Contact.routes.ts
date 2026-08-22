import express from 'express'
import { AddContact, DeleteContact, GetContact } from './Contact.controller';
import { verifyAdmin, verifyUser } from '@middleware/Auth.middleware';
import { Validate } from '@middleware/Validation.middleware';
import { CreateContactSchema,ContactIdSchema } from './Contact.validation';


const route=express.Router();

route.post('/contact',Validate(CreateContactSchema),verifyUser,AddContact);
route.get('/contact?page=:page&limit=:limit',verifyAdmin,GetContact);
route.delete('/contact/:id',Validate(ContactIdSchema),verifyAdmin,DeleteContact);

export default route