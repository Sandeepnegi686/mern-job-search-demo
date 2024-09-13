import jwt from "jsonwebtoken";
import { UnAuthenticatedError } from "../error/index.js";

function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthenticatedError("Authenticated Invalid");
  }
  const token = authHeader.split(" ")[1];
  const payload = jwt.verify(token, process.env.JWT_SECERT);
  req.user = { userId: payload.userId };
  next();
}

export default authenticateUser;
