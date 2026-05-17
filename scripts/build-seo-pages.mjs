/**
 * Generates SEO landing pages from privacy.html so they match site chrome/layout.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.join(__dirname, "..", "site");
const template = fs.readFileSync(path.join(siteDir, "privacy.html"), "utf8");

const PRIVACY_COLLECTION = "collection-68557a4d141c1978cfe6fe1c";
const CONTENT_BLOCK_ID = "block-dfb189d7f3a818b2bc20";

const pages = [
  {
    slug: "roofing-north-norfolk",
    title: "Roofing & Repointing North Norfolk | Sky's The Limit",
    description:
      "Roof repairs, new roofs and chimney repointing across North Norfolk — Cromer, Sheringham, Holt, Fakenham and the coast. Free quotes from Cromer-based roofers.",
    canonical: "https://skysthelimitroofing.co.uk/roofing-north-norfolk",
    schemaArea: "North Norfolk",
    breadcrumb: "North Norfolk roofing",
    h1: "Roofing &amp; repointing in North Norfolk",
    lead:
      "Sky's The Limit is based in Cromer and specialises in roofing and repointing across <strong>North Norfolk</strong> — from the coast to market towns and villages throughout the district.",
    body: `
<p class="" style="white-space:pre-wrap;">Whether you need storm-damage repairs, a full re-roof, chimney repointing, or new fascias and guttering, our team delivers tidy, reliable workmanship with clear communication and free, no-obligation quotations.</p>
<h2 style="white-space:pre-wrap;"><span class="sqsrte-text-color--accent">Roofing services in North Norfolk</span></h2>
<ul data-rte-list="default"><li><p class="" style="white-space:pre-wrap;">New pitched and flat roof installations</p></li><li><p class="" style="white-space:pre-wrap;">Roof repairs, leak fixes and storm damage</p></li><li><p class="" style="white-space:pre-wrap;">Chimney repointing, lead flashing and stack repairs</p></li><li><p class="" style="white-space:pre-wrap;">Fascias, soffits, gutters and roofline replacement</p></li><li><p class="" style="white-space:pre-wrap;">Tile, slate and membrane flat roofing</p></li></ul>
<h2 style="white-space:pre-wrap;"><span class="sqsrte-text-color--accent">Areas we cover in North Norfolk</span></h2>
<p class="" style="white-space:pre-wrap;">We work throughout the North Norfolk district, including Cromer, Sheringham, Holt, Wells-next-the-Sea, Hunstanton, Fakenham, Mundesley, North Walsham, Blakeney, Cley, Wroxham and the Broads.</p>
<p class="" style="white-space:pre-wrap;">We also cover <a href="../roofing-south-norfolk/">South Norfolk</a> and <a href="../chimney-repointing-norfolk-suffolk/">Suffolk</a> — <a href="../index.html">see our full service area</a>.</p>`,
  },
  {
    slug: "roofing-south-norfolk",
    title: "Roofing & Repointing South Norfolk | Sky's The Limit",
    description:
      "Roofing, roof repairs and repointing across South Norfolk — Norwich, Wymondham, Diss, Attleborough, Thetford and surrounding villages. Free quotes, fully insured.",
    canonical: "https://skysthelimitroofing.co.uk/roofing-south-norfolk",
    schemaArea: "South Norfolk",
    breadcrumb: "South Norfolk roofing",
    h1: "Roofing &amp; repointing in South Norfolk",
    lead:
      "From our base in Cromer we provide roofing and repointing services across <strong>South Norfolk</strong>, including Norwich, market towns and rural properties throughout the district.",
    body: `
<p class="" style="white-space:pre-wrap;">Our work covers domestic and commercial roofs — repairs after storms, planned re-roofs, chimney maintenance and complete roofline upgrades. Every job starts with an honest assessment and a written quote with no hidden extras.</p>
<h2 style="white-space:pre-wrap;"><span class="sqsrte-text-color--accent">What we offer in South Norfolk</span></h2>
<ul data-rte-list="default"><li><p class="" style="white-space:pre-wrap;">Emergency and planned roof repairs</p></li><li><p class="" style="white-space:pre-wrap;">New tiled, slated and flat roofs</p></li><li><p class="" style="white-space:pre-wrap;">Chimney repointing and lead work</p></li><li><p class="" style="white-space:pre-wrap;">Guttering, fascias and soffits</p></li><li><p class="" style="white-space:pre-wrap;">Mortar and ridge pointing</p></li></ul>
<h2 style="white-space:pre-wrap;"><span class="sqsrte-text-color--accent">South Norfolk towns &amp; villages</span></h2>
<p class="" style="white-space:pre-wrap;">Regular projects across South Norfolk include Norwich, Wymondham, Diss, Attleborough, Thetford, Loddon, Harleston, Long Stratton and Poringland.</p>
<p class="" style="white-space:pre-wrap;">See our <a href="../roofing-north-norfolk/">North Norfolk roofing</a> page or <a href="../chimney-repointing-norfolk-suffolk/">chimney repointing in Suffolk</a>.</p>`,
  },
  {
    slug: "chimney-repointing-norfolk-suffolk",
    title: "Chimney Repointing Norfolk & Suffolk | Sky's The Limit",
    description:
      "Chimney repointing and stack repairs across Norfolk and Suffolk — North & South Norfolk, Norwich, Ipswich, Lowestoft and the coast. Free inspection and quote.",
    canonical: "https://skysthelimitroofing.co.uk/chimney-repointing-norfolk-suffolk",
    schemaArea: "Norfolk and Suffolk",
    breadcrumb: "Chimney repointing",
    h1: "Chimney repointing in Norfolk &amp; Suffolk",
    lead:
      "Chimneys take the worst of coastal wind and rain across East Anglia. We provide specialist <strong>chimney repointing</strong>, lead flashing repairs and stack maintenance throughout <strong>Norfolk</strong> and <strong>Suffolk</strong>.",
    body: `
<p class="" style="white-space:pre-wrap;">Crumbling mortar, loose pots and failed flashings can let water into lofts and bedrooms. Our team rakes out decayed mortar, repoints with a matched mix, and repairs lead aprons and back gutters for a watertight finish.</p>
<h2 style="white-space:pre-wrap;"><span class="sqsrte-text-color--accent">Chimney services</span></h2>
<ul data-rte-list="default"><li><p class="" style="white-space:pre-wrap;">Full chimney repointing and mortar repairs</p></li><li><p class="" style="white-space:pre-wrap;">Lead flashing replacement and dressing</p></li><li><p class="" style="white-space:pre-wrap;">Chimney pot rebedding and cowls</p></li><li><p class="" style="white-space:pre-wrap;">Stack repairs after storm damage</p></li><li><p class="" style="white-space:pre-wrap;">Ridge and verge pointing</p></li></ul>
<h2 style="white-space:pre-wrap;"><span class="sqsrte-text-color--accent">Where we work</span></h2>
<p class="" style="white-space:pre-wrap;">We cover North Norfolk (Cromer, Sheringham, Holt, Wells), South Norfolk (Norwich, Wymondham, Diss) and Suffolk including Lowestoft, Beccles, Bungay and Ipswich.</p>
<p class="" style="white-space:pre-wrap;"><a href="../roofing-north-norfolk/">North Norfolk roofing</a> · <a href="../roofing-south-norfolk/">South Norfolk roofing</a></p>
<h2 style="white-space:pre-wrap;"><span class="sqsrte-text-color--accent">Signs your chimney needs attention</span></h2>
<ul data-rte-list="default"><li><p class="" style="white-space:pre-wrap;">Mortar falling onto the roof or ground</p></li><li><p class="" style="white-space:pre-wrap;">Damp patches on chimney breasts indoors</p></li><li><p class="" style="white-space:pre-wrap;">Visible gaps in brick joints or leaning pots</p></li><li><p class="" style="white-space:pre-wrap;">Cracked or slipped lead around the stack base</p></li></ul>`,
  },
];

function prefixAssetPaths(html) {
  return html
    .replace(/<base href="">/, '<base href="../">')
    .replace(/(href|src)="(css\/|js\/|images\/)/g, '$1="../$2')
    .replace(/href="(index|contact|privacy|cart|thanks|404|home)\.html"/g, 'href="../$1.html"')
    .replace(
      /href="(roofing-north-norfolk|roofing-south-norfolk|chimney-repointing-norfolk-suffolk)\/?"/g,
      'href="../$1/"'
    )
    .replace(/href="\/sitemap\.xml"/g, 'href="../sitemap.xml"');
}

function buildMainContent(page) {
  const cta = `<p class="" style="white-space:pre-wrap;"><strong><a href="../contact.html">Get a free quote</a></strong> · <a href="tel:+447863395028">Call 07863 395028</a></p>`;
  return `<p class="" style="white-space:pre-wrap;"><a href="../index.html">Home</a> / ${page.breadcrumb}</p><h1 style="white-space:pre-wrap;"><span class="sqsrte-text-color--accent">${page.h1}</span></h1><p class="" style="white-space:pre-wrap;">${page.lead}</p>${page.body}${cta}`;
}

function buildPage(page) {
  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${page.title.replace(/'/g, "&#39;")}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${page.description}" />`
  );
  html = html.replace(/<link rel="canonical" href="[^"]*"\/>/, `<link rel="canonical" href="${page.canonical}"/>`);
  html = html.replace(/<meta property="og:title" content="[^"]*"\/>/, `<meta property="og:title" content="${page.title}"/>`);
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\/>/,
    `<meta property="og:description" content="${page.description}"/>`
  );
  html = html.replace(/<meta property="og:url" content="[^"]*"\/>/, `<meta property="og:url" content="${page.canonical}"/>`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"\/>/, `<meta name="twitter:title" content="${page.title}"/>`);
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\/>/,
    `<meta name="twitter:description" content="${page.description}"/>`
  );
  html = html.replace(/<meta name="twitter:url" content="[^"]*"\/>/, `<meta name="twitter:url" content="${page.canonical}"/>`);
  html = html.replace(
    /<meta itemprop="name" content="[^"]*"\/>/,
    `<meta itemprop="name" content="${page.title}"/>`
  );
  html = html.replace(
    /<meta itemprop="description" content="[^"]*"\/>/,
    `<meta itemprop="description" content="${page.description}"/>`
  );
  html = html.replace(/<meta itemprop="url" content="[^"]*"\/>/, `<meta itemprop="url" content="${page.canonical}"/>`);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Roofing and repointing",
    provider: {
      "@type": "RoofingContractor",
      name: "Sky's The Limit Roofing and Repointing",
      telephone: "+447863395028",
      email: "enquiries@skysthelimitroofing.co.uk",
      address: {
        "@type": "PostalAddress",
        streetAddress: "67 Station Road",
        addressLocality: "Cromer",
        addressRegion: "Norfolk",
        postalCode: "NR27 0DX",
        addressCountry: "GB",
      },
    },
    areaServed: { "@type": "AdministrativeArea", name: page.schemaArea },
  };
  html = html.replace(
    '<link rel="stylesheet" type="text/css" href="css/site.css"/>',
    `<script type="application/ld+json">${JSON.stringify(schema)}</script><link rel="stylesheet" type="text/css" href="css/site.css"/>`
  );

  const contentPattern = new RegExp(
    `(<div class="sqs-html-content" data-sqsp-text-block-content>)[\\s\\S]*?(</div>\\s*<style id="container-styles">#${CONTENT_BLOCK_ID})`
  );

  const mainContent = buildMainContent(page);
  const replaced = html.replace(contentPattern, `$1${mainContent}$2`);
  if (replaced === html) {
    throw new Error(`Failed to replace main content in template (${CONTENT_BLOCK_ID})`);
  }
  html = replaced;

  html = prefixAssetPaths(html);
  html = html.replace(new RegExp(PRIVACY_COLLECTION, "g"), `collection-seo-${page.slug}`);
  html = html.replace(
    /header-nav-item--active/g,
    "header-nav-item--collection"
  );

  return html;
}

for (const page of pages) {
  const outDir = path.join(siteDir, page.slug);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "index.html");
  fs.writeFileSync(outPath, buildPage(page), "utf8");
  console.log("Wrote", outPath);
}
