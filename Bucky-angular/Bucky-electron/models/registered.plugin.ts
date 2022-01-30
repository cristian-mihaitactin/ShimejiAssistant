import { IPlugin } from "./iplugin";
import { PluginModel } from "./plugin.model";

export interface RegisteredPlugin {
    plugin: IPlugin,
    pluginModel:PluginModel,
}