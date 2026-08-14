import mongoose,{ model, Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true
        },
        refreshToken: {
            type: String
        },
        ticketsGiven: {
            type: Number,
            default: 0
        },
        ticketsReceived: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model("User", userSchema)