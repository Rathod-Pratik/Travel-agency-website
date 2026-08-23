import Transport from "winston-transport";
import { LogModel } from "./Log.model";

class MongoTransport extends Transport {

    async log(info: any, callback: () => void) {

        // Tell Winston that logging has started
        setImmediate(() => {
            this.emit("logged", info);
        });

        try {
            // Store the log in MongoDB
            await LogModel.create({
                level: info.level,
                message: info.message,
                metadata: info.metadata,
            });
        } catch (error) {
            console.error("Failed to save log:", error);
        }

        callback();
    }
}

export default MongoTransport;