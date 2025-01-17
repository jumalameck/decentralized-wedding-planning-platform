import { Err, Ok, text } from "azle/experimental";
import { ApproveRSVPPayload, Guest, GuestRSVPPayload, Wedding } from "../datatypes/dataTypes"
import { weddingStorage } from "../storage/storage";



class GuestController {
    static submitGuestRSVP = (payload: GuestRSVPPayload) => {
        try {
            const wedding = weddingStorage.get(payload.weddingId);
            if (!wedding) {
                return Err({ WeddingNotFound: "Wedding not found" });
            }

            // Check if the guest already exists
            const existingGuest = wedding.guestList.find(
                (g) => g.guestEmail === payload.guestEmail
            );
            if (existingGuest) {
                return Err({
                    UnauthorizedAction: "Guest RSVP already submitted",
                });
            }

            // Create the new guest RSVP
            const newGuest: Guest = {
                ...payload,
                rsvpStatus: "pending", // Default RSVP status for submission
                tableAssignment: { unassigned: "Unassigned" }, // Default table assignment
            };

            // Update the wedding's guest list
            const updatedWedding: Wedding = {
                ...wedding,
                guestList: [...wedding.guestList, newGuest],
            };

            // Save the updated wedding details
            weddingStorage.insert(payload.weddingId, updatedWedding);

            return Ok({
                message: "Guest RSVP submitted successfully",
                wedding: updatedWedding,
                newGuest: newGuest,
            });
        } catch (error) {
            return Err({
                UnauthorizedAction: `Guest RSVP submission failed: ${error}`,
            });
        }
    }

    static approveGuestRSVP = (payload: ApproveRSVPPayload) => {
        try {
            const wedding = weddingStorage.get(payload.weddingId);
            if (!wedding) {
                return Err({ WeddingNotFound: "Wedding not found" });
            }

            // Find the guest in the wedding's guest list
            const guest = wedding.guestList.find(
                (g) => g.guestEmail === payload.guestEmail
            );
            if (!guest) {
                return Err({
                    UnauthorizedAction: "Guest not found in the wedding list",
                });
            }

            // Update the guest's RSVP status and table assignment
            const updatedGuest: Guest = {
                ...guest,
                rsvpStatus: "confirmed",
                tableAssignment: { ...payload.tableAssignment },
            };

            // Update the wedding's guest list
            const updatedGuestList = wedding.guestList.map((g) =>
                g.guestEmail === payload.guestEmail ? updatedGuest : g
            );

            const updatedWedding: Wedding = {
                ...wedding,
                guestList: updatedGuestList,
            };

            // Save the updated wedding
            weddingStorage.insert(payload.weddingId, updatedWedding);

            return Ok({
                message: "RSVP approved and table assigned successfully",
                wedding: updatedWedding,
                updatedGuest: updatedGuest,
            });
        } catch (error) {
            return Err({ UnauthorizedAction: `Failed to approve RSVP: ${error}` });
        }
    }

    static getGuestList = (weddingId: text) => {
        const wedding = weddingStorage.get(weddingId);
        if (!wedding) {
            return Err({ WeddingNotFound: "Wedding not found" });
        }
        return Ok(wedding.guestList);
    }

    static getGuestDetails = (weddingId: text, guestEmail: text) => {
        const wedding = weddingStorage.get(weddingId);
        if (!wedding) {
            return Err({ WeddingNotFound: "Wedding not found" });
        }

        const guest = wedding.guestList.find((g) => g.guestEmail === guestEmail);
        if (!guest) {
            return Err({
                UnauthorizedAction: "Guest not found in the wedding list",
            });
        }

        return Ok(guest);
    }

    static getGuestRSVPStatus = (weddingId: text, guestEmail: text) => {
        const wedding = weddingStorage.get(weddingId);
        if (!wedding) {
            return Err({ WeddingNotFound: "Wedding not found" });
        }

        const guest = wedding.guestList.find((g) => g.guestEmail === guestEmail);
        if (!guest) {
            return Err({
                UnauthorizedAction: "Guest not found in the wedding list",
            });
        }

        return Ok(guest.rsvpStatus);
    }
    static getGuestCount = (weddingId: text) => {
        const wedding = weddingStorage.get(weddingId);
        if (!wedding) {
            return Err({ WeddingNotFound: "Wedding not found" });
        }

        return Ok(BigInt(wedding.guestList.length));
    }
}

export default GuestController