-- Run in Supabase SQL Editor after 001_initial.sql

ALTER TABLE brand_kits
  ADD COLUMN IF NOT EXISTS is_pro              boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS stripe_customer_id  text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text;
