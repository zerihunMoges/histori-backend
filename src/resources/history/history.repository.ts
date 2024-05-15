import { InternalError } from "../../core/ApiError";
import { TempHistory } from "./history.model";

export async function createTempHistoryRepo({
    title,
    country,
    start_year,
    end_year,
    content,
    categories,
    sources }) {
    try {
        const tempHistory = new TempHistory({
            title,
            country,
            start_year,
            end_year,
            content,
            categories,
            sources,
        });

        await tempHistory.save();

        return tempHistory;
    } catch (error) {
        throw new InternalError(error)
    }
}

export async function updateTempHistoryRepo({
    _id,
    title,
    country,
    start_year,
    end_year,
    content,
    categories,
    sources }) {
    try {
        const tempHistory = await TempHistory.findByIdAndUpdate(_id, {
            title,
            country,
            start_year,
            end_year,
            content,
            categories,
            sources
        });

        return tempHistory;
    } catch (error) {
        throw new InternalError(error)
    }
}

export async function deleteTempHistoryRepo({ _id }) {
    try {
        const tempHistory = await TempHistory.findByIdAndDelete(_id);

        return tempHistory;
    } catch (error) {
        throw new InternalError(error)
    }
}

export async function getTempHistoryRepo({ _id }) {
    try {
        const tempHistory = await TempHistory.findById(_id);

        return tempHistory;
    } catch (error) {
        throw new InternalError(error)
    }
}