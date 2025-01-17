import { v4 as uuidv4 } from "uuid";
import { CreateWeddingPayload, Wedding } from "../datatypes/dataTypes"
import { Err, Ok, text } from "azle/experimental";
import { weddingStorage } from "../storage/storage";



class WeddingController {
    static createWedding = (payload: CreateWeddingPayload) => {
        const time = new Date().toISOString();
        try {
            if (payload.date < time) {
                return Err({ InvalidDate: "Wedding date must be in the future" });
            }

            const weddingId = uuidv4();

            const createdWedding: Wedding = {
                ...payload,
                id: weddingId,
                vendors: [],
                timeline: [],
                tasks: [],
                guestList: [],
                registry: [],
                status: "planning",
            };

            weddingStorage.insert(weddingId, createdWedding);

            return Ok({
                message: "Wedding created successfully",
                wedding: createdWedding,
            });
        } catch (error) {
            return Err({ UnauthorizedAction: `Wedding creation failed: ${error}` });
        }
    }

    static getWeddingDetails = (weddingId: text) => {
        const wedding = weddingStorage.get(weddingId);
        if (!wedding) {
            return Err({ WeddingNotFound: "Wedding not found" });
        }
        return Ok(wedding);
    }
    static getAllWeddings = () => {
        const weddings = weddingStorage.values();
        if (weddings.length === 0) {
            return Err({ WeddingNotFound: "No weddings found" });
        }

        return Ok(weddings);
    }
    static getWeddingTimeline = (weddingId: text) => {
        const wedding = weddingStorage.get(weddingId);
        if (!wedding) {
            return Err({ WeddingNotFound: "Wedding not found" });
        }

        // Check if the timeline is empty
        if (wedding.timeline.length === 0) {
            return Err({ NoTimeLineItemsFound: "No timeline items for this wedding" });
        }

        return Ok(wedding.timeline);
    }
}

export default WeddingController