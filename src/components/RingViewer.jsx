import { useEffect, useRef } from "react";

const BASE_URL =
  "https://ijewel3d.com/drive/files/YlM4-ztDTY6BEF2Vy5VLXQ/embedded?isAutoplay=true&isConfigurator=false";

export default function RingViewer({ selectedMetal, selectedGem }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!iframeRef.current || !selectedMetal) return;

    const hash = `?Metal=${encodeURIComponent(selectedMetal)}${
      selectedGem ? `&Gem=${encodeURIComponent(selectedGem)}` : ""
    }`;

    const url = new URL(BASE_URL);
    url.hash = hash;
    iframeRef.current.src = url.toString();
    console.log("iframe src:", iframeRef.current.src);
  }, [selectedMetal, selectedGem]);

  return (
    <iframe
      id="viewer-frame"
      ref={iframeRef}
      src={BASE_URL}
      title="3D Ring Viewer"
      frameBorder="0"
      allowFullScreen
      mozallowfullscreen="true"
      webkitallowfullscreen="true"
      allow="autoplay; fullscreen; xr-spatial-tracking; web-share"
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        display: "block",
      }}
    />
  );
}
