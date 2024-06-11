import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import { config } from "../../config";
import { ForbiddenError } from "../core/ApiError";
import { AuthFailureResponse } from "../core/ApiResponse";
import { handleErrorResponse } from "../helpers/errorHandle";
import { User } from "../resources/user/user.model";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token !== undefined) {
    try {
      const payload = JWT.verify(token, config.jwt.secret);
      const _id = JSON.parse(JSON.stringify(payload));

      const user = await User.findById(_id);

      if (!user) {
        return res.status(403).json({ message: "User does not exist." });
      }

      res.locals.user = user;

      return next();

    } catch (error) {
      console.log(error);
      return new AuthFailureResponse("Token Error Occurred").send(res);
    }
  }
  return new AuthFailureResponse("Token Error Occurred").send(res);
}

export function permit(...allowed: string[]) {
  return (req: Request,
    res: Response,
    next: NextFunction) => {
    const user = res.locals.user;
    if (user && allowed.includes(user.role)) {
      return next();
    }
    handleErrorResponse(new ForbiddenError("Access Denied"), res);
  };
}