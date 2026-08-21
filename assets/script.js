
/* ============ Header scroll state ============ */
const header = document.getElementById('siteHeader');
const scrollCue = document.querySelector('.scroll-cue');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    if (scrollCue) scrollCue.style.opacity = window.scrollY > 120 ? '0' : '1';
}, { passive: true });

/* ============ Mobile menu ============ */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
function toggleMenu() {
    const open = mobileMenu.classList.toggle('open');
    burger.querySelectorAll('span')[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
    burger.querySelectorAll('span')[1].style.opacity = open ? '0' : '1';
    burger.querySelectorAll('span')[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
    document.body.style.overflow = open ? 'hidden' : '';
}
burger.addEventListener('click', toggleMenu);
burger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) toggleMenu();
}));
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) toggleMenu();
});

/* ============ Cursor glow (desktop only) ============ */
const cursorGlow = document.getElementById('cursor-glow');
let hasFinePointer = window.matchMedia('(pointer:fine)').matches;
if (hasFinePointer) {
    window.addEventListener('mousemove', e => {
        cursorGlow.style.opacity = '1';
        cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    });
}

/* ============ Magnetic buttons ============ */
document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ============ Scroll reveal ============ */
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => io.observe(el));

/* ============ Bar fill animation on view ============ */
const bars = document.querySelectorAll('.bar-fill');
const barIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.width = entry.target.dataset.w + '%';
            barIo.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });
bars.forEach(b => barIo.observe(b));

/* ============ Counter animation ============ */
function animateCounter(el, target, duration, suffix) {
    suffix = suffix || '';
    let startTime = null;
    function step(ts) {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}
const counterIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(document.getElementById('statMarkets'), 120, 1400, '+');
            animateCounter(document.getElementById('statNodes'), 48, 1400, '+');
            counterIo.disconnect();
        }
    });
}, { threshold: 0.5 });
counterIo.observe(document.querySelector('.hero-stats'));

const mapCounterIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(document.getElementById('mapNodes'), 48, 1400, '');
            mapCounterIo.disconnect();
        }
    });
}, { threshold: 0.4 });
mapCounterIo.observe(document.getElementById('mapNodes'));

/* ============ Ticker content ============ */
const tickerData = [
    { s: 'BTC/USD', v: '67,240.5', d: '+2.41%', pos: true },
    { s: 'ETH/USD', v: '3,482.1', d: '+1.86%', pos: true },
    { s: 'EUR/USD', v: '1.0842', d: '-0.12%', pos: false },
    { s: 'GBP/USD', v: '1.2715', d: '+0.34%', pos: true },
    { s: 'SOL/USD', v: '182.44', d: '+4.02%', pos: true },
    { s: 'USD/JPY', v: '149.62', d: '-0.21%', pos: false },
    { s: 'XAU/USD', v: '2,398.7', d: '+0.55%', pos: true },
    { s: 'AUD/USD', v: '0.6621', d: '-0.08%', pos: false },
];
const track = document.getElementById('tickerTrack');
function buildTicker() {
    let html = '';
    for (let i = 0; i < 2; i++) {
        tickerData.forEach(t => {
            html += `<span><b>${t.s}</b>${t.v}<span class="${t.pos ? 'pos' : 'neg'}">${t.d}</span></span>`;
        });
    }
    track.innerHTML = html;
}
buildTicker();

/* ============ FAQ accordion ============ */
document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (item.classList.contains('open')) {
        a.style.maxHeight = a.scrollHeight + 'px';
    }
    q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(openItem => {
            if (openItem !== item) {
                openItem.classList.remove('open');
                openItem.querySelector('.faq-a').style.maxHeight = null;
            }
        });
        item.classList.toggle('open', !isOpen);
        a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
    });
});
window.addEventListener('resize', () => {
    document.querySelectorAll('.faq-item.open .faq-a').forEach(a => {
        a.style.maxHeight = a.scrollHeight + 'px';
    });
});
window.addEventListener('load', () => {
    document.querySelectorAll('.faq-item.open .faq-a').forEach(a => {
        a.style.maxHeight = a.scrollHeight + 'px';
    });
});
if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
        document.querySelectorAll('.faq-item.open .faq-a').forEach(a => {
            a.style.maxHeight = a.scrollHeight + 'px';
        });
    });
}

/* ============ Hero parallax (desktop only) ============ */
if (hasFinePointer) {
    const heroSection = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero-visual');
    const heroGlow = document.getElementById('heroGlow');
    if (heroSection) {
        heroSection.addEventListener('mousemove', e => {
            const r = heroSection.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            if (heroVisual) heroVisual.style.transform = `rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
            if (heroGlow) heroGlow.style.transform = `translate(${px * 30}px, ${py * 30}px)`;
        });
        heroSection.addEventListener('mouseleave', () => {
            if (heroVisual) heroVisual.style.transform = '';
        });
        if (heroVisual) heroVisual.style.transformStyle = 'preserve-3d';
    }
}

/* ============ Dashboard subtle tilt (desktop only) ============ */
if (hasFinePointer) {
    const dashEl = document.querySelector('.dash');
    if (dashEl) {
        dashEl.addEventListener('mousemove', e => {
            const r = dashEl.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            dashEl.style.transform = `perspective(1400px) rotateY(${px * 2.4}deg) rotateX(${-py * 2.4}deg)`;
        });
        dashEl.addEventListener('mouseleave', () => { dashEl.style.transform = ''; });
    }
}

/* ============ Background particles ============ */
(function particles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let w, h, particlesArr;
    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = document.documentElement.scrollHeight;
    }
    function init() {
        resize();
        const count = Math.min(70, Math.floor(w / 24));
        particlesArr = Array.from({ length: count }, () => ({
            x: Math.random() * w, y: Math.random() * h,
            r: Math.random() * 1.4 + 0.4,
            vy: -(Math.random() * 0.18 + 0.05),
            vx: (Math.random() - 0.5) * 0.08,
            o: Math.random() * 0.5 + 0.15,
            gold: Math.random() < 0.22
        }));
    }
    function draw() {
        ctx.clearRect(0, 0, w, h);
        particlesArr.forEach(p => {
            p.y += p.vy; p.x += p.vx;
            if (p.y < -10) p.y = h + 10;
            if (p.x < -10) p.x = w + 10;
            if (p.x > w + 10) p.x = -10;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.gold ? `rgba(203,164,99,${p.o})` : `rgba(34,232,212,${p.o})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    init();
    draw();
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(init, 250);
    });
})();

/* ============ Hero globe (wireframe rotating sphere) ============ */
(function globe() {
    const canvas = document.getElementById('globe-canvas');
    const ctx = canvas.getContext('2d');
    let w, h, dpr;
    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        w = canvas.width = rect.width * dpr;
        h = canvas.height = rect.height * dpr;
    }
    resize();
    window.addEventListener('resize', resize);
    const rings = 9, ptsPerRing = 26;
    const points = [];
    for (let i = 0; i <= rings; i++) {
        const lat = (Math.PI * i / rings) - Math.PI / 2;
        for (let j = 0; j < ptsPerRing; j++) {
            const lon = (2 * Math.PI * j / ptsPerRing);
            points.push({ lat, lon });
        }
    }
    const nodeIdx = [4, 15, 26, 37, 48, 66, 80, 95, 110, 130, 150];
    let rot = 0;
    function draw() {
        ctx.clearRect(0, 0, w, h);
        const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.36;
        rot += 0.0016;
        const projected = points.map((p, idx) => {
            const lon = p.lon + rot;
            const x = Math.cos(p.lat) * Math.sin(lon);
            const y = Math.sin(p.lat);
            const z = Math.cos(p.lat) * Math.cos(lon);
            return { x: cx + x * R, y: cy + y * R, z, idx, node: nodeIdx.includes(idx) };
        });
        const nodes = projected.filter(p => p.node && p.z > -0.2);
        ctx.lineWidth = 1 * dpr;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (Math.random() < 0.5) continue;
                const a = nodes[i], b = nodes[j];
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                if (dist > R * 1.6) continue;
                const alpha = (Math.min(a.z, b.z) + 1) / 2 * 0.35;
                ctx.strokeStyle = `rgba(203,164,99,${alpha})`;
                ctx.beginPath();
                const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 18 * dpr;
                ctx.moveTo(a.x, a.y);
                ctx.quadraticCurveTo(mx, my, b.x, b.y);
                ctx.stroke();
            }
        }
        projected.sort((a, b) => a.z - b.z).forEach(p => {
            const alpha = (p.z + 1) / 2;
            const size = (p.node ? 2.6 : 1.15) * dpr * (0.5 + alpha * 0.7);
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fillStyle = p.node ? `rgba(123,255,240,${0.35 + alpha * 0.65})` : `rgba(34,232,212,${0.08 + alpha * 0.4})`;
            ctx.fill();
            if (p.node && alpha > 0.55) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(34,232,212,${0.05 * alpha})`;
                ctx.fill();
            }
        });
        ctx.beginPath();
        ctx.arc(cx, cy, R * 1.02, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(34,232,212,0.18)';
        ctx.lineWidth = 1 * dpr;
        ctx.stroke();
        requestAnimationFrame(draw);
    }
    draw();
})();

/* ============ Dashboard candlestick / line chart ============ */
(function priceChart() {
    const canvas = document.getElementById('priceChart');
    const ctx = canvas.getContext('2d');
    let w, h, dpr;
    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = 220 * dpr;
        w = canvas.width; h = canvas.height;
    }
    resize();
    window.addEventListener('resize', resize);
    const n = 40;
    let price = 100;
    const candles = [];
    for (let i = 0; i < n; i++) {
        const open = price;
        const change = (Math.random() - 0.42) * 6;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * 3;
        const low = Math.min(open, close) - Math.random() * 3;
        candles.push({ open, close, high, low });
        price = close;
    }
    const allVals = candles.flatMap(c => [c.high, c.low]);
    const max = Math.max(...allVals), min = Math.min(...allVals);
    let animProgress = 0;
    function draw() {
        ctx.clearRect(0, 0, w, h);
        const pad = 10 * dpr;
        const cw = (w - pad * 2) / n;
        animProgress = Math.min(animProgress + 0.02, 1);
        const visibleCount = Math.floor(n * animProgress);
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = (h / 4) * i;
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
        candles.slice(0, visibleCount).forEach((c, i) => {
            const x = pad + i * cw + cw / 2;
            const yOpen = h - ((c.open - min) / (max - min)) * h;
            const yClose = h - ((c.close - min) / (max - min)) * h;
            const yHigh = h - ((c.high - min) / (max - min)) * h;
            const yLow = h - ((c.low - min) / (max - min)) * h;
            const up = c.close >= c.open;
            const color = up ? '#22e8d4' : '#e8836b';
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.9;
            ctx.lineWidth = 1 * dpr;
            ctx.beginPath();
            ctx.moveTo(x, yHigh); ctx.lineTo(x, yLow); ctx.stroke();
            const bodyW = cw * 0.55;
            const bodyTop = Math.min(yOpen, yClose);
            const bodyH = Math.max(Math.abs(yClose - yOpen), 1.5 * dpr);
            ctx.globalAlpha = 0.75;
            ctx.fillRect(x - bodyW / 2, bodyTop, bodyW, bodyH);
            ctx.globalAlpha = 1;
        });
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(203,164,99,0.75)';
        ctx.lineWidth = 1.6 * dpr;
        candles.slice(0, visibleCount).forEach((c, i) => {
            const x = pad + i * cw + cw / 2;
            const y = h - ((c.close - min) / (max - min)) * h;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();
        requestAnimationFrame(draw);
    }
    draw();
})();

/* ============ World map canvas ============ */
(function worldMap() {
    const canvas = document.getElementById('world-canvas');
    const ctx = canvas.getContext('2d');
    let w, h, dpr;
    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        w = canvas.width; h = canvas.height;
    }
    resize();
    window.addEventListener('resize', resize);
    const continents = [
        { cx: 0.19, cy: 0.32, rw: 0.09, rh: 0.10 },
        { cx: 0.27, cy: 0.62, rw: 0.05, rh: 0.13 },
        { cx: 0.48, cy: 0.26, rw: 0.045, rh: 0.07 },
        { cx: 0.50, cy: 0.52, rw: 0.06, rh: 0.14 },
        { cx: 0.68, cy: 0.32, rw: 0.13, rh: 0.14 },
        { cx: 0.82, cy: 0.68, rw: 0.05, rh: 0.05 },
    ];
    const dots = [];
    continents.forEach(c => {
        const count = 220;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const rad = Math.random();
            const x = c.cx + Math.cos(angle) * c.rw * rad;
            const y = c.cy + Math.sin(angle) * c.rh * rad;
            dots.push({ x, y });
        }
    });
    const hubs = [
        { x: 0.19, y: 0.30 }, { x: 0.47, y: 0.24 }, { x: 0.70, y: 0.30 }, { x: 0.75, y: 0.40 },
        { x: 0.50, y: 0.50 }, { x: 0.27, y: 0.58 }, { x: 0.81, y: 0.66 }, { x: 0.60, y: 0.28 }
    ];
    let t = 0;
    function draw() {
        ctx.clearRect(0, 0, w, h);
        dots.forEach(d => {
            ctx.beginPath();
            ctx.arc(d.x * w, d.y * h, 1 * dpr, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(140,180,200,0.28)';
            ctx.fill();
        });
        t += 0.006;
        ctx.lineWidth = 1 * dpr;
        for (let i = 0; i < hubs.length; i++) {
            const a = hubs[i];
            const b = hubs[(i + 3) % hubs.length];
            const ax = a.x * w, ay = a.y * h, bx = b.x * w, by = b.y * h;
            const mx = (ax + bx) / 2, my = (ay + by) / 2 - 40 * dpr;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.quadraticCurveTo(mx, my, bx, by);
            ctx.strokeStyle = 'rgba(203,164,99,0.25)';
            ctx.stroke();
            const prog = (t + i * 0.15) % 1;
            const px = (1 - prog) * (1 - prog) * ax + 2 * (1 - prog) * prog * mx + prog * prog * bx;
            const py = (1 - prog) * (1 - prog) * ay + 2 * (1 - prog) * prog * my + prog * prog * by;
            ctx.beginPath();
            ctx.arc(px, py, 2 * dpr, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(123,255,240,0.9)';
            ctx.fill();
        }
        hubs.forEach(hb => {
            const x = hb.x * w, y = hb.y * h;
            const pulse = (Math.sin(t * 4 + x) * 0.5 + 0.5);
            ctx.beginPath();
            ctx.arc(x, y, 3 * dpr, 0, Math.PI * 2);
            ctx.fillStyle = '#22e8d4';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, y, (6 + pulse * 6) * dpr, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(34,232,212,${0.4 - pulse * 0.3})`;
            ctx.lineWidth = 1 * dpr;
            ctx.stroke();
        });
        requestAnimationFrame(draw);
    }
    draw();
})();

/* ============ CTA particles ============ */
(function ctaParticles() {
    const canvas = document.getElementById('ctaParticles');
    const ctx = canvas.getContext('2d');
    let w, h, dpr, pts;
    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        canvas.width = w = rect.width * dpr;
        canvas.height = h = rect.height * dpr;
        pts = Array.from({ length: 36 }, () => ({
            x: Math.random() * w, y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
            r: Math.random() * 1.5 + 0.5
        }));
    }
    resize();
    window.addEventListener('resize', resize);
    function draw() {
        ctx.clearRect(0, 0, w, h);
        pts.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * dpr, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(34,232,212,0.5)';
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
})();

/* ============ Tabs ============ */
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.dataset.tab;
        tabButtons.forEach(item => item.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        button.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
}); 