import JWT from "jsonwebtoken";
import { User } from "../resources/user/user.model";
import { Request, Response, NextFunction } from "express";
import { config } from "../../config";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token !== undefined) {
    try {
      const payload = JWT.verify(token, config.jwtSecret);
      const _id = JSON.parse(JSON.stringify(payload));

      const user = await User.findById(_id);

      if (!user) {
        return res.status(403).json({ message: "User does not exist." });
      }

      res.locals.user = user;

      return next();

    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Unexpected Error Occurred" });
    }
  }
  res.status(403).json({ message: "Please login to use this service." });
}

export function permit(...allowed: string[]){
  return (req: Request,
  res: Response,
  next: NextFunction) => {
    const user = res.locals.user;
    console.log("user is: ", user, "allowed is: ", allowed, "user role is: ", user.role);
    if (user && allowed.includes(user.role)) {
      return next();
    }
    res.status(403).json({ message: "Access Denied" });
  };
}


//  {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (token !== null) {
//     try {
//       const payload = JWT.verify(token, config.jwtSecret);
//       console.log(payload);
//       const id = JSON.parse(JSON.stringify(payload));

      
//       return next();
//     } catch (error) {
//       console.log(error);
//       res.locals = {
//         payload: null,
//       };
//       return res.status(403).json({ message: "unauthorized" });
//     }
//   }
//   res.status(403).json({ message: "unauthorized" });
// }

// export async function isAdmin(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (token !== null) {
//     try {
//       const payload = JWT.verify(token, config.jwtSecret);
//       res.locals = JSON.parse(JSON.stringify(payload));
//       const { _id } = res.locals;

//       const user = await User.findById(_id);

//       if (user.role !== "admin") {
//         return res.status(403).json({ message: "not authorized" });
//       }
//       res.locals = JSON.parse(JSON.stringify(payload));
//       return next();
//     } catch (error) {
//       console.log(error);
//       res.locals = {
//         payload: null,
//       };
//       return res.status(403).json({ message: "unauthorized" });
//     }
//   }
//   res.status(403).json({ message: "unauthorized" });
// }

// export async function isContributor(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (token !== null) {
//     try {
//       const payload = JWT.verify(token, config.jwtSecret);
//       res.locals = JSON.parse(JSON.stringify(payload));
//       const { _id } = res.locals;

//       const user = await User.findById(_id);

//       if (user.role !== "contributor") {
//         return res.status(403).json({ message: "not a contributor" });
//       }
//       res.locals = JSON.parse(JSON.stringify(payload));
//       return next();
//     } catch (error) {
//       console.log(error);
//       res.locals = {
//         payload: null,
//       };
//       return res.status(403).json({ message: "unauthorized" });
//     }
//   }
//   res.status(403).json({ message: "unauthorized" });
// }
