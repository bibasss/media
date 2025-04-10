import mongoose from "mongoose";

const RequestToFriendsSchema = new mongoose.Schema({
    id:  Number ,
    user_id:  String,
    userName: String,
    UserLocation: String,
    userAva: String,
    sender_id: String
});

export const RequestToFriends = mongoose.model('RequestToFriends', RequestToFriendsSchema);
