import { CreateContactJobData } from "./Contact.types";
import { Worker } from "bullmq";
import { bellmqConnection } from "@config/redis";
import { ContactModel } from "./Contact.model";
import { logger } from "@modules/log/logger";
import { incrementCacheVersion } from "@utils/index";
import { ContactCacheKeys } from "@utils/index";
import { createNotification } from "@modules/Notification/Notification.service";

export const ContactCreateWorker = new Worker<CreateContactJobData>(
    "contact-creation", async (job) => {
        const { name, email, mobile, message, userid, requestId } = job.data;
        logger.info("Contact Worker: Proceessing contact creation job", {
            metadata: {
                name,
                email,
                mobile,
                message,
                userid,
                requestId
            }
        }
        );
        const existingContact = await ContactModel.findOne({
            requestId
        })
        if (existingContact) {
            logger.info("Contact Worker:Contact with requestId already exists. skipping creation", {
                metadata: {
                    requestId,
                    contactId: existingContact._id
                }
            })
            return {
                contactId: existingContact._id,
                alreadyCreated: true
            }
        }

        const contact = await ContactModel.create({
            name,
            email,
            mobile,
            message,
            userid,
            requestId
        })
        await incrementCacheVersion(ContactCacheKeys.listVersion());
        await createNotification({
            userId: userid,
            message: "Your contact request has been received. We will get back to you shortly.",
            type: "info"
        })
        logger.info("Contact Worker:Contact created successfully", {
            metadata: {
                contactId: contact._id
            }
        })
        return {
            contactId: contact._id,
            alreadyCreated: false
        }
    }, {
    connection: bellmqConnection,
    concurrency: 5
}
)