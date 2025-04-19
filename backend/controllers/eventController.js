import Event from "../models/Event.js";
import User from "../models/User.js";
import Alumni from "../models/Alumni.js";

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get a single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private (Admin)
export const createEvent = async (req, res) => {
  try {
    console.log("Incoming data:", req.body); // Log what you receive
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error("Create Event Error:", error.message); // This is key!
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
};


// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Admin)
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ message: "Invalid data" });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Admin)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Register a user for an event
// @route   POST /api/events/:id/register
// @access  Private (Students & Alumni)
export const registerForEvent = async (req, res) => {
  try {
    const { email, role ,eventId} = req.body;
    
    if (!email || !role || !eventId) {
      return res.status(400).json({ message: "Email, role, and eventId are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    let user;
    if (role === "student") {
      user = await User.findOne({ email });
    } else if (role === "alumni") {
      user = await Alumni.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.registeredEvents?.includes(eventId)) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    user.registeredEvents = [...(user.registeredEvents || []), eventId];
    await user.save();

    event.registeredUsers = [...(event.registeredUsers || []), email];
    await event.save();

    return res.status(200).json({
      message: "Successfully registered for the event",
      eventId: event._id
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const unregisterFromEvent = async (req, res) => {
  console.log("🚀 Unregister called with body:", req.body);
  try {
    const { email, role, eventId } = req.body;

    if (!email || !role || !eventId) {
      return res.status(400).json({ message: "Email, role, and eventId are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    let user;
    if (role === "student") {
      user = await User.findOne({ email });
    } else if (role === "alumni") {
      user = await Alumni.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("Before unregister:", user.registeredEvents);

    user.registeredEvents = (user.registeredEvents || []).filter(
      id => id.toString() !== eventId
    );
    await user.save();

    event.registeredUsers = (event.registeredUsers || []).filter(
      userEmail => userEmail !== email
    );
    await event.save();

    res.status(200).json({ message: "User successfully unregistered from the event" });
  } catch (error) {
    console.error("Unregistration Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};




// @desc    Get user's registered events
// @route   GET /api/events/user/:userId/registered-events
// @access  Private (Students & Alumni)
export const getUserRegisteredEvents = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("registeredEvents");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.registeredEvents);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
