/* eslint-disable @typescript-eslint/no-unused-vars */
import { Response } from 'express'
import {
  ApiResponse,
  InternalErrorResponse,
  ResponseStatus,
  BadRequestResponse,
  NotFoundResponse,
  ForbiddenResponse,
  ConflictResponse,
} from '../core/ApiResponse'
import{ BadRequestError,
NotFoundError,
ForbiddenError,
ConflictError} from '../core/ApiError'

export function handleErrorResponse<T extends ApiResponse>(
  error: any,
  res: Response,
  _defaultStatus: ResponseStatus = ResponseStatus.INTERNAL_ERROR
): Response {
  if (error instanceof ApiResponse) {
    return error.send(res)
  }

  if (error instanceof BadRequestError) {
    return new BadRequestResponse(error.message).send(res)
  } else if (error instanceof NotFoundError) {
    return new NotFoundResponse(error.message).send(res)
  } else if (error instanceof ForbiddenError) {
    return new ForbiddenResponse(error.message).send(res)
  } else if (error instanceof ConflictError) {
    return new ConflictResponse(error.message).send(res)
  } else {
    return new InternalErrorResponse(error.message).send(res)
  }
}
