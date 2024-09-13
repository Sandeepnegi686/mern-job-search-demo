import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { model, Schema } from "mongoose";
import validator from "validator";

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    validate: {
      validator: validator.isEmail,
      message: (props) => `${props.value} is not a valid email!`,
    },
    required: [true, "Please provide email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
    select: false,
  },
  lastName: {
    type: String,
    default: "lastName",
    trim: true,
    maxlength: 20,
  },
  location: {
    type: String,
    default: "my city",
    trim: true,
    maxlength: 20,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECERT, {
    expiresIn: process.env.JWT_LIFETIME,
    // expiresIn: "100",
  });
};

UserSchema.methods.comparePasswords = async function (loginPass) {
  const isCorrectPassword = await bcryptjs.compare(loginPass, this.password);
  return isCorrectPassword;
};

const UserModel = model("User", UserSchema);

export default UserModel;
