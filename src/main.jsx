import React from "react"
import ReactDOM from "react-dom/client"
import App from "./EduNexus"

ReactDOM.createRoot(document.getElementById("root")).render(<App/>)

// PWA: register the service worker so the app becomes installable.
// Registered after load so it never competes with initial page render.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((e) => console.warn("Service worker registration failed:", e));
  });
}

