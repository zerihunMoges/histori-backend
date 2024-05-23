import { Request, Response } from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { handleErrorResponse } from '../../helpers/errorHandle';
import { FlagService } from './flag.service';

export default class FlagController {
    static async createFlag(req: Request, res: Response) {
        try {
            const { url, country, start_year, end_year } = req.body;

            const flag = await FlagService.createFlag(url, country, parseInt(start_year), parseInt(end_year));

            return new SuccessResponse('Flag created successfully', flag).send(res);
        } catch (error) {
            handleErrorResponse(error, res);
        }
    }
    static async getFlagsByCount(req: Request, res: Response) {
        try {
            const { count } = req.params;

            const flags = await FlagService.getFlagsByCount(parseInt(count));

            return new SuccessResponse('Flags retrieved successfully', flags).send(res);
        } catch (error) {
            handleErrorResponse(error, res);
        }
    }
}