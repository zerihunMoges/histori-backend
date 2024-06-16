import { Report } from "./report.model";

export class ReportRepository {
    static async createReport(reporter_id: string, title: string, content_id: string, type: string, reason: string, isPopulated: boolean) {
        const report = await Report.create({ reporter_id, title, content_id, type, reason })

        if (isPopulated) {
            await report.populate("content_id")
        }

        return report
    }

    static async getReport(id: string, isPopulated: boolean) {
        const report = await Report.findById(id)

        if (isPopulated) {
            await report.populate("content_id")
        }

        return report
    }

    static async updateReport(id: string, title: string, reason: string, isPopulated: boolean) {
        const report = await Report.findByIdAndUpdate(id, { title, reason }, { new: true })

        if (isPopulated) {
            await report.populate("content_id")
        }

        return report
    }

    static async updateReportStatus(id: string, status: string, isPopulated: boolean) {
        const report = await Report.findByIdAndUpdate(id, { status }, { new: true })

        if (isPopulated) {
            await report.populate("content_id")
        }

        return report
    }

    static async getHistoryReports(reporter_id: string, country: string, category: string, start_year: string, end_year: string) {

        const reports = await Report.find({ reporter_id }).populate("content_id").sort({ updatedAt: -1 });
        return reports

        // const pipeline: any[] = [
        //     {
        //         $lookup: {
        //             from: "histories",
        //             localField: "content_id",
        //             foreignField: "_id",
        //             as: "content_id"
        //         },
        //     },
        // ];

        // pipeline.push({ $sort: { updatedAt: -1 } });

        // const matchStage = {};

        // matchStage["reporter_id"] = reporter_id;

        // if (country) {
        //     matchStage["content.country"] = country;
        // }

        // // if (start_year && end_year) {

        // //     matchStage["content.start_year"] = { $gte: start_year };
        // //     matchStage["content.end_year"] = { $lte: end_year };
        // // }

        // if (category) {
        //     matchStage["content.categories"] = { $in: [category] };
        // }

        // // Add the $match stage if any conditions are specified
        // if (Object.keys(matchStage).length > 0) {
        //     pipeline.push({ $match: matchStage });
        // }

        // var reports = await Report.aggregate(pipeline)

        // return reports
    }

    static async getAllHistoryReports(country: string, category: string, start_year: string, end_year: string) {

        const reports = await Report.find({}).populate("content_id").sort({ updatedAt: -1 });
        return reports

        // const pipeline: any[] = [
        //     {
        //         $lookup: {
        //             from: "histories",
        //             localField: "content_id",
        //             foreignField: "_id",
        //             as: "content_id"
        //         }
        //     },
        // ];

        // const matchStage = {};

        // if (country) {
        //     matchStage["content.country"] = country;
        // }

        // // if (start_year && end_year) {

        // //     matchStage["content.start_year"] = { $gte: start_year };
        // //     matchStage["content.end_year"] = { $lte: end_year };
        // // }

        // if (category) {
        //     matchStage["content.categories"] = { $in: [category] };
        // }

        // // Add the $match stage if any conditions are specified
        // if (Object.keys(matchStage).length > 0) {
        //     pipeline.push({ $match: matchStage });
        // }

        // var reports = await Report.aggregate(pipeline)

        // return reports
    }

    static async deleteReport(id: string, isPopulated: boolean) {
        const report = await Report.findByIdAndDelete(id)

        if (isPopulated) {
            await report.populate("content_id")
        }

        return report
    }
}