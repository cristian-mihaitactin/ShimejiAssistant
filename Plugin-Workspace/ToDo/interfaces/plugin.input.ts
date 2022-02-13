export interface ToDoMessage {
    action: string,
    title:string,
    sectionTitle: string
}

export interface PluginInput {
    pluginId: string,
    data: ToDoMessage
}