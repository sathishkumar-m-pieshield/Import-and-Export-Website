<script lang="ts">
	import { onMount } from 'svelte';
	import { DEFAULT_CONTENT, readContent, saveContent, type SiteContent } from '#lib/content.ts';

	let content = $state<SiteContent>(structuredClone(DEFAULT_CONTENT));
	let marketsText = $state('');
	let trustPointsText = $state('');
	let saved = $state(false);
	let notice = $state('');
	let error = $state('');

	onMount(() => {
		content = structuredClone(readContent());
		marketsText = content.markets.join('\n');
		trustPointsText = content.trustPoints.join('\n');
	});

	function save(event: SubmitEvent) {
		event.preventDefault();
		content.markets = marketsText.split('\n').map((item) => item.trim()).filter(Boolean);
		content.trustPoints = trustPointsText.split('\n').map((item) => item.trim()).filter(Boolean);
		try {
			saveContent(content);
			saved = true;
			error = '';
			notice = 'Changes saved in this browser.';
			window.setTimeout(() => (saved = false), 2200);
		} catch {
			error = 'Could not save. Remove a large image or download a backup and try again.';
			notice = '';
		}
	}

	function addProduct() {
		content.products.push({ id: crypto.randomUUID(), name: '', description: '', image: '' });
	}

	function removeProduct(id: string) {
		content.products = content.products.filter((product) => product.id !== id);
	}

	async function imageAsDataUrl(file: File) {
		const image = await createImageBitmap(file);
		const scale = Math.min(1, 1200 / image.width, 900 / image.height);
		const canvas = document.createElement('canvas');
		canvas.width = Math.round(image.width * scale);
		canvas.height = Math.round(image.height * scale);
		const context = canvas.getContext('2d');
		if (!context) throw new Error('Image processing is not available in this browser.');
		context.drawImage(image, 0, 0, canvas.width, canvas.height);
		image.close();
		return canvas.toDataURL('image/jpeg', 0.8);
	}

	async function uploadProductImage(id: string, event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		try {
			const image = await imageAsDataUrl(file);
			const product = content.products.find((item) => item.id === id);
			if (product) product.image = image;
			error = '';
			notice = 'Image added. Save changes to keep it in this browser.';
		} catch {
			error = 'Could not load this image. Choose a JPG, PNG or WebP file.';
			notice = '';
		} finally {
			input.value = '';
		}
	}

	async function uploadLogo(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		try {
			content.logo = await imageAsDataUrl(file);
			error = '';
			notice = 'Logo added. Save changes to keep it in this browser.';
		} catch {
			error = 'Could not load this logo. Choose a JPG, PNG or WebP file.';
			notice = '';
		} finally {
			input.value = '';
		}
	}

	function downloadBackup() {
		const file = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(file);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'sanjay-global-traders-content.json';
		link.click();
		URL.revokeObjectURL(url);
		notice = 'Content backup downloaded.';
	}

	async function restoreBackup(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		try {
			const parsed = JSON.parse(await file.text()) as Partial<SiteContent>;
			if (
				typeof parsed.companyName !== 'string' ||
				!Array.isArray(parsed.products) ||
				!Array.isArray(parsed.markets) ||
				!Array.isArray(parsed.trustPoints)
			) {
				throw new Error('This file does not look like a site content backup.');
			}
			content = { ...DEFAULT_CONTENT, ...parsed };
			marketsText = content.markets.join('\n');
			trustPointsText = content.trustPoints.join('\n');
			saveContent(content);
			error = '';
			notice = 'Backup restored in this browser.';
		} catch (cause) {
			error = cause instanceof Error ? cause.message : 'Could not restore this file.';
			notice = '';
		} finally {
			input.value = '';
		}
	}
</script>

<svelte:head>
	<title>Content Admin | {content.companyName}</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<header class="admin-header">
	<a class="admin-brand" href="/">
		<img src={content.logo} alt="" />
		<span><strong>{content.companyName}</strong><small>{content.tagline}</small></span>
	</a>
	<div class="admin-header-actions">
		<a href="/" class="view-site">View website <span aria-hidden="true">↗</span></a>
		<button class="save-button" type="submit" form="content-form">{saved ? 'Saved' : 'Save changes'}</button>
	</div>
</header>

<main class="admin-main">
	<div class="admin-intro">
		<div><p class="eyebrow">Local content editor</p><h1>Website content</h1><p class="intro-copy">Update what visitors see on the public page.</p></div>
		<div class="local-badge"><span></span> Stored on this device only</div>
	</div>

	<div class="storage-notice"><strong>Browser-only storage</strong><span>Changes save to this browser only. They are not password-protected and do not sync to other devices. Download a backup before clearing browser data.</span></div>
	{#if notice}<p class="feedback" role="status">{notice}</p>{/if}
	{#if error}<p class="feedback error" role="alert">{error}</p>{/if}

	<div class="admin-layout">
		<aside class="admin-nav" aria-label="Editor sections">
			<a href="#company">Company</a>
			<a href="#products">Products</a>
			<a href="#markets">Target markets</a>
			<a href="#trust">Trust details</a>
			<a href="#backup">Backup</a>
		</aside>

		<form id="content-form" class="editor-form" onsubmit={save}>
			<section class="editor-section" id="company">
				<div class="section-heading"><div><span class="section-index">01</span><h2>Company & contact</h2></div><p>Core identity and enquiry details.</p></div>
				<div class="field-grid">
					<label class="field"><span>Company name</span><input bind:value={content.companyName} required /></label>
					<label class="field"><span>Tagline</span><input bind:value={content.tagline} /></label>
					<div class="field field-wide"><span>Company logo</span><div class="logo-upload-row"><img src={content.logo} alt="Current company logo" /><label class="upload-button">Choose logo<input type="file" accept="image/*" onchange={uploadLogo} /></label></div></div>
					<label class="field"><span>Business email</span><input type="email" bind:value={content.email} /></label>
					<label class="field"><span>Phone number</span><input type="tel" bind:value={content.phone} /></label>
					<label class="field"><span>WhatsApp number</span><input type="tel" bind:value={content.whatsapp} /></label>
					<label class="field field-wide"><span>Registered business address</span><textarea rows="2" bind:value={content.address}></textarea></label>
					<label class="field field-wide"><span>About the company</span><textarea rows="5" bind:value={content.about}></textarea></label>
				</div>
			</section>

			<section class="editor-section" id="products">
				<div class="section-heading"><div><span class="section-index">02</span><h2>Products</h2></div><button class="quiet-button" type="button" onclick={addProduct}>+ Add product</button></div>
				<div class="product-editor-list">
					{#each content.products as product, index (product.id)}
						<article class="product-editor">
							<div class="product-editor-top"><span>Product {String(index + 1).padStart(2, '0')}</span><button class="remove-button" type="button" onclick={() => removeProduct(product.id)}>Remove</button></div>
							<div class="field-grid">
								<label class="field"><span>Product name</span><input bind:value={product.name} required /></label>
								<label class="field"><span>Product image</span><label class="upload-button image-upload">Choose image<input type="file" accept="image/*" onchange={(event) => uploadProductImage(product.id, event)} /></label></label>
								<label class="field field-wide"><span>Short description</span><textarea rows="2" bind:value={product.description}></textarea></label>
							</div>
						</article>
					{/each}
					{#if content.products.length === 0}<p class="empty-state">No products yet. Add one to show it on the website.</p>{/if}
				</div>
			</section>

			<section class="editor-section" id="markets">
				<div class="section-heading"><div><span class="section-index">03</span><h2>Target markets & cities</h2></div><p>One place per line.</p></div>
				<label class="field"><span>Countries or cities shown on the public page</span><textarea rows="6" bind:value={marketsText}></textarea></label>
			</section>

			<section class="editor-section" id="trust">
				<div class="section-heading"><div><span class="section-index">04</span><h2>Trust details</h2></div><p>Only publish claims you can verify.</p></div>
				<label class="field"><span>Trade commitments, one per line</span><textarea rows="6" bind:value={trustPointsText}></textarea></label>
			</section>

			<section class="editor-section backup-section" id="backup">
				<div class="section-heading"><div><span class="section-index">05</span><h2>Backup & restore</h2></div><p>Move content between browsers manually.</p></div>
				<div class="backup-actions"><button class="quiet-button" type="button" onclick={downloadBackup}>Download JSON backup ↓</button><label class="upload-button">Restore from JSON<input type="file" accept="application/json,.json" onchange={restoreBackup} /></label></div>
			</section>

			<div class="mobile-save"><button class="save-button" type="submit">{saved ? 'Saved' : 'Save changes'}</button></div>
		</form>
	</div>
</main>

<style>
	.admin-header { position: sticky; z-index: 3; top: 0; min-height: 70px; display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 0 max(24px, calc((100vw - 1180px) / 2)); border-bottom: 1px solid var(--line); background: rgba(255,255,255,.96); backdrop-filter: blur(12px); }
	.admin-brand { display: flex; align-items: center; gap: 11px; color: var(--ink); text-decoration: none; }
	.admin-brand img { flex: 0 0 auto; width: 48px; height: 48px; object-fit: contain; }
	.admin-brand > span { min-width: 0; }
	.admin-brand strong, .admin-brand small { display: block; }
	.admin-brand strong { overflow-wrap: anywhere; font: 600 12px Georgia, 'Times New Roman', serif; }
	.admin-brand small { margin-top: 4px; color: var(--muted); font-size: 9px; }
	.admin-header-actions { display: flex; align-items: center; gap: 24px; }
	.view-site { color: var(--muted); font-size: 12px; font-weight: 600; text-decoration: none; }
	.view-site span { color: var(--green); }
	.save-button { min-height: 40px; border: 0; border-radius: 4px; padding: 0 17px; background: var(--ink); color: white; font-size: 12px; font-weight: 700; }
	.save-button:hover { background: #1d5360; }
	.admin-main { width: min(1120px, calc(100% - 48px)); margin: 0 auto; padding: 50px 0 90px; }
	.admin-intro { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 25px; }
	.admin-intro .eyebrow { margin-bottom: 9px; }
	.admin-intro h1 { margin: 0 0 7px; font-size: 36px; }
	.intro-copy { margin: 0; color: var(--muted); font-size: 13px; }
	.local-badge { display: flex; align-items: center; gap: 8px; color: var(--muted); font-size: 11px; }
	.local-badge span { width: 7px; height: 7px; border-radius: 50%; background: var(--green); }
	.storage-notice { display: flex; gap: 13px; margin-bottom: 17px; border-left: 3px solid #d59b52; padding: 14px 16px; background: #fff6e8; color: #69553c; font-size: 11px; line-height: 1.6; }
	.storage-notice strong { flex: 0 0 auto; color: #4a3b2b; }
	.feedback { margin: 0 0 16px; color: #187755; font-size: 12px; }
	.feedback.error { color: #a23434; }
	.admin-layout { display: grid; grid-template-columns: 190px minmax(0, 1fr); align-items: start; gap: 52px; }
	.admin-nav { position: sticky; top: 95px; display: flex; flex-direction: column; border-left: 1px solid var(--line); }
	.admin-nav a { padding: 11px 0 11px 14px; color: var(--muted); font-size: 12px; text-decoration: none; }
	.admin-nav a:hover { border-left: 2px solid var(--green); color: var(--ink); }
	.editor-form { min-width: 0; }
	.editor-section { scroll-margin-top: 94px; margin-bottom: 18px; border: 1px solid var(--line); border-radius: 4px; padding: 25px; background: white; }
	.section-heading { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 22px; }
	.section-heading > div { display: flex; align-items: center; gap: 12px; }
	.section-heading h2 { margin: 0; font-size: 17px; }
	.section-heading > p { margin: 0; color: var(--muted); font-size: 10px; }
	.section-index { color: var(--green); font: 600 11px 'Space Grotesk', sans-serif; }
	.field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
	.field { min-width: 0; display: flex; flex-direction: column; gap: 7px; }
	.field-wide { grid-column: 1 / -1; }
	.field > span { color: #536a70; font-size: 10px; font-weight: 700; }
	.field input, .field textarea { width: 100%; border: 1px solid #ccd9d5; border-radius: 3px; padding: 10px 11px; background: #fcfdfc; color: var(--ink); font-size: 12px; line-height: 1.55; }
	.field input:focus, .field textarea:focus { border-color: var(--green); outline: 2px solid rgba(16, 154, 116, .14); }
	.field textarea { resize: vertical; }
	.product-editor-list { display: grid; gap: 13px; }
	.product-editor { border: 1px solid #e3ebe7; border-radius: 3px; padding: 15px; background: #fbfdfb; }
	.logo-upload-row { display: flex; align-items: center; gap: 15px; }
	.logo-upload-row img { width: min(230px, 65%); height: 62px; object-fit: contain; object-position: left center; }
	.image-upload { width: fit-content; }
	.product-editor-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; color: var(--muted); font-size: 10px; font-weight: 700; text-transform: uppercase; }
	.quiet-button, .upload-button { min-height: 38px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #b8cbc3; border-radius: 3px; padding: 0 13px; background: white; color: var(--ink); font-size: 11px; font-weight: 700; }
	.quiet-button:hover, .upload-button:hover { border-color: var(--green); }
	.remove-button { border: 0; background: transparent; color: #a04b45; font-size: 10px; }
	.empty-state { margin: 0; color: var(--muted); font-size: 12px; }
	.backup-section { margin-bottom: 0; }
	.backup-actions { display: flex; flex-wrap: wrap; gap: 10px; }
	.upload-button { position: relative; overflow: hidden; cursor: pointer; }
	.upload-button input { position: absolute; inset: 0; width: 100%; height: 100%; cursor: pointer; opacity: 0; }
	.mobile-save { display: none; }
	@media (max-width: 760px) {
		.admin-header { padding-inline: 16px; }
		.admin-brand img { width: 42px; height: 42px; }
		.admin-main { width: calc(100% - 32px); padding-top: 35px; }
		.admin-intro { align-items: flex-start; flex-direction: column; }
		.admin-layout { grid-template-columns: 1fr; gap: 16px; }
		.admin-nav { position: static; flex-direction: row; overflow-x: auto; border: 0; border-bottom: 1px solid var(--line); }
		.admin-nav a { flex: 0 0 auto; padding: 10px 12px; }
		.admin-nav a:hover { border: 0; border-bottom: 2px solid var(--green); }
	}
	@media (max-width: 520px) {
		.admin-header-actions { gap: 12px; }
		.admin-header-actions .save-button { display: none; }
		.admin-intro h1 { font-size: 30px; }
		.admin-brand img { width: 36px; height: 36px; }
		.storage-notice { flex-direction: column; gap: 3px; }
		.editor-section { padding: 17px 14px; }
		.section-heading { align-items: flex-start; flex-direction: column; }
		.field-grid { grid-template-columns: 1fr; }
		.field-wide { grid-column: auto; }
		.mobile-save { display: flex; justify-content: flex-end; padding-top: 10px; }
	}
</style>