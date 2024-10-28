const transformationZone = "kylecsutton.com";

const cloudflareLoader = (props: {
  src: string,
  width: number,
  quality?: number,
}) => {
  const params = [`width=${props.width}`, `quality=${props.quality ?? 85}`, "format=auto"];
  return `https://${transformationZone}/cdn-cgi/image/${params.join(',')}/${props.src}`;
}

export default cloudflareLoader;