declare module "*.woff2" {
  const content: ArrayBuffer;
  export default content;
}

declare module "*.ttf" {
  const content: ArrayBuffer;
  export default content;
}

declare module "*.txt" {
  // Wrangler's [[rules]] type = "Data" bundles .txt files as an
  // ArrayBuffer. The dictionary loader decodes them with TextDecoder.
  const content: ArrayBuffer;
  export default content;
}
