import type { MetaFunction } from "@remix-run/node";
import Analytics from '@vercel/analytics'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useEffect } from "react";

import styles from "~/index.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { setupGoogleAnalytics } from "./utils/GoogleAnalytics";

export const meta: MetaFunction = () => {
  const title = "VSCode Shortcuts: The open source VSCode cheat sheet";
  const description =
    "VSCode Shortcuts is the most comprehensive Visual Studio Code shortcut resource. Unleash your programming productivity with these Visual Studio Code keyboard hotkeys.";

  return {
    charset: "utf-8",
    title,
    description,
    viewport: "width=device-width,initial-scale=1",
    "og:url": "https://vscodeshortcuts.com",
    "og:type": "website",
    "og:title": title,
    "og:description": description,
    "og:image": "https://vscodeshortcuts.com/SocialCard2.png",
    "twitter:card": "summary_large_image",
    "twitter:domain": "vscodeshortcuts.com",
    "twitter:url": "https://vscodeshortcuts.com",
    "twitter:title": title,
    "twitter:description": description,
    "twitter:image": "https://vscodeshortcuts.com/SocialCard2.png",
  };
};

export function links() {
  return [{ href: styles, rel: "stylesheet" }];
}

export default function App() {
  useEffect(() => {
    setupGoogleAnalytics();
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-YTYZCJEYRB"
        />

        <Meta />
        <Links />
      </head>
      <body className="scroll-smooth bg-slate-900">
        <div className="min-h-screen">
          <Header />
          <div className="px-2">
            <Outlet />
          </div>
        </div>
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
 <Analytics />
      </body>
    </html>
  );
}
