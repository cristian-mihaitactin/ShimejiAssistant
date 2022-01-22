import { Subject } from "rxjs";
import { PluginNotification } from "./plugin.notification";

export interface IPlugin {
    (eventHandler: Subject<PluginNotification> ,argv: string[]): boolean;
  };