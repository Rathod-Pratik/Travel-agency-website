import {z} from "zod";

export const CreateContactSchema = z.object({
    userid: z.string().min(1, "User ID is required"),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    mobile: z.string().min(1, "Mobile number is required"),
    message: z.string().min(1, "Message is required"),
})

export const ContactIdSchema = z.object({
    id: z.string().min(1, "Contact ID is required"),
});