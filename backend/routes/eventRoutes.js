import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();

router.route("/").get(getEvents)
// router.route("/post").post(createEvent);
router.route("/:id").get(getEventById);

export default router;
