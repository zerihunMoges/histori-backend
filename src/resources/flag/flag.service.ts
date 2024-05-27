import { FlagRepository } from "./flag.repository";

export class FlagService {
    static async createFlag(url: string, country: string, start_year: number, end_year: number | undefined) {
        return await FlagRepository.createFlag(url, country, start_year, end_year);
    }

    static async getFlagsByCount(count: number) {
        return await FlagRepository.getFlags(count);
    }
}