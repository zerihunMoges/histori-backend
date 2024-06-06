import { FlagModel } from './flag.model';

export class FlagRepository {
    static async createFlag(url: string, country: string, start_year: number, end_year: number | undefined) {
        return await FlagModel.create({ url, country, start_year, end_year });
    }

    static async getFlags(count: number) {
        return await FlagModel.aggregate([{ $sample: { size: count } }]);
    }
}