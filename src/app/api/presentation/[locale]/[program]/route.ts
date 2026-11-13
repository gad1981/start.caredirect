import { NextResponse } from "next/server";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildProgramPptx } from "@/lib/presentation/build-program-pptx";
import { getProgramBySlug } from "@/lib/programs";

type RouteParams = {
  params: Promise<{ locale: string; program: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { locale: rawLocale, program: rawProgram } = await params;
  if (!isLocale(rawLocale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 404 });
  }
  const locale = rawLocale as Locale;
  const prog = getProgramBySlug(rawProgram);
  if (!prog) {
    return NextResponse.json({ error: "Unknown program" }, { status: 404 });
  }

  const deck = await buildProgramPptx(prog.id, locale);
  if (!deck) {
    return NextResponse.json({ error: "No content" }, { status: 404 });
  }

  const bytes = new Uint8Array(deck.buffer);
  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": `attachment; filename="${deck.filename}"`,
      "Cache-Control": "private, max-age=300",
    },
  });
}
