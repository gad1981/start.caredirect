import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { z } from "zod";

const disposable = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "10minutemail.com",
  "yopmail.com",
]);

const LeadSchema = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(200),
  market: z.enum([
    "Greece",
    "Cyprus",
    "Romania",
    "Bulgaria",
    "Serbia",
    "Other",
  ]),
  program: z.string().trim().max(40).optional().nullable(),
  message: z.string().trim().max(4000).optional().nullable(),
  website: z.string().optional().nullable(),
  source_page: z.string().trim().max(200),
  consent_text: z.string().trim().min(10).max(1000),
});

const rate = new Map<string, { count: number; reset: number }>();

function limited(ip: string) {
  const now = Date.now();
  const row = rate.get(ip);
  if (!row || row.reset < now) {
    rate.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  row.count += 1;
  return row.count > 8;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (limited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form fields and try again." },
      { status: 400 },
    );
  }

  const data = parsed.data;
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const domain = data.email.split("@")[1]?.toLowerCase();
  if (domain && disposable.has(domain)) {
    return NextResponse.json(
      { error: "Please use a work email address." },
      { status: 400 },
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json(
      {
        error:
          "Lead storage is not configured yet. Please email the team or try again later.",
      },
      { status: 503 },
    );
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from("leads").insert({
    name: data.name,
    company: data.company,
    email: data.email,
    market: data.market,
    program: data.program || null,
    message: data.message || null,
    source_page: data.source_page,
    consent_text: data.consent_text,
    consent_at: new Date().toISOString(),
    status: "new",
  });

  if (error) {
    return NextResponse.json(
      { error: "Could not save the brief. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
