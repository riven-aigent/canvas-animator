<script>
	import { onMount, onDestroy } from 'svelte';
	
	let canvas;
	let ctx;
	let animationId;
	let isPlaying = false;
	let currentFrame = 0;
	let fps = 30;
	
	// Animation presets
	const presets = {
		particles: {
			name: 'Particle Flow',
			setup: () => ({
				particles: Array.from({ length: 50 }, () => ({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					vx: (Math.random() - 0.5) * 2,
					vy: (Math.random() - 0.5) * 2,
					size: Math.random() * 4 + 2,
					color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
				}))
			}),
			render: (state) => {
				ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				
				state.particles.forEach(p => {
					p.x += p.vx;
					p.y += p.vy;
					
					if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
					if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
					
					ctx.beginPath();
					ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
					ctx.fillStyle = p.color;
					ctx.fill();
				});
			}
		},
		waves: {
			name: 'Sine Waves',
			setup: () => ({ time: 0 }),
			render: (state) => {
				ctx.fillStyle = '#0a0a0f';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				
				state.time += 0.02;
				
				for (let i = 0; i < 5; i++) {
					ctx.beginPath();
					ctx.strokeStyle = `hsl(${200 + i * 30}, 70%, 60%)`;
					ctx.lineWidth = 2;
					
					for (let x = 0; x < canvas.width; x += 5) {
						const y = canvas.height / 2 + 
							Math.sin(x * 0.01 + state.time + i * 0.5) * 50 +
							Math.sin(x * 0.02 + state.time * 1.5) * 25;
						
						if (x === 0) ctx.moveTo(x, y);
						else ctx.lineTo(x, y);
					}
					ctx.stroke();
				}
			}
		},
		spiral: {
			name: 'Golden Spiral',
			setup: () => ({ angle: 0, points: [] }),
			render: (state) => {
				ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				
				state.angle += 0.05;
				const centerX = canvas.width / 2;
				const centerY = canvas.height / 2;
				const radius = state.angle * 2;
				
				const x = centerX + Math.cos(state.angle) * radius;
				const y = centerY + Math.sin(state.angle) * radius;
				
				state.points.push({ x, y, age: 0 });
				
				state.points = state.points.filter(p => {
					p.age++;
					const alpha = 1 - p.age / 100;
					if (alpha <= 0) return false;
					
					ctx.beginPath();
					ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
					ctx.fillStyle = `hsla(${state.angle * 10 % 360}, 70%, 60%, ${alpha})`;
					ctx.fill();
					return true;
				});
			}
		},
		matrix: {
			name: 'Matrix Rain',
			setup: () => ({
				drops: Array.from({ length: Math.floor(canvas.width / 20) }, () => ({
					y: Math.random() * canvas.height,
					speed: Math.random() * 3 + 2,
					chars: Array.from({ length: 20 }, () => 
						String.fromCharCode(0x30A0 + Math.random() * 96)
					)
				}))
			}),
			render: (state) => {
				ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				
				ctx.font = '14px monospace';
				
				state.drops.forEach((drop, i) => {
					drop.y += drop.speed;
					if (drop.y > canvas.height) drop.y = -20;
					
					drop.chars.forEach((char, j) => {
						const y = drop.y - j * 20;
						if (y < 0 || y > canvas.height) return;
						
						const alpha = j === 0 ? 1 : 0.5 - j * 0.05;
						ctx.fillStyle = `rgba(0, 255, 100, ${Math.max(0, alpha)})`;
						ctx.fillText(char, i * 20, y);
					});
					
					// Randomly change characters
					if (Math.random() < 0.1) {
						drop.chars[Math.floor(Math.random() * drop.chars.length)] = 
							String.fromCharCode(0x30A0 + Math.random() * 96);
					}
				});
			}
		}
	};
	
	let currentPreset = 'particles';
	let animationState = null;
	
	function resizeCanvas() {
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		canvas.width = rect.width;
		canvas.height = rect.height;
	}
	
	function animate() {
		if (!isPlaying) return;
		
		const preset = presets[currentPreset];
		if (preset && animationState) {
			preset.render(animationState);
		}
		
		currentFrame++;
		animationId = requestAnimationFrame(animate);
	}
	
	function startAnimation() {
		if (!animationState) {
			animationState = presets[currentPreset].setup();
		}
		isPlaying = true;
		animate();
	}
	
	function stopAnimation() {
		isPlaying = false;
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
	}
	
	function changePreset(key) {
		currentPreset = key;
		animationState = presets[key].setup();
		if (isPlaying) {
			ctx.fillStyle = '#0a0a0f';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
	}
	
	function downloadFrame() {
		const link = document.createElement('a');
		link.download = `canvas-animator-${currentPreset}-${Date.now()}.png`;
		link.href = canvas.toDataURL();
		link.click();
	}
	
	onMount(() => {
		ctx = canvas.getContext('2d');
		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);
		
		// Initial render
		ctx.fillStyle = '#0a0a0f';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	});
	
	onDestroy(() => {
		stopAnimation();
		window.removeEventListener('resize', resizeCanvas);
	});
</script>

<div class="container">
	<header>
		<h1>Canvas Animator</h1>
		<p>Generative art animations with HTML5 Canvas</p>
	</header>
	
	<div class="main">
		<div class="canvas-container">
			<canvas bind:this={canvas}></canvas>
			
			<div class="overlay">
				<button class="icon-btn" on:click={downloadFrame} title="Download frame">
					📷
				</button>
			</div>
		</div>
		
		<div class="controls">
			<div class="preset-grid">
				{#each Object.entries(presets) as [key, preset]}
					<button 
						class="preset-btn"
						class:active={currentPreset === key}
						on:click={() => changePreset(key)}
					>
						{preset.name}
					</button>
				{/each}
			</div>
			
			<div class="playback-controls">
				{#if isPlaying}
					<button class="control-btn stop" on:click={stopAnimation}>
						⏹ Stop
					</button>
				{:else}
					<button class="control-btn play" on:click={startAnimation}>
						▶ Play
					</button>
				{/if}
			</div>
			
			<div class="info">
				<p>Frame: {currentFrame}</p>
				<p>Preset: {presets[currentPreset].name}</p>
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
		min-height: 100vh;
	}
	
	header {
		text-align: center;
		margin-bottom: 30px;
	}
	
	h1 {
		font-size: 2.5rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	header p {
		color: #888;
		margin-top: 8px;
	}
	
	.main {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: 20px;
	}
	
	@media (max-width: 900px) {
		.main {
			grid-template-columns: 1fr;
		}
	}
	
	.canvas-container {
		position: relative;
		background: #111;
		border-radius: 12px;
		overflow: hidden;
		aspect-ratio: 16/9;
	}
	
	canvas {
		width: 100%;
		height: 100%;
		display: block;
	}
	
	.overlay {
		position: absolute;
		top: 10px;
		right: 10px;
		display: flex;
		gap: 8px;
	}
	
	.icon-btn {
		width: 40px;
		height: 40px;
		border: none;
		border-radius: 8px;
		background: rgba(0, 0, 0, 0.6);
		color: white;
		font-size: 1.2rem;
		cursor: pointer;
		transition: background 0.2s;
	}
	
	.icon-btn:hover {
		background: rgba(0, 0, 0, 0.8);
	}
	
	.controls {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	
	.preset-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
	
	.preset-btn {
		padding: 12px 16px;
		border: 2px solid #333;
		border-radius: 8px;
		background: #1a1a1f;
		color: #ccc;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 0.9rem;
	}
	
	.preset-btn:hover {
		border-color: #667eea;
		background: #222;
	}
	
	.preset-btn.active {
		border-color: #667eea;
		background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
		color: #fff;
	}
	
	.playback-controls {
		display: flex;
		gap: 10px;
	}
	
	.control-btn {
		flex: 1;
		padding: 16px;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.1s;
	}
	
	.control-btn:active {
		transform: scale(0.98);
	}
	
	.control-btn.play {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}
	
	.control-btn.stop {
		background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
		color: white;
	}
	
	.info {
		background: #1a1a1f;
		padding: 16px;
		border-radius: 8px;
		font-size: 0.9rem;
		color: #888;
	}
	
	.info p {
		margin: 4px 0;
	}
</style>
