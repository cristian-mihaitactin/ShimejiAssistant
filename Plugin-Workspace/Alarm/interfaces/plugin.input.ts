export interface AlarmMessage {
    action: string,
    hour: string,
    minute:string
}

export interface PluginInput {
    pluginId: string,
    data: AlarmMessage
}