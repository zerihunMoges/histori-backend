import mongoose from "mongoose";
export interface IFlag {
    url: string;
    country: string;
    start_year: number;
    end_year: number;
}

const FlagSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    start_year: {
        type: Number,
        required: true
    },
    end_year: {
        type: Number,
        default: null
    }
});


export const FlagModel = mongoose.model<IFlag>("Flag", FlagSchema);
