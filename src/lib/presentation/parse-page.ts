/** Shared parsers for program page copy → deck / UI. */

export function parseAbout(copy: string) {
  const [leadRaw, factsRaw = ""] = copy.split("||").map((s) => s.trim());
  const facts: { label: string; value: string }[] = [];
  for (const part of factsRaw.split("·")) {
    const [label, ...rest] = part.split(":").map((s) => s.trim());
    if (label && rest.length) facts.push({ label, value: rest.join(":").trim() });
  }
  return { lead: leadRaw, facts };
}

export function parseCards(copy: string) {
  return copy.split("·").map((chunk) => {
    const [title, ...rest] = chunk.split(":").map((s) => s.trim());
    return { title, body: rest.join(":").trim() };
  });
}
