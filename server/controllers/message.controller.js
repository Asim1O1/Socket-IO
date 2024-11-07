import Conversation from "../models/conversation.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: [],
    });
  } catch (error) {
    console.error("The error occurred while sending message", error);
    return next(createError(400, error.details[0].message));
  }
};
