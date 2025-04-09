import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id:  Number ,
  username: String,
  email: String,
  password: String,
  city: String,
  ava: String,
  role: String,
  text_about_user: String,
});

export const User = mongoose.model('User', userSchema);
