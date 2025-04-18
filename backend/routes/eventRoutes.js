import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getUserRegisteredEvents,
} from "../controllers/eventController.js";

const router = express.Router();

// ✅ Public Routes (Available to all users)
router.get("/", getEvents); // Get all events
router.get("/:id", getEventById); // Get event details by ID

// ✅ Admin Routes (Require authentication)
router.post("/", createEvent); // Create a new event (Admin only)
router.put("/:id", updateEvent); // Update an event (Admin only)
router.delete("/:id", deleteEvent); // Delete an event (Admin only)

// ✅ Event Registration Routes
router.post("/register", registerForEvent); // Register for an event
router.post("/unregister", unregisterFromEvent);
 // Unregister from an event
router.get("/user/:userId/registered-events", getUserRegisteredEvents); // Get user's registered events

export default router;
