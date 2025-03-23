import Event from "../models/Event.js";
import User from "../models/User.js";

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
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: "Invalid data" });
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
    console.log("Received Registration Request:", req.body); // ✅ Debugging

    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // ✅ Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Find event by ID
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    console.log("User Found:", user);
    console.log("Event Found:", event);

    // ✅ Check if user is already registered
    if (user.registeredEvents.includes(event._id)) {
      return res.status(400).json({ message: "User already registered for this event" });
    }

    // ✅ Add event to user's registered events list
    user.registeredEvents.push(event._id);
    await user.save();

    // ✅ Add student email to event's `registeredUsers` list
    event.registeredUsers.push(email);
    await event.save();

    res.status(200).json({ 
      message: "User successfully registered for the event", 
      eventId: event._id 
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// @desc    Unregister a user from an event
// @route   DELETE /api/events/:id/unregister
// @access  Private (Students & Alumni)
export const unregisterFromEvent = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find event by ID
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Remove event from user's registeredEvents list
    user.registeredEvents = user.registeredEvents.filter(eventId => eventId.toString() !== event._id.toString());
    await user.save();

    // Remove user email from event's registeredUsers list
    event.registeredUsers = event.registeredUsers.filter(userEmail => userEmail !== email);
    await event.save();

    res.status(200).json({ message: "User successfully unregistered from the event" });

  } catch (error) {
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
