import {Suspense} from "react";
import MainPage from "./main-page";
import {getSEOTags, renderSchemaTags} from "../libs/seo";

export const metadata = getSEOTags({
  title: "DotSpan | Your Life in Weeks Timeline",
  description:
    "DotSpan helps you visualize Your Life in Weeks with a clean dot timeline so you can see time in perspective and stay accountable.",
  canonicalUrlRelative: "/"
});

export default function Page() {
  return (
    <>
      {renderSchemaTags()}
      <Suspense fallback={null}>
        <MainPage />
      </Suspense>
    </>
  );
}
