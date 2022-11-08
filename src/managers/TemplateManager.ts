import { injectable } from "inversify";
import container from "../inversify.config";
import { statusCodes } from "../libs/statusCodes";
import { STAGE } from "../env";

@injectable()
export class TemplateManager {
  async createBookmark(
    workspaceId: string,
    idToken: string,
    nodeID: string
  ): Promise<any> {
    try {
      // TODO: do something here
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
