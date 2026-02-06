"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type WheelEvent
} from "react";
import type {DotStyle} from "../libs/lifeDotsData";
import type {Theme} from "../libs/themes";
import {
  buildExportFilename,
  downloadCanvasAsJpg,
  downloadCanvasAsPng,
  openPrintWindow,
  type PrintSize,
  renderCardToCanvas
} from "../libs/dotExport";

type ExportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  hasAccess: boolean;
  name?: string;
  total: number;
  filled: number;
  perRow: number;
  dotStyle: DotStyle;
  theme: Theme;
  dotSize: number;
  gap: number;
  title: string;
  weeksText: string;
  percentText: string;
  footerText?: string;
  footerFlagUrl?: string;
};

type Mode = "download" | "print";
const MIN_PREVIEW_ZOOM = 0.5;
const MAX_PREVIEW_ZOOM = 3;
const PREVIEW_ZOOM_STEP = 0.1;

const fontOptions = [
  {id: "Arial, sans-serif", label: "Sans"},
  {id: "Georgia, serif", label: "Serif"},
  {id: "'Courier New', monospace", label: "Mono"}
] as const;

const sizeOptions = [
  {id: 0.85, label: "Small"},
  {id: 1, label: "Medium"},
  {id: 1.2, label: "Large"}
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function ExportModal({
  isOpen,
  onClose,
  hasAccess,
  name,
  total,
  filled,
  perRow,
  dotStyle,
  theme,
  dotSize,
  gap,
  title,
  weeksText,
  percentText,
  footerText,
  footerFlagUrl
}: ExportModalProps) {
  const [mode, setMode] = useState<Mode>("download");
  const [paperSize, setPaperSize] = useState<PrintSize>("letter");
  const [sizeScale, setSizeScale] = useState<number>(1);
  const [background, setBackground] = useState<string>(theme.palette.surface || "#ffffff");
  const [fontColor, setFontColor] = useState<string>(theme.palette.text || "#111827");
  const [mutedColor, setMutedColor] = useState<string>(theme.palette.muted || "#6b7280");
  const [fontFamily, setFontFamily] = useState<string>("Arial, sans-serif");
  const [previewZoom, setPreviewZoom] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const renderTokenRef = useRef(0);

  useEffect(() => {
    if (!isOpen) return;
    setMode("download");
    setPaperSize("letter");
    setSizeScale(1);
    setBackground(theme.palette.surface || "#ffffff");
    setFontColor(theme.palette.text || "#111827");
    setMutedColor(theme.palette.muted || "#6b7280");
    setFontFamily("Arial, sans-serif");
    setPreviewZoom(1);
    setError(null);
  }, [isOpen, theme.palette.muted, theme.palette.surface, theme.palette.text]);

  const createCanvas = useCallback(
    async (renderScale: number) => {
      const scaledDot = clamp(dotSize * sizeScale, 2, 20);
      const scaledGap = clamp(gap * sizeScale, 0.5, 12);
      return renderCardToCanvas({
        total,
        filled,
        perRow,
        dotStyle,
        theme,
        dotSize: scaledDot,
        gap: scaledGap,
        title,
        weeksText,
        percentText,
        footerText,
        footerName: name,
        footerFlagUrl,
        scale: renderScale,
        background,
        fontFamily,
        textColor: fontColor,
        mutedColor
      });
    },
    [
      background,
      dotSize,
      dotStyle,
      filled,
      fontColor,
      fontFamily,
      footerFlagUrl,
      footerText,
      gap,
      mutedColor,
      name,
      perRow,
      percentText,
      sizeScale,
      theme,
      title,
      total,
      weeksText
    ]
  );

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    const renderToken = renderTokenRef.current + 1;
    renderTokenRef.current = renderToken;

    const renderPreview = async () => {
      setIsGenerating(true);
      setError(null);
      try {
        const canvas = await createCanvas(2);
        if (cancelled || renderTokenRef.current !== renderToken) return;
        setPreviewUrl(canvas.toDataURL("image/png"));
      } catch (err) {
        if (!cancelled) {
          setError("Failed to generate preview.");
        }
      } finally {
        if (!cancelled) setIsGenerating(false);
      }
    };

    void renderPreview();
    return () => {
      cancelled = true;
    };
  }, [createCanvas, isOpen]);

  const handleDownload = async (format: "png" | "jpg") => {
    if (isExporting) return;
    setIsExporting(true);
    setError(null);
    try {
      const canvas = await createCanvas(3);
      const filename = buildExportFilename(name, format);
      if (format === "png") {
        downloadCanvasAsPng(canvas, filename);
      } else {
        downloadCanvasAsJpg(canvas, filename);
      }
    } catch (err) {
      setError("Could not generate download file.");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = async () => {
    if (!hasAccess || isExporting) return;
    setIsExporting(true);
    setError(null);
    try {
      const canvas = await createCanvas(4);
      const imageUrl = canvas.toDataURL("image/png");
      openPrintWindow(imageUrl, buildExportFilename(name, "pdf"), paperSize);
    } catch (err) {
      setError("Could not generate print file.");
    } finally {
      setIsExporting(false);
    }
  };

  const canShowPrintEditor = hasAccess && mode === "print";

  const panelTitle = useMemo(() => {
    if (mode === "download") return "Download Preview";
    return hasAccess ? "Ready for print" : "Ready for print";
  }, [hasAccess, mode]);
  const zoomPercent = Math.round(previewZoom * 100);

  const handleZoomIn = () =>
    setPreviewZoom((current) => clamp(current + PREVIEW_ZOOM_STEP, MIN_PREVIEW_ZOOM, MAX_PREVIEW_ZOOM));
  const handleZoomOut = () =>
    setPreviewZoom((current) => clamp(current - PREVIEW_ZOOM_STEP, MIN_PREVIEW_ZOOM, MAX_PREVIEW_ZOOM));
  const handleZoomReset = () => setPreviewZoom(1);
  const handleWheelZoom = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const direction = event.deltaY < 0 ? 1 : -1;
    setPreviewZoom((current) =>
      clamp(current + direction * PREVIEW_ZOOM_STEP, MIN_PREVIEW_ZOOM, MAX_PREVIEW_ZOOM)
    );
  };
  const handleImageDoubleClick = () => {
    setPreviewZoom((current) => (current >= 1.9 ? 1 : 2));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-3 py-4 sm:px-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[1080px] rounded-2xl border border-surface bg-white p-4 sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-xl border border-surface bg-neutral-50 p-1">
            <button
              type="button"
              onClick={() => setMode("download")}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                mode === "download"
                  ? "bg-white text-main"
                  : "text-muted hover:text-main"
              }`}
            >
              Download
            </button>
            <button
              type="button"
              onClick={() => {
                if (hasAccess) setMode("print");
              }}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                mode === "print" && hasAccess
                  ? "bg-white text-main"
                  : hasAccess
                  ? "text-muted hover:text-main"
                  : "cursor-not-allowed text-subtle"
              }`}
              title={hasAccess ? "Ready for print" : "Plus required for print editor"}
            >
              Ready for print
            </button>
          </div>

          <div className="text-sm font-semibold text-main">{panelTitle}</div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-surface px-2 py-1 text-sm text-muted transition hover:text-main"
            aria-label="Close export modal"
          >
            ×
          </button>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4 rounded-xl border border-surface bg-neutral-50 p-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">
                Download
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => void handleDownload("png")}
                  disabled={isExporting || isGenerating}
                  className="rounded-lg border border-surface bg-white px-3 py-2 text-xs font-semibold text-main transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-subtle"
                >
                  PNG
                </button>
                <button
                  type="button"
                  onClick={() => void handleDownload("jpg")}
                  disabled={isExporting || isGenerating}
                  className="rounded-lg border border-surface bg-white px-3 py-2 text-xs font-semibold text-main transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-subtle"
                >
                  JPG
                </button>
              </div>
            </div>

            {canShowPrintEditor ? (
              <>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">
                    Size
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {sizeOptions.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => setSizeScale(option.id)}
                        className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${
                          sizeScale === option.id
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-surface bg-white text-main hover:bg-neutral-100"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">
                    Paper
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaperSize("letter")}
                      className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${
                        paperSize === "letter"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-surface bg-white text-main hover:bg-neutral-100"
                      }`}
                    >
                      Letter
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaperSize("a4")}
                      className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${
                        paperSize === "a4"
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-surface bg-white text-main hover:bg-neutral-100"
                      }`}
                    >
                      A4
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">
                    Background
                  </label>
                  <input
                    type="color"
                    value={background}
                    onChange={(event) => setBackground(event.target.value)}
                    className="h-9 w-full cursor-pointer rounded-md border border-surface bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">
                    Font
                  </label>
                  <select
                    value={fontFamily}
                    onChange={(event) => setFontFamily(event.target.value)}
                    className="w-full rounded-md border border-surface bg-white px-2.5 py-2 text-sm text-main focus-visible:outline-none"
                  >
                    {fontOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <label className="space-y-1">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">
                      Text
                    </span>
                    <input
                      type="color"
                      value={fontColor}
                      onChange={(event) => setFontColor(event.target.value)}
                      className="h-9 w-full cursor-pointer rounded-md border border-surface bg-white"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">
                      Muted
                    </span>
                    <input
                      type="color"
                      value={mutedColor}
                      onChange={(event) => setMutedColor(event.target.value)}
                      className="h-9 w-full cursor-pointer rounded-md border border-surface bg-white"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => void handlePrint()}
                  disabled={isExporting || isGenerating}
                  className="w-full rounded-lg bg-neutral-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
                >
                  Save Print-Ready
                </button>
              </>
            ) : (
              <div className="rounded-lg border border-surface bg-white p-2.5 text-xs text-muted">
                {hasAccess
                  ? "Use the print tab to adjust size, colors, and fonts."
                  : "Ready for print is available for Plus users."}
              </div>
            )}

            {error ? <p className="text-xs text-rose-700">{error}</p> : null}
          </aside>

          <div className="rounded-xl border border-surface bg-neutral-50 p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">
                Preview
              </p>
              <div className="inline-flex items-center gap-1 rounded-md border border-surface bg-white p-1">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={isGenerating || previewZoom <= MIN_PREVIEW_ZOOM}
                  className="h-7 w-7 rounded border border-surface text-sm font-semibold text-main transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:text-subtle"
                  aria-label="Zoom out"
                  title="Zoom out"
                >
                  -
                </button>
                <span className="min-w-[54px] text-center text-xs font-semibold text-main">{zoomPercent}%</span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={isGenerating || previewZoom >= MAX_PREVIEW_ZOOM}
                  className="h-7 w-7 rounded border border-surface text-sm font-semibold text-main transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:text-subtle"
                  aria-label="Zoom in"
                  title="Zoom in"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={handleZoomReset}
                  disabled={isGenerating || previewZoom === 1}
                  className="h-7 rounded border border-surface px-2 text-[11px] font-semibold text-main transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:text-subtle"
                  aria-label="Reset zoom"
                  title="Reset zoom"
                >
                  100%
                </button>
                <input
                  type="range"
                  min={MIN_PREVIEW_ZOOM}
                  max={MAX_PREVIEW_ZOOM}
                  step={PREVIEW_ZOOM_STEP}
                  value={previewZoom}
                  onChange={(event) => setPreviewZoom(Number(event.target.value))}
                  className="h-7 w-20 accent-[#00c565]"
                  aria-label="Zoom level"
                />
              </div>
            </div>
            <div
              className="min-h-[360px] overflow-auto rounded-lg border border-surface bg-white p-3 sm:min-h-[460px]"
              onWheel={handleWheelZoom}
            >
              {isGenerating ? (
                <div className="flex min-h-[330px] items-center justify-center">
                  <p className="text-sm text-muted">Generating preview...</p>
                </div>
              ) : previewUrl ? (
                <div className="flex min-h-[330px] min-w-max items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Export preview"
                    className="h-auto max-w-none cursor-zoom-in object-contain"
                    style={{width: `${Math.round(previewZoom * 100)}%`}}
                    onDoubleClick={handleImageDoubleClick}
                  />
                </div>
              ) : (
                <div className="flex min-h-[330px] items-center justify-center">
                  <p className="text-sm text-muted">Preview unavailable.</p>
                </div>
              )}
            </div>
            <p className="mt-2 text-[11px] text-muted">
              Tip: Use mouse wheel or double-click the preview to zoom.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
