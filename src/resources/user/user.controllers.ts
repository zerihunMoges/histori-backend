import { Request, Response, NextFunction } from "express";
import { User, IUserInterface } from "./user.model";
import jwt from "jsonwebtoken";

//create token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};
//login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);

    //create a token
    const token = createToken(user._id);

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//sign up
export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phoneNumber, password, role } = req.body;

  try {
    if (role !== "user" || role !== "contributor") {
      res.status(400).json({ message: "Invalid role" });
    }
    const user = await User.signup(
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      role
    );

    //create a token
    const token = createToken(user._id);
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//fetch all users
export const fetchAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({});
    res.locals.json = {
      statusCode: 200,
      data: users,
    };
    return res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

//get user by ID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = res.locals;
    const user = await User.findById(_id);
    if (user) {
      return res.status(200).json(user);
    }
    return res.status(404);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

//delete a single user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.params;
    const user = await User.deleteOne({ _id });
    if (!user) {
      return res.status(400);
    }
    return res.status(200).json(user);
  } catch (err: any) {
    return res.status(404).json({ message: err.message });
  }
};

//update user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
