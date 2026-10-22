-- Run this once in your Supabase project: SQL Editor → New Query → paste and run.

-- ── Brand kits ────────────────────────────────────────────────────────────────
-- One row per user. user_id is the Clerk userId (string like "user_abc123").
CREATE TABLE IF NOT EXISTS brand_kits (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         text        NOT NULL UNIQUE,
  business        text        NOT NULL DEFAULT '',
  location        text        NOT NULL DEFAULT '',
  what_we_do      text        NOT NULL DEFAULT '',
  voice_lean      text        NOT NULL DEFAULT 'friendly',
  use_phrases     text[]      NOT NULL DEFAULT '{}',
  avoid_phrases   text[]      NOT NULL DEFAULT '{}',
  sample_line     text        NOT NULL DEFAULT '',
  include_emoji   boolean     NOT NULL DEFAULT true,
  cta_default     text        NOT NULL DEFAULT '',
  color_primary   text        NOT NULL DEFAULT '#B221F6',
  color_secondary text        NOT NULL DEFAULT '#FF6452',
  logo_url        text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ── Drafts ───────────────────────────────────────────────────────────────────
-- id is client-generated (same format as lib/drafts.ts newDraftId).
CREATE TABLE IF NOT EXISTS drafts (
  id          text        PRIMARY KEY,
  user_id     text        NOT NULL,
  name        text        NOT NULL DEFAULT 'Untitled',
  project     jsonb       NOT NULL,
  thumb       text,
  is_autosave boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS drafts_user_id_idx ON drafts (user_id);
CREATE INDEX IF NOT EXISTS drafts_updated_at_idx ON drafts (user_id, updated_at DESC);

-- ── Supabase Storage bucket for logos ────────────────────────────────────────
-- Run this in the Supabase dashboard: Storage → New bucket → name "logos", public ON.
-- Or run via SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;
