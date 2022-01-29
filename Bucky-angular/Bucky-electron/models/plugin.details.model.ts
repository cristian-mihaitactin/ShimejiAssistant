export interface PluginDetailsModel{
    id: string,
    name: string,
    description: string,
    version: string,
    html:string,
    pluginImageBlob: {
      icoBytes: string,
      svgBytes: string,
      pngBytes: string
    }
}