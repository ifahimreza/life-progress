"use client";

import type {FormEvent} from "react";
import {useEffect, useRef, useState} from "react";
import Link from "next/link";
import type {UiStrings} from "../libs/i18n";
import type {LanguageId, SelectOption} from "../libs/lifeDotsData";
import {useSupabaseAuth} from "../libs/useSupabaseAuth";

type AppFooterProps = {
  strings: UiStrings;
  languageOptions?: SelectOption[];
  languageValue?: LanguageId;
  onLanguageChange?: (value: LanguageId) => void;
};

export default function AppFooter({
  strings,
  languageOptions,
  languageValue = "default",
  onLanguageChange
}: AppFooterProps) {
  const {userId, session} = useSupabaseAuth({redirectPath: "/"});
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [contactStatus, setContactStatus] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const isAdmin =
    session?.user?.app_metadata?.role === "admin" ||
    session?.user?.user_metadata?.role === "admin";
  const sessionEmail = session?.user?.email ?? "";
  const hasLanguageSelector = Boolean(languageOptions?.length && onLanguageChange);
  const selectedLanguageLabel =
    languageOptions?.find((option) => option.id === languageValue)?.label ??
    strings.languageEnglish;

  useEffect(() => {
    if (!sessionEmail) return;
    setContactEmail((current) => current || sessionEmail);
  }, [sessionEmail]);

  useEffect(() => {
    if (!isLanguageOpen) return;
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (!languageMenuRef.current?.contains(target)) {
        setIsLanguageOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isLanguageOpen]);

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contactEmail.trim() || !contactMessage.trim()) {
      setContactError("Please enter your email and a message.");
      return;
    }

    setIsSendingContact(true);
    setContactError(null);
    setContactStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          email: contactEmail.trim(),
          message: contactMessage.trim(),
          page: typeof window !== "undefined" ? window.location.pathname : ""
        })
      });

      const data = (await response.json().catch(() => null)) as {error?: string} | null;
      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to send message.");
      }

      setContactMessage("");
      setContactStatus("Thanks. Your message has been sent.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send message.";
      setContactError(message);
    } finally {
      setIsSendingContact(false);
    }
  };

  return (
    <>
      <footer className="mx-auto w-full max-w-[860px] px-4 pb-6 pt-3 sm:px-6">
      <div className="flex flex-col items-center gap-3 border-t border-surface pt-4 text-[11px] text-muted sm:flex-row sm:justify-between">
        <div className="font-semibold tracking-[0.2em] text-subtle">
          DotSpan
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {hasLanguageSelector ? (
            <div ref={languageMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsLanguageOpen((current) => !current)}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-[13px] font-medium text-main transition hover:border-neutral-400"
                aria-haspopup="menu"
                aria-expanded={isLanguageOpen}
                aria-label={strings.languageLabel}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-neutral-700">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18ZM3 12h18M12 3c2.2 2.5 3.4 5.7 3.4 9s-1.2 6.5-3.4 9M12 3c-2.2 2.5-3.4 5.7-3.4 9s1.2 6.5 3.4 9"
                  />
                </svg>
                <span>{selectedLanguageLabel}</span>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className={`h-4 w-4 text-neutral-500 transition ${isLanguageOpen ? "rotate-180" : ""}`}
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m6 9 6 6 6-6"
                  />
                </svg>
              </button>
              {isLanguageOpen ? (
                <div className="absolute bottom-full right-0 z-30 mb-2 w-48 rounded-xl border border-neutral-200 bg-white p-1.5">
                  {languageOptions?.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        onLanguageChange?.(option.id as LanguageId);
                        setIsLanguageOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] transition hover:bg-neutral-50 ${
                        option.id === languageValue ? "text-main" : "text-neutral-700"
                      }`}
                      role="menuitem"
                    >
                      <span>{option.label}</span>
                      {option.id === languageValue ? <span className="text-xs">✓</span> : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">
          <Link href="/privacy" className="transition hover:text-neutral-600">
            Privacy
          </Link>
          <Link href="/terms" className="transition hover:text-neutral-600">
            Terms
          </Link>
          <Link href="/refund" className="transition hover:text-neutral-600">
            Refund
          </Link>
          <button
            type="button"
            onClick={() => {
              setIsContactOpen(true);
              setContactError(null);
              setContactStatus(null);
            }}
            className="transition hover:text-neutral-600"
          >
            Contact
          </button>
          {userId ? (
            <Link href="/dashboard" className="transition hover:text-neutral-600">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="transition hover:text-neutral-600">
              Login
            </Link>
          )}
          {isAdmin ? (
            <Link href="/admin" className="transition hover:text-neutral-600">
              Admin
            </Link>
          ) : null}
          </div>
        </div>
      </div>
      <div className="mt-2 text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-subtle sm:text-[10px]">
        {strings.inspiredByPrefix ? `${strings.inspiredByPrefix} ` : ""}
        <a
          href="https://waitbutwhy.com/2014/05/life-weeks.html"
          target="_blank"
          rel="noreferrer"
          className="transition hover:text-neutral-600"
        >
          {strings.inspiredByTitle}
        </a>
        {strings.inspiredBySuffix ? ` ${strings.inspiredBySuffix}` : ""}
      </div>
      </footer>

      {isContactOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6"
          onClick={() => setIsContactOpen(false)}
        >
          <div
            className="w-full max-w-[560px] rounded-2xl border border-surface bg-white p-5 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-main">Contact us</h2>
                <p className="mt-1 text-sm text-muted">
                  Ask a question, report a bug, or suggest a feature.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsContactOpen(false)}
                className="rounded-lg border border-surface px-2 py-1 text-lg leading-none text-muted transition hover:text-main"
                aria-label="Close contact modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleContactSubmit} className="mt-5 grid gap-3">
              <textarea
                value={contactMessage}
                onChange={(event) => setContactMessage(event.target.value)}
                placeholder="Your message"
                rows={7}
                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-main placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8cdf8]"
                required
              />
              <input
                type="email"
                value={contactEmail}
                onChange={(event) => setContactEmail(event.target.value)}
                placeholder="Your email address"
                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-main placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8cdf8]"
                required
              />

              {contactStatus ? (
                <p className="text-sm text-emerald-700">{contactStatus}</p>
              ) : null}
              {contactError ? (
                <p className="text-sm text-rose-700">{contactError}</p>
              ) : null}

              <button
                type="submit"
                disabled={isSendingContact}
                className="mt-1 w-full rounded-xl bg-[#4e55e0] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#434ad0] disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                {isSendingContact ? "Sending..." : "Send message"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
