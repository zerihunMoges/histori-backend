import JWT from "jsonwebtoken";
import { User } from "../resources/user/user.model";

export async function isAuthenticated(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token !== null) {
    try {
      const payload = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log(payload);
      res.locals = JSON.parse(JSON.stringify(payload));
      return next();
    } catch (error) {
      console.log(error);
      res.locals = {
        payload: null,
      };
      return res.status(401).json({ message: "unauthorized" });
    }
  }
  res.status(401).json({ message: "unauthorized" });
}

export async function isAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token !== null) {
    try {
      const payload = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
      res.locals = JSON.parse(JSON.stringify(payload));
      const { _id } = res.locals;

      const user = await User.findById(_id);

      if (user.role !== "admin") {
        return res.status(401).json({ message: "not authorized" });
      }
      res.locals = JSON.parse(JSON.stringify(payload));
      return next();
    } catch (error) {
      console.log(error);
      res.locals = {
        payload: null,
      };
      return res.status(401).json({ message: "unauthorized" });
    }
  }
  res.status(401).json({ message: "unauthorized" });
}

export async function isContributor(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token !== null) {
    try {
      const payload = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
      res.locals = JSON.parse(JSON.stringify(payload));
      const { _id } = res.locals;

      const user = await User.findById(_id);

      if (user.role !== "contributor") {
        return res.status(401).json({ message: "not a contributor" });
      }
      res.locals = JSON.parse(JSON.stringify(payload));
      return next();
    } catch (error) {
      console.log(error);
      res.locals = {
        payload: null,
      };
      return res.status(401).json({ message: "unauthorized" });
    }
  }
  res.status(401).json({ message: "unauthorized" });
}
