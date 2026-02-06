/**
 * Global app configuration.
 * Each key explains how and why it is used so you can safely adjust it.
 */
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
const domainName =
	process.env.NEXT_PUBLIC_DOMAIN ??
	(() => {
		try {
			return new URL(appUrl).host;
		} catch {
			return appUrl;
		}
	})();

const config = {
	// Visible app name used in titles and UI.
	appName: 'DotSpan',

	// Short tagline for metadata and social previews.
	appDescription:
		'See time clearly with a minimalist life dots timeline',

	// Primary brand color used in UI accents and PWA theme color.
	brandColor: '#4e55e0',

	// Public app URL used for canonical links and auth callbacks.
	appUrl,

	// Root domain (no protocol) used for SEO.
	domainName,

	// Support contact shown in emails or help links.
	supportEmail: process.env.SUPPORT_EMAIL ?? '',

	// Supabase public configuration for auth and database access.
	supabase: {
		url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
		anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
	},

	// Authentication providers.
	auth: {
		google: {
			enabled: true,
		},
	},
};

export default config;
