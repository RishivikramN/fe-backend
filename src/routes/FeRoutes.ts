import FeController from "../controllers/FeController";
import { AuthRequest } from "../middlewares/authrequest";

export const initializeFeRoutes = (feControllerObject: FeController): void => {
  feControllerObject._router.post(
    `${feControllerObject._urlPath}/all`,
    // [AuthRequest],
    feControllerObject.fetchAllEntities
  );
};
