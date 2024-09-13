import { StatusCodes } from "http-status-codes";

function errorHandlerMiddleware(error, req, res, next) {
  // console.log(error.message);
  const defaultError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: error.message || "Something went wrong, please try again.",
  };
  if (error.name === "ValidationError") {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = Object.values(error.errors)
      .map((val) => val.message)
      .join(", ");
  } else if (error.errorResponse && error.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = `${Object.keys(error.keyValue)} already exist...`;
  }
  res.status(defaultError.statusCode).json({ msg: defaultError.msg });
}
export default errorHandlerMiddleware;
