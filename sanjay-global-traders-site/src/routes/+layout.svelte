<script lang="ts">
	import '../app.css';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href="/brand-logo.svg" type="image/svg+xml" />
</svelte:head>

{@render children()}
