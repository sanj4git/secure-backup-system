import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },

        otpHash : {
            type : String,
            required : true
        },

        expiresAt : {
            type : Date,
            required : true
        }

    },

    {
        timestamps : true
    }
);

export default mongoose.model("OTP", otpSchema);