import JSZip from "jszip";

/**
 * pptxgenjs 4.0.x writes a Content_Types Override for slideMasterN per slide,
 * but only emits slideMaster1.xml. PowerPoint then prompts to repair the file.
 * Strip the phantom master entries so the package is valid.
 */
export async function fixPptxContentTypes(buffer: Buffer): Promise<Buffer> {
  const zip = await JSZip.loadAsync(buffer);
  const ctFile = zip.file("[Content_Types].xml");
  if (!ctFile) return buffer;

  const original = await ctFile.async("string");
  const fixed = original.replace(
    /<Override PartName="\/ppt\/slideMasters\/slideMaster(?!1\.xml)[^"]+" ContentType="[^"]+"\/>/g,
    "",
  );
  if (fixed === original) return buffer;

  zip.file("[Content_Types].xml", fixed);
  const out = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
  });
  return Buffer.from(out);
}
