import { Subject } from "rxjs";
import { PluginNotification } from "./plugin.notification";

export interface IPluginConstructor {
  new (eventHandlerIn:Subject<PluginNotification> , eventHandlerOut:Subject<PluginNotification>, id: string, ...argv: string[]): IPlugin
};

export interface IPlugin {
  eventHandlerIn:Subject<PluginNotification>,
  eventHandlerOut:Subject<PluginNotification>,
  id: string,
  html:string
  };