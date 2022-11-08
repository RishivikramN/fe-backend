import { NextFunction, Request, Response } from "express";
import { statusCodes } from "../libs/statusCodes";
import { TokenHandler } from "../libs/tokenvalidator";
// Authenticates the user for accessing
// the endpoint routes.
async function AuthRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // remove the 'Bearer ' token from the auth token
  const token = req.headers.authorization?.replace("Bearer ", "");
  try {
    if (!token) throw new Error("Access denied. No token provided");

    const result = await TokenHandler({ token });
    if (result.isValid) {
      res.locals.userEmail = result.userEmail;
      res.locals.userId = result.userId.replace(/-/g, "");
      res.locals.userIdRaw = result.userId;
      res.locals.idToken = req.headers.authorization;

      const headerNeeded = () => {
        const noHeaderPaths = ["/user/register", "/public", "/oauth2"];
        const url = req.url;

        for (const path of noHeaderPaths) {
          if (url.includes(path)) return false;
        }
        return true;
      };

      next();
    } else throw new Error(result.error);
  } catch (error) {
    next(error);
  }
}

export { AuthRequest };
