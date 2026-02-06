"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import AppFooter from "../../components/AppFooter";
import {getTranslations} from "../../libs/i18n";
import {useSupabaseAuth} from "../../libs/useSupabaseAuth";

export default function AdminPage() {
  const router = useRouter();
  const strings = getTranslations("default", "en");
  const {session, userId, isLoading} = useSupabaseAuth({redirectPath: "/admin"});
  const isAdmin =
    session?.user?.app_metadata?.role === "admin" ||
    session?.user?.user_metadata?.role === "admin";

  useEffect(() => {
    if (isLoading) return;
    if (!userId) {
      router.replace("/login");
    }
  }, [isLoading, router, userId]);

  return (
    <main className="flex min-h-screen flex-col py-6">
      <section className="mx-auto flex w-full max-w-[860px] flex-1 flex-col gap-6 px-4 sm:px-6">
        <div className="rounded-3xl surface-card p-6 shadow-soft">
          <h1 className="text-2xl font-semibold text-main">Admin</h1>
          {isLoading ? (
            <p className="mt-3 text-sm text-muted">Checking session...</p>
          ) : !userId ? (
            <p className="mt-3 text-sm text-muted">Redirecting to login...</p>
          ) : isAdmin ? (
            <p className="mt-3 text-sm text-muted">
              Admin access verified. Add admin tools here.
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted">
              You do not have permission to view this page.
            </p>
          )}
        </div>
      </section>
      <AppFooter strings={strings} />
    </main>
  );
}
