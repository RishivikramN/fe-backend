import { GenericObjectType, GenericType } from "./interfaces/Generics";
import { GotResponse, GotClientType } from "./interfaces/GotClient";
import { errorCodes } from "./libs/errorCodes";
import { statusCodes } from "./libs/statusCodes";
import { FetchWebEntity } from "./interfaces/WebUrl";
import schema from "./types.json";

type SchemaType = typeof schema.definitions;
type Definitions = { [x in keyof SchemaType]: unknown };

export default class Interfaces implements Definitions {
  errorCodes: errorCodes;
  statusCodes: statusCodes;
  GenericType: GenericType;
  GenericObjectType: GenericObjectType;
  GotResponse: GotResponse;
  GotClientType: GotClientType;
  FetchWebEntity: FetchWebEntity;
}
