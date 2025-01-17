// Imports
import {
  Canister,
  Record,
  Result,
  Vec,
  nat64,
  query,
  update,
  text,
} from "azle/experimental";
import VendorController from "./controllers/VendorController";
import WeddingController from "./controllers/WeddingController";
import GuestController from "./controllers/GuestController";
import TaskController from "./controllers/TaskController";
import RegisterController from "./controllers/RegisterController";
import {
  AddRegistryItemPayload,
  AddRegistryResult,
  AddTaskPayload,
  AddTimelineItemPayload,
  ApproveRSVPPayload,
  ApproveRSVPResult,
  BookVendorPayload,
  bookVendorResult,
  CreateWeddingPayload,
  DeleteRegistryItemPayload,
  DeleteTaskPayload,
  Guest,
  GuestRSVPPayload,
  GuestRSVPResult,
  Message,
  RegisterVendorPayload,
  RegistryItem,
  Task,
  taskResult,
  TimelineItem,
  UpdateRegistryItemStatusPayload,
  updateRegistryResult,
  updateTaskResult,
  UpdateTaskStatusPayload,
  Vendor,
  VendorResult,
  Wedding,
  WeddingResult
} from "./datatypes/dataTypes";





/**
 * Canister Definition
 */

export default Canister({
  /**
   * Vendor Management
   */
  registerVendor: update(
    [RegisterVendorPayload],
    Result(VendorResult, Message),
    (payload) => {
      return VendorController.registerVendor(payload)
    }
  ),

  bookVendor: update(
    [BookVendorPayload],
    Result(
      bookVendorResult,
      Message
    ),
    (payload) => {
      return VendorController.bookVendor(payload)
    }
  ),

  /**
   * Vendor Queries
   */

  // Get Vendor Details by ID
  getVendorDetails: query([text], Result(Vendor, Message), (vendorId) => {
    return VendorController.getVendorDetails(vendorId)
  }),

  // Get Vendors by Category
  searchVendors: query([text], Result(Vec(Vendor), Message), (category) => {
    return VendorController.searchVendors(category)
  }),

  // Get ALl Vendors
  getAllVendors: query([], Result(Vec(Vendor), Message), () => {
    return VendorController.getAllVendors()
  }),

  /**
   * Wedding Management
   */
  createWedding: update(
    [CreateWeddingPayload],
    Result(WeddingResult, Message),
    (payload) => {
      return WeddingController.createWedding(payload)
    }
  ),

  /**
   * Wedding Queries
   */

  // Get Wedding Details by ID
  getWeddingDetails: query([text], Result(Wedding, Message), (weddingId) => {
    return WeddingController.getWeddingDetails(weddingId)
  }),

  // Get All Weddings
  getAllWeddings: query([], Result(Vec(Wedding), Message), () => {
    return WeddingController.getAllWeddings()
  }),

  // Get Wedding Timeline
  getWeddingTimeline: query(
    [text],
    Result(Vec(TimelineItem), Message),
    (weddingId) => {
      return WeddingController.getWeddingTimeline(weddingId)
    }
  ),

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
    Result(
      GuestRSVPResult,
      Message
    ),
    (payload) => {
      return GuestController.submitGuestRSVP(payload)
    }
  ),

  // Guest RSVP Approval and Table Assignment
  approveGuestRSVP: update(
    [ApproveRSVPPayload],
    Result(
      ApproveRSVPResult,
      Message
    ),
    (payload) => {
      return GuestController.approveGuestRSVP(payload)
    }
  ),

  /**
   * Guest Queries
   */

  // Guest List
  getGuestList: query([text], Result(Vec(Guest), Message), (weddingId) => {
    return GuestController.getGuestList(weddingId)
  }),

  // Guest RSVP List
  getGuestDetails: query(
    [text, text], // [weddingId, guestEmail]
    Result(Guest, Message),
    (weddingId, guestEmail) => {
      return GuestController.getGuestDetails(weddingId, guestEmail)
    }
  ),

  // Guest RSVP Status
  getGuestRSVPStatus: query(
    [text, text], // [weddingId, guestEmail]
    Result(text, Message),
    (weddingId, guestEmail) => {
      return GuestController.getGuestRSVPStatus(weddingId, guestEmail)
    }
  ),

  // Guest RSVP Count
  getGuestCount: query([text], Result(nat64, Message), (weddingId) => {
    return GuestController.getGuestCount(weddingId)
  }),

  /**
   * Timeline Item Management
   */
  addTimelineItem: update(
    [AddTimelineItemPayload],
    Result(
      Record({
        message: text,
        wedding: Wedding,
      }),
      Message
    ),
    (payload) => {
      return TaskController.addTimelineItem(payload)
    }
  ),

  /**
   * Task Management
   */

  // Add Task
  addTask: update(
    [AddTaskPayload],
    Result(
      taskResult,
      Message
    ),
    (payload) => {
      return TaskController.addTask(payload)
    }
  ),

  // Update Task Status
  updateTaskStatus: update(
    [UpdateTaskStatusPayload],
    Result(
      updateTaskResult,
      Message
    ),
    (payload) => {
      return TaskController.updateTaskStatus(payload)
    }
  ),

  // Delete Task
  deleteTask: update(
    [DeleteTaskPayload],
    Result(
      Record({
        message: text,
        wedding: Wedding,
      }),
      Message
    ),
    (payload) => {
      return TaskController.deleteTask(payload)
    }
  ),

  // Get Task List
  getTaskList: query([text], Result(Vec(Task), Message), (weddingId) => {
    return TaskController.getTaskList(weddingId)
  }),

  // Get Task Details
  getTaskDetails: query(
    [text, text], // [weddingId, taskId]
    Result(Task, Message),
    (weddingId, taskId) => {
      return TaskController.getTaskDetails(weddingId, taskId)
    }
  ),

  /**
   * RegistryItem Management
   */

  // Add Registry Item
  addRegistryItem: update(
    [AddRegistryItemPayload],
    Result(
      AddRegistryResult,
      Message
    ),
    (payload) => {
      return RegisterController.addRegistryItem(payload)
    }
  ),

  // Update Registry Item Status (e.g., purchased)
  updateRegistryItemStatus: update(
    [UpdateRegistryItemStatusPayload],
    Result(
      updateRegistryResult,
      Message
    ),
    (payload) => {
      return RegisterController.updateRegistryItemStatus(payload)
    }
  ),

  // Delete Registry Item
  deleteRegistryItem: update(
    [DeleteRegistryItemPayload],
    Result(
      Record({
        message: text,
        wedding: Wedding,
      }),
      Message
    ),
    (payload) => {
      return RegisterController.deleteRegistryItem(payload)
    }
  ),

  // Get Registry Items
  getRegistryItems: query(
    [text],
    Result(Vec(RegistryItem), Message),
    (weddingId) => {
      return RegisterController.getRegistryItems(weddingId)
    }
  ),

  // Get Registry Item Details
  getRegistryItemDetails: query(
    [text, text], // [weddingId, itemName]
    Result(RegistryItem, Message),
    (weddingId, itemName) => {
      return RegisterController.getRegistryItemDetails(weddingId, itemName)
    }
  ),
});
