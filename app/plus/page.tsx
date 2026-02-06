"use client";

import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import AppFooter from "../../components/AppFooter";
import GoogleButton from "../../components/GoogleButton";
import {Profile, LanguageId} from "../../libs/lifeDotsData";
import {UiStrings, getTranslations} from "../../libs/i18n";
import {loadStoredProfile} from "../../libs/profile";
import {useSupabaseAuth} from "../../libs/useSupabaseAuth";
import config from "../../config";

export default function PlusPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [language, setLanguage] = useState<LanguageId>("default");
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"yearly" | "lifetime">("yearly");
  const router = useRouter();
  const {
    supabase,
    userId,
    email,
    hasAccess,
    isLoading: isAuthLoading,
    signInWithGoogle
  } = useSupabaseAuth({redirectPath: "/plus"});

  const navigatorLanguage = typeof navigator !== "undefined" ? navigator.language : "en";
  const strings = useMemo<UiStrings>(
    () => getTranslations(language, navigatorLanguage),
    [language, navigatorLanguage]
  );
  const appUrl = config.appUrl?.replace(/\/$/, "") || "http://localhost:3000";
  const pricing = {
    yearly: {
      label: config.freemius?.plans?.yearly?.name ?? "Plus Yearly",
      price: config.freemius?.plans?.yearly?.price ?? 18,
      billing: "Per year"
    },
    lifetime: {
      label: config.freemius?.plans?.lifetime?.name ?? "Plus Lifetime",
      price: config.freemius?.plans?.lifetime?.price ?? 48,
      billing: "One-time"
    }
  };
  const faqItems = useMemo(
    () => [
      {
        question: "What is included in DotSpan Plus?",
        answer:
          "DotSpan Plus includes print-ready PDF export, full theme pack, shareable read-only links, and weekly reminder emails."
      },
      {
        question: "Can I switch from yearly to lifetime?",
        answer:
          "Yes. You can upgrade to lifetime later from billing support. Contact support with your account email for migration help."
      },
      {
        question: "Do I need Plus to use DotSpan?",
        answer:
          "No. DotSpan has a basic plan. Plus is for users who want premium export, visual customization, and reminder/share tools."
      }
    ],
    []
  );
  const plusSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Product",
          name: "DotSpan Plus",
          description:
            "Premium plan for DotSpan with PDF export, theme pack, shareable link, and weekly reminders.",
          brand: {
            "@type": "Brand",
            name: "DotSpan"
          },
          offers: [
            {
              "@type": "Offer",
              name: pricing.yearly.label,
              price: pricing.yearly.price,
              priceCurrency: "USD",
              url: `${appUrl}/plus`,
              availability: "https://schema.org/InStock"
            },
            {
              "@type": "Offer",
              name: pricing.lifetime.label,
              price: pricing.lifetime.price,
              priceCurrency: "USD",
              url: `${appUrl}/plus`,
              availability: "https://schema.org/InStock"
            }
          ]
        },
        {
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer
            }
          }))
        }
      ]
    }),
    [appUrl, faqItems]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const parsed = loadStoredProfile(window.localStorage);
    setProfile(parsed);
    setLanguage((parsed?.language ?? "default") as LanguageId);

    const missing: string[] = [];
    if (!parsed?.name?.trim()) missing.push("name");
    if (!parsed?.country) missing.push("country");
    if (!parsed?.dob) missing.push("date of birth");
    setMissingFields(missing);
  }, []);

  useEffect(() => {
    if (isAuthLoading) return;
    if (userId && hasAccess) {
      router.replace("/dashboard");
    }
  }, [hasAccess, isAuthLoading, router, userId]);

  const canCheckout = missingFields.length === 0 && Boolean(userId) && Boolean(email);

  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleCheckout = async () => {
    if (!canCheckout || isLoading) return;
    setIsLoading(true);
    try {
      if (!supabase) {
        throw new Error("Supabase is not configured.");
      }
      const {data: sessionData} = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) {
        throw new Error("Please sign in again.");
      }
      const response = await fetch("/api/freemius/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: selectedPlan,
          userId,
          name: profile?.name?.trim() || undefined,
          email: email ?? undefined
        })
      });
      const data = await response.json();
      if (response.ok && data?.url) {
        window.location.href = data.url as string;
        return;
      }
      console.error(data?.error ?? "Unable to start checkout.");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col py-4 sm:py-6">
      <section className="mx-auto flex w-full max-w-[980px] flex-1 flex-col gap-6 px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-muted transition hover:text-neutral-800"
          >
            ← Back to DotSpan
          </Link>
          <div className="text-base font-semibold sm:text-lg text-main">
            <span className="title-main">{strings.appTitle} Plus</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl surface-card p-5 shadow-soft sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
              Plus
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-main sm:text-3xl">
              Simple premium tools for better weekly focus
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted">
              Print-ready export, clean themes, share links, and weekly reminders.
            </p>

            <div className="mt-6 grid gap-4">
              <article className="flex items-start gap-3 rounded-2xl border border-surface bg-white p-4">
                <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#00c565]/10 text-[#00c565]">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h7l5 5v13H7V3Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5M10 13h6M10 17h6" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-main">Print-ready PDF</h2>
                  <p className="mt-1 text-sm text-muted">“Hang it, save it, or share it.”</p>
                </div>
              </article>

              <article className="flex items-start gap-3 rounded-2xl border border-surface bg-white p-4">
                <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#b8eb7c]/25 text-[#4b7a16]">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 3 8l9 5 9-5-9-5Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="m3 12 9 5 9-5M3 16l9 5 9-5" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-main">Theme pack</h2>
                  <p className="mt-1 text-sm text-muted">“Calm, bold, and warm palettes.”</p>
                </div>
              </article>

              <article className="flex items-start gap-3 rounded-2xl border border-surface bg-white p-4">
                <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7cd63]/25 text-[#7a5600]">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 0 1 0-7l1.2-1.2a5 5 0 0 1 7 7L17 13" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 11a5 5 0 0 1 0 7l-1.2 1.2a5 5 0 0 1-7-7L7 11" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-main">Shareable link</h2>
                  <p className="mt-1 text-sm text-muted">“Read-only timeline, one URL.”</p>
                </div>
              </article>

              <article className="flex items-start gap-3 rounded-2xl border border-surface bg-white p-4">
                <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#fc8fc6]/20 text-[#a02b6b]">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v5l3 2" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-main">Weekly reminder</h2>
                  <p className="mt-1 text-sm text-muted">“A gentle nudge, once a week.”</p>
                </div>
              </article>
            </div>
          </div>

          <div className="rounded-3xl surface-card p-5 shadow-soft sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
                  Simple pricing
                </p>
                <p className="mt-2 text-2xl font-semibold text-main">Plus Access</p>
              </div>
              <span className="rounded-full border border-surface px-3 py-1 text-xs font-semibold text-muted">
                Freemius
              </span>
            </div>
            <p className="mt-3 text-sm text-muted">
              One plan. All Plus features. Checkout handled securely.
            </p>

            <div className="mt-5 overflow-hidden rounded-2xl border border-surface">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 text-xs uppercase tracking-[0.16em] text-subtle">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Plan</th>
                    <th className="px-3 py-2 font-semibold">Price</th>
                    <th className="px-3 py-2 font-semibold">Billing</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-surface">
                    <td className="px-3 py-2 font-medium text-main">{pricing.yearly.label}</td>
                    <td className="px-3 py-2 text-main">${pricing.yearly.price}</td>
                    <td className="px-3 py-2 text-muted">{pricing.yearly.billing}</td>
                  </tr>
                  <tr className="border-t border-surface">
                    <td className="px-3 py-2 font-medium text-main">{pricing.lifetime.label}</td>
                    <td className="px-3 py-2 text-main">${pricing.lifetime.price}</td>
                    <td className="px-3 py-2 text-muted">{pricing.lifetime.billing}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {isAuthLoading ? (
              <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
                Checking account status...
              </div>
            ) : hasAccess ? (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                You already have Plus access. Thank you!
              </div>
            ) : !userId ? (
              <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
                <p className="font-semibold">Sign in to continue.</p>
                <div className="mt-3">
                  <GoogleButton onClick={handleSignIn} size="sm" />
                </div>
              </div>
            ) : !canCheckout ? (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-semibold">Complete your profile before upgrading.</p>
                <p className="mt-2">
                  Missing: {missingFields.join(", ")}
                </p>
                <Link
                  href="/?settings=1"
                  className="mt-3 inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                >
                  Update profile
                </Link>
              </div>
            ) : null}

            {!hasAccess ? (
              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPlan("yearly")}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    selectedPlan === "yearly"
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400"
                  }`}
                >
                  <span>
                    <span className="block font-semibold">{pricing.yearly.label}</span>
                    <span className="block text-xs opacity-70">${pricing.yearly.price} / year</span>
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Yearly
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlan("lifetime")}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    selectedPlan === "lifetime"
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400"
                  }`}
                >
                  <span>
                    <span className="block font-semibold">{pricing.lifetime.label}</span>
                    <span className="block text-xs opacity-70">${pricing.lifetime.price} one-time</span>
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Lifetime
                  </span>
                </button>
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={!canCheckout || isLoading || hasAccess}
              className="mt-5 w-full rounded-full bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              {isLoading ? "Starting checkout..." : "Unlock Plus"}
            </button>
            <p className="mt-3 text-xs text-muted">
              By continuing, you’ll be redirected to Freemius.
            </p>
          </div>
        </div>

        <section className="rounded-3xl surface-card p-5 shadow-soft sm:p-6">
          <h2 className="text-xl font-semibold text-main sm:text-2xl">Frequently asked questions</h2>
          <div className="mt-4 divide-y divide-surface border-y border-surface">
              {faqItems.map((item) => (
              <article key={item.question} className="py-4">
                <h3 className="text-sm font-semibold text-main">{item.question}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{item.answer}</p>
              </article>
            ))}
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: JSON.stringify(plusSchema)}}
          />
        </section>
      </section>
      <AppFooter strings={strings} />
    </main>
  );
}
