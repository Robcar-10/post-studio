import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });

export async function POST(req: Request) {
  console.log("[stripe/checkout] POST");
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const origin = req.headers.get("origin") ?? "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
      success_url: `${origin}/studio?upgraded=1`,
      cancel_url: `${origin}/studio`,
      client_reference_id: userId,
      metadata: { userId },
    });
    console.log("[stripe/checkout] session created", session.id);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe/checkout] session create failed", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
