import { Err, Ok, text } from "azle/experimental";
import { AddRegistryItemPayload, DeleteRegistryItemPayload, RegistryItem, UpdateRegistryItemStatusPayload, Wedding } from "../datatypes/dataTypes"
import { weddingStorage } from "../storage/storage";



class RegisterController {
    static addRegistryItem = (payload: AddRegistryItemPayload) => {
        try {
            const wedding = weddingStorage.get(payload.weddingId);
            if (!wedding) {
                return Err({ WeddingNotFound: "Wedding not found" });
            }

            const newRegistryItem: RegistryItem = {
                name: payload.name,
                description: payload.description,
                price: payload.price,
                status: "available", // Default status for a new registry item
                purchasedBy: "", // Default empty purchaser
            };

            const updatedWedding: Wedding = {
                ...wedding,
                registry: [...wedding.registry, newRegistryItem],
            };

            weddingStorage.insert(payload.weddingId, updatedWedding);

            return Ok({
                message: "Registry item added successfully",
                wedding: updatedWedding,
                newRegistryItem,
            });
        } catch (error) {
            return Err({
                UnauthorizedAction: `Failed to add registry item: ${error}`,
            });
        }
    }

    static updateRegistryItemStatus = (payload: UpdateRegistryItemStatusPayload) => {
        try {
            const wedding = weddingStorage.get(payload.weddingId);
            if (!wedding) {
                return Err({ WeddingNotFound: "Wedding not found" });
            }

            const itemIndex = wedding.registry.findIndex(
                (item) => item.name === payload.itemName
            );
            if (itemIndex === -1) {
                return Err({ UnauthorizedAction: "Registry item not found" });
            }

            const updatedRegistryItem: RegistryItem = {
                ...wedding.registry[itemIndex],
                status: payload.status,
                purchasedBy: payload.purchasedBy || "",
            };

            const updatedWedding: Wedding = {
                ...wedding,
                registry: [
                    ...wedding.registry.slice(0, itemIndex),
                    updatedRegistryItem,
                    ...wedding.registry.slice(itemIndex + 1),
                ],
            };

            weddingStorage.insert(payload.weddingId, updatedWedding);

            return Ok({
                message: "Registry item status updated successfully",
                wedding: updatedWedding,
                updatedRegistryItem,
            });
        } catch (error) {
            return Err({
                UnauthorizedAction: `Failed to update registry item status: ${error}`,
            });
        }
    }

    static deleteRegistryItem = (payload: DeleteRegistryItemPayload) => {
        try {
            const wedding = weddingStorage.get(payload.weddingId);
            if (!wedding) {
                return Err({ WeddingNotFound: "Wedding not found" });
            }

            const updatedRegistry = wedding.registry.filter(
                (item) => item.name !== payload.itemName
            );
            if (updatedRegistry.length === wedding.registry.length) {
                return Err({ UnauthorizedAction: "Registry item not found" });
            }

            const updatedWedding: Wedding = {
                ...wedding,
                registry: updatedRegistry,
            };

            weddingStorage.insert(payload.weddingId, updatedWedding);

            return Ok({
                message: "Registry item deleted successfully",
                wedding: updatedWedding,
            });
        } catch (error) {
            return Err({
                UnauthorizedAction: `Failed to delete registry item: ${error}`,
            });
        }
    }

    static getRegistryItemDetails = (weddingId: text, itemName: text) => {
        const wedding = weddingStorage.get(weddingId);
        if (!wedding) {
            return Err({ WeddingNotFound: "Wedding not found" });
        }

        const registryItem = wedding.registry.find(
            (item) => item.name === itemName
        );
        if (!registryItem) {
            return Err({ UnauthorizedAction: "Registry item not found" });
        }

        return Ok(registryItem);
    }
    static getRegistryItems = (weddingId: text) => {
        const wedding = weddingStorage.get(weddingId);
        if (!wedding) {
            return Err({ WeddingNotFound: "Wedding not found" });
        }
        return Ok(wedding.registry);
    }

}

export default RegisterController