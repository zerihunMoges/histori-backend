import { Router } from "express";
import { authenticate } from "../../middlewares/authentication";
import {
  becomeContributor,
  deleteUser,
  getUser,
  loginUser,
  registerUser,
  updateUser
} from "./user.controllers";

const userRouter = Router();


userRouter.get("/user", authenticate, getUser);
userRouter.delete("/:userId", deleteUser);
userRouter.put("/:userId", updateUser);
userRouter.post("/login", loginUser);
userRouter.post("/signup", registerUser);
userRouter.post("/contributor", authenticate, becomeContributor);

export default userRouter;
