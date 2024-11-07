import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import createError from "http-errors"; // For error handling

export const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    conversation.messages.push(newMessage._id);

    await Promise.all([conversation.save(), newMessage.save()]);

    return res.status(200).json({
      status: "success",
      message: "Message sent successfully",
      conversation: {
        _id: conversation._id,
        participants: conversation.participants,
        messages: conversation.messages,
      },
    });
  } catch (error) {
    console.error("Error occurred while sending message:", error);
    return next(createError(500, "Internal Server Error"));
  }
};
