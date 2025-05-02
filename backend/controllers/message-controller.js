import Message from "../models/message-model.js";

// Save a new message
export const createMessage = async (req, res) => {
  try {
    const { userId, name, email, image, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Name, email, and message are required." });
    }

    const newMessage = new Message({ userId, name, email, image, message });
    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ message: "Failed to send message." });
  }
};

// Get all messages (for admin)
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages." });
    console.log(error);
  }
};

// delete message
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    res.status(200).json({
      message: "Message deleted successfully",
      deletedMessage: message,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete message.", error });
  }
};

// Allow to show message on site
export const toggleShowOnSite = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);

    if (!message) return res.status(404).json({ message: "Message not found" });

    message.showOnSite = !message.showOnSite;
    await message.save();

    res
      .status(200)
      .json({ message: "Visibility toggled", showOnSite: message.showOnSite });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to toggle visibility", error: err });
  }
};
