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

    static async getHistoryReports(reporter_id: string, country: string, category: string, start_year: string, end_year: string, type: string) {

        const reports = await Report.find({ reporter_id, type }).populate("content_id").sort({ updatedAt: -1 });
        return reports
    }

    static async getAllHistoryReports(country: string, category: string, start_year: string, end_year: string, type: string) {

        const reports = await Report.find({ type }).populate("content_id").sort({ updatedAt: -1 });
        return reports
    }

    static async getMapReports(reporter_id: string, type: string) {

        const reports = await Report.find({ reporter_id, type }).populate("content_id").sort({ updatedAt: -1 });
        return reports
    }

    static async getAllMapReports(type: string) {

        const reports = await Report.find({ type }).populate("content_id").sort({ updatedAt: -1 });
        return reports
    }

    static async deleteReport(id: string, isPopulated: boolean) {
        const report = await Report.findByIdAndDelete(id)

        if (isPopulated) {
            await report.populate("content_id")
        }

        return report
    }
}