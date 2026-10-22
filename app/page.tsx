import Link from "next/link";
import { LandingClient } from "./landing-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RUT Post Studio · Branded social posts in seconds",
  description:
    "A focused editor for Rolled Up Tees — pick a template, write the post, export every Instagram / Facebook / Google size at once. Brand-locked, always on.",
};

const TEMPLATES_SHOWCASE = [
  { name: "Announcement", type: "Big statement", variants: ["Centered", "Left aligned", "Color block"], pack: "essential" },
  { name: "Quote / Review", type: "Social proof", variants: ["Card centered", "Big quote", "Photo + quote"], pack: "essential" },
  { name: "Promo / Offer", type: "Promotion", variants: ["Badge corner", "Split with photo", "Stamp center"], pack: "pro" },
  { name: "Photo Showcase", type: "Photo-first", variants: ["Bottom overlay", "Corner tag", "Minimal", "Frame"], pack: "pro" },
  { name: "Before & After", type: "Comparison", variants: ["Side by side", "Stacked", "Diagonal cut", "Big labels"], pack: "pro" },
  { name: "Tip / Did you know", type: "Educational", variants: ["Card", "Wide split", "Big number", "Minimal"], pack: "pro" },
  { name: "Question / Poll", type: "Engagement", variants: ["Split photos", "Text only", "Stacked", "Versus"], pack: "pro" },
  { name: "Carousel", type: "Multi-card", variants: ["Numbered", "Title-first", "Quote pull"], pack: "pro" },
];

export default function Home() {
  return (
    <div className="landing">
      <LandingClient />

      {/* NAV */}
      <nav className="nav">
        <div className="brand">
          <div className="brand-mark">R</div>
          RUT Studio
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="nav-actions">
          <Link className="nav-sign-in" href="/sign-in">Sign in</Link>
          <Link className="nav-cta" href="/studio">
            Open Studio
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div>
          <div className="hero-eyebrow">New · Carousel generator drafts 10 cards in seconds</div>
          <h1>Branded social posts<br />in <span className="grad">seconds,</span><br />not afternoons.</h1>
          <p className="lede">
            RUT Post Studio is a focused editor for Rolled Up Tees teams. Pick a template, write the post,
            export every Instagram&nbsp;/ Facebook&nbsp;/ Google size at once — all on-brand, every time.
          </p>
          <div className="hero-ctas">
            <Link className="btn-primary" href="/studio">
              Open the Studio
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <a className="btn-secondary" href="#how">See how it works</a>
          </div>
          <div className="hero-meta">
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Free plan, no card needed
            </span>
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              8 templates · 4 layouts each
            </span>
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Export PNGs in seconds
            </span>
          </div>
        </div>

        <div className="hero-art">
          <div className="hero-orbit">AI · 5 cards in 8s</div>
          <div className="hero-orbit-2">
            <span className="orbit-dot" />
            Brand voice on
          </div>
          <div className="card-stack">
            <div className="stack-card s1">
              <div className="inner">
                <div>
                  <div className="ey">Now booking</div>
                  <div className="num">01</div>
                </div>
                <div>
                  <div className="title">Spring sports orders.</div>
                  <div className="body" style={{ color: "rgba(255,255,255,0.65)" }}>
                    Fabric weight first, fit second. Personality always.
                  </div>
                </div>
                <div className="foot" style={{ color: "rgba(255,255,255,0.55)" }}>
                  <span>Link in bio</span><span>RUT</span>
                </div>
              </div>
            </div>
            <div className="stack-card s2">
              <div className="inner">
                <div>
                  <div className="ey" style={{ color: "var(--purple)" }}>5 ways to</div>
                  <div className="num" style={{ color: "var(--ink)" }}>02</div>
                </div>
                <div>
                  <div className="title">Match your team&apos;s vibe.</div>
                  <div className="body">Bold colorways move faster than safe ones — every single time.</div>
                </div>
                <div className="foot"><span>Swipe →</span><span>RUT</span></div>
              </div>
            </div>
            <div className="stack-card s3">
              <div className="inner">
                <div>
                  <div className="ey">Limited run</div>
                  <div className="num" style={{ color: "var(--coral)" }}>03</div>
                </div>
                <div>
                  <div className="title">25% off any 24+ piece order.</div>
                  <div className="body">Code SPRING25 · Spring slots filling fast.</div>
                </div>
                <div className="foot"><span>DM us</span><span>RUT</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGO STRIP */}
      <div className="strip">
        <div className="strip-inner">
          <div className="strip-label">EXPORTS FOR</div>
          <div className="strip-platforms">
            <div className="strip-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              Instagram Feed · Story · Reel
            </div>
            <div className="strip-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              Facebook Feed · Square
            </div>
            <div className="strip-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
              </svg>
              Google Business
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="section-head">
          <div className="section-eyebrow">What&apos;s inside</div>
          <h2>Everything to ship a post. Nothing you won&apos;t use.</h2>
          <p>Stop fighting Canva templates and resizing the same post six times. Studio is built around the way RUT actually posts.</p>
        </div>
        <div className="feat-grid">
          <div className="feat">
            <div className="feat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
              </svg>
            </div>
            <h3>8 post templates</h3>
            <p>Announcement, Promo, Quote, Before/After, Showcase, Tip, Question, Carousel — each with multiple variants and theme options.</p>
          </div>
          <div className="feat">
            <div className="feat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" /><circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <h3>AI copywriting</h3>
            <p>One-click headline, subhead, hashtag, and caption drafting. Tuned to your brand voice — not generic LinkedIn slop.</p>
          </div>
          <div className="feat">
            <div className="feat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="14" rx="2" /><path d="M2 10h20M7 6V4M17 6V4" />
              </svg>
            </div>
            <h3>Carousel generator</h3>
            <p>Type one prompt, get a 3–12 card swipeable post drafted end-to-end with hook, body, and CTA.</p>
          </div>
          <div className="feat">
            <div className="feat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <h3>Drafts library</h3>
            <p>Auto-saves to your device. Open last week&apos;s post, tweak the date, ship it again. Every draft has a thumbnail.</p>
          </div>
          <div className="feat">
            <div className="feat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h3>Multi-size export</h3>
            <p>Pick your sizes once. Export Feed + Story + GBP as a clean ZIP. Every size renders at the right scale automatically.</p>
          </div>
          <div className="feat">
            <div className="feat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" /><path d="M7 14l4-4 4 4 5-5" />
              </svg>
            </div>
            <h3>Brand-locked, always</h3>
            <p>Work Sans, Inter, Montserrat, RUT purple/coral, the gradient, the dark hero — baked in. New hires can&apos;t go off-brand.</p>
          </div>
        </div>
      </section>

      {/* TEMPLATES SECTION */}
      <section className="lp-templates" id="templates">
        <div className="section-head">
          <div className="section-eyebrow">Template library</div>
          <h2>Eight templates. Up to four layouts each.</h2>
          <p>Every template ships with distinct layout variants — same content, totally different frame. Swap in one click, no redesign needed.</p>
        </div>

        <div className="tpl-pack-group">
          <div className="tpl-pack-label">
            <span className="tpl-pack-name">Essential</span>
            <span className="tpl-pack-badge free">Free</span>
          </div>
          <div className="tpl-cards">
            {TEMPLATES_SHOWCASE.filter((t) => t.pack === "essential").map((t) => (
              <div className="tpl-card" key={t.name}>
                <div className="tpl-card-top">
                  <div className="tpl-card-name">{t.name}</div>
                  <div className="tpl-card-type">{t.type}</div>
                </div>
                <div className="tpl-card-variants">
                  {t.variants.map((v) => (
                    <span key={v} className="tpl-card-variant">{v}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tpl-pack-group">
          <div className="tpl-pack-label">
            <span className="tpl-pack-name">Pro</span>
            <span className="tpl-pack-badge pro">Pro · $24/mo</span>
          </div>
          <div className="tpl-cards">
            {TEMPLATES_SHOWCASE.filter((t) => t.pack === "pro").map((t) => (
              <div className="tpl-card" key={t.name}>
                <div className="tpl-card-top">
                  <div className="tpl-card-name">{t.name}</div>
                  <div className="tpl-card-type">{t.type}</div>
                </div>
                <div className="tpl-card-variants">
                  {t.variants.map((v) => (
                    <span key={v} className="tpl-card-variant">{v}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOWCASE / HOW IT WORKS */}
      <section className="showcase" id="how">
        <div className="showcase-inner">
          <div className="car-preview">
            <div className="car-card car-dark" style={{ transform: "rotate(-3deg)" }}>
              <div className="car-eye">5 WAYS TO</div>
              <div>
                <div className="car-num">01</div>
                <div className="car-h" style={{ marginTop: 12 }}>Pick the right tee.</div>
                <div className="car-body">Start with fabric weight, then fit. The rest is personality.</div>
              </div>
              <div className="car-foot">Swipe →</div>
            </div>
            <div className="car-card" style={{ transform: "rotate(2deg)", marginLeft: "-28%" }}>
              <div className="car-eye" style={{ color: "var(--purple)" }}>5 WAYS TO</div>
              <div>
                <div className="car-num car-num-light">02</div>
                <div className="car-h" style={{ marginTop: 12 }}>Match fit to the wearer.</div>
                <div className="car-body">Athletic, relaxed, vintage — get the mock-up right before the run.</div>
              </div>
              <div className="car-foot">Swipe →</div>
            </div>
          </div>

          <div className="showcase-text">
            <div className="showcase-eyebrow">How it works</div>
            <h2>From blank page to post in under three minutes.</h2>
            <p>Tell Studio what the post is about, pick how many cards, and watch it draft headline, body, and CTA across the whole stack. Edit any card; it stays on-brand.</p>
            <div className="step-list">
              <div className="step">
                <div className="step-num">1</div>
                <div>
                  <h4>Pick a template</h4>
                  <p>Announcement, Quote, Carousel — eight options, each with layout variants.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-num">2</div>
                <div>
                  <h4>Write or generate</h4>
                  <p>Inline-edit any field, or hit ✨ to draft headline + caption + hashtags.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-num">3</div>
                <div>
                  <h4>Export every size</h4>
                  <p>Feed, Story, GBP — all at once, named correctly, ready to upload.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="lp-pricing" id="pricing">
        <div className="section-head">
          <div className="section-eyebrow">Pricing</div>
          <h2>Built for the RUT team first.</h2>
          <p>Start free. Pay when you need the full brand engine.</p>
        </div>
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="pricing-plan">Solo</div>
            <div className="pricing-price">
              <span className="pricing-amount">$0</span>
              <span className="pricing-period">/ forever</span>
            </div>
            <div className="pricing-desc">For one person posting weekly.</div>
            <ul className="pricing-features">
              <li>All 8 templates</li>
              <li>AI copywriting (50 generations/mo)</li>
              <li>Local drafts library</li>
              <li>Single-size export</li>
            </ul>
            <Link href="/studio" className="pricing-cta pricing-cta-ghost">Start free</Link>
          </div>

          <div className="pricing-card pricing-card-featured">
            <div className="pricing-featured-badge">Most popular</div>
            <div className="pricing-plan">Studio Pro</div>
            <div className="pricing-price">
              <span className="pricing-amount">$24</span>
              <span className="pricing-period">/ month</span>
            </div>
            <div className="pricing-desc">For shops shipping multiple posts a week.</div>
            <ul className="pricing-features">
              <li>Everything in Solo</li>
              <li>Unlimited AI generations</li>
              <li>Carousel generator (up to 12 cards)</li>
              <li>Multi-size batch export</li>
              <li>Brand voice + tone presets</li>
              <li>Cloud-synced drafts</li>
            </ul>
            <Link href="/studio" className="pricing-cta pricing-cta-primary">Start 14-day trial</Link>
          </div>

          <div className="pricing-card">
            <div className="pricing-plan">Team</div>
            <div className="pricing-price">
              <span className="pricing-amount">$79</span>
              <span className="pricing-period">/ month</span>
            </div>
            <div className="pricing-desc">Up to 5 seats sharing one brand.</div>
            <ul className="pricing-features">
              <li>Everything in Pro</li>
              <li>5 seats included</li>
              <li>Shared draft library</li>
              <li>Brand kit lock</li>
              <li>Priority support</li>
            </ul>
            <a href="mailto:info@rolleduptees.com" className="pricing-cta pricing-cta-ghost">Talk to us</a>
          </div>
        </div>
        <p className="pricing-note">Annual plan available · $249/yr (save $39) · Cancel anytime</p>
      </section>

      {/* FAQ */}
      <section className="lp-faq" id="faq">
        <div className="section-head">
          <div className="section-eyebrow">Questions</div>
          <h2>The honest FAQ.</h2>
        </div>
        <div className="faq">
          <div className="faq-item">
            <div className="faq-q">Is this just another Canva clone?</div>
            <div className="faq-a">No. Canva is a generalist tool with infinite templates. Studio is opinionated: 8 post templates locked to one brand. Faster, less decision fatigue, impossible to drift off-brand.</div>
          </div>
          <div className="faq-item">
            <div className="faq-q">Can I use my own brand colors and fonts?</div>
            <div className="faq-a">Today Studio ships with the Rolled Up Tees brand baked in. White-label support and custom brand kits are on the Team roadmap — talk to us if that&apos;s what you need.</div>
          </div>
          <div className="faq-item">
            <div className="faq-q">What does the AI cost?</div>
            <div className="faq-a">Solo includes 50 generations/month free. Pro is unlimited. Generations cover headlines, subheads, captions, hashtags, and full carousel drafts.</div>
          </div>
          <div className="faq-item">
            <div className="faq-q">Where do my drafts live?</div>
            <div className="faq-a">On the free tier, drafts auto-save to your browser&apos;s local storage — they stay on this device. Pro syncs them to the cloud so you can pick up where you left off on any computer.</div>
          </div>
          <div className="faq-item">
            <div className="faq-q">Can I export in print resolution?</div>
            <div className="faq-a">Studio is tuned for social media — every export is at the platform&apos;s native resolution (1080×1350 IG portrait, 1200×630 FB feed, etc). Print/large-format isn&apos;t the use case.</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta-card">
          <h2>Stop redesigning the same post six times a week.</h2>
          <p>Open Studio. Pick a template. Ship it.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="btn-primary" href="/studio">
              Open the Studio
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <a href="#pricing" className="btn-secondary" style={{ background: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}>
              See pricing
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="foot-inner">
          <div className="foot-grid">
            <div className="foot-brand">
              <div className="brand" style={{ color: "#fff" }}>
                <div className="brand-mark">R</div>
                RUT Studio
              </div>
              <p>The post-shipping tool built for Rolled Up Tees. Designed by the team that ships every weekly drop.</p>
            </div>
            <div className="foot-col">
              <h5>Product</h5>
              <a href="#features">Features</a>
              <a href="#how">How it works</a>
              <a href="#pricing">Pricing</a>
              <Link href="/studio">Open Studio</Link>
            </div>
            <div className="foot-col">
              <h5>Company</h5>
              <a href="#">About RUT</a>
              <a href="mailto:info@rolleduptees.com">Contact</a>
              <a href="#">Brand kit</a>
            </div>
            <div className="foot-col">
              <h5>Legal</h5>
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">Cookies</a>
            </div>
          </div>
          <div className="foot-base">
            <div>© 2026 Rolled Up Tees · All rights reserved</div>
            <div>Made in California</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
