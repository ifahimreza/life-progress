"use client";

import {useEffect} from "react";

export default function PwaSetup() {
  useEffect(() => {
    if (typeof window === "undefined") return;
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
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Silent fail to avoid breaking the app in dev.
    });
  }, []);

  return null;
}
