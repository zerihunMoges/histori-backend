import { ReportRepository } from "./report.repository";

export class ReportService {
    static async createReport(reporter_id: string, title: string, content_id: string, type: string, reason: string, isPopulated: boolean = false) {
        const report = await ReportRepository.createReport(reporter_id, title, content_id, type, reason, isPopulated)
        return report
    }

    static async getReport(id: string, isPopulated: boolean = false) {
        const report = await ReportRepository.getReport(id, isPopulated)
        return report
    }

    static async updateReport(id: string, title: string, reason: string, isPopulated: boolean = false) {
        const report = await ReportRepository.updateReport(id, title, reason, isPopulated)
        return report
    }

    static async updateReportStatus(id: string, status: string, isPopulated: boolean = false) {
        const report = await ReportRepository.updateReportStatus(id, status, isPopulated)
        return report
    }

    static async getHistoryReports(reporter_id: string, country: string, category: string, start_year: string, end_year: string) {
        const report = await ReportRepository.getHistoryReports(reporter_id, country, category, start_year, end_year)

        return report
    }

    static async getAllHistoryReports(country: string, category: string, start_year: string, end_year: string) {
        const report = await ReportRepository.getAllHistoryReports(country, category, start_year, end_year)

        return report
    }

    static async deleteReport(id: string, isPopulated: boolean = false) {
        const report = await ReportRepository.deleteReport(id, isPopulated)
        return report
    }
}