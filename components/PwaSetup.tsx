"use client";

import {useEffect} from "react";

export default function PwaSetup() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const extensionNoise =
      "A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received";
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        typeof reason === "string"
          ? reason
          : reason instanceof Error
          ? reason.message
          : "";

      // Ignore a known browser-extension rejection that is unrelated to app logic.
      if (message.includes(extensionNoise)) {
        event.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      // Prevent stale service worker caches from breaking dev assets.
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          void registration.unregister();
        });
      });

      if ("caches" in window) {
        void caches.keys().then((keys) => {
          keys
            .filter(
              (key) =>
                key.startsWith("dotspan-static") ||
                key.startsWith("life-dots-static")
            )
            .forEach((key) => {
              void caches.delete(key);
            });
        });
      }
      return () => {
        window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      };
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Silent fail to avoid breaking the app in dev.
    });

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}
