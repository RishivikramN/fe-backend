import Ajv from "ajv";
import Interfaces from "../Interfaces";
import schema from "../types.json";
const ajv = new Ajv({ allErrors: true });
ajv.addSchema(schema);
export function schemaValidator<T extends keyof Interfaces>(
  data: Interfaces[T],
  nameOfInterface: any
) {
  const validate = ajv.compile(schema.definitions[nameOfInterface]);
  const valid = validate(data);
  if (!valid) {
    const field = validate.errors[0].dataPath;
    const message = validate.errors[0].message;
    const error = `${field.substring(1)} ${message}`;

    throw new Error(error);
  }
  return data;
}
