import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import createError from "http-errors";

// FUNCTION TO SEND MESSAGES
export const sendMessage = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(createError(401, "Unauthorized"));
    }

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

// FUNCTION TO GET MESSAGES
export const getMessage = async (req, res) => {
  console.log("The end point to get messages ");

  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("Error occurred while getting messages", error);
    return next(createError(500, "Internal Server Error"));
  }
};
