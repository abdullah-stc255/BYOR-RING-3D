import { useEffect, useRef } from "react";

const MODEL_ID = "XsSLRlniSGucXtbNw6dAwQ";
const BASENAME = "ringsandi";

const WEBGI_URL = "https://releases.ijewel3d.com/libs/webgi-v0/bundle-0.22.0.js";
const VIEWER_URL = "https://releases.ijewel3d.com/libs/mini-viewer/0.6.8/bundle.nowebgi.iife.js";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function waitForGlobal(name, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (window[name]) return resolve(window[name]);
      if (Date.now() - start > timeout) return reject(new Error(`${name} not available`));
      requestAnimationFrame(check);
    };
    check();
  });
}

function applyMaterials(metal, gem) {
  const params = new URLSearchParams();
  if (metal) {
    params.set("Metal 01", metal);
    params.set("Metal 02", metal);
  }
  if (gem) params.set("Gem 01", gem);
  window.location.hash = "?" + params.toString();
}

function applyComponent(viewerApp, componentName, variationName) {
  const ringConfig = viewerApp?.plugins?.["RingConfigurator"];
  if (!ringConfig) return;
  const comp = ringConfig.getComponent(componentName);
  if (!comp) return;
  const variation = comp.variations.find((v) => v.name === variationName);
  if (!variation) return;
  comp.applyVariation(variation);
}

export default function RingViewer({ selectedMetal, selectedGem, selectedHead, selectedShank }) {
  const containerRef = useRef(null);
  const viewerAppRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const onViewerReady = (ev) => {
      viewerAppRef.current = ev.detail?.viewer;
    };

    window.addEventListener("ijewel-viewer-ready", onViewerReady);

    loadScript(WEBGI_URL)
      .then(() => loadScript(VIEWER_URL))
      .then(() => waitForGlobal("ijewelViewer"))
      .then((viewer) => viewer.loadModelById(MODEL_ID, BASENAME, container, { showCard: false, showLogo: false }))
      .then((viewer) => {
        const poll = setInterval(() => {
          if (viewer?.viewerApp) {
            viewerAppRef.current = viewer.viewerApp;
            clearInterval(poll);
          }
        }, 100);
        setTimeout(() => clearInterval(poll), 10000);
      })
      .catch((err) => console.error("Viewer load error:", err));

    return () => window.removeEventListener("ijewel-viewer-ready", onViewerReady);
  }, []);

  useEffect(() => {
    if (!selectedMetal) return;
    applyMaterials(selectedMetal, selectedGem);
  }, [selectedMetal, selectedGem]);

  useEffect(() => {
    if (!viewerAppRef.current || !selectedHead) return;
    applyComponent(viewerAppRef.current, "Heads", selectedHead);
  }, [selectedHead]);

  useEffect(() => {
    if (!viewerAppRef.current || !selectedShank) return;
    applyComponent(viewerAppRef.current, "Shanks", selectedShank);
  }, [selectedShank]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
