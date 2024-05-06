import mongoose from "mongoose";
import { ConflictError } from "../../core/ApiError";

export interface IClaim {
    _id: mongoose.Types.ObjectId;
    claimer: mongoose.Types.ObjectId;
    report: mongoose.Types.ObjectId;
    due_date: Date;
}

const ClaimSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    claimer: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    report: {
        type: mongoose.Types.ObjectId,
        ref: "Report",
    },
    due_date: {
        type: Date,
        required: true,
    },
}, { _id: false });


const addedDays = (7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
const nearestHour = 6; // Round to nearest 6-hour mark

export function calculateDueDate() {
    const currentDate = new Date();
    const dueDate = new Date(currentDate.getTime() + addedDays);
    dueDate.setHours(Math.ceil(dueDate.getHours() / nearestHour) * nearestHour);
    return dueDate;
}

ClaimSchema.pre("save", function (next) {
    Claim.findById(this._id)
        .then(existingClaim => {
            if (existingClaim) {
                throw new ConflictError('This user already has an active claim.');
            } else {
                this.due_date = calculateDueDate();
                next();
            }
        })
        .catch(err => next(err));
});

export const Claim = mongoose.model<IClaim>("Claim", ClaimSchema);
