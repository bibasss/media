import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender_id: Object,
  getter_id: Object,
  message: String,
  createdAt: String,
  sender_ava: String,
  sender_name: String,
});

export const Message = mongoose.model('Message', messageSchema);
