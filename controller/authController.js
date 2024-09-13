import UserModel from "../model/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../error/index.js";

async function registerUser(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError("Please provide all feilds.");
  }

  const user = await UserModel.create(req.body);
  const token = user.createJWT();
  return res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
    },
    token,
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("All fields required");
  }
  const user = await UserModel.findOne({ email }).select("+password");
  // console.log(user);
  if (!user) {
    throw new BadRequestError("Invalid Credentials");
  }
  const isPasswordCorret = await user.comparePasswords(password);
  if (!isPasswordCorret) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const token = await user.createJWT();
  user.password = undefined;
  res.status(StatusCodes.OK).json({ user, token, location: user.location });
}

async function updateUser(req, res) {
  const { email, lastName, name, location } = req.body;
  if (!email || !lastName || !name || !location) {
    throw new BadRequestError("Please provide all fields");
  }
  const user = await UserModel.findOne({ _id: req.user.userId });

  try {
    user.email = email;
    user.name = name;
    user.location = location;
    user.lastName = lastName;

    await user.save();
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user, token, location: user.location });
  } catch (error) {
    console.log(error);
    throw new BadRequestError(error);
  }
}

export { registerUser, loginUser, updateUser };
