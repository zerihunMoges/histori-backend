import { Request, Response } from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { handleErrorResponse } from '../../helpers/errorHandle';
import { FlagService } from './flag.service';

export default class FlagController {
    static async createFlag(req: Request, res: Response) {
        try {
            const { url, country, start_year, end_year } = req.body;

            const flag = await FlagService.createFlag(url, country, parseInt(start_year), parseInt(end_year));

            const data = {
                flag: flag
            }

            return new SuccessResponse('Flag created successfully', data).send(res);
        } catch (error) {
            handleErrorResponse(error, res);
        }
    }
    static async getFlagsByCount(req: Request, res: Response) {
        try {
            const count = req.query.count as string;

            const flags = await FlagService.getFlagsByCount(count ? parseInt(count) : 4);

            const data = {
                flags: flags
            }

            return new SuccessResponse('Flags retrieved successfully', data).send(res);
        } catch (error) {
            handleErrorResponse(error, res);
        }
    }
}