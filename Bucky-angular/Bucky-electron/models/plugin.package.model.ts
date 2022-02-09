export interface PluginPackageModel{
    fileName: string,
    zipBytes: string,
    name: string,
    version: string,
    pluginImagesBlob: {
      icoBytes: string,
      svgBytes: string,
      pngBytes: string
    }
}