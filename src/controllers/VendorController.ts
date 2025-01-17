import { Err, ic, Ok, text } from "azle/experimental";
import { v4 as uuidv4 } from "uuid";
import { BookVendorPayload, RegisterVendorPayload, Vendor, VendorBooking } from "../datatypes/dataTypes";
import { vendorStorage, weddingStorage } from "../storage/storage";


class VendorController {
    static registerVendor = (payload: RegisterVendorPayload) => {
        try {
            const vendorId = uuidv4();
            if (vendorStorage.get(vendorId)) {
                return Err({ UnauthorizedAction: "Vendor already registered" });
            }

            const createdVendor: Vendor = {
                ...payload,
                id: vendorId,
                owner: ic.caller(),
                rating: 0n,
                reviews: [],
                bookings: [],
                verified: false,
            };

            vendorStorage.insert(vendorId, createdVendor);

            return Ok({
                message: "Vendor registered successfully",
                vendor: createdVendor,
            });
        } catch (error) {
            return Err({ UnauthorizedAction: `Registration failed: ${error}` });
        }
    }

    static bookVendor = (payload: BookVendorPayload) => {
        try {
            const wedding = weddingStorage.get(payload.weddingId);
            const vendor = vendorStorage.get(payload.vendorId);

            if (!wedding) {
                return Err({ WeddingNotFound: "Wedding not found" });
            }

            if (!vendor) {
                return Err({ VendorNotFound: "Vendor not found" });
            }

            // Check vendor availability
            if (!vendor.availability.includes(wedding.date)) {
                return Err({
                    DateUnavailable: "Vendor not available on wedding date",
                });
            }

            const vendorBooking: VendorBooking = {
                ...payload,
                status: "pending",
                date: wedding.date,
            };

            const updatedWedding = {
                ...wedding,
                vendors: [...wedding.vendors, vendorBooking],
            };

            weddingStorage.insert(payload.weddingId, updatedWedding);

            return Ok({
                message: "Vendor booked successfully",
                wedding: updatedWedding,
                vendor: vendor,
                booking: vendorBooking,
            });
        } catch (error) {
            return Err({ UnauthorizedAction: `Booking failed: ${error}` });
        }
    }
    static getVendorDetails = (vendorId: text) => {
        const vendor = vendorStorage.get(vendorId);
        if (!vendor) {
            return Err({ VendorNotFound: "Vendor not found" });
        }
        return Ok(vendor);
    }
    static searchVendors = (category: text) => {
        try {
            const matchingVendors = vendorStorage
                .values()
                .filter((vendor) => Object.keys(vendor.category)[0] === category);

            if (matchingVendors.length === 0) {
                return Err({
                    VendorNotFound: `No vendors found in the '${category}' category`,
                });
            }

            return Ok(matchingVendors);
        } catch (error: any) {
            return Err({ UnauthorizedAction: `Search failed: ${error}` });
        }
    }
    static getAllVendors = () => {
        const vendors = vendorStorage.values();

        if (vendors.length === 0) {
            // Return an empty array wrapped in Ok
            return Ok([]);
        }

        // Return the list of vendors
        return Ok(vendors);
    }
}

export default VendorController