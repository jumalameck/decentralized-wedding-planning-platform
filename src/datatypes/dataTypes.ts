// Imports
import {
    Principal,
    Record,
    Variant,
    Vec,
    Opt,
    bool,
    nat64,
    text,
} from "azle/experimental";


/**
 * Enumerations
 */
// Service Categories
export const Category = Variant({
    Venue: text,
    Catering: text,
    Photography: text,
    Music: text,
    Decor: text,
    Planning: text,
    Attire: text,
    Beauty: text,
    Transport: text,
    Stationery: text,
    Cake: text,
    Favors: text,
    Other: text,
});

export type Category = typeof Category.tsType

// Table Assignment Enum
export const TableAssignment = Variant({
    VIPTable: text,
    familyTable: text,
    Table1: text,
    Table2: text,
    Table3: text,
    Table4: text,
    Table5: text,
    Table6: text,
    Table7: text,
    Table8: text,
    Table9: text,
    Table10: text,
    unassigned: text,
});
export type TableAssignment = typeof TableAssignment.tsType
/**
 * Core Types
 */

// Review Record
export const Review = Record({
    author: Principal,
    rating: nat64,
    comment: text,
    date: nat64,
});
export type Review = typeof Review.tsType
// Vendor Details Record
export const Vendor = Record({
    id: text,
    owner: Principal,
    name: text,
    category: Category,
    description: text,
    serviceCost: nat64,
    availability: Vec(text), // ISO timestamps of available dates
    rating: nat64,
    reviews: Vec(Review),
    bookings: Vec(Principal), // wedding IDs
    verified: bool,
    portfolio: Vec(text), // URLs to portfolio items
});

export type Vendor = typeof Vendor.tsType;

// Vendor Booking Record
export const VendorBooking = Record({
    vendorId: text,
    weddingId: text,
    weddingOffer: nat64,
    additionalDetails: Opt(text),
    status: text, // "pending", "confirmed", "paid"
    date: text,
});

export type VendorBooking = typeof VendorBooking.tsType;

// Timeline Item Record
export const TimelineItem = Record({
    weddingId: text,
    time: text,
    description: text,
    responsible: text,
    status: text, // "pending", "completed"
});

export type TimelineItem = typeof TimelineItem.tsType;

// Task Record
export const Task = Record({
    id: text,
    title: text,
    description: text,
    deadline: text,
    assignedTo: text,
    status: text, // "pending", "in-progress", "completed"
    budget: nat64,
});

export type Task = typeof Task.tsType;

// Guest Details Record
export const Guest = Record({
    name: text,
    guestEmail: text,
    rsvpStatus: text, // "pending", "confirmed", "declined"
    dietaryRestrictions: text,
    plusOne: bool,
    tableAssignment: TableAssignment,
});

export type Guest = typeof Guest.tsType;

// Registry Item Record
export const RegistryItem = Record({
    name: text,
    description: text,
    price: nat64,
    status: text, // "available", "purchased"
    purchasedBy: text,
});

export type RegistryItem = typeof RegistryItem.tsType;

// Wedding Record with all details
export const Wedding = Record({
    id: text,
    coupleNames: Vec(text),
    date: text,
    budget: nat64,
    location: text,
    guestCount: nat64,
    vendors: Vec(VendorBooking),
    timeline: Vec(TimelineItem),
    tasks: Vec(Task),
    guestList: Vec(Guest),
    registry: Vec(RegistryItem),
    status: text, // "planning", "upcoming", "completed"
});

export type Wedding = typeof Wedding.tsType;

/**
 * Payload Definitions
 */

// Vendor Management Payload
export const RegisterVendorPayload = Record({
    name: text,
    category: Category,
    description: text,
    serviceCost: nat64,
    availability: Vec(text),
    portfolio: Vec(text),
});
export type RegisterVendorPayload = typeof RegisterVendorPayload.tsType
// Wedding Planning Payload
export const CreateWeddingPayload = Record({
    coupleNames: Vec(text),
    date: text,
    budget: nat64,
    location: text,
    guestCount: nat64,
});
export type CreateWeddingPayload = typeof CreateWeddingPayload.tsType
// GuestRSVP Payload
export const GuestRSVPPayload = Record({
    weddingId: text,
    name: text,
    guestEmail: text,
    dietaryRestrictions: text,
    plusOne: bool,
});
export type GuestRSVPPayload = typeof GuestRSVPPayload.tsType
// Approve RSVP Payload
export const ApproveRSVPPayload = Record({
    weddingId: text,
    guestEmail: text,
    tableAssignment: TableAssignment,
});
export type ApproveRSVPPayload = typeof ApproveRSVPPayload.tsType
// Vendor Booking
export const BookVendorPayload = Record({
    vendorId: text,
    weddingId: text,
    weddingOffer: nat64,
    additionalDetails: Opt(text),
});
export type BookVendorPayload = typeof BookVendorPayload.tsType
// selectVendorForService Payload
export const SelectVendorForServicePayload = Record({
    weddingId: text,
    vendorId: text,
    category: Category,
});
export type SelectVendorForServicePayload = typeof SelectVendorForServicePayload.tsType
// Timeline Item Payload
export const AddTimelineItemPayload = Record({
    weddingId: text,
    time: text,
    description: text,
    responsible: text,
    status: text,
});

export type AddTimelineItemPayload = typeof AddTimelineItemPayload.tsType
// Task Payload
export const AddTaskPayload = Record({
    weddingId: text,
    title: text,
    description: text,
    deadline: text,
    assignedTo: text,
    budget: nat64,
});
export type AddTaskPayload = typeof AddTaskPayload.tsType
// Update Task Status Payload
export const UpdateTaskStatusPayload = Record({
    weddingId: text,
    taskId: text,
    status: text,
});
export type UpdateTaskStatusPayload = typeof UpdateTaskStatusPayload.tsType
// Delete Task Payload
export const DeleteTaskPayload = Record({
    weddingId: text,
    taskId: text,
});

export type DeleteTaskPayload = typeof DeleteTaskPayload.tsType
// Add Registry Item Payload
export const AddRegistryItemPayload = Record({
    weddingId: text,
    name: text,
    description: text,
    price: nat64,
});
export type AddRegistryItemPayload = typeof AddRegistryItemPayload.tsType
// Update Registry Item Status Payload
export const UpdateRegistryItemStatusPayload = Record({
    weddingId: text,
    itemName: text,
    status: text,
    purchasedBy: text,
});
export type UpdateRegistryItemStatusPayload = typeof UpdateRegistryItemStatusPayload.tsType
// Delete Registry Item Payload
export const DeleteRegistryItemPayload = Record({
    weddingId: text,
    itemName: text,
});
export type DeleteRegistryItemPayload = typeof DeleteRegistryItemPayload.tsType

// Error Variants
export const Message = Variant({
    VendorNotFound: text,
    WeddingNotFound: text,
    NoTimeLineItemsFound: text,
    DateUnavailable: text,
    UnauthorizedAction: text,
    BudgetExceeded: text,
    InvalidDate: text,
});

export type Message = typeof Message.tsType;

//add Type 

export const VendorResult = Record({ message: text, vendor: Vendor })
export type VendorResult = typeof VendorResult.tsType

export const bookVendorResult = Record({
    message: text,
    wedding: Wedding,
    vendor: Vendor,
    booking: VendorBooking,
})
export type bookVendorResult = typeof bookVendorResult.tsType

export const WeddingResult = Record({ message: text, wedding: Wedding })
export type WeddingResult = typeof WeddingResult.tsType

export const GuestRSVPResult = Record({
    message: text,
    wedding: Wedding,
    newGuest: Guest,
})
export type GuestRSVPResult = typeof GuestRSVPResult.tsType

export const ApproveRSVPResult = Record({
    message: text,
    wedding: Wedding,
    updatedGuest: Guest,
})

export type ApproveRSVPResult = typeof ApproveRSVPResult.tsType

export const taskResult = Record({
    message: text,
    wedding: Wedding,
    newTask: Task,
})
export type taskResult = typeof taskResult.tsType

export const updateTaskResult = Record({
    message: text,
    wedding: Wedding,
    updatedTask: Task,
})

export type updateTaskResult = typeof updateTaskResult.tsType

export const AddRegistryResult = Record({
    message: text,
    wedding: Wedding,
    newRegistryItem: RegistryItem,
})
export type AddRegistryResult = typeof AddRegistryResult.tsType

export const updateRegistryResult = Record({
    message: text,
    wedding: Wedding,
    updatedRegistryItem: RegistryItem,
})
export type updateRegistryResult = typeof updateRegistryResult.tsType