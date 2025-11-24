// Configuration pour ONNX Runtime Web
if (typeof window !== 'undefined') {
  window.ort = window.ort || {};
  window.ort.env = window.ort.env || {};
  window.ort.env.wasm = window.ort.env.wasm || {};
  window.ort.env.wasm.wasmPaths = '/_next/static/chunks/';
}
