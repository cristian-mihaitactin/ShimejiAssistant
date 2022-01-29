import { Subject } from "rxjs";
import { PluginInput } from "./plugin.input";
import { PluginNotification } from "./plugin.notification";

export interface IPluginConstructor {
  new (eventHandlerIn:Subject<PluginInput> , eventHandlerOut:Subject<PluginNotification>, id: string, ...argv: string[]): IPlugin
};

export interface IPlugin {
  eventHandlerIn:Subject<PluginInput>,
  eventHandlerOut:Subject<PluginNotification>,
  id: string,
  getHtml():string
  };