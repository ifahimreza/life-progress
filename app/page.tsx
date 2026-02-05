import {Suspense} from "react";
import MainPage from "./main-page";
import {getSEOTags, renderSchemaTags} from "../libs/seo";

export const metadata = getSEOTags({
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
