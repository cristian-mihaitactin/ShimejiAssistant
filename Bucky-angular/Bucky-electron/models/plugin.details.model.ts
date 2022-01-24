export interface PluginDetailsModel{
    id: string,
    name: string,
    description: string,
    version: string,
    pluginImageBlob: {
      icoBytes: string,
      svgBytes: string,
      pngBytes: string
    }
}