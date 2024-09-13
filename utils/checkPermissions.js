import { UnAuthenticatedError } from "../error/index.js";

function checkPermissions(requestUser, resourceUserId) {
  if (requestUser === resourceUserId) {
    return;
  }
  throw new UnAuthenticatedError("Not authorized to access this route");
}

export default checkPermissions;
