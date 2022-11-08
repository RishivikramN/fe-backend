import { Container } from "inversify";
import { CacheType } from "./interfaces/Config";
import { Cache } from "./libs/CacheClass";
import { GotClient } from "./libs/GotClientClass";
import { TemplateManager } from "./managers/TemplateManager";

const container = new Container();

container.bind<GotClient>(GotClient).to(GotClient).inSingletonScope();
container
  .bind<Cache>(CacheType.NamespaceHierarchy)
  .to(Cache)
  .inSingletonScope();
container.bind<Cache>(CacheType.Node).to(Cache).inSingletonScope();
container.bind<Cache>(CacheType.UserAccess).to(Cache).inSingletonScope();
container
  .bind<TemplateManager>(TemplateManager)
  .to(TemplateManager)
  .inSingletonScope();
export default container;
