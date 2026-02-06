import {ReactNode} from "react";
import {getSEOTags} from "../../libs/seo";

export const metadata = getSEOTags({
  title: "DotSpan Plus - Pricing, Features, and FAQ",
  description:
    "Unlock DotSpan Plus with print-ready PDF, theme pack, shareable link, and weekly reminders. Compare yearly and lifetime pricing.",
  canonicalUrlRelative: "/plus"
});

export default function PlusLayout({children}: {children: ReactNode}) {
  return children;
}
