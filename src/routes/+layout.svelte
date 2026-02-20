<script>
	let { children } = $props();
</script>

{@render children()}

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}
	
	:global(body) {
		font-family: system-ui, -apple-system, sans-serif;
		background: #0a0a0f;
		color: #e0e0e0;
		min-height: 100vh;
	}
</style>
