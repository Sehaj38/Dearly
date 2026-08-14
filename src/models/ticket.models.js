import mongoose,{ Schema } from "mongoose";

const TicketSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        reciever: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "redeemed", "expired"],
            default: "pending"
        },
        validTill: {
            type: Date,
            required: true 
        },
        reedemedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
)

export const Ticket = mongoose.model("Ticket", TicketSchema)