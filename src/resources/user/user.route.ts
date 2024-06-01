import { Router } from "express";
import {
  becomeContributor,
  deleteUser,
  fetchAllUsers,
  getUserById,
  loginUser,
  registerUser,
  updateUser,
} from "./user.controllers";

const userRouter = Router();

userRouter.get("/all", fetchAllUsers);
userRouter.get("/:userId", getUserById);
userRouter.delete("/:userId", deleteUser);
userRouter.put("/:userId", updateUser);
userRouter.post("/login", loginUser);
userRouter.post("/signup", registerUser);
userRouter.post("/contributor", becomeContributor);

export default userRouter;
