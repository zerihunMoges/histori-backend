import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUserInterface {
  firstName: String;
  lastName: String;
  email: String;
  phoneNumber: String;
  password: String;
  role: String;
}
interface userModel extends Model<IUserInterface> {
  signup(firstName, lastName, email, phoneNUmber, password, role?): any;
  login(email, password): any;
}
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phoneNUmber: {
    type: String,
  },

  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin", "contributor"],
    default: "user",
  },
});

// static sign up
userSchema.statics.signup = async function (
  firstName,
  lastName,
  email,
  phoneNumber,
  password,
  role = "user"
) {
  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("There is another account with the same email!");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    password: hash,
    role,
  });

  return user;
};

//static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled!");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Invalid login credentials");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Invalid login credentials!");
  }
  return user;
};
export const User = mongoose.model<IUserInterface, userModel>(
  "User",
  userSchema
);
