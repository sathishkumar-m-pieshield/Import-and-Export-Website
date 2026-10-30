<script lang="ts">
	import { onMount } from 'svelte';
	import { DEFAULT_CONTENT, readContent, type SiteContent } from '#lib/content.ts';

	let content = $state<SiteContent>(DEFAULT_CONTENT);
	let whatsappUrl = $derived(makeWhatsappUrl());

	function makeWhatsappUrl(productName?: string) {
		const enquiry = productName
			? `Hello Sanjay Global Traders, I would like to enquire about ${productName}.`
			: 'Hello Sanjay Global Traders, I would like to enquire about your export products.';
		return `https://wa.me/${content.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(enquiry)}`;
	}

	onMount(() => {
		content = readContent();
		const syncContent = (event: StorageEvent) => {
			if (event.key === 'sgt-site-content-v1') content = readContent();
		};
		window.addEventListener('storage', syncContent);
		return () => window.removeEventListener('storage', syncContent);
	});
</script>

<svelte:head>
	<title>{content.companyName} | Exporting from Tamil Nadu</title>
	<meta name="description" content={content.about} />
</svelte:head>

<header class="site-header">
	<div class="wrap header-inner">
		<a class="brand" href="#top" aria-label={`${content.companyName} home`}>
			<img class="brand-logo" src={content.logo} alt="" />
			<span class="brand-copy"><strong class="brand-name">{content.companyName}</strong><small>{content.tagline}</small></span>
		</a>
		<nav aria-label="Main navigation">
			<a href="#products">Products</a>
			<a href="#markets">Markets</a>
			<a href="#about">About</a>
		</nav>
		<a class="header-cta" href={whatsappUrl} target="_blank" rel="noreferrer">Talk to our team <span aria-hidden="true">↗</span></a>
	</div>
</header>

<main id="top">
	<section class="hero">
		<div class="wrap hero-grid">
			<div class="hero-copy">
				<p class="eyebrow"><span class="eyebrow-dot"></span> Exporting from Tamil Nadu, India</p>
				<h1>Good produce.<br /><span>Greater reach.</span></h1>
				<p class="hero-intro">{content.tagline}. We connect global buyers with carefully sourced agricultural products from India.</p>
				<div class="hero-actions">
					<a class="button button-primary" href="#products">Explore our products <span aria-hidden="true">↓</span></a>
					<a class="text-link" href={whatsappUrl} target="_blank" rel="noreferrer">Start an enquiry <span aria-hidden="true">↗</span></a>
				</div>
				<div class="hero-footnote"><span class="footnote-rule"></span><span>Rooted in Tamil Nadu<br />Open to global trade</span></div>
			</div>
			<div class="hero-visual" aria-label="Fresh produce sourced for international trade" role="img">
				<div class="hero-photo"></div>
				<div class="hero-note"><span class="note-index">01 / 03</span><strong>Fresh from the source</strong><span>Product enquiries welcome</span></div>
				<div class="hero-stamp"><span>INDIA</span><strong>↗</strong><span>WORLD</span></div>
			</div>
		</div>
	</section>

	<section class="trust-strip" aria-label="Trade commitments">
		<div class="wrap trust-strip-inner">
			<p>Trade, built on</p>
			{#each content.trustPoints.slice(0, 3) as point}
				<span class="trust-item"><span class="check-mark">✓</span>{point}</span>
			{/each}
		</div>
	</section>

	<section class="products-section" id="products">
		<div class="wrap">
			<div class="section-heading">
				<div>
					<p class="eyebrow">What we trade</p>
					<h2 class="section-title">Fresh produce, thoughtfully sourced.</h2>
				</div>
				<p class="section-copy">A focused range for importers, distributors and wholesale buyers. Contact us for availability and export enquiries.</p>
			</div>
			<div class="product-grid">
				{#each content.products as product, index (product.id)}
					<article class="product-item">
						<div class="product-image-wrap">
							<img src={product.image} alt={product.name} loading="lazy" />
							<span class="product-number">0{index + 1}</span>
						</div>
						<div class="product-caption">
							<div><h3>{product.name}</h3><p>{product.description}</p></div>
							<a href={makeWhatsappUrl(product.name)} target="_blank" rel="noreferrer" aria-label={`Enquire about ${product.name}`}>↗</a>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="markets-section" id="markets">
		<div class="wrap markets-layout">
			<div class="markets-copy">
				<p class="eyebrow">A regional starting point</p>
				<h2 class="section-title">Near to home.<br />Ready for the world.</h2>
				<p class="section-copy">We are building trade relationships across nearby markets. Get in touch to discuss sourcing and shipment requirements.</p>
				<span class="market-label">Initial target markets</span>
			</div>
			<div class="market-list">
				{#each content.markets as market, index}
					<div class="market-row"><span class="market-index">0{index + 1}</span><strong>{market}</strong><span class="market-arrow" aria-hidden="true">↗</span></div>
				{/each}
			</div>
		</div>
	</section>

	<section class="about-section" id="about">
		<div class="wrap about-layout">
			<div class="about-heading">
				<p class="eyebrow">About {content.companyName}</p>
				<h2 class="section-title">Relationships first.<br />Trade that lasts.</h2>
			</div>
			<div class="about-copy">
				<p>{content.about}</p>
				<ul>
					{#each content.trustPoints as point}
						<li><span>+</span>{point}</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<section class="contact-band" id="contact">
		<div class="wrap contact-layout">
			<div><p class="eyebrow">Let’s talk trade</p><h2>Have a product enquiry?</h2><p>Tell us what you’re looking for. Our team is ready to connect.</p></div>
			<a class="button button-light" href={whatsappUrl} target="_blank" rel="noreferrer">Message us on WhatsApp <span aria-hidden="true">↗</span></a>
		</div>
	</section>
</main>

<footer class="site-footer">
	<div class="wrap footer-top">
		<div class="footer-brand"><a class="brand" href="#top"><img class="brand-logo" src={content.logo} alt="" /><span class="brand-copy"><strong class="brand-name">{content.companyName}</strong><small>{content.tagline}</small></span></a><p>Connecting commerce, empowering trade.</p></div>
		<div class="footer-contact"><span class="eyebrow">Contact</span><a href={`mailto:${content.email}`}>{content.email}</a><a href={`tel:${content.phone.replace(/\s/g, '')}`}>{content.phone}</a><a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp {content.whatsapp}</a></div>
		<div class="footer-contact"><span class="eyebrow">Find us</span><p>{content.address}</p></div>
	</div>
	<div class="wrap footer-bottom"><span>© {new Date().getFullYear()} {content.companyName}</span><a href="/admin">Content admin ↗</a><span>Made for global trade</span></div>
</footer>

<style>
	.site-header { position: relative; z-index: 2; border-bottom: 1px solid rgba(16, 43, 56, .09); background: rgba(247, 250, 247, .94); }
	.header-inner { min-height: 78px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
	.brand { display: inline-flex; min-width: 0; align-items: center; gap: 10px; color: var(--ink); text-decoration: none; }
	.brand-logo { flex: 0 0 auto; width: 52px; height: 52px; object-fit: contain; }
	.brand-copy { min-width: 0; display: block; }
	.brand-name { display: block; overflow-wrap: anywhere; font-size: 13px; line-height: 1.15; }
	.brand-copy small { display: block; margin-top: 4px; color: var(--muted); font-size: 9px; line-height: 1.25; }
	nav { display: flex; gap: 32px; }
	nav a, .header-cta { color: var(--ink); font-size: 12px; font-weight: 600; text-decoration: none; }
	nav a:hover, .footer-contact a:hover, .footer-bottom a:hover { color: var(--green); }
	.header-cta { display: flex; align-items: center; gap: 12px; }
	.header-cta span { color: var(--green); font-size: 17px; }
	.hero { overflow: hidden; padding: 58px 0 66px; background: radial-gradient(ellipse at 86% 28%, rgba(201, 231, 107, .18), transparent 36%), var(--paper); }
	.hero-grid { display: grid; grid-template-columns: .92fr 1.08fr; align-items: center; gap: 42px; }
	.hero-copy { padding: 18px 0 12px; }
	.eyebrow { display: flex; align-items: center; gap: 8px; margin-bottom: 22px; }
	.eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); }
	.hero h1 { margin: 0 0 21px; font-size: 70px; line-height: .99; letter-spacing: 0; }
	.hero h1 span { color: var(--green); }
	.hero-intro { max-width: 445px; margin-bottom: 26px; color: var(--muted); font-size: 16px; line-height: 1.7; }
	.hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 22px; }
	.text-link { color: var(--ink); font-size: 13px; font-weight: 700; text-decoration: none; }
	.text-link span { margin-left: 8px; color: var(--green); }
	.hero-footnote { display: flex; align-items: center; gap: 13px; margin-top: 54px; color: var(--muted); font-size: 10px; line-height: 1.5; }
	.footnote-rule { width: 38px; height: 1px; background: var(--green); }
	.hero-visual { position: relative; min-height: 460px; }
	.hero-photo { position: absolute; inset: 0 26px 26px 0; border-radius: 3px; background: linear-gradient(180deg, rgba(10, 43, 50, .02), rgba(10, 43, 50, .16)), url('/images/hero-produce.jpg') center / cover no-repeat; }
	.hero-note { position: absolute; right: 0; bottom: 0; width: min(235px, 57%); min-height: 116px; display: flex; flex-direction: column; justify-content: center; gap: 7px; padding: 19px; background: var(--white); box-shadow: 0 15px 40px rgba(16, 43, 56, .1); }
	.note-index { color: var(--green); font-size: 9px; font-weight: 700; letter-spacing: .12em; }
	.hero-note strong { font: 600 16px Georgia, 'Times New Roman', serif; }
	.hero-note > span:last-child { color: var(--muted); font-size: 11px; }
	.hero-stamp { position: absolute; top: 21px; right: 45px; width: 67px; height: 67px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,.7); border-radius: 50%; color: white; font-size: 8px; letter-spacing: .1em; backdrop-filter: blur(4px); }
	.hero-stamp strong { font-size: 19px; }
	.trust-strip { border-block: 1px solid var(--line); background: #fff; }
	.trust-strip-inner { min-height: 70px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
	.trust-strip p { margin: 0; color: var(--muted); font-size: 11px; }
	.trust-item { display: flex; align-items: center; gap: 9px; color: var(--ink); font-size: 11px; font-weight: 600; }
	.check-mark { color: var(--green); font-size: 14px; }
	.products-section { padding: 102px 0 112px; }
	.section-heading { display: flex; align-items: end; justify-content: space-between; gap: 36px; margin-bottom: 38px; }
	.section-heading .eyebrow { margin-bottom: 16px; }
	.section-heading .section-title { max-width: 580px; margin-bottom: 0; }
	.section-heading .section-copy { max-width: 370px; margin: 0 0 5px; font-size: 13px; }
	.product-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 24px; }
	.product-item { min-width: 0; }
	.product-image-wrap { position: relative; aspect-ratio: 1.12 / 1; overflow: hidden; background: #d9e8dc; }
	.product-image-wrap::after { position: absolute; inset: 0; content: ''; background: linear-gradient(180deg, transparent 55%, rgba(12, 35, 40, .25)); pointer-events: none; }
	.product-image-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
	.product-item:hover img { transform: scale(1.035); }
	.product-number { position: absolute; z-index: 1; top: 15px; left: 15px; color: white; font: 600 11px 'Space Grotesk', sans-serif; }
	.product-caption { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px 0 0; }
	.product-caption h3 { margin: 0 0 7px; font-size: 20px; }
	.product-caption p { max-width: 290px; margin: 0; color: var(--muted); font-size: 12px; line-height: 1.6; }
	.product-caption > a { flex: 0 0 38px; width: 38px; height: 38px; display: grid; place-items: center; border: 1px solid var(--line); border-radius: 50%; color: var(--green); font-size: 17px; text-decoration: none; }
	.markets-section { padding: 94px 0 100px; background: #eaf3ed; }
	.markets-layout { display: grid; grid-template-columns: .85fr 1.15fr; align-items: center; gap: 90px; }
	.markets-copy .section-title { margin-bottom: 20px; }
	.markets-copy .eyebrow { margin-bottom: 18px; }
	.markets-copy .section-copy { margin-bottom: 28px; font-size: 13px; }
	.market-label { display: inline-flex; border-bottom: 1px solid #91b5a2; padding-bottom: 5px; color: #42715f; font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
	.market-list { border-top: 1px solid #b9d1c2; }
	.market-row { min-height: 61px; display: grid; grid-template-columns: 44px 1fr 30px; align-items: center; border-bottom: 1px solid #b9d1c2; }
	.market-index { color: #6b8b7b; font-size: 10px; }
	.market-row strong { font: 500 18px Georgia, 'Times New Roman', serif; }
	.market-arrow { justify-self: end; color: var(--green); font-size: 15px; }
	.about-section { padding: 98px 0 108px; }
	.about-layout { display: grid; grid-template-columns: .8fr 1.2fr; gap: 90px; }
	.about-heading .eyebrow { margin-bottom: 18px; }
	.about-copy > p { max-width: 680px; color: var(--muted); font-size: 14px; line-height: 1.9; }
	.about-copy ul { display: grid; grid-template-columns: 1fr 1fr; gap: 15px 24px; margin: 28px 0 0; padding: 0; list-style: none; }
	.about-copy li { display: flex; align-items: flex-start; gap: 9px; color: var(--ink); font-size: 12px; line-height: 1.5; }
	.about-copy li span { color: var(--green); font-size: 16px; line-height: 1; }
	.contact-band { padding: 54px 0; background: var(--ink); color: white; }
	.contact-layout { display: flex; align-items: center; justify-content: space-between; gap: 30px; }
	.contact-layout .eyebrow { margin-bottom: 13px; color: var(--lime); }
	.contact-layout h2 { margin: 0 0 8px; font-size: clamp(27px, 3.3vw, 40px); }
	.contact-layout p:last-child { margin: 0; color: #bed0d0; font-size: 13px; }
	.site-footer { padding: 50px 0 0; background: #f0f5f2; }
	.footer-top { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 55px; padding-bottom: 40px; }
	.footer-brand > p { margin: 18px 0 0; color: var(--muted); font-size: 11px; }
	.footer-contact { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
	.footer-contact .eyebrow { margin-bottom: 3px; }
	.footer-contact a, .footer-contact p { margin: 0; color: var(--ink); font-size: 11px; line-height: 1.7; text-decoration: none; }
	.footer-bottom { min-height: 54px; display: flex; align-items: center; justify-content: space-between; gap: 16px; border-top: 1px solid var(--line); color: var(--muted); font-size: 10px; }
	.footer-bottom a { color: var(--muted); text-decoration: none; }

	@media (max-width: 900px) {
		.hero-grid { grid-template-columns: 1fr 1fr; gap: 25px; }
		.hero-visual { min-height: 395px; }
		.hero h1 { font-size: 56px; }
		.trust-strip-inner { flex-wrap: wrap; justify-content: flex-start; padding-block: 17px; }
		.trust-strip p { flex-basis: 100%; }
		.markets-layout, .about-layout { gap: 48px; }
	}
	@media (max-width: 680px) {
		.header-inner { min-height: 68px; }
		nav { display: none; }
		.header-cta { font-size: 11px; }
		.brand { gap: 7px; }
		.brand-logo { width: 40px; height: 40px; }
		.brand-name { font-size: 10px; }
		.brand-copy small { max-width: 170px; font-size: 7px; }
		.hero { padding: 43px 0 42px; }
		.hero-grid { grid-template-columns: 1fr; gap: 34px; }
		.hero h1 { font-size: 48px; }
		.hero-intro { font-size: 14px; }
		.hero-footnote { margin-top: 34px; }
		.hero-visual { min-height: 330px; }
		.hero-photo { inset: 0 19px 19px 0; }
		.hero-note { min-height: 96px; padding: 14px; }
		.trust-strip-inner { gap: 13px 20px; }
		.trust-item { width: calc(50% - 12px); font-size: 10px; }
		.products-section, .about-section { padding: 68px 0 72px; }
		.section-heading { display: block; margin-bottom: 28px; }
		.section-heading .section-copy { margin-top: 16px; }
		.product-grid { grid-template-columns: 1fr; gap: 32px; }
		.product-image-wrap { aspect-ratio: 1.35 / 1; }
		.markets-section { padding: 68px 0 72px; }
		.markets-layout, .about-layout { grid-template-columns: 1fr; gap: 28px; }
		.about-copy ul { grid-template-columns: 1fr; }
		.contact-layout { align-items: flex-start; flex-direction: column; }
		.footer-top { grid-template-columns: 1fr 1fr; gap: 32px 20px; }
		.footer-brand { grid-column: 1 / -1; }
		.footer-bottom { flex-wrap: wrap; justify-content: flex-start; padding-block: 14px; }
	}
	@media (max-width: 390px) {
		.brand-logo { width: 34px; height: 34px; }
		.header-inner { gap: 8px; }
		.header-cta { gap: 5px; font-size: 10px; }
		.brand-copy small { display: none; }
		.hero h1 { font-size: 42px; }
	}
</style>
