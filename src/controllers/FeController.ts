import express, { NextFunction, Request, Response } from "express";
import { TemplateManager } from "../managers/TemplateManager";
import container from "../inversify.config";
import { statusCodes } from "../libs/statusCodes";
import { isUri, isHttpUri, isHttpsUri } from "valid-url";
import { initializeFeRoutes } from "../routes/FeRoutes";
import { RequestClass } from "../libs/RequestClass";
import axios from "axios";
import { parse } from "node-html-parser";
import { Image, URLResponse } from "../interfaces/response";

class FeController {
  public _urlPath = "/fetch";
  public _router = express.Router();
  public _bookmarkManager: TemplateManager =
    container.get<TemplateManager>(TemplateManager);

  constructor() {
    initializeFeRoutes(this);
  }

  private rankColours = (colourArr: string[]) => {
    const colourFreqMap = new Map<string, number>();

    colourArr.map((item) => {
      if (colourFreqMap.has(item))
        colourFreqMap.set(item, colourFreqMap.get(item) + 1);
      else colourFreqMap.set(item, 1);
    });
    return new Map([...colourFreqMap.entries()].sort((a, b) => b[1] - a[1]));
  };

  fetchAllEntities = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { data } = new RequestClass(request, "FetchWebEntity");
      if (isUri(data.url) || isHttpUri(data.url) || isHttpsUri(data.url)) {
        const htmlContent: string = await (
          await axios.get(data.url)
        ).data.toString();

        const rankedColours = this.rankColours(
          htmlContent
            .match(/#(([0-9a-fA-F]{2}){3,4}|([0-9a-fA-F]){3,4})/g)
            .toString()
            .toUpperCase()
            .split(",")
        );

        if (!htmlContent)
          response
            .status(statusCodes.INTERNAL_SERVER_ERROR)
            .json("Cannot parse html content");

        const domRoot = parse(htmlContent);

        // Parse all the images
        const images = domRoot.getElementsByTagName("img");
        const imageSources: Image[] = images.map((image) => {
          return {
            src: image.attributes.src.includes("data:image/")
              ? image.attributes.src
              : `${data.url}${image.attributes.src}`,
          };
        });

        const webResult: URLResponse = {
          origin: data.url,
          images: imageSources,
          colours: Object.fromEntries(rankedColours),
        };
        response.status(statusCodes.OK).json(webResult);
      } else response.status(statusCodes.BAD_REQUEST).json("Invalid url");
    } catch (error) {
      next(error);
    }
  };
}

export default FeController;
