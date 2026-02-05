import "./globals.css";
import Providers from "../components/Providers";
import PwaSetup from "../components/PwaSetup";
import config from "../config";
import {getSEOTags} from "../libs/seo";

export const metadata = getSEOTags();

export const viewport = {
  themeColor: config.brandColor
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="app-body font-satoshi">
        <Providers>
          {children}
          <PwaSetup />
        </Providers>
      </body>
    </html>
  );
}
