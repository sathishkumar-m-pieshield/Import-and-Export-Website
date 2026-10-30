export type Product = {
	id: string;
	name: string;
	description: string;
	image: string;
};

export type SiteContent = {
	companyName: string;
	logo: string;
	tagline: string;
	about: string;
	email: string;
	phone: string;
	whatsapp: string;
	address: string;
	products: Product[];
	markets: string[];
	trustPoints: string[];
};

export const DEFAULT_CONTENT: SiteContent = {
	companyName: 'SANJAY GLOBAL TRADERS',
	logo: '/brand-logo.svg',
	tagline: 'Connecting Commerce, Empowering Trade',
	about:
		'Sanjay Global Traders is a dynamic import and export enterprise based in Tamil Nadu, India. We specialize in connecting global markets with quality-assured products, ensuring seamless trade compliance, transparent transactions, and reliable logistics. Our mission is to build lasting relationships with international buyers and suppliers through integrity and efficiency.',
	email: 'sanjayglobaltraders.official@gmail.com',
	phone: '+91 73051 49758',
	whatsapp: '+91 89253 49741',
	address: 'No. 463/A, 1st Street, Jawahar Nagar, Kilkuppam Post and Village, Arakkonam, Ranipet - 631004, Tamil Nadu, India',
	products: [
		{
			id: 'coconut',
			name: 'Coconut',
			description: 'Freshly sourced coconuts prepared for wholesale export enquiries.',
			image: '/images/coconut-open.jpg'
		},
		{
			id: 'greens',
			name: 'Greens',
			description: 'Leafy greens sourced for buyers seeking dependable fresh produce supply.',
			image: '/images/greens.jpg'
		},
		{
			id: 'banana-leaves',
			name: 'Banana Leaves',
			description: 'Fresh banana leaves available for bulk and international trade enquiries.',
			image: '/images/banana-leaves.jpg'
		}
	],
	markets: ['Sri Lanka', 'Maldives', 'Bangladesh', 'Nepal', 'Bhutan'],
	trustPoints: [
		'Quality-assured product sourcing',
		'Trade compliance and transparent transactions',
		'Reliable logistics coordination',
		'Business built on integrity and efficiency'
	]
};

const STORAGE_KEY = 'sgt-site-content-v1';

export function readContent(): SiteContent {
	if (typeof window === 'undefined') return DEFAULT_CONTENT;

	try {
		const saved = window.localStorage.getItem(STORAGE_KEY);
		if (!saved) return DEFAULT_CONTENT;

		const parsed = JSON.parse(saved) as Partial<SiteContent>;
		const products = Array.isArray(parsed.products)
			? parsed.products.map((product) => ({
					...product,
					image:
						product.image?.startsWith('data:image/') || product.image?.startsWith('/images/')
							? product.image
							: DEFAULT_CONTENT.products.find((item) => item.id === product.id)?.image ??
								'/images/produce-placeholder.svg'
				}))
			: DEFAULT_CONTENT.products;
		return {
			...DEFAULT_CONTENT,
			...parsed,
			logo:
				typeof parsed.logo === 'string' &&
				(parsed.logo.startsWith('data:image/') || parsed.logo === '/brand-logo.svg')
					? parsed.logo
					: DEFAULT_CONTENT.logo,
			products,
			markets: Array.isArray(parsed.markets) ? parsed.markets : DEFAULT_CONTENT.markets,
			trustPoints: Array.isArray(parsed.trustPoints)
				? parsed.trustPoints
				: DEFAULT_CONTENT.trustPoints
		};
	} catch {
		return DEFAULT_CONTENT;
	}
}

export function saveContent(content: SiteContent) {
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}