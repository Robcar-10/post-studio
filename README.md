# RUT Post Studio

Brand-locked Instagram post and carousel designer for Rolled Up Tees. Pick a post type, fill in the fields (or let Claude write them in the RUT voice), preview at Instagram size, export PNGs.

Stack: Next.js 16 · React 19 · Clerk (auth) · Supabase (drafts, brand kit, logos) · Anthropic SDK (copy) · html-to-image (export) · Vercel.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in the keys — see below
npm run dev                  # http://localhost:3000/studio
```

### Keys you need

| Variable | Where to get it | Needed for |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | console.anthropic.com | AI copy, voice variants, carousel generator, captions |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | dashboard.clerk.com → API keys | Sign-in; `/studio` and every `/api/*` route require a session |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API | Drafts, brand kit, logo upload |
| `ADMIN_EMAILS` | you | Unlocks every template for those accounts without Stripe |
| `STRIPE_*` | optional | Only if you sell Pro to other businesses |

### Supabase setup (once)

In the Supabase SQL editor run, in order:

1. `supabase/001_initial.sql` — `brand_kits`, `drafts`, the `logos` storage bucket
2. `supabase/002_stripe.sql` — only if you use Stripe

### Why AI copy might fail

Every AI button calls `POST /api/ai`, which uses `ANTHROPIC_API_KEY` on the server. If copy generation errors, it's that key (missing, wrong, or no credit), not the templates. Check the terminal running `next dev` for the message.

## How it's put together

```
app/
  studio/page.tsx        the editor: slides, history, drafts, AI, export
  api/ai                 Anthropic completion (server-side)
  api/drafts             CRUD on drafts (Supabase, scoped to the Clerk user)
  api/brand-kit          brand voice + colors + logo, plus the isPro / ADMIN_EMAILS check
  api/upload/logo        logo upload to the Supabase "logos" bucket
components/
  templates/             one file per post type; each exports a Template
  primitives/            Logo, Eyebrow, GradText, HeroBg, EditText, Resizable, ImagePlaceholder
  studio/                Sidebar, Canvas, ControlsRail, Filmstrip, toolbars, modals
lib/
  brand.ts               colors, fonts, sizes, accent/gradient resolvers
  brandVoice.ts          brand voice defaults + prompt preamble
  carouselGenerator.ts   one prompt → N carousel cards
  exportPng.ts           html-to-image export, multi-size, ZIP
  types.ts               Template, RenderContext, Slide, Project
```

### Templates

A template is a plain object: `id`, `name`, `variants` (layouts), `fields` (what the right rail edits), `defaults`, and `render(ctx)`. The render context carries the field values plus theme, accent, gradient, canvas size, font scale, and the per-field scale/position/style/crop the user applied on the canvas. Add a template by creating a file in `components/templates/` and listing it in `index.ts`.

### Brand

- **Type:** Work Sans Black/ExtraBold for headlines and big numbers, Inter for body, Montserrat ExtraBold for eyebrows, counters and "Swipe". Loaded in `app/layout.tsx`, referenced through `FONT_DISPLAY` / `FONT_BODY` / `FONT_EYEBROW` in `lib/brand.ts`.
- **Color:** purple `#B221F6`, coral `#FF6452`, the purple→coral gradient, dark ink `#1A0030`, cream `#FAF3E5`, yellow `#FFDB3B` for small tags.
- **Themes:** dark (purple glow), light, cream. **Accent:** purple or coral. **Gradient** toggles gradient text and buttons.

## Deploy

Vercel, with the same env vars set in the project settings. Run `npm run lint` and `npx tsc --noEmit` before pushing; both are clean on `main`.
