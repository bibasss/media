import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  post_header: String,
  post_type: String,
  img_src: String,
  post_text: { type: String, required: true },
  about: String,
  cost: Number,
  createdAt: String,
  user_id: Object,
  user_ava: String,
  username: String,
  like: Number,
  likedBy: Array
});


export const Post = mongoose.model('Post', postSchema);






