// Imports
import {
  Canister,
  Err,
  Ok,
  Principal,
  Record,
  Result,
  StableBTreeMap,
  Variant,
  Vec,
  Opt,
  bool,
  ic,
  nat64,
  query,
  update,
  text,
  Null,
} from "azle/experimental";
import { DECLARATION_TYPE_EXT } from "ts-jest";
import { v4 as uuidv4 } from "uuid";

/**
 * Enumerations
 */
// Service Categories
const Category = Variant({
  Venue: Null,
  Catering: Null,
  Photography: Null,
  Music: Null,
  Decor: Null,
  Planning: Null,
  Attire: Null,
  Beauty: Null,
  Transport: Null,
  Stationery: Null,
  Cake: Null,
  Favors: Null,
  Other: Null,
});

// Table Assignment Enum
const TableAssignment = Variant({
  VIPTable: nat64,
  FamilyTable: nat64,
  Table: nat64,
  Unassigned: Null,
});

/**
 * Core Types
 */

// Review Record
const Review = Record({
  author: Principal,
  rating: nat64,
  comment: text,
  date: nat64,
});

// Vendor Booking Status Enum
const VendorBookingStatus = Variant({
  Pending: Null,
  Confirmed: Null,
  Paid: Null,
  Cancelled: text,
});

// Vendor Booking Record
const VendorBooking = Record({
  id: text,
  vendorId: text,
  weddingId: text,
  weddingOffer: nat64,
  additionalDetails: Opt(text),
  status: VendorBookingStatus,
  date: text,
});

type VendorBooking = typeof VendorBooking.tsType;

// Vendor Details Record
const Vendor = Record({
  id: text,
  owner: Principal,
  name: text,
  category: Category,
  description: text,
  serviceCost: nat64,
  bookedDates: Vec(text), // Dates already booked
  rating: nat64,
  reviews: Vec(Review),
  bookings: Vec(VendorBooking),
  verified: bool,
  portfolio: Vec(text), // URLs to portfolio items
});

type Vendor = typeof Vendor.tsType;

const VendorResponse = Record({ message: text, vendor: Vendor });

// Timeline Item Status Enum
const TimelineItemStatus = Variant({
  Pending: Null,
  Completed: Null,
});

// Timeline Item Record
const TimelineItem = Record({
  weddingId: text,
  time: text,
  description: text,
  responsible: text,
  status: TimelineItemStatus,
});

type TimelineItem = typeof TimelineItem.tsType;

// Task Status Enum
const TaskStatus = Variant({
  Pending: Null,
  InProgress: Null,
  Completed: Null,
});

// Task Record
const Task = Record({
  id: text,
  title: text,
  description: text,
  deadline: text,
  assignedTo: text,
  status: TaskStatus, // "pending", "in-progress", "completed"
  budget: nat64,
});

type Task = typeof Task.tsType;

// RSVP Status Enum
const RSVPStatus = Variant({
  Pending: Null,
  Confirmed: Null,
  Declined: text,
});

// Guest Details Record
const Guest = Record({
  id: text,
  name: text,
  guestEmail: text,
  rsvpStatus: RSVPStatus, // "pending", "confirmed", "declined"
  dietaryRestrictions: text,
  plusOne: bool,
  tableAssignment: TableAssignment,
});

type Guest = typeof Guest.tsType;

// Registry Item Status Enum
const RegistryItemStatus = Variant({
  Available: Null,
  Purchased: Null,
});

// Registry Item Record
const RegistryItem = Record({
  name: text,
  description: text,
  price: nat64,
  status: RegistryItemStatus, // "available", "purchased"
  purchasedBy: text,
});

type RegistryItem = typeof RegistryItem.tsType;

// Vendor Booking Reference Record
const VendorBookingRef = Record({
  id: text,
  vendorId: text,
});

type VendorBookingRef = typeof VendorBookingRef.tsType;

// Vendor Booking Status Enum
const WeddingStatus = Variant({
  Planning: text,
  Upcoming: text,
  Completed: text,
});

// Wedding Record with all details
const Wedding = Record({
  id: text,
  coupleNames: Vec(text),
  date: text, // yyyy-mm-dd
  budget: nat64,
  location: text,
  guestCount: nat64,
  timeline: Vec(TimelineItem),
  bookings: Vec(VendorBookingRef),
  tasks: Vec(Task),
  guestList: Vec(Guest),
  registry: Vec(RegistryItem),
  status: WeddingStatus, // "planning", "upcoming", "completed"
});

type Wedding = typeof Wedding.tsType;

const WeddingMessageResponse = Record({
  message: text,
  wedding: Wedding,
});

const WeddingResponse = Record({ message: text, wedding: Wedding });

/**
 * Payload Definitions
 */

// Vendor Management Payload
const RegisterVendorPayload = Record({
  name: text,
  category: Category,
  description: text,
  serviceCost: nat64,
  portfolio: Vec(text),
});

// Wedding Planning Payload
const CreateWeddingPayload = Record({
  coupleNames: Vec(text),
  date: text, // yyyy-mm-dd
  budget: nat64,
  location: text,
  guestCount: nat64,
});

// GuestRSVP Payload
const GuestRSVPPayload = Record({
  weddingId: text,
  name: text,
  guestEmail: text,
  dietaryRestrictions: text,
  plusOne: bool,
});

const GuestRSVPResponse = Record({
  message: text,
  wedding: Wedding,
  guest: Guest,
});

// Approve RSVP Payload
const ApproveRSVPPayload = Record({
  weddingId: text,
  id: text, // Guest ID
  tableAssignment: TableAssignment,
});

// Decline RSVP Payload
const DeclineRSVPPayload = Record({
  weddingId: text,
  id: text, // Guest ID
  reason: text,
});

// Vendor Booking
const BookVendorPayload = Record({
  vendorId: text,
  weddingId: text,
  weddingOffer: nat64,
  additionalDetails: Opt(text),
});

const BookVendorResponse = Record({
  message: text,
  wedding: Wedding,
  vendor: Vendor,
  booking: VendorBooking,
});

// Update Vendor Booking
const UpdateVendorBookingPayload = Record({
  id: text, // Booking ID
  vendorId: text,
  status: VendorBookingStatus,
});

const UpdateVendorBookingResponse = Record({
  message: text,
  booking: VendorBooking,
});

// selectVendorForService Payload
const SelectVendorForServicePayload = Record({
  weddingId: text,
  vendorId: text,
  category: Category,
});

// Timeline Item Payload
const AddTimelineItemPayload = Record({
  weddingId: text,
  time: text,
  description: text,
  responsible: text,
});

// Task Payload
const AddTaskPayload = Record({
  weddingId: text,
  title: text,
  description: text,
  deadline: text,
  assignedTo: text,
  budget: nat64,
});

const TaskResponse = Record({
  message: text,
  wedding: Wedding,
  task: Task,
});

// Update Task Status Payload
const UpdateTaskStatusPayload = Record({
  weddingId: text,
  taskId: text,
  status: TaskStatus,
});

// Delete Task Payload
const DeleteTaskPayload = Record({
  weddingId: text,
  taskId: text,
});

// Add Registry Item Payload
const AddRegistryItemPayload = Record({
  weddingId: text,
  name: text,
  description: text,
  price: nat64,
});

const RegistryItemResponse = Record({
  message: text,
  wedding: Wedding,
  registryItem: RegistryItem,
});

// Update Registry Item Status Payload
const UpdateRegistryItemStatusPayload = Record({
  weddingId: text,
  itemName: text,
  status: RegistryItemStatus,
  purchasedBy: text,
});

// Delete Registry Item Payload
const DeleteRegistryItemPayload = Record({
  weddingId: text,
  itemName: text,
});

/**
 * Storage Setup
 */
const vendorStorage = StableBTreeMap<text, Vendor>(0);
const weddingStorage = StableBTreeMap<text, Wedding>(1);

// Error Variants
const Message = Variant({
  VendorNotFound: text,
  WeddingNotFound: text,
  NoTimeLineItemsFound: text,
  DateUnavailable: text,
  UnauthorizedAction: text,
  BudgetExceeded: text,
  InvalidDate: text,
  Other: text,
});

type Message = typeof Message.tsType;

/**
 * Canister Definition
 */

export default Canister({
  /**
   * Vendor Management
   */
  registerVendor: update(
    [RegisterVendorPayload],
    Result(VendorResponse, Message),
    (payload) => {
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
          bookedDates: [],
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
  ),

  bookVendor: update(
    [BookVendorPayload],
    Result(BookVendorResponse, Message),
    (payload) => {
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
        if (vendor.bookedDates.includes(wedding.date)) {
          return Err({ Other: "Vendor not available on the wedding date" });
        }

        // Check offer meets vendor's service cost
        if (payload.weddingOffer < vendor.serviceCost) {
          return Err({ Other: "Offer below vendor's service cost" });
        }

        const vendorBooking: VendorBooking = {
          ...payload,
          id: uuidv4(),
          status: { Pending: null },
          date: wedding.date,
        };

        // Update vendor's bookings
        const updatedVendor = {
          ...vendor,
          bookings: [...vendor.bookings, vendorBooking],
        };
        vendorStorage.insert(payload.vendorId, updatedVendor);

        // Update wedding's bookings
        const updatedWedding = {
          ...wedding,
          bookings: [
            ...wedding.bookings,
            {
              id: vendorBooking.id,
              vendorId: vendor.id,
            },
          ],
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
  ),

  updateBookingStatus: update(
    [UpdateVendorBookingPayload],
    Result(UpdateVendorBookingResponse, Message),
    (payload) => {
      try {
        const vendor = vendorStorage.get(payload.vendorId);

        if (!vendor) {
          return Err({ VendorNotFound: "Vendor not found" });
        }

        const booking = vendor.bookings.find((b) => b.id === payload.id);
        if (!booking) {
          return Err({ UnauthorizedAction: "Booking not found" });
        }

        // Check if the booking status is already the same
        if (Object.keys(booking.status)[0] === Object.keys(payload.status)[0]) {
          return Err({ UnauthorizedAction: "Booking status already set" });
        }

        // Check if it's already confirmed
        if (booking.status.Confirmed !== null) {
          return Err({ UnauthorizedAction: "Booking already confirmed" });
        }

        const updatedBooking: VendorBooking = {
          ...booking,
          status: payload.status,
        };
        vendor.bookings = vendor.bookings.map((b) =>
          b.id === payload.id ? updatedBooking : b
        );

        // If confirmed update booked dates
        if (payload.status.Confirmed === null) {
          vendor.bookedDates.push(booking.date);
          // Cancel other pending bookings on the same date
          vendor.bookings = vendor.bookings.map((b) => {
            if (b.date === booking.date && b.id !== booking.id) {
              return {
                ...b,
                status: { Cancelled: "No longer available" },
              };
            }
            return b;
          });
        }

        vendorStorage.insert(payload.vendorId, vendor);

        return Ok({
          message: "Vendor booking updated successfully",
          booking: updatedBooking,
        });
      } catch (error) {
        return Err({ UnauthorizedAction: `Booking update failed: ${error}` });
      }
    }
  ),

  /**
   * Vendor Queries
   */

  // Get Vendor Details by ID
  getVendorDetails: query([text], Result(Vendor, Message), (vendorId) => {
    const vendor = vendorStorage.get(vendorId);
    if (!vendor) {
      return Err({ VendorNotFound: "Vendor not found" });
    }
    return Ok(vendor);
  }),

  // Get All Vendors and can search by Category
  searchVendors: query(
    [Opt(Category)],
    Result(Vec(Vendor), Message),
    (category) => {
      try {
        if (category && category.Some) {
          const matchingVendors = vendorStorage
            .values()
            .filter(
              (vendor) =>
                Object.keys(vendor.category)[0] ===
                Object.keys(category.Some)[0]
            );

          if (matchingVendors.length === 0) {
            return Err({
              VendorNotFound: `No vendors found in the selected category`,
            });
          }
          return Ok(matchingVendors);
        }
        const allVendors = vendorStorage.values();
        if (allVendors.length === 0) {
          return Err({ VendorNotFound: "No vendors found" });
        }
        return Ok(allVendors);
      } catch (error) {
        return Err({ UnauthorizedAction: `Search failed: ${error}` });
      }
    }
  ),

  /**
   * Wedding Management
   */
  createWedding: update(
    [CreateWeddingPayload],
    Result(WeddingResponse, Message),
    (payload) => {
      try {
        if (new Date(payload.date) < new Date()) {
          return Err({ InvalidDate: "Wedding date must be in the future" });
        }

        const weddingId = uuidv4();

        const createdWedding: Wedding = {
          ...payload,
          id: weddingId,
          bookings: [],
          timeline: [],
          tasks: [],
          guestList: [],
          registry: [],
          status: { Planning: "Planning" },
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
  ),

  /**
   * Wedding Queries
   */

  // Get Wedding Details by ID
  getWeddingDetails: query([text], Result(Wedding, Message), (weddingId) => {
    const wedding = weddingStorage.get(weddingId);
    if (!wedding) {
      return Err({ WeddingNotFound: "Wedding not found" });
    }
    return Ok(wedding);
  }),

  // Get All Weddings
  getAllWeddings: query([], Result(Vec(Wedding), Message), () => {
    const weddings = weddingStorage.values();
    if (weddings.length === 0) {
      return Err({ WeddingNotFound: "No weddings found" });
    }

    return Ok(weddings);
  }),

  /**
   * Guest Management
   * RSVP Submission
   * Guest RSVP Approval
   * Table Assignment
   * Guest Queries
   * Guest RSVP Queries
   * Guest RSVP List
   * Guest RSVP Status
   * Guest RSVP Count

   */

  // Guest RSVP Submission
  submitGuestRSVP: update(
    [GuestRSVPPayload],
    Result(GuestRSVPResponse, Message),
    (payload) => {
      try {
        const wedding = weddingStorage.get(payload.weddingId);
        if (!wedding) {
          return Err({ WeddingNotFound: "Wedding not found" });
        }

        // Check if email is valid using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(payload.guestEmail)) {
          return Err({ Other: "Invalid email address" });
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

        // Check if the guest count exceeds the wedding's guest count
        if (wedding.guestList.length >= wedding.guestCount) {
          return Err({
            BudgetExceeded:
              "Guest count limit has been reached for this wedding",
          });
        }

        // Create the new guest RSVP
        const newGuest: Guest = {
          id: uuidv4(),
          ...payload,
          rsvpStatus: { Pending: null }, // Default RSVP status
          tableAssignment: { Unassigned: null }, // Default table assignment
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
          guest: newGuest,
        });
      } catch (error) {
        return Err({
          UnauthorizedAction: `Guest RSVP submission failed: ${error}`,
        });
      }
    }
  ),

  // Guest RSVP Approval and Table Assignment
  approveGuestRSVP: update(
    [ApproveRSVPPayload],
    Result(GuestRSVPResponse, Message),
    (payload) => {
      try {
        const wedding = weddingStorage.get(payload.weddingId);
        if (!wedding) {
          return Err({ WeddingNotFound: "Wedding not found" });
        }

        // Find the guest in the wedding's guest list
        const guest = wedding.guestList.find((g) => g.id === payload.id);
        if (!guest) {
          return Err({
            UnauthorizedAction: "Guest not found in the wedding list",
          });
        }

        // Update the guest's RSVP status and table assignment
        const updatedGuest: Guest = {
          ...guest,
          rsvpStatus: { Confirmed: null },
          tableAssignment: { ...payload.tableAssignment },
        };

        // Update the wedding's guest list
        const updatedGuestList = wedding.guestList.map((g) =>
          g.id === payload.id ? updatedGuest : g
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
          guest: updatedGuest,
        });
      } catch (error) {
        return Err({ UnauthorizedAction: `Failed to approve RSVP: ${error}` });
      }
    }
  ),

  declineGuestRSVP: update(
    [DeclineRSVPPayload],
    Result(GuestRSVPResponse, Message),
    (payload) => {
      try {
        const wedding = weddingStorage.get(payload.weddingId);
        if (!wedding) {
          return Err({ WeddingNotFound: "Wedding not found" });
        }

        // Find the guest in the wedding's guest list
        const guest = wedding.guestList.find((g) => g.id === payload.id);
        if (!guest) {
          return Err({
            UnauthorizedAction: "Guest not found in the wedding list",
          });
        }

        // Update the guest's RSVP status
        const updatedGuest: Guest = {
          ...guest,
          rsvpStatus: { Declined: payload.reason },
        };

        // Update the wedding's guest list
        const updatedGuestList = wedding.guestList.map((g) =>
          g.id === payload.id ? updatedGuest : g
        );

        const updatedWedding: Wedding = {
          ...wedding,
          guestList: updatedGuestList,
        };

        // Save the updated wedding
        weddingStorage.insert(payload.weddingId, updatedWedding);

        return Ok({
          message: "RSVP declined successfully",
          wedding: updatedWedding,
          guest: updatedGuest,
        });
      } catch (error) {
        return Err({ UnauthorizedAction: `Failed to decline RSVP: ${error}` });
      }
    }
  ),

  /**
   * Guest Queries
   */

  // Guest List
  getGuestList: query([text], Result(Vec(Guest), Message), (weddingId) => {
    const wedding = weddingStorage.get(weddingId);
    if (!wedding) {
      return Err({ WeddingNotFound: "Wedding not found" });
    }
    return Ok(wedding.guestList);
  }),

  // Guest RSVP List
  getGuestDetails: query(
    [text, text], // [weddingId, guestEmail]
    Result(Guest, Message),
    (weddingId, guestEmail) => {
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
  ),

  // Guest RSVP Status
  getGuestRSVPStatus: query(
    [text, text], // [weddingId, guestEmail]
    Result(RSVPStatus, Message),
    (weddingId, guestEmail) => {
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
  ),

  // Guest RSVP Count
  getGuestCount: query([text], Result(nat64, Message), (weddingId) => {
    const wedding = weddingStorage.get(weddingId);
    if (!wedding) {
      return Err({ WeddingNotFound: "Wedding not found" });
    }

    return Ok(BigInt(wedding.guestList.length));
  }),

  /**
   * Timeline Item Management
   */

  // Get Wedding Timeline
  getWeddingTimeline: query(
    [text],
    Result(Vec(TimelineItem), Message),
    (weddingId) => {
      const wedding = weddingStorage.get(weddingId);

      if (!wedding) {
        return Err({ WeddingNotFound: "Wedding not found" });
      }

      // Check if the timeline is empty
      if (wedding.timeline.length === 0) {
        return Err({
          NoTimeLineItemsFound: "No timeline items for this wedding",
        });
      }

      return Ok(wedding.timeline);
    }
  ),

  addTimelineItem: update(
    [AddTimelineItemPayload],
    Result(WeddingMessageResponse, Message),
    (payload) => {
      const wedding = weddingStorage.get(payload.weddingId);
      if (!wedding) {
        return Err({ WeddingNotFound: "Wedding not found" });
      }

      // Check time not clashing
      const known = wedding.timeline.find((item) => {
        if (item.time === payload.time) {
          return item;
        }
      });
      if (known) {
        return Err({
          DateUnavailable: "Timeline item already exists at this time",
        });
      }

      const timelineItem: TimelineItem = {
        ...payload,
        status: { Pending: null },
      };

      const updatedWedding = {
        ...wedding,
        timeline: [...wedding.timeline, timelineItem],
      };

      weddingStorage.insert(payload.weddingId, updatedWedding);

      return Ok({
        message: "Timeline item added successfully",
        wedding: updatedWedding,
      });
    }
  ),

  /**
   * Task Management
   */

  // Add Task
  addTask: update(
    [AddTaskPayload],
    Result(TaskResponse, Message),
    (payload) => {
      try {
        const wedding = weddingStorage.get(payload.weddingId);
        if (!wedding) {
          return Err({ WeddingNotFound: "Wedding not found" });
        }

        const newTask: Task = {
          id: uuidv4(),
          title: payload.title,
          description: payload.description,
          deadline: payload.deadline,
          assignedTo: payload.assignedTo,
          status: { Pending: null },
          budget: payload.budget,
        };

        const updatedWedding: Wedding = {
          ...wedding,
          tasks: [...wedding.tasks, newTask],
        };

        weddingStorage.insert(payload.weddingId, updatedWedding);

        return Ok({
          message: "Task added successfully",
          wedding: updatedWedding,
          task: newTask,
        });
      } catch (error) {
        return Err({ UnauthorizedAction: `Failed to add task: ${error}` });
      }
    }
  ),

  // Update Task Status
  updateTaskStatus: update(
    [UpdateTaskStatusPayload],
    Result(TaskResponse, Message),
    (payload) => {
      try {
        const wedding = weddingStorage.get(payload.weddingId);
        if (!wedding) {
          return Err({ WeddingNotFound: "Wedding not found" });
        }

        const taskIndex = wedding.tasks.findIndex(
          (task) => task.id === payload.taskId
        );
        if (taskIndex === -1) {
          return Err({ UnauthorizedAction: "Task not found" });
        }

        const updatedTask: Task = {
          ...wedding.tasks[taskIndex],
          status: payload.status,
        };

        const updatedWedding: Wedding = {
          ...wedding,
          tasks: [
            ...wedding.tasks.slice(0, taskIndex),
            updatedTask,
            ...wedding.tasks.slice(taskIndex + 1),
          ],
        };

        weddingStorage.insert(payload.weddingId, updatedWedding);

        return Ok({
          message: "Task status updated successfully",
          wedding: updatedWedding,
          task: updatedTask,
        });
      } catch (error) {
        return Err({
          UnauthorizedAction: `Failed to update task status: ${error}`,
        });
      }
    }
  ),

  // Delete Task
  deleteTask: update(
    [DeleteTaskPayload],
    Result(WeddingMessageResponse, Message),
    (payload) => {
      try {
        const wedding = weddingStorage.get(payload.weddingId);
        if (!wedding) {
          return Err({ WeddingNotFound: "Wedding not found" });
        }

        const updatedTasks = wedding.tasks.filter(
          (task) => task.id !== payload.taskId
        );
        if (updatedTasks.length === wedding.tasks.length) {
          return Err({ UnauthorizedAction: "Task not found" });
        }

        const updatedWedding: Wedding = {
          ...wedding,
          tasks: updatedTasks,
        };

        weddingStorage.insert(payload.weddingId, updatedWedding);

        return Ok({
          message: "Task deleted successfully",
          wedding: updatedWedding,
        });
      } catch (error) {
        return Err({ UnauthorizedAction: `Failed to delete task: ${error}` });
      }
    }
  ),

  // Get Task List
  getTaskList: query([text], Result(Vec(Task), Message), (weddingId) => {
    const wedding = weddingStorage.get(weddingId);
    if (!wedding) {
      return Err({ WeddingNotFound: "Wedding not found" });
    }
    return Ok(wedding.tasks);
  }),

  // Get Task Details
  getTaskDetails: query(
    [text, text], // [weddingId, taskId]
    Result(Task, Message),
    (weddingId, taskId) => {
      const wedding = weddingStorage.get(weddingId);
      if (!wedding) {
        return Err({ WeddingNotFound: "Wedding not found" });
      }

      const task = wedding.tasks.find((task) => task.id === taskId);
      if (!task) {
        return Err({ UnauthorizedAction: "Task not found" });
      }

      return Ok(task);
    }
  ),

  /**
   * RegistryItem Management
   */

  // Add Registry Item
  addRegistryItem: update(
    [AddRegistryItemPayload],
    Result(RegistryItemResponse, Message),
    (payload) => {
      try {
        const wedding = weddingStorage.get(payload.weddingId);
        if (!wedding) {
          return Err({ WeddingNotFound: "Wedding not found" });
        }

        // Check if the item already exists
        const existingItem = wedding.registry.find(
          (item) => item.name === payload.name
        );
        if (existingItem) {
          return Err({
            Other: "Registry item already exists",
          });
        }

        const newRegistryItem: RegistryItem = {
          name: payload.name,
          description: payload.description,
          price: payload.price,
          status: { Available: null }, // Default status
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
          registryItem: newRegistryItem,
        });
      } catch (error) {
        return Err({
          UnauthorizedAction: `Failed to add registry item: ${error}`,
        });
      }
    }
  ),

  // Update Registry Item Status (e.g., purchased)
  updateRegistryItemStatus: update(
    [UpdateRegistryItemStatusPayload],
    Result(RegistryItemResponse, Message),
    (payload) => {
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
          registryItem: updatedRegistryItem,
        });
      } catch (error) {
        return Err({
          UnauthorizedAction: `Failed to update registry item status: ${error}`,
        });
      }
    }
  ),

  // Delete Registry Item
  deleteRegistryItem: update(
    [DeleteRegistryItemPayload],
    Result(WeddingMessageResponse, Message),
    (payload) => {
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
  ),

  // Get Registry Items
  getRegistryItems: query(
    [text],
    Result(Vec(RegistryItem), Message),
    (weddingId) => {
      const wedding = weddingStorage.get(weddingId);
      if (!wedding) {
        return Err({ WeddingNotFound: "Wedding not found" });
      }
      return Ok(wedding.registry);
    }
  ),

  // Get Registry Item Details
  getRegistryItemDetails: query(
    [text, text], // [weddingId, itemName]
    Result(RegistryItem, Message),
    (weddingId, itemName) => {
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
  ),
});
