/**
 * Generates SEO landing pages from contact.html so they match site chrome/layout.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.join(__dirname, "..", "site");
const template = fs.readFileSync(path.join(siteDir, "contact.html"), "utf8");

const CONTACT_HERO =
  '<p class="" data-rte-preserve-empty="true" style="white-space:pre-wrap;"></p><div class="sqsrte-scaled-text-container"><span class="sqsrte-scaled-text"><h1 style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Contact us</span></h1></span></div><p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Interested in working with us? Fill out some info and we will be in touch to arrange your free quotation.</span></p>';

const FORM_BLOCK_START = '<div class="fe-block fe-block-60fe2ef5f75cdc2d0128">';
const FORM_BLOCK_END = "    <button class='background-pause-button'";

const HERO_BLOCK_START = '<div class="fe-block fe-block-a18791bd572c905cdec6">';
const HERO_BLOCK_END = '<div class="fe-block fe-block-60fe2ef5f75cdc2d0128">';

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
<p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Whether you need storm-damage repairs, a full re-roof, chimney repointing, or new fascias and guttering, our team delivers tidy, reliable workmanship with clear communication and free, no-obligation quotations.</span></p>
<h2 style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Roofing services in North Norfolk</span></h2>
<ul data-rte-list="default"><li><p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">New pitched and flat roof installations</span></p></li><li><p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Roof repairs, leak fixes and storm damage</span></p></li><li><p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Chimney repointing, lead flashing and stack repairs</span></p></li><li><p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Fascias, soffits, gutters and roofline replacement</span></p></li><li><p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Tile, slate and membrane flat roofing</span></p></li></ul>
<h2 style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Areas we cover in North Norfolk</span></h2>
<p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">We work throughout the North Norfolk district, including Cromer, Sheringham, Holt, Wells-next-the-Sea, Hunstanton, Fakenham, Mundesley, North Walsham, Blakeney, Cley, Wroxham and the Broads.</span></p>
<p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">We also cover <a href="../roofing-south-norfolk/">South Norfolk</a> and <a href="../chimney-repointing-norfolk-suffolk/">Suffolk</a> — <a href="../index.html">see our full service area</a>.</span></p>`,
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
<p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Our work covers domestic and commercial roofs — repairs after storms, planned re-roofs, chimney maintenance and complete roofline upgrades. Every job starts with an honest assessment and a written quote with no hidden extras.</span></p>
<h2 style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">What we offer in South Norfolk</span></h2>
<ul data-rte-list="default"><li><p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Emergency and planned roof repairs</span></p></li><li><p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">New tiled, slated and flat roofs</span></p></li><li><p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Chimney repointing and lead work</span></p></li><li><p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Guttering, fascias and soffits</span></p></li><li><p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Mortar and ridge pointing</span></p></li></ul>
<h2 style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">South Norfolk towns &amp; villages</span></h2>
<p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Regular projects across South Norfolk include Norwich, Wymondham, Diss, Attleborough, Thetford, Loddon, Harleston, Long Stratton and Poringland.</span></p>
<p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">See our <a href="../roofing-north-norfolk/">North Norfolk roofing</a> page or <a href="../chimney-repointing-norfolk-suffolk/">chimney repointing in Suffolk</a>.</span></p>`,
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
<p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Crumbling mortar, loose pots and failed flashings can let water into lofts and bedrooms. Our team rakes out decayed mortar, repoints with a matched mix, and repairs lead aprons and back gutters for a watertight finish.</span></p>
<h2 style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Chimney services</span></h2>
<ul data-rte-list="default"><li><p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Full chimney repointing and mortar repairs</span></p></li><li><p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Lead flashing replacement and dressing</span></p></li><li><p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Chimney pot rebedding and cowls</span></p></li><li><p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Stack repairs after storm damage</span></p></li><li><p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Ridge and verge pointing</span></p></li></ul>
<h2 style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Where we work</span></h2>
<p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">We cover North Norfolk (Cromer, Sheringham, Holt, Wells), South Norfolk (Norwich, Wymondham, Diss) and Suffolk including Lowestoft, Beccles, Bungay and Ipswich.</span></p>
<p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white"><a href="../roofing-north-norfolk/">North Norfolk roofing</a> · <a href="../roofing-south-norfolk/">South Norfolk roofing</a></span></p>
<h2 style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Signs your chimney needs attention</span></h2>
<ul data-rte-list="default"><li><p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Mortar falling onto the roof or ground</span></p></li><li><p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Damp patches on chimney breasts indoors</span></p></li><li><p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Visible gaps in brick joints or leaning pots</span></p></li><li><p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">Cracked or slipped lead around the stack base</span></p></li></ul>`,
  },
];

function prefixAssetPaths(html) {
  return html
    .replace(/(href|src)="(css\/|js\/|images\/)/g, '$1="../$2')
    .replace(/href="(index|contact|privacy|cart|thanks|404|home)\.html"/g, 'href="../$1.html"')
    .replace(
      /href="(roofing-north-norfolk|roofing-south-norfolk|chimney-repointing-norfolk-suffolk)\/?"/g,
      'href="../$1/"'
    )
    .replace(/href="\/sitemap\.xml"/g, 'href="../sitemap.xml"');
}

function buildHeroContent(page) {
  return `<p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white"><a href="../index.html">Home</a> / ${page.breadcrumb}</span></p><div class="sqsrte-scaled-text-container"><span class="sqsrte-scaled-text"><h1 style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">${page.h1}</span></h1></span></div><p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white">${page.lead}</span></p>`;
}

function buildBodyBlockFromHeroTemplate(heroBlockTemplate, page) {
  const cta = `<p class="" style="white-space:pre-wrap;"><span class="sqsrte-text-color--white"><a href="../contact.html">Get a free quote</a> · <a href="tel:+447863395028">Call 07863 395028</a></span></p>`;
  const inner = `${page.body}\n${cta}`;
  const renamed = heroBlockTemplate
    .replace(/fe-block-a18791bd572c905cdec6/g, "fe-block-seo-body")
    .replace(/block-a18791bd572c905cdec6/g, "block-seo-body")
    .replace(/a18791bd572c905cdec6/g, "seo-body");
  const replaced = renamed.replace(
    /(<div class="sqs-html-content" data-sqsp-text-block-content>)[\s\S]*?(<\/div>\s*<style id="container-styles">)/,
    `$1${inner}$2`
  );
  if (replaced === renamed) {
    throw new Error("Failed to replace body content in hero block template");
  }
  return replaced;
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

  if (!html.includes(CONTACT_HERO)) {
    throw new Error("Contact hero marker not found in template");
  }
  html = html.replace(CONTACT_HERO, buildHeroContent(page));

  const heroStart = html.indexOf(HERO_BLOCK_START);
  const heroEnd = html.indexOf(HERO_BLOCK_END, heroStart);
  if (heroStart === -1 || heroEnd === -1) {
    throw new Error("Hero block markers not found in template");
  }
  const heroBlockTemplate = html.slice(heroStart, heroEnd);
  const bodyBlock = buildBodyBlockFromHeroTemplate(heroBlockTemplate, page);

  const formStart = html.indexOf(FORM_BLOCK_START);
  const formEnd = html.indexOf(FORM_BLOCK_END, formStart);
  if (formStart === -1 || formEnd === -1) {
    throw new Error("Form block markers not found in template");
  }
  html = html.slice(0, formStart) + bodyBlock + html.slice(formEnd);

  html = prefixAssetPaths(html);
  html = html.replace(/collection-681ca588cc62471553f1b749/g, `collection-seo-${page.slug}`);
  html = html.replace(/id="collection-681ca588cc62471553f1b749"/g, `id="collection-seo-${page.slug}"`);

  return html;
}

for (const page of pages) {
  const outDir = path.join(siteDir, page.slug);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "index.html");
  fs.writeFileSync(outPath, buildPage(page), "utf8");
  console.log("Wrote", outPath);
}
