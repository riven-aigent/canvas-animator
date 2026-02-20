import { $ as ssr_context, a0 as ensure_array_like, a1 as attr_class, e as escape_html } from "../../chunks/index.js";
import "clsx";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let canvas;
    let ctx;
    let isPlaying = false;
    let currentFrame = 0;
    const presets = {
      particles: {
        name: "Particle Flow",
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
          ctx.fillStyle = "rgba(10, 10, 15, 0.1)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          state.particles.forEach((p) => {
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
        name: "Sine Waves",
        setup: () => ({ time: 0 }),
        render: (state) => {
          ctx.fillStyle = "#0a0a0f";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          state.time += 0.02;
          for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.strokeStyle = `hsl(${200 + i * 30}, 70%, 60%)`;
            ctx.lineWidth = 2;
            for (let x = 0; x < canvas.width; x += 5) {
              const y = canvas.height / 2 + Math.sin(x * 0.01 + state.time + i * 0.5) * 50 + Math.sin(x * 0.02 + state.time * 1.5) * 25;
              if (x === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
          }
        }
      },
      spiral: {
        name: "Golden Spiral",
        setup: () => ({ angle: 0, points: [] }),
        render: (state) => {
          ctx.fillStyle = "rgba(10, 10, 15, 0.05)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          state.angle += 0.05;
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = state.angle * 2;
          const x = centerX + Math.cos(state.angle) * radius;
          const y = centerY + Math.sin(state.angle) * radius;
          state.points.push({ x, y, age: 0 });
          state.points = state.points.filter((p) => {
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
        name: "Matrix Rain",
        setup: () => ({
          drops: Array.from({ length: Math.floor(canvas.width / 20) }, () => ({
            y: Math.random() * canvas.height,
            speed: Math.random() * 3 + 2,
            chars: Array.from({ length: 20 }, () => String.fromCharCode(12448 + Math.random() * 96))
          }))
        }),
        render: (state) => {
          ctx.fillStyle = "rgba(10, 10, 15, 0.1)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.font = "14px monospace";
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
            if (Math.random() < 0.1) {
              drop.chars[Math.floor(Math.random() * drop.chars.length)] = String.fromCharCode(12448 + Math.random() * 96);
            }
          });
        }
      }
    };
    let currentPreset = "particles";
    function resizeCanvas() {
      return;
    }
    function stopAnimation() {
      isPlaying = false;
    }
    onDestroy(() => {
      stopAnimation();
      window.removeEventListener("resize", resizeCanvas);
    });
    $$renderer2.push(`<div class="container svelte-1uha8ag"><header class="svelte-1uha8ag"><h1 class="svelte-1uha8ag">Canvas Animator</h1> <p class="svelte-1uha8ag">Generative art animations with HTML5 Canvas</p></header> <div class="main svelte-1uha8ag"><div class="canvas-container svelte-1uha8ag"><canvas class="svelte-1uha8ag"></canvas> <div class="overlay svelte-1uha8ag"><button class="icon-btn svelte-1uha8ag" title="Download frame">📷</button></div></div> <div class="controls svelte-1uha8ag"><div class="preset-grid svelte-1uha8ag"><!--[-->`);
    const each_array = ensure_array_like(Object.entries(presets));
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [key, preset] = each_array[$$index];
      $$renderer2.push(`<button${attr_class("preset-btn svelte-1uha8ag", void 0, { "active": currentPreset === key })}>${escape_html(preset.name)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="playback-controls svelte-1uha8ag">`);
    if (isPlaying) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button class="control-btn stop svelte-1uha8ag">⏹ Stop</button>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<button class="control-btn play svelte-1uha8ag">▶ Play</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="info svelte-1uha8ag"><p class="svelte-1uha8ag">Frame: ${escape_html(currentFrame)}</p> <p class="svelte-1uha8ag">Preset: ${escape_html(presets[currentPreset].name)}</p></div></div></div></div>`);
  });
}
export {
  _page as default
};
