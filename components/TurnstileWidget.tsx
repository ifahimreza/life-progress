"use client";

import {useEffect, useRef, useState} from "react";

type TurnstileWidgetProps = {
  siteKey: string;
  className?: string;
  onTokenChange: (token: string | null) => void;
};

type TurnstileRenderOptions = {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "flexible" | "compact";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  remove?: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export default function TurnstileWidget({
  siteKey,
  className,
  onTokenChange
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenChangeRef = useRef(onTokenChange);
  const [isScriptLoaded, setIsScriptLoaded] = useState(
    () => typeof window !== "undefined" && Boolean(window.turnstile)
  );

  useEffect(() => {
    onTokenChangeRef.current = onTokenChange;
  }, [onTokenChange]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.turnstile) {
      setIsScriptLoaded(true);
      return;
    }

    const scriptId = "cloudflare-turnstile-script";
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    const markLoaded = () => setIsScriptLoaded(true);

    if (existingScript) {
      if (existingScript.dataset.loaded === "true") {
        setIsScriptLoaded(true);
      } else {
        existingScript.addEventListener("load", markLoaded, {once: true});
      }
      return () => {
        existingScript.removeEventListener("load", markLoaded);
      };
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        markLoaded();
      },
      {once: true}
    );
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isScriptLoaded) return;
    if (!containerRef.current) return;
    if (!window.turnstile) return;
    if (widgetIdRef.current) return;

    onTokenChangeRef.current(null);
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "light",
      size: "flexible",
      callback: (token: string) => onTokenChangeRef.current(token),
      "expired-callback": () => onTokenChangeRef.current(null),
      "error-callback": () => onTokenChangeRef.current(null)
    });

    return () => {
      if (widgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [isScriptLoaded, siteKey]);

  return (
    <div ref={containerRef} className={className} />
  );
}
