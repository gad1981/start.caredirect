import JSZip from "jszip";

/**
 * pptxgenjs 4.0.x packages trip PowerPoint’s “Repair” dialog for two reasons:
 * 1) Content_Types lists slideMaster2..N but only slideMaster1.xml exists
 * 2) Empty notes slides / notesMaster are always emitted and often flagged
 *
 * Sanitize the OOXML package before download.
 */
export async function fixPptxContentTypes(buffer: Buffer): Promise<Buffer> {
  const zip = await JSZip.loadAsync(buffer);

  // Drop empty notes parts entirely.
  for (const name of Object.keys(zip.files)) {
    if (
      name.startsWith("ppt/notesSlides/") ||
      name === "ppt/notesMasters/notesMaster1.xml" ||
      name.startsWith("ppt/notesMasters/")
    ) {
      zip.remove(name);
    }
  }

  // Strip notes relationships from each slide.
  const slideRelNames = Object.keys(zip.files).filter((f) =>
    /^ppt\/slides\/_rels\/slide\d+\.xml\.rels$/.test(f),
  );
  for (const relName of slideRelNames) {
    const file = zip.file(relName);
    if (!file) continue;
    let xml = await file.async("string");
    xml = xml.replace(
      /<Relationship[^>]*notesSlide[^>]*\/>/g,
      "",
    );
    zip.file(relName, xml);
  }

  // presentation.xml — remove notes master list
  const presFile = zip.file("ppt/presentation.xml");
  if (presFile) {
    let pres = await presFile.async("string");
    pres = pres.replace(/<p:notesMasterIdLst>[\s\S]*?<\/p:notesMasterIdLst>/g, "");
    zip.file("ppt/presentation.xml", pres);
  }

  // presentation.xml.rels — drop notesMaster relationship
  const presRelsFile = zip.file("ppt/_rels/presentation.xml.rels");
  if (presRelsFile) {
    let rels = await presRelsFile.async("string");
    rels = rels.replace(
      /<Relationship[^>]*notesMaster[^>]*\/>/g,
      "",
    );
    zip.file("ppt/_rels/presentation.xml.rels", rels);
  }

  // Content_Types — only parts that still exist; only slideMaster1
  const ctFile = zip.file("[Content_Types].xml");
  if (ctFile) {
    let ct = await ctFile.async("string");
    ct = ct.replace(
      /<Override PartName="\/ppt\/slideMasters\/slideMaster(?!1\.xml)[^"]+" ContentType="[^"]+"\/>/g,
      "",
    );
    ct = ct.replace(
      /<Override PartName="\/ppt\/notesSlides\/notesSlide\d+\.xml" ContentType="[^"]+"\/>/g,
      "",
    );
    ct = ct.replace(
      /<Override PartName="\/ppt\/notesMasters\/notesMaster\d+\.xml" ContentType="[^"]+"\/>/g,
      "",
    );
    // Final safety: drop any Override whose part is missing from the zip
    ct = ct.replace(
      /<Override PartName="([^"]+)" ContentType="[^"]+"\/>/g,
      (full, partName: string) => {
        const key = String(partName).replace(/^\//, "");
        return zip.file(key) ? full : "";
      },
    );
    zip.file("[Content_Types].xml", ct);
  }

  const out = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
  return Buffer.from(out);
}
