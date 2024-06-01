import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../../config";
import { SuccessResponse } from "../../core/ApiResponse";
import { handleErrorResponse } from "../../helpers/errorHandle";
import { User } from "./user.model";
import { UserService } from "./user.service";

//create token
const createToken = ({
  _id,
  firstName,
  lastName,
  email,
  phoneNumber,
  role
}) => {
  return jwt.sign({
    _id,
    firstName,
    lastName,
    email,
    phoneNumber,
    role
  }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};
//login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);

    //create a token
    const token = createToken({ _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phoneNumber: user.phoneNumber, role: user.role });

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//sign up
export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phoneNumber, password, role } = req.body;

  try {
    const user = await User.signup(
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      role
    );

    //create a token
    const token = createToken({ _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phoneNumber: user.phoneNumber, role: user.role });

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
) => { };

export const becomeContributor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = res.locals.user._id;

    const user = UserService.becomeContributor(user_id);

    const data = {
      user: user
    }

    return new SuccessResponse('User has become a contributor', data).send(res);
  } catch (error) {
    handleErrorResponse(error, res);
  }
};