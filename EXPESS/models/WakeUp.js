import mongoose from "mongoose";

const wakeupChema = new mongoose.Schema({
    email: String,
    createdAt: String,

});

export const WakeUp = mongoose.model('WakeUp', wakeupChema);
