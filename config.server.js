import config from './config';

const appUrl = config.appUrl;

const serverConfig = {
	...config,

	supabase: {
		...config.supabase,
		serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
	},

	postmark: {
		apiKey: process.env.POSTMARK_API_KEY ?? '',
		senderEmail: process.env.POSTMARK_SENDER_EMAIL ?? '',
	},

	turnstile: {
		secretKey: process.env.TURNSTILE_SECRET_KEY ?? '',
	},

	freemius: {
		...config.freemius,
		productId: process.env.FREEMIUS_PRODUCT_ID ?? '',
		apiKey: process.env.FREEMIUS_API_KEY ?? '',
		secretKey: process.env.FREEMIUS_SECRET_KEY ?? '',
		publicKey: process.env.FREEMIUS_PUBLIC_KEY ?? '',
		isSandbox: process.env.FREEMIUS_SANDBOX === 'true',
		plans: {
			yearly: {
				...(config.freemius?.plans?.yearly ?? {}),
				id: 'yearly',
				planId: process.env.FREEMIUS_PLAN_ID_YEARLY ?? '',
			},
			lifetime: {
				...(config.freemius?.plans?.lifetime ?? {}),
				id: 'lifetime',
				planId: process.env.FREEMIUS_PLAN_ID_LIFETIME ?? '',
			},
		},
		checkout: {
			successUrl: `${appUrl}/?checkout=success`,
			cancelUrl: `${appUrl}/?checkout=cancel`,
		},
	},
};

export default serverConfig;
