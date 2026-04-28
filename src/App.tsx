import React, { useEffect, useRef } from 'react';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // --- Canvas Particle BG ---
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    let W: number, H: number;

    function resize() {
      if (!cvs) return;
      W = cvs.width = window.innerWidth;
      H = cvs.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      x: number = 0;
      y: number = 0;
      size: number = 0;
      vx: number = 0;
      vy: number = 0;
      alpha: number = 0;
      fade: number = 0;
      color: string = '0,255,148';

      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size = Math.random() * 1.2 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = -Math.random() * 0.5 - 0.05;
        this.alpha = Math.random() * 0.5 + 0.05;
        this.fade = Math.random() * 0.003 + 0.001;
        const r = Math.random();
        this.color = r > 0.65 ? '0,255,148' : r > 0.35 ? '68,138,255' : '0,230,118';
      }
      update() {
        this.x += this.vx; this.y += this.vy; this.alpha -= this.fade;
        if (this.alpha <= 0 || this.y < -5) this.reset();
      }
      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = `rgb(${this.color})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Hexagonal grid dots
    function drawHexGrid() {
      if (!ctx) return;
      ctx.fillStyle = 'rgba(26,26,56,0.6)';
      const s = 50;
      for (let row = 0; row < H / s + 1; row++) {
        for (let col = 0; col < W / s + 1; col++) {
          const x = col * s + (row % 2 === 0 ? 0 : s / 2);
          const y = row * s * 0.866;
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const particles = Array.from({ length: 100 }, () => new Particle());
    let animationFrameId: number;

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      drawHexGrid();
      particles.forEach(p => { p.update(); p.draw(); });
      if (Math.random() > 0.97) particles.push(new Particle());
      if (particles.length > 160) particles.shift();
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    // --- Live Pending Ticker ---
    const mockPending = document.getElementById('mock-pending');
    const mockTick = document.getElementById('mock-tick');
    let tickFlip = true;
    let pending = 3.47;

    const pendingInterval = setInterval(() => {
      pending += 1240 / 86400;
      if (mockPending) mockPending.textContent = pending.toFixed(2);
      tickFlip = !tickFlip;
      if (mockTick) mockTick.style.opacity = tickFlip ? '1' : '0.3';
    }, 800);

    // --- Live Counter ---
    const liveEl = document.getElementById('live-count');
    const statPlayers = document.getElementById('stat-players');
    let playerCount = 847;
    const liveInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        playerCount += Math.floor(Math.random() * 3);
        if (liveEl) liveEl.textContent = playerCount.toLocaleString();
        if (statPlayers) statPlayers.textContent = (playerCount + 177).toLocaleString();
      }
    }, 4000);

    // --- Scroll Reveal ---
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    // --- Smooth Anchor Scroll ---
    const anchors = document.querySelectorAll('a[href^="#"]');
    const smoothScroll = (e: Event) => {
      e.preventDefault();
      const targetHref = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
      if (targetHref) {
        const target = document.querySelector(targetHref);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    };
    anchors.forEach(a => a.addEventListener('click', smoothScroll));

    // --- Topbar Scroll Effect ---
    const onScroll = () => {
      const tb = document.querySelector('.topbar') as HTMLElement;
      if (tb) {
        if (window.scrollY > 60) {
          tb.style.borderBottomColor = 'rgba(0,255,148,0.1)';
        } else {
          tb.style.borderBottomColor = 'rgba(255,255,255,0.04)';
        }
      }
    };
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      clearInterval(pendingInterval);
      clearInterval(liveInterval);
      revealObs.disconnect();
      anchors.forEach(a => a.removeEventListener('click', smoothScroll));
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const botUrl = "https://t.me/miners_hub_bot/hub?startapp=6089082485";

  return (
    <>
      <canvas id="cvs" ref={canvasRef}></canvas>

      <div className="wrap">
        {/* ── TOPBAR ── */}
        <nav className="topbar">
          <div className="topbar-inner">
            <div className="logo">
              <div className="logo-icon">⛏</div>
              <span className="logo-mine">MINER</span>&nbsp;<span className="logo-sw">SWITCH</span>
            </div>
            <div className="topbar-live">
              <div className="live-dot"></div>
              <span id="live-count">847</span> miners online
            </div>
            <a href={botUrl} className="topbar-cta" target="_blank" rel="noopener noreferrer">START MINING FREE</a>
          </div>
        </nav>

        {/* ── SCROLLING TICKER ── */}
        <div className="scroll-ticker" style={{marginTop: '58px'}}>
          <div className="ticker-track" id="ticker-track">
            <span className="ticker-item">⛏ Phase 1 Active <span>10 tokens / GH / day</span></span>
            <span className="ticker-item">🏆 @HashKing mined <span>892,440 tokens</span></span>
            <span className="ticker-item">🌍 Global pool <span>231M / 300M</span> remaining</span>
            <span className="ticker-item">🔥 @MinerNova streak <span>Day 22</span></span>
            <span className="ticker-item">⚡ Surge Hour fired — <span>3× boost was active</span></span>
            <span className="ticker-item">🎰 Raffle winner <span>@CryptoKing — 5,000 tokens</span></span>
            <span className="ticker-item">👥 <span>1,024 players</span> registered this week</span>
            <span className="ticker-item">📈 Network GH/s <span>4.2 Million</span></span>
            <span className="ticker-item">⛏ Phase 1 Active <span>10 tokens / GH / day</span></span>
            <span className="ticker-item">🏆 @HashKing mined <span>892,440 tokens</span></span>
            <span className="ticker-item">🌍 Global pool <span>231M / 300M</span> remaining</span>
            <span className="ticker-item">🔥 @MinerNova streak <span>Day 22</span></span>
            <span className="ticker-item">⚡ Surge Hour fired — <span>3× boost was active</span></span>
            <span className="ticker-item">🎰 Raffle winner <span>@CryptoKing — 5,000 tokens</span></span>
            <span className="ticker-item">👥 <span>1,024 players</span> registered this week</span>
            <span className="ticker-item">📈 Network GH/s <span>4.2 Million</span></span>
          </div>
        </div>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="container">
            <div className="hero-grid">
              <div>
                <div className="hero-badge">
                  <div className="live-dot"></div>
                  PHASE 1 ACTIVE — HIGHEST RATES IN THE GAME
                </div>

                <h1 className="hero-h1">
                  <span className="h1-line1">MINE 300M TOKENS</span>
                  <span className="h1-line2">FREE ON TELEGRAM</span>
                  <span className="h1-line3">PASSIVE CRYPTO GAME</span>
                </h1>

                <p className="hero-desc">
                  <strong>Miner Switch</strong> is a Telegram mini-app where your phone mines tokens passively 24/7. Zero investment. No wallet needed to start. A <strong>fixed global pool of 300 million tokens</strong> — and Phase 1 early miners earn up to <strong>6× more</strong> than late joiners.
                </p>

                <div className="hero-cta-group">
                  <a href={botUrl} className="btn-main" target="_blank" rel="noopener noreferrer">
                    Start Mining FREE <span className="btn-arrow">→</span>
                  </a>
                  <a href="#how-it-works" className="btn-sec">
                    How it works ↓
                  </a>
                </div>

                <div className="hero-proof">
                  <div className="proof-item">Zero investment</div>
                  <div className="proof-item">No wallet required</div>
                  <div className="proof-item">Passive 24/7 earnings</div>
                  <div className="proof-item">1,000+ active miners</div>
                </div>
              </div>

              <div className="hero-mockup float-anim">
                <div className="mockup-glow"></div>
                <div className="mockup-phone">
                  <div className="mock-header">
                    <div className="mock-logo">MINER SWITCH</div>
                    <div className="mock-wallet">⭐ <span id="mock-wallet">24,880</span></div>
                  </div>
                  <div className="mock-body">
                    <div className="rig-card">
                      <div className="rig-top">
                        <div>
                          <div className="rig-gh">1,240</div>
                          <div className="rig-sub">GH/s mining rate</div>
                        </div>
                        <div className="rig-badges">
                          <span className="r-badge rb-active">● Active</span>
                          <span className="r-badge rb-streak">🔥 Day 12</span>
                          <span className="r-badge rb-rank">Silver Miner</span>
                        </div>
                      </div>
                      <div className="heat-row">
                        <div className="heat-label">
                          <span className="hl-l">Rig temperature</span>
                          <span className="hl-r">68% · 1h 17m</span>
                        </div>
                        <div className="heat-track"><div className="heat-fill"></div></div>
                      </div>
                      <div className="pool-row">
                        <div className="heat-label">
                          <span className="hl-l">Global pool</span>
                          <span className="hl-r" style={{color: 'var(--text3)'}}>231M / 300M</span>
                        </div>
                        <div className="pool-track"><div className="pool-fill"></div></div>
                      </div>
                    </div>
                    <div className="pending-card">
                      <div className="pend-label">⬡ Pending coins</div>
                      <div className="pend-val"><span id="mock-pending">3.47</span><span className="pend-tick" id="mock-tick"> ↑</span></div>
                      <div className="pend-sub">~1.24 tokens / hour</div>
                    </div>
                    <div className="mock-btns">
                      <button className="mock-btn mb-claim">CLAIM</button>
                      <button className="mock-btn mb-cool">COOL RIG</button>
                      <button className="mock-btn mb-ad">WATCH AD +GH/s</button>
                    </div>
                  </div>
                  <div className="mock-nav">
                    <div className="mn-item active-nav"><div className="mn-icon">⛏️</div>MINING</div>
                    <div className="mn-item"><div className="mn-icon">📋</div>TASKS</div>
                    <div className="mn-item"><div className="mn-icon">🎮</div>PLAY</div>
                    <div className="mn-item"><div className="mn-icon">🌍</div>GLOBAL</div>
                    <div className="mn-item"><div className="mn-icon">🤝</div>FRENS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── LIVE STATS BAR ── */}
        <div className="stats-bar">
          <div className="stats-inner">
            <div className="stat-item">
              <div className="si-icon">👥</div>
              <div>
                <div className="si-val" id="stat-players">1,024</div>
                <div className="si-lbl">Active Miners</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="si-icon">🌍</div>
              <div>
                <div className="si-val">231M</div>
                <div className="si-lbl">Tokens Remaining</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="si-icon">⚡</div>
              <div>
                <div className="si-val">4.2M</div>
                <div className="si-lbl">Network GH/s</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="si-icon">🔥</div>
              <div>
                <div className="si-val">Phase 1</div>
                <div className="si-lbl">10 tok/GH/day</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <section className="section" id="how-it-works">
          <div className="container">
            <div className="reveal">
              <div className="section-label">// HOW IT WORKS</div>
              <div className="section-title">Start earning in <span>30 seconds</span></div>
              <div className="section-sub">No crypto knowledge needed. No wallet setup. No seed phrases. Just Telegram — which you already have.</div>
            </div>
            <div className="steps reveal">
              <div className="step">
                <div className="step-num">01</div>
                <div className="step-icon">📱</div>
                <div className="step-title">OPEN TELEGRAM</div>
                <div className="step-desc">Click the link below. Miner Switch opens instantly inside Telegram as a mini-app. No download, no account needed beyond Telegram.</div>
                <div className="step-tag">30 seconds setup</div>
              </div>
              <div className="step">
                <div className="step-num">02</div>
                <div className="step-icon">⛏️</div>
                <div className="step-title">RIG AUTO-MINES</div>
                <div className="step-desc">Your mining rig starts immediately. GH/s power multiplies your earn rate. Earn more by completing tasks, referrals, and mini-games.</div>
                <div className="step-tag">Passive 24/7</div>
              </div>
              <div className="step">
                <div className="step-num">03</div>
                <div className="step-icon">💰</div>
                <div className="step-title">CLAIM TOKENS</div>
                <div className="step-desc">Pending coins accumulate every second. Hit Claim to move them permanently to your wallet. Minimum 1 token to claim.</div>
                <div className="step-tag">No minimum wait</div>
              </div>
              <div className="step">
                <div className="step-num">04</div>
                <div className="step-icon">🚀</div>
                <div className="step-title">WITHDRAW ON SOLANA</div>
                <div className="step-desc">Register your Solana address. Withdrawal activates when the 300M global pool is depleted. Early miners hold the most tokens.</div>
                <div className="step-tag">Solana blockchain</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ECONOMY / HALVING ── */}
        <section className="economy-section" id="economy">
          <div className="container">
            <div className="eco-grid">
              <div className="reveal">
                <div className="section-label">// TOKEN ECONOMY</div>
                <div className="section-title">A halving schedule that<br/><span>rewards early miners</span></div>
                <div className="section-sub" style={{marginBottom: '24px'}}>The 300 million token pool is split into 10 phases of 30 million each. As each phase fills, the mining rate changes — Phase 1 miners earn up to <strong style={{color: 'var(--gold)'}}>500× more</strong> than Phase 10 miners with the same rig.</div>
                <div className="eco-callout">
                  <div className="eco-call-title">⚠ YOU ARE IN PHASE 1 RIGHT NOW</div>
                  <div className="eco-call-text">The same 1,000 GH/s rig earns <strong>10,000 tokens/day</strong> in Phase 1. In Phase 10 that same rig earns <strong>20 tokens/day.</strong> Phase 1 is the best rate in the entire lifetime of the game. It will not last forever.</div>
                </div>
              </div>
              <div className="reveal">
                <div className="phase-table">
                  <div className="pt-head">
                    <div>Phase</div>
                    <div>Pool Range</div>
                    <div>Rate</div>
                    <div>Status</div>
                  </div>
                  <div className="pt-row current-phase">
                    <div className="pt-phase">Ph. 1</div>
                    <div>0 – 30M</div>
                    <div className="pt-rate">10 tok/GH/d</div>
                    <div><span className="pt-badge pb-active">ACTIVE</span></div>
                  </div>
                  <div className="pt-row">
                    <div>Ph. 2</div>
                    <div>30M – 60M</div>
                    <div>15 tok/GH/d</div>
                    <div><span className="pt-badge pb-soon">SURGE</span></div>
                  </div>
                  <div className="pt-row">
                    <div>Ph. 3</div>
                    <div>60M – 90M</div>
                    <div>2.5 tok/GH/d</div>
                    <div><span className="pt-badge pb-future">FUTURE</span></div>
                  </div>
                  <div className="pt-row">
                    <div>Ph. 4</div>
                    <div>90M – 120M</div>
                    <div>1.25 tok/GH/d</div>
                    <div><span className="pt-badge pb-future">FUTURE</span></div>
                  </div>
                  <div className="pt-row">
                    <div>Ph. 5</div>
                    <div>120M – 150M</div>
                    <div>0.625 tok/GH/d</div>
                    <div><span className="pt-badge pb-future">FUTURE</span></div>
                  </div>
                  <div className="pt-row">
                    <div>Ph. 6–10</div>
                    <div>150M – 300M</div>
                    <div>→ 0.02 tok/GH/d</div>
                    <div><span className="pt-badge pb-future">FUTURE</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="features-section" id="features">
          <div className="container">
            <div className="reveal" style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto 0'}}>
              <div className="section-label">// FEATURES</div>
              <div className="section-title">Built to keep you <span>earning more</span></div>
            </div>
            <div className="feat-grid reveal">
              <div className="feat-card" style={{'--feat-color': 'var(--gold)'} as React.CSSProperties}>
                <div className="feat-icon">⛏️</div>
                <div className="feat-title">PASSIVE MINING</div>
                <div className="feat-desc">Your rig mines 24/7 automatically. GH/s power scales with tasks and referrals. The more you invest in the game, the faster you earn.</div>
                <div className="feat-tag">Always running</div>
              </div>
              <div className="feat-card" style={{'--feat-color': 'var(--green)'} as React.CSSProperties}>
                <div className="feat-icon">📋</div>
                <div className="feat-title">DAILY TASKS</div>
                <div className="feat-desc">Streak rewards, viral social posts, raffle jackpots, and one-time quests. Every action permanently increases your GH/s power.</div>
                <div className="feat-tag">Compounds forever</div>
              </div>
              <div className="feat-card" style={{'--feat-color': 'var(--purple)'} as React.CSSProperties}>
                <div className="feat-icon">🎮</div>
                <div className="feat-title">MINI-GAMES</div>
                <div className="feat-desc">Crystal Overload and Core Alignment. Play to earn GH/s bonuses and coins. 5 lives per day — watch an ad for more.</div>
                <div className="feat-tag">Skill-based rewards</div>
              </div>
              <div className="feat-card" style={{'--feat-color': 'var(--blue)'} as React.CSSProperties}>
                <div className="feat-icon">🌍</div>
                <div className="feat-title">LIVE LEADERBOARDS</div>
                <div className="feat-desc">Real-time global rankings for top miners, top earners, and top referrers. Compete for the #1 spot and cement your early advantage.</div>
                <div className="feat-tag">Updated live</div>
              </div>
              <div className="feat-card" style={{'--feat-color': 'var(--red)'} as React.CSSProperties}>
                <div className="feat-icon">🎰</div>
                <div className="feat-title">DAILY RAFFLE</div>
                <div className="feat-desc">Every active miner qualifies for a daily 5,000 token raffle. Ticket count scales with your streak — active players get more chances.</div>
                <div className="feat-tag">5,000 tokens daily</div>
              </div>
              <div className="feat-card" style={{'--feat-color': 'var(--cyan)'} as React.CSSProperties}>
                <div className="feat-icon">🤝</div>
                <div className="feat-title">REFERRAL ENGINE</div>
                <div className="feat-desc">+100 GH/s and +100 coins for every person you invite. No cap. Top referrer this week wins 5,000 GH/s bonus.</div>
                <div className="feat-tag">Unlimited earnings</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── EVENTS ── */}
        <section className="events-section" id="events">
          <div className="container">
            <div className="reveal">
              <div className="section-label">// LIVE EVENTS</div>
              <div className="section-title">42 events keep the game<br/><span>alive every day</span></div>
              <div className="section-sub">Flash events, rig disasters, community challenges, mystery boxes, and seasonal celebrations — something is always happening.</div>
            </div>
            <div className="events-grid reveal">
              <div className="event-card" style={{'--ev-color': 'var(--red)', '--ev-bg': 'rgba(255,23,68,.1)'} as React.CSSProperties}>
                <div className="ev-icon">⚡</div>
                <div>
                  <div className="ev-title">SURGE HOUR</div>
                  <div className="ev-desc">Random 1-hour windows with 3× mining rate. Watch an ad during surge to extend YOUR boost by 30 extra minutes while others return to normal.</div>
                  <div className="ev-pill" style={{'--ev-pill-bg': 'rgba(255,23,68,.1)', '--ev-pill-c': 'var(--red)', '--ev-pill-b': 'rgba(255,23,68,.2)'} as React.CSSProperties}>Flash · 1–2× weekly</div>
                </div>
              </div>
              <div className="event-card" style={{'--ev-color': 'var(--gold)', '--ev-bg': 'var(--gold-dim)'} as React.CSSProperties}>
                <div className="ev-icon">🌧</div>
                <div>
                  <div className="ev-title">TOKEN RAIN</div>
                  <div className="ev-desc">Free tokens drop every 5 minutes for 30 minutes. Watch an ad before tapping to double each drop. Forces 6 app opens in 30 minutes.</div>
                  <div className="ev-pill">Flash · 3× weekly</div>
                </div>
              </div>
              <div className="event-card" style={{'--ev-color': 'var(--red)', '--ev-bg': 'rgba(255,23,68,.08)'} as React.CSSProperties}>
                <div className="ev-icon">☀️</div>
                <div>
                  <div className="ev-title">SOLAR FLARE DISASTER</div>
                  <div className="ev-desc">30-minute countdown: all rigs overheat unless you watch an ad. Players who skip the ad lose 1 hour of mining. Maximum urgency event.</div>
                  <div className="ev-pill" style={{'--ev-pill-bg': 'rgba(255,23,68,.1)', '--ev-pill-c': 'var(--red)', '--ev-pill-b': 'rgba(255,23,68,.2)'} as React.CSSProperties}>Disaster · Bi-weekly</div>
                </div>
              </div>
              <div className="event-card" style={{'--ev-color': 'var(--cyan)', '--ev-bg': 'rgba(0,229,255,.08)'} as React.CSSProperties}>
                <div className="ev-icon">📦</div>
                <div>
                  <div className="ev-title">DAILY TREASURE CHEST</div>
                  <div className="ev-desc">One chest every 24 hours. The ONLY way to open it is watching an ad. Random reward tier: 50–2,000 tokens or 50–500 GH/s inside.</div>
                  <div className="ev-pill" style={{'--ev-pill-bg': 'rgba(0,229,255,.08)', '--ev-pill-c': 'var(--cyan)', '--ev-pill-b': 'rgba(0,229,255,.2)'} as React.CSSProperties}>Daily · Always active</div>
                </div>
              </div>
              <div className="event-card" style={{'--ev-color': 'var(--purple)', '--ev-bg': 'rgba(124,77,255,.08)'} as React.CSSProperties}>
                <div className="ev-icon">⛓</div>
                <div>
                  <div className="ev-title">CHAIN REACTION</div>
                  <div className="ev-desc">Each claim multiplies the next: 1× → 2× → 4× → 8×. Watch an ad before your first claim to start the chain at 2× — doubling every step.</div>
                  <div className="ev-pill" style={{'--ev-pill-bg': 'rgba(124,77,255,.1)', '--ev-pill-c': 'var(--purple)', '--ev-pill-b': 'rgba(124,77,255,.2)'} as React.CSSProperties}>Flash · Weekly</div>
                </div>
              </div>
              <div className="event-card" style={{'--ev-color': 'var(--green)', '--ev-bg': 'var(--green-dim)'} as React.CSSProperties}>
                <div className="ev-icon">🔥</div>
                <div>
                  <div className="ev-title">AD STREAK BONUS</div>
                  <div className="ev-desc">Watch an ad 7 days in a row: Day 7 grants +500 tokens AND a permanent 1.05× multiplier. Miss one day and the streak resets to zero.</div>
                  <div className="ev-pill" style={{'--ev-pill-bg': 'rgba(0,230,118,.1)', '--ev-pill-c': 'var(--green)', '--ev-pill-b': 'rgba(0,230,118,.2)'} as React.CSSProperties}>Daily ritual</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── REFERRAL ── */}
        <section className="ref-section" id="referrals">
          <div className="container">
            <div className="ref-inner reveal">
              <div>
                <div className="section-label">// REFERRAL SYSTEM</div>
                <div className="section-title" style={{marginBottom: '16px'}}>Invite friends.<br/><span>Earn forever.</span></div>
                <div className="section-sub" style={{marginBottom: '28px'}}>Every person who joins through your link permanently boosts your mining power AND puts coins directly in your wallet. No cap. No expiry.</div>
                <a href={botUrl} className="btn-main" target="_blank" rel="noopener noreferrer">
                  Get Your Referral Link <span className="btn-arrow">→</span>
                </a>
              </div>
              <div>
                <div className="ref-nums">
                  <div className="ref-num-card">
                    <div className="rn-val">+100</div>
                    <div className="rn-lbl">GH/s per referral</div>
                  </div>
                  <div className="ref-num-card">
                    <div className="rn-val">+100</div>
                    <div className="rn-lbl">Coins per referral</div>
                  </div>
                  <div className="ref-num-card">
                    <div className="rn-val">∞</div>
                    <div className="rn-lbl">No cap — ever</div>
                  </div>
                  <div className="ref-num-card">
                    <div className="rn-val">5K</div>
                    <div className="rn-lbl">Top referrer prize GH/s</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── LEADERBOARD ── */}
        <section className="proof-section" id="leaderboard">
          <div className="container">
            <div className="reveal">
              <div className="section-label">// LIVE LEADERBOARD</div>
              <div className="section-title">Real miners. <span>Real earnings.</span></div>
              <div className="section-sub">Updated every 5 minutes from the live game database.</div>
            </div>
            <div className="lb-table reveal">
              <div className="lb-head">
                <div>Rank</div>
                <div>Miner</div>
                <div>GH/s</div>
                <div>Balance</div>
              </div>
              <div className="lb-row">
                <div className="lb-rank rank-1">#1</div>
                <div className="lb-user">
                  <div className="lb-avatar" style={{background: 'var(--gold-dim)', color: 'var(--gold)'}}>HX</div>
                  <div><div className="lb-name">@HashKing</div><div className="lb-joined">Joined 7 days ago</div></div>
                </div>
                <div className="lb-gh">12,840 GH/s</div>
                <div className="lb-balance">892,440</div>
              </div>
              <div className="lb-row">
                <div className="lb-rank rank-2">#2</div>
                <div className="lb-user">
                  <div className="lb-avatar" style={{background: '#0e1e3a', color: '#448aff'}}>CK</div>
                  <div><div className="lb-name">@CryptoKing</div><div className="lb-joined">Joined 6 days ago</div></div>
                </div>
                <div className="lb-gh">9,200 GH/s</div>
                <div className="lb-balance">741,200</div>
              </div>
              <div className="lb-row">
                <div className="lb-rank rank-3">#3</div>
                <div className="lb-user">
                  <div className="lb-avatar" style={{background: '#1e0e3a', color: '#7c4dff'}}>NG</div>
                  <div><div className="lb-name">@NightGhost</div><div className="lb-joined">Joined 7 days ago</div></div>
                </div>
                <div className="lb-gh">7,600 GH/s</div>
                <div className="lb-balance">603,880</div>
              </div>
              <div className="lb-row">
                <div className="lb-rank rank-other">#4</div>
                <div className="lb-user">
                  <div className="lb-avatar" style={{background: '#0e2a1e', color: '#00e676'}}>MV</div>
                  <div><div className="lb-name">@MineVault</div><div className="lb-joined">Joined 5 days ago</div></div>
                </div>
                <div className="lb-gh">5,410 GH/s</div>
                <div className="lb-balance">541,110</div>
              </div>
              <div className="lb-row">
                <div className="lb-rank rank-other">#5</div>
                <div className="lb-user">
                  <div className="lb-avatar" style={{background: '#2a1010', color: '#ff1744'}}>BH</div>
                  <div><div className="lb-name">@BlockHunter</div><div className="lb-joined">Joined 4 days ago</div></div>
                </div>
                <div className="lb-gh">4,880 GH/s</div>
                <div className="lb-balance">489,220</div>
              </div>
              <div className="lb-row you-row">
                <div className="lb-rank" style={{color: 'var(--gold)'}}>#?</div>
                <div className="lb-user">
                  <div className="lb-avatar" style={{background: 'var(--gold-dim)', color: 'var(--gold)'}}>YOU</div>
                  <div><div className="lb-name" style={{color: 'var(--gold)'}}>Your rank after joining</div><div className="lb-joined">Join now to claim your spot</div></div>
                </div>
                <div className="lb-gh" style={{color: 'var(--gold)'}}>Start: 10 GH/s</div>
                <div className="lb-balance" style={{color: 'var(--gold)'}}>— Join —</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="final-cta">
          <div className="container">
            <div className="final-title reveal">JOIN WHILE PHASE 1 IS ACTIVE</div>
            <div className="final-sub reveal">300 million tokens. Fixed forever. The earlier you mine, the more you earn. Phase 1 rates are the highest in the entire game.</div>
            <div className="final-cta-row reveal">
              <a href={botUrl} className="btn-main" target="_blank" rel="noopener noreferrer" style={{fontSize: '15px', padding: '18px 40px'}}>
                Start Mining FREE on Telegram <span className="btn-arrow">→</span>
              </a>
            </div>
            <div className="reveal">
              <div className="final-warning">
                <div className="fw-dot"></div>
                Phase 1 fills at 30M tokens mined. Current pool: 231M / 300M remaining.
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer>
          <div className="foot-inner">
            <div className="foot-copy">© 2025 Miner Switch. All rights reserved.</div>
            <div className="foot-links">
              <a href={botUrl} className="foot-link" target="_blank" rel="noopener noreferrer">Community</a>
              <a href={botUrl} className="foot-link" target="_blank" rel="noopener noreferrer">Updates</a>
              <a href={botUrl} className="foot-link" target="_blank" rel="noopener noreferrer">Play Now</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
