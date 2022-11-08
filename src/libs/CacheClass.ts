import { injectable } from "inversify";
import NodeCache from "node-cache";
import container from "../inversify.config";

@injectable()
export class Cache {
  private TTL = 1200;
  private refreshPeriod = 1205;
  private maxKeys = 1000;
  private _cache: NodeCache;

  constructor() {
    this._cache = new NodeCache({
      stdTTL: this.TTL,
      checkperiod: this.refreshPeriod,
      maxKeys: this.maxKeys,
      useClones: false,
    });
  }

  set(key: string, entity: string, payload: any) {
    this._cache.set(key, payload);
  }

  get(key: string, entity: string) {
    return Promise.resolve(this._cache.get(key));
  }

  async getOrSet<T>(
    key: string,
    entity: string,
    storeFunction,
    forceGet = false
  ): Promise<T> {
    const value = await this._cache.get(key);
    if (value && !forceGet) {
      return Promise.resolve(value) as Promise<T>;
    }

    return storeFunction().then((result) => {
      this._cache.set(key, result);
      return result;
    });
  }

  replaceAndSet(key: string, entity: string, value: any) {
    if (this._cache.has(key)) this._cache.del(key);

    this._cache.set(key, value);
  }

  has(key: string, entity: string) {
    return this._cache.has(key);
  }

  del(key: string, entity: string) {
    if (this._cache.has(key)) this._cache.del(key);
  }
}
