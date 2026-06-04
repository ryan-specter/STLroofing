import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "site");

const replacements = [
  ["Cromer-based, fully insured", "Based in North Norfolk, fully insured"],
  ["Free quotations from our Cromer team", "Free quotations from our North Norfolk team"],
  ["message our Cromer team", "message our North Norfolk team"],
  ["We’re Cromer-based roofing", "We’re based in North Norfolk — roofing"],
  ["We're Cromer-based roofing", "We're based in North Norfolk — roofing"],
  ["Our Cromer team works on the coast", "Based in North Norfolk, we work on the coast"],
  ["Free quotes from Cromer-based roofers", "Free quotes from roofers based in North Norfolk"],
  ["Cromer-based roofers", "roofers based in North Norfolk"],
  ["We're based at 81 Cromer Road, Mundesley, NR11 8DF", "We're based at 81 Cromer Road in Mundesley, NR11 8DF"],
  ["67 Station Road Cromer, NR27 0DX", "81 Cromer Road, Mundesley, NR11 8DF"],
  ["52.9208406", "52.87681"],
  ["1.3106949", "1.43385"],
  ['content="Cromer, Norfolk"', 'content="Mundesley, Norfolk"'],
  ["81 Cromer Road, Cromer, NR11 8DF", "81 Cromer Road, Mundesley, NR11 8DF"],
  ["Cromer, England, NR11 8DF", "Mundesley, England, NR11 8DF"],
  ["\nCromer, England", "\nMundesley, England"],
  ["67 Station Road", "81 Cromer Road"],
  ["NR27 0DX", "NR11 8DF"],
  ['content="Cromer, Norfolk"', 'content="Mundesley, Norfolk"'],
  ['"addressLocality":"Cromer"', '"addressLocality":"Mundesley"'],
  ['"addressLocality": "Cromer"', '"addressLocality": "Mundesley"'],
  [
    '<span class="sqsrte-text-color--black"><br>07863&nbsp;395028 </span>',
    '<br><a href="tel:+447863395028" class="wb-phone-link"><span class="sqsrte-text-color--black">07863&nbsp;395028</span></a>',
  ],
];

const brandLinkRoot =
  '<link rel="stylesheet" href="css/brand-overrides.css" id="wheeler-bowers-brand-styles" />';
const brandLinkNested =
  '<link rel="stylesheet" href="../css/brand-overrides.css" id="wheeler-bowers-brand-styles" />';

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function patchHtml(html, depth) {
  let next = html;
  for (const [from, to] of replacements) {
    next = next.split(from).join(to);
  }

  if (!next.includes("wheeler-bowers-brand-styles")) {
    const brandLink = depth > 0 ? brandLinkNested : brandLinkRoot;
    next = next.replace(/<meta charset="utf-8" \/>/i, `<meta charset="utf-8" />\n${brandLink}`);
  }

  return next;
}

const htmlFiles = await walk(siteRoot);
let changed = 0;

for (const file of htmlFiles) {
  const depth = path.relative(siteRoot, path.dirname(file)).split(path.sep).filter(Boolean).length;
  const before = await fs.readFile(file, "utf8");
  const after = patchHtml(before, depth);
  if (after !== before) {
    await fs.writeFile(file, after);
    changed += 1;
    console.log("patched", path.relative(siteRoot, file));
  }
}

console.log(`Done. ${changed} file(s) updated.`);
