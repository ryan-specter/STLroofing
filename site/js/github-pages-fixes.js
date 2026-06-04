(function () {
  var videoSourcesBySystemId = {
    "8e483bad-8b98-4d57-8e39-1e6ca27624b4": "images/Video_Ready_No_Logos_Black_Hats.mp4",
    "1dae9738-081d-40a4-8da3-02315be9f071": "images/Video_Ready_Roofers_in_Anglia.mp4"
  };
  var videoPostersBySystemId = {
    "8e483bad-8b98-4d57-8e39-1e6ca27624b4": "images/Video_Ready_No_Logos_Black_Hats-poster.jpg",
    "1dae9738-081d-40a4-8da3-02315be9f071": "images/Video_Ready_Roofers_in_Anglia-poster.jpg"
  };
  var fabformEndpoint = "https://form.jotform.com/261523914866060";
  var brandStyleId = "wheeler-bowers-brand-styles";
  var brandStylesheet = "css/brand-overrides.css";
  var siteLogoAsset = "images/wb_roofing_logo.png";
  var announcementBarId = "wheeler-bowers-announcement-bar";
  var announcementMessage =
    "Looking for Sky's The Limit? We're now WB Roofing and Repointing — new name, same great service.";
  var jotformQuoteUrl = fabformEndpoint + "?source=website-quote";
  var defaultDocumentTitle = "Roofing & Repointing Norfolk & Suffolk | WB Roofing and Repointing";
  var localPageTargets = {
    "": "index.html",
    "404": "404.html",
    cart: "cart.html",
    contact: "contact.html",
    home: "home.html",
    index: "index.html",
    privacy: "privacy.html",
    thanks: "thanks.html",
    "roofing-north-norfolk": "roofing-north-norfolk/index.html",
    "roofing-south-norfolk": "roofing-south-norfolk/index.html",
    "chimney-repointing-norfolk-suffolk": "chimney-repointing-norfolk-suffolk/index.html"
  };
  var luciLogoUrl = "https://www.luci.ltd";
  var luciLogoAsset = "images/Luci.png";
  var luciFooterBlockId = "block-yui_3_17_2_1_1748997156366_5445";
  var luciLogoStyleId = "luci-footer-logo-styles-v2";
  var luciLogoMaxWidth = 96;
  var luciLogoHeight = 68;
  var legacyDesignerLogoPattern = /landscape-logo\.png|1c19ec4c-c38c-45d7-9535-66b0c61fc8c0_removalai_preview\.png|Luci\.svg/i;
  var logosManifestPath = "images/business-logos/logos.json";
  var logosCarouselStyleId = "trusted-clients-carousel-styles";
  var trustedClientsCarouselObserver;
  var trustedClientsPageObserver;
  var trustedClientsPageObserverTimer;
  var trustedClientsObserverTicking = false;
  var isRenderingTrustedClientsCarousel = false;
  var fallbackLogos = [
    { id: "albert_bartlett", name: "Albert Bartlett", website: "https://albertbartlett.co.uk/", image: "albert_bartlett.png" },
    { id: "tms_fm", name: "TMS Facilities Management", website: "https://tmsfm.co.uk/about-us/", image: "tms_fm.png", hideFromCarousel: true },
    { id: "animal_cromer", name: "Animal (Cromer)", website: "https://www.animal.co.uk/pages/animal-store-information", image: "animal_cromer.png", linkedLogos: ["tms_fm"] },
    { id: "mundesley_parish_council", name: "Mundesley Parish Council", website: "https://www.mundesley-pc.gov.uk/", image: "mundesley_parish_council.png" },
    { id: "watsons_property", name: "Watsons Property Group", website: "https://www.watsons-property.co.uk/", image: "watsons_property.png" }
  ];

  function decodeHtml(value) {
    var textarea = document.createElement("textarea");
    textarea.innerHTML = value || "";
    return textarea.value;
  }

  function getGitHubPagesBasePath() {
    if (window.location.protocol === "file:") return "";
    if (!/\.github\.io$/i.test(window.location.hostname)) return "/";

    var firstPathSegment = window.location.pathname.split("/").filter(Boolean)[0];
    return firstPathSegment ? "/" + firstPathSegment + "/" : "/";
  }

  function getLocalPageTarget(url) {
    var basePath = getGitHubPagesBasePath();
    var pathname = url.pathname;

    if (basePath !== "/" && pathname.indexOf(basePath) === 0) {
      pathname = pathname.slice(basePath.length);
    } else {
      pathname = pathname.replace(/^\/+/, "");
    }

    var pageName = pathname.replace(/^\/+|\/+$/g, "").replace(/\.html$/i, "");
    return localPageTargets[pageName];
  }

  function normalizeInternalPageHref(rawHref) {
    if (!rawHref || /^(#|mailto:|tel:|sms:|javascript:)/i.test(rawHref)) return null;

    var url;
    try {
      url = new URL(rawHref, window.location.href);
    } catch (error) {
      return null;
    }

    if (url.origin !== window.location.origin) return null;

    var targetPage = getLocalPageTarget(url);
    if (!targetPage) return null;

    return getGitHubPagesBasePath() + targetPage + url.search + url.hash;
  }

  function normalizeInternalLinks() {
    document.querySelectorAll("a[href]").forEach(function (anchor) {
      var normalizedHref = normalizeInternalPageHref(anchor.getAttribute("href"));
      if (normalizedHref) {
        anchor.setAttribute("href", normalizedHref);
      }
    });
  }

  function handleInternalLinkClick(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    var target = event.target.nodeType === 1 ? event.target : event.target.parentElement;
    var anchor = target && target.closest && target.closest("a[href]");
    if (!anchor || (anchor.target && anchor.target.toLowerCase() !== "_self")) return;

    var normalizedHref = normalizeInternalPageHref(anchor.getAttribute("href"));
    if (!normalizedHref) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(normalizedHref);
  }

  function getAssetUrl(relativePath) {
    return getGitHubPagesBasePath() + relativePath.replace(/^\/+/, "");
  }

  function urlUsesWbRoofingDomain(url) {
    if (!url) return false;

    try {
      return new URL(url, window.location.href).hostname.toLowerCase().indexOf("wbroofing.uk") !== -1;
    } catch (error) {
      return /wbroofing\.uk/i.test(url);
    }
  }

  function shouldShowRebrandAnnouncement() {
    if (urlUsesWbRoofingDomain(window.location.href)) return false;
    if (urlUsesWbRoofingDomain(document.referrer)) return false;
    return true;
  }

  function removeAnnouncementBar() {
    var bar = document.getElementById(announcementBarId);
    if (bar) bar.remove();
  }

  function ensureAnnouncementBar() {
    if (!shouldShowRebrandAnnouncement()) {
      removeAnnouncementBar();
      return;
    }

    if (document.getElementById(announcementBarId)) return;

    var dropzone = document.querySelector(".sqs-announcement-bar-dropzone");
    if (!dropzone) return;

    var bar = document.createElement("div");
    bar.id = announcementBarId;
    bar.className = "wheeler-bowers-announcement-bar";
    bar.setAttribute("role", "status");
    bar.innerHTML = "<p>" + announcementMessage + "</p>";
    dropzone.insertBefore(bar, dropzone.firstChild);
  }

  function applyWheelerBowersBranding() {
    var path = (window.location.pathname || "").replace(/\.html$/i, "").replace(/\/+$/, "");
    var isHome =
      path === "" ||
      path.endsWith("/index") ||
      path.endsWith("/home") ||
      /\/index$/i.test(path) ||
      /\/home$/i.test(path);

    if (isHome && document.title.indexOf("WB Roofing and Repointing") === -1) {
      document.title = defaultDocumentTitle;
    }

    ensureAnnouncementBar();
  }

  function ensureBrandStyles() {
    if (document.getElementById(brandStyleId) || document.querySelector('link[href*="brand-overrides.css"]')) {
      return;
    }

    var link = document.createElement("link");
    link.id = brandStyleId;
    link.rel = "stylesheet";
    link.href = getAssetUrl(brandStylesheet);
    document.head.appendChild(link);
  }

  function scheduleRetries(fn, delays) {
    delays.forEach(function (delay) {
      setTimeout(fn, delay);
    });
  }

  function applySiteLogoToImage(image, logoSrc) {
    if (!image || image.tagName !== "IMG") return;
    if (image.closest(".section-background")) return;
    if (image.classList.contains("background-image-fx")) return;

    if (image.getAttribute("data-wheeler-logo-ready") === "true" && image.getAttribute("src") === logoSrc) {
      return;
    }

    image.removeAttribute("srcset");
    image.removeAttribute("sizes");
    image.src = logoSrc;
    image.setAttribute("data-src", logoSrc);
    image.alt = "WB Roofing and Repointing";
    image.width = 320;
    image.height = 166;
    image.style.display = "block";
    image.style.visibility = "visible";
    image.style.opacity = "1";
    image.style.width = "auto";
    image.style.height = "auto";
    image.style.maxHeight = "80px";
    image.style.objectFit = "contain";
    image.setAttribute("data-wheeler-logo-ready", "true");
  }

  function hydrateSiteLogo() {
    var logoSrc = getAssetUrl(siteLogoAsset);

    document.querySelectorAll(".header-title-logo img, .header-mobile-logo img").forEach(function (image) {
      applySiteLogoToImage(image, logoSrc);
    });
  }

  function observeSiteLogo() {
    if (typeof MutationObserver === "undefined") return;

    var header = document.querySelector(".header, #header");
    if (!header) return;

    var observer = new MutationObserver(function () {
      hydrateSiteLogo();
    });
    observer.observe(header, { childList: true, subtree: true });
  }

  var siteLogoHydrated = false;

  function scheduleSiteLogoHydration() {
    hydrateSiteLogo();
    if (!siteLogoHydrated) {
      siteLogoHydrated = true;
      observeSiteLogo();
    }
    scheduleRetries(hydrateSiteLogo, [500]);
  }

  function scheduleVideoBackgroundHydration() {
    hydrateVideoBackgrounds();
    observeVideoBackgroundPlayers();
    scheduleRetries(hydrateVideoBackgrounds, [500, 2000]);
  }

  function parseSectionDividerContext(section) {
    var raw = section.getAttribute("data-current-context");
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch (error) {
      try {
        return JSON.parse(decodeHtml(raw));
      } catch (ignored) {
        return null;
      }
    }
  }

  function getVisiblePageSections() {
    return Array.from(document.querySelectorAll(".page-section")).filter(function (section) {
      var parent = section.parentElement;
      if (!parent) return false;
      return window.getComputedStyle(parent).display !== "none";
    });
  }

  function toDividerPixels(value, unit, clientWidth, clientHeight) {
    if (unit === "vw" || unit === "%") return clientWidth * (value * 0.01);
    if (unit === "vh") return clientHeight * (value * 0.01);
    return value;
  }

  var HERO_DIVIDER_SECTION_ID = "683f864b289d826d93f34fd7";
  var POINTED_DIVIDER_SECTION_ID = "683f8b11d4250d477014d681";
  function getEffectiveDividerType(section, divider) {
    if (section.getAttribute("data-section-id") === POINTED_DIVIDER_SECTION_ID) {
      return "pointed";
    }
    return "rounded";
  }

  function computeDividerIterations(blockWidth, widthPx) {
    var iterations = Math.ceil(blockWidth / widthPx);
    return iterations % 2 === 0 ? iterations + 1 : iterations + 2;
  }

  var dividerShapeBuilders = {
    softCorners: function (options) {
      var width = options.width;
      var height = options.height;
      var aspect = options.aspect || height / Math.max(width, 0.001);
      var offsetX = options.offsetX || 0;
      var isFlipX = options.isFlipX;
      var offsetY = isFlipX ? 1 : 1 - height;
      var curveHeight = isFlipX ? -height : height;
      var cornerSpan = Math.min(0.5 * width, aspect);
      var controlPull = 0.75 * height;
      var cornerInset = 0.75 * cornerSpan;
      var flipDir = isFlipX ? -1 : 1;
      var curve = [
        "l0,0",
        "c0," + controlPull * flipDir + " " + (cornerSpan - cornerInset) + "," + curveHeight + " " + cornerSpan + "," + curveHeight,
        "h" + (width - 2 * cornerSpan),
        "c" + cornerInset + ",0 " + cornerSpan + "," + (controlPull * flipDir - curveHeight) + " " + cornerSpan + "," + -curveHeight,
        "l0,0"
      ].join(" ");

      return [
        "M" + offsetX + ", " + offsetY,
        curve,
        "L1, -1",
        "L0, -1",
        "z"
      ].join(" ");
    },
    rounded: function (options) {
      var width = options.width;
      var height = options.height;
      var offsetX = options.offsetX || 0;
      var offsetY = options.offsetY || 0;
      var iterations = options.iterations || 1;
      var isFlipX = options.isFlipX;
      var r = isFlipX ? 1 : 1 - height;
      var l = 0.5 * width;
      var a = isFlipX ? -height : height;
      var segment = [
        "l0,0",
        "c0,0 " + (0.5 * l) + "," + a + " " + l + "," + a,
        "s" + l + "," + (-a) + " " + l + "," + (-a),
        "l0,0"
      ].join(" ");
      var curve = "";
      for (var i = 0; i < iterations; i += 1) curve += segment;

      return [
        "M" + offsetX + ", " + offsetY,
        "L" + offsetX + ", " + r,
        curve,
        "L1, -1",
        "L0, -1",
        "z"
      ].join(" ");
    },
    pointed: function (options) {
      var width = options.width;
      var height = options.height;
      var offsetX = options.offsetX || 0;
      var offsetY = options.offsetY || 0;
      var iterations = options.iterations || 1;
      var isFlipX = options.isFlipX;
      var r = isFlipX ? 1 - height : 1;
      var l = isFlipX ? height : -height;
      var a = 0.5 * width;
      var segment = ["l0,0", "l" + a + "," + l, "l" + a + "," + (-l)].join(" ");
      var curve = "";
      for (var j = 0; j < iterations; j += 1) curve += segment;

      return [
        "M" + offsetX + ", " + offsetY,
        "L" + offsetX + ", " + r,
        curve,
        "L1, -1",
        "L0, -1",
        "z"
      ].join(" ");
    }
  };

  function clipPathToStrokeCurve(clipPath) {
    var closeIndex = clipPath.indexOf("L1, -1");
    if (closeIndex === -1) return clipPath;
    return clipPath.slice(0, closeIndex).trim();
  }

  function ensureSectionDividerClipReference(section, sectionBorder) {
    var sectionId = section.getAttribute("data-section-id");
    if (!sectionId || !sectionBorder) return;
    var clipUrl = "url(#section-divider-" + sectionId + ")";
    sectionBorder.style.clipPath = clipUrl;
    sectionBorder.style.webkitClipPath = clipUrl;
  }

  function applySectionDividerStroke(section, divider, display, clipPath) {
    var strokeSvg = display.querySelector(".section-divider-svg-stroke");
    var strokePath = display.querySelector(".section-divider-stroke");
    if (!strokeSvg || !strokePath) return;

    var isHeroStroke =
      section.getAttribute("data-section-id") === HERO_DIVIDER_SECTION_ID &&
      divider.stroke &&
      divider.stroke.style === "solid";

    if (isHeroStroke) {
      var thickness =
        divider.stroke.thickness && divider.stroke.thickness.value
          ? divider.stroke.thickness.value
          : 6;
      display.style.setProperty("--stroke-thickness", thickness + "px");
      display.style.setProperty("--stroke-dasharray", "0");
      display.style.setProperty("--stroke-linecap", "square");
      display.style.setProperty("--section-divider-stroke-color", "hsla(var(--white-hsl), 1)");
      strokeSvg.style.display = "block";
      strokePath.style.display = "";
      strokePath.setAttribute(
        "d",
        "M-100,0.5 L-100,1.5 " + clipPathToStrokeCurve(clipPath)
      );
      return;
    }

    display.style.setProperty("--stroke-thickness", "0");
    display.style.setProperty("--stroke-dasharray", "0");
    display.style.removeProperty("--section-divider-stroke-color");
    strokeSvg.style.display = "none";
    strokePath.setAttribute("d", "M0,0");
    strokePath.style.display = "none";
  }

  function applySectionDividerStacking(section, divider, sectionIndex, sections) {
    var display = section.querySelector(".section-divider-display");
    if (!display) return;

    var styleEl = display.querySelector("[data-section-divider-style]");
    var sectionId = section.getAttribute("data-section-id");
    var dividerHeight = divider.height.value + divider.height.unit;
    var zIndex = sections.length - sectionIndex;
    var css =
      '[data-section-id="' + sectionId + '"] { --divider-height: ' + dividerHeight + "; --z-index: " + zIndex + "; }";

    var nextSection = sections[sectionIndex + 1];
    if (nextSection) {
      css +=
        '\n[data-section-id="' + nextSection.getAttribute("data-section-id") + '"] { --previous-section-divider-offset: ' + dividerHeight + "; }";
      nextSection.style.setProperty("--previous-section-divider-offset", dividerHeight);
    }

    if (styleEl) styleEl.textContent = css;
    section.style.setProperty("--divider-height", dividerHeight);
    section.style.setProperty("--z-index", String(zIndex));
  }

  function clearSectionDividerMaskOverrides(section) {
    var sectionBorder = section.querySelector(".section-border");
    if (!sectionBorder) return;

    sectionBorder.classList.remove("wb-section-divider-masked");
    sectionBorder.style.removeProperty("-webkit-mask-image");
    sectionBorder.style.removeProperty("mask-image");

    var sectionBackground = sectionBorder.querySelector(".section-background");
    if (sectionBackground) {
      sectionBackground.classList.remove("wb-section-divider-masked");
      sectionBackground.style.removeProperty("-webkit-mask-image");
      sectionBackground.style.removeProperty("mask-image");
    }

    var clipContainer = section.querySelector(".section-divider-svg-clip");
    if (clipContainer) clipContainer.style.display = "";
  }

  function updateSectionDividerPath(section, divider, sectionIndex, sections) {
    var sectionBorder = section.querySelector(".section-border");
    var display = section.querySelector(".section-divider-display");
    if (!sectionBorder || !display) return;

    var clipPath = display.querySelector(".section-divider-clip");
    var dividerBlock = display.querySelector(".section-divider-block");
    var clipContainer = display.querySelector(".section-divider-svg-clip");
    if (!clipPath || !dividerBlock || !clipContainer) return;

    applySectionDividerStacking(section, divider, sectionIndex, sections);

    var borderRect = sectionBorder.getBoundingClientRect();
    var blockRect = dividerBlock.getBoundingClientRect();
    var clientWidth = document.documentElement.clientWidth;
    var clientHeight = document.documentElement.clientHeight;
    if (borderRect.width <= 0 || clientHeight <= 0) return;

    var offsetPx = toDividerPixels(divider.offset.value, divider.offset.unit, clientWidth, clientHeight);
    var widthPx = toDividerPixels(divider.width.value, divider.width.unit, clientWidth, clientHeight);
    var blockWidth = blockRect.width + Math.abs(offsetPx);
    var dividerType = getEffectiveDividerType(section, divider);
    var isSoftCorners = dividerType === "softCorners";
    var iterations = isSoftCorners ? 1 : computeDividerIterations(blockWidth, widthPx);

    var scaleX = 1 / borderRect.width;
    var scaleY = 1 / borderRect.height;
    var normalizedWidth = Math.round(widthPx * scaleX * 1000) / 1000;
    var normalizedHeight = Math.round(Math.floor(blockRect.height - 0.5) * scaleY * 1000) / 1000;
    var normalizedOffset = Math.round(offsetPx * scaleX * 1000) / 1000;

    if (Math.round(widthPx) >= Math.round(borderRect.width) && divider.stroke && divider.stroke.style === "solid") {
      var strokePx = toDividerPixels(
        divider.stroke.thickness.value,
        divider.stroke.thickness.unit,
        clientWidth,
        clientHeight
      );
      widthPx += strokePx;
      normalizedWidth = Math.round(widthPx * scaleX * 1000) / 1000;
    }

    var builder = dividerShapeBuilders[dividerType] || dividerShapeBuilders.rounded;
    var path = builder({
      width: normalizedWidth,
      height: normalizedHeight,
      aspect: blockRect.height > 0 ? blockRect.height / Math.max(widthPx, 1) : normalizedHeight / Math.max(normalizedWidth, 0.001),
      offsetX: isSoftCorners
        ? 0
        : 0.5 * -normalizedOffset + 0.5 - normalizedWidth * iterations * 0.5,
      offsetY: 1 - normalizedHeight,
      iterations: iterations,
      isFlipX: !!divider.isFlipX
    });

    clearSectionDividerMaskOverrides(section);

    clipContainer.style.display = "block";
    clipPath.setAttribute("d", path);
    ensureSectionDividerClipReference(section, sectionBorder);
    applySectionDividerStroke(section, divider, display, path);
    section.setAttribute("data-github-pages-divider-ready", dividerType);
  }

  function hydrateSectionDividers() {
    var sections = getVisiblePageSections();

    sections.forEach(function (section, sectionIndex) {
      if (!section.classList.contains("has-section-divider")) return;

      var context = parseSectionDividerContext(section);
      if (!context || !context.divider || !context.divider.enabled) return;

      var divider = context.divider;
      if (!divider.type || divider.type === "none") return;

      updateSectionDividerPath(section, divider, sectionIndex, sections);
    });
  }

  var sectionDividerResizeTimer;
  var sectionDividerHydrationBound = false;

  function scheduleSectionDividerHydration() {
    hydrateSectionDividers();

    if (!sectionDividerHydrationBound) {
      sectionDividerHydrationBound = true;
      window.addEventListener("resize", function () {
        clearTimeout(sectionDividerResizeTimer);
        sectionDividerResizeTimer = setTimeout(hydrateSectionDividers, 150);
      });
      window.addEventListener("load", hydrateSectionDividers, { once: true });
    }

    scheduleRetries(hydrateSectionDividers, [500]);
  }

  function createFabformContactForm(sourceLabel) {
    var container = document.createElement("div");
    container.className = "fabform-contact-form";

    container.innerHTML = [
      '<a class="fabform-contact-link" href="' + fabformEndpoint + "?source=" + encodeURIComponent(sourceLabel) + '" target="_blank" rel="noopener noreferrer">Get Your Free Quote</a>'
    ].join("");

    return container;
  }

  function replaceFormBlockWithJotformButton(block, index) {
    if (!block || block.querySelector(".fabform-contact-form")) return false;

    var wrapper = block.querySelector(".sqs-block-content");
    if (!wrapper) return false;

    block.removeAttribute("data-block-scripts");
    block.setAttribute("data-fabform-endpoint", fabformEndpoint);
    wrapper.innerHTML = "";
    wrapper.appendChild(createFabformContactForm("contact-form-" + (index + 1)));
    wrapper.setAttribute("data-fabform-ready", "true");
    return true;
  }

  function hydrateFabformContactForms() {
    document.querySelectorAll(".sqs-block-form").forEach(function (block, index) {
      replaceFormBlockWithJotformButton(block, index);
    });
  }

  function watchContactFormBlocks() {
    var contactSection = document.querySelector('[data-section-id="683f8b11d4250d477014d681"]');
    if (!contactSection || !window.MutationObserver) return;

    var observer = new MutationObserver(function () {
      contactSection.querySelectorAll(".sqs-block-form").forEach(function (block, index) {
        replaceFormBlockWithJotformButton(block, index);
      });
    });

    observer.observe(contactSection, { childList: true, subtree: true });
  }

  function scheduleFabformHydration() {
    hydrateFabformContactForms();
    watchContactFormBlocks();
    scheduleRetries(hydrateFabformContactForms, [500]);
  }

  function ensureLogosCarouselStyles() {
    if (document.getElementById(logosCarouselStyleId)) return;

    var style = document.createElement("style");
    style.id = logosCarouselStyleId;
    style.textContent = [
      ".page-section.trusted-clients-section { padding-top: 0 !important; padding-bottom: 0 !important; }",
      ".page-section.trusted-clients-previous-section.has-section-divider { padding-bottom: 6vw !important; }",
      ".page-section.trusted-clients-previous-section .section-divider-block { height: 6vw !important; min-height: 6vw !important; }",
      ".page-section.has-section-divider:not([data-section-id=\"683f864b289d826d93f34fd7\"]) .section-divider-svg-stroke { display: none !important; }",
      ".page-section.trusted-clients-section { position: relative; overflow: visible; margin-top: calc(-1 * var(--previous-section-divider-offset, 6vw)) !important; }",
      ".page-section.trusted-clients-section .section-border { top: 0 !important; }",
      ".page-section.trusted-clients-section .section-background, .page-section.trusted-clients-section .trusted-clients-brand-backdrop { top: calc(-1 * var(--previous-section-divider-offset, 6vw)) !important; }",
      ".page-section.trusted-clients-section > .content-wrapper { padding-top: calc(var(--previous-section-divider-offset, 6vw) + clamp(16px, 2.5vw, 36px)) !important; overflow-x: hidden; }",
      ".page-section.trusted-clients-section .trusted-clients-heading-fe-block { margin-top: 0 !important; }",
      ".page-section.trusted-clients-section .section-background-overlay { opacity: 0.2 !important; }",
      ".trusted-clients-brand-backdrop { position: absolute; inset: 0; pointer-events: none; z-index: 1; }",
      ".trusted-clients-brand-layer { position: absolute; inset: 0; background-position: center; background-repeat: no-repeat; background-size: cover; opacity: 0; transition: opacity 500ms ease-in-out; filter: saturate(1.05) contrast(1.02); }",
      ".trusted-clients-brand-layer.is-active { opacity: 0.58; }",
      ".trusted-clients-heading-fe-block, .trusted-clients-fe-block, .trusted-clients-following-fe-block { position: relative; z-index: 3; }",
      ".trusted-clients-fe-block, .trusted-clients-fe-block .sqs-block, .trusted-clients-fe-block .sqs-block-content { min-height: 0 !important; }",
      ".trusted-clients-fe-block { width: 100vw !important; margin-left: calc(50% - 50vw) !important; }",
      ".trusted-clients-fe-block .sqs-block-content { width: 100% !important; overflow: visible !important; }",
      ".trusted-clients-heading-fe-block .sqs-html-content, .trusted-clients-heading-fe-block .sqs-block-content { padding-bottom: 0 !important; margin-bottom: 0 !important; }",
      ".trusted-clients-following-fe-block .sqs-html-content, .trusted-clients-following-fe-block .sqs-block-content { padding-top: 0 !important; margin-top: 0 !important; }",
      ".trusted-clients-block, .trusted-clients-block .sqs-block-content { margin: 0 !important; padding: 0 !important; min-height: 0 !important; }",
      ".trusted-clients-block { margin-top: -1.05rem !important; margin-bottom: -1.5rem !important; }",
      ".trusted-clients-block .sqs-block-content { line-height: 0; }",
      ".trusted-clients-block + .fe-block .sqs-html-content p { margin-bottom: 0.08rem !important; }",
      ".trusted-clients-block .trusted-clients-nav { display: none !important; }",
      ".trusted-clients-carousel { position: relative; width: 100%; overflow: visible; padding: 0; margin-top: -0.5rem; margin-bottom: -0.95rem; }",
      ".trusted-clients-track { display: flex; gap: 0.14rem; overflow-x: auto; scroll-behavior: auto; padding: 0; -ms-overflow-style: none; scrollbar-width: none; }",
      ".trusted-clients-track::-webkit-scrollbar { display: none; }",
      ".trusted-clients-scrollbar { position: relative; height: 12px; width: min(520px, 92%); margin: 0 auto 0; border-radius: 999px; background: rgba(255,255,255,0.2); cursor: pointer; }",
      ".trusted-clients-scrollbar-thumb { position: absolute; top: 1px; left: 0; height: 10px; width: 112px; border-radius: 999px; background: rgba(255,255,255,0.9); box-shadow: 0 1px 8px rgba(0,0,0,0.3); cursor: grab; }",
      ".trusted-clients-scrollbar.dragging .trusted-clients-scrollbar-thumb { cursor: grabbing; }",
      ".trusted-clients-slide { flex: 0 0 auto; border: 0 !important; background: transparent !important; padding: 0 !important; box-shadow: none !important; }",
      ".trusted-clients-group { display: flex; align-items: center; justify-content: center; min-height: 240px; }",
      ".trusted-clients-logo-link { display: inline-flex; align-items: center; justify-content: center; padding: 0 0.28rem; transition: transform 0.25s ease, opacity 0.25s ease, filter 0.25s ease; opacity: 0.95; }",
      ".trusted-clients-logo-link:hover, .trusted-clients-logo-link:focus-visible { transform: translateY(-2px) scale(1.04); opacity: 1; filter: drop-shadow(0 0 14px rgba(255,255,255,0.22)); }",
      ".trusted-clients-logo-img { display: block; height: clamp(230px, 20vw, 340px); width: auto; max-width: none; object-fit: contain; }",
      ".trusted-clients-separator { display: inline-block; width: 2px; height: 152px; margin: 0 0.2rem; background: rgba(255,255,255,0.92); box-shadow: 0 0 10px rgba(255,255,255,0.28); }",
      "@media (max-width: 900px) { .trusted-clients-fe-block { width: 100vw !important; margin-left: calc(50% - 50vw) !important; } .trusted-clients-block { margin-top: -0.75rem !important; margin-bottom: -1.05rem !important; } .trusted-clients-carousel { margin-top: -0.35rem; margin-bottom: -0.7rem; } .trusted-clients-track { gap: 0.1rem; padding: 0; } .trusted-clients-group { min-height: 196px; } .trusted-clients-logo-img { height: clamp(178px, 24vw, 270px); } .trusted-clients-separator { height: 136px; margin: 0 0.12rem; } .trusted-clients-scrollbar { width: min(420px, 90%); margin-top: 0; } .trusted-clients-scrollbar-thumb { width: 96px; } }",
      "@media (max-width: 640px) { .trusted-clients-fe-block { width: 100vw !important; margin-left: calc(50% - 50vw) !important; } .trusted-clients-block { margin-top: -0.45rem !important; margin-bottom: -0.75rem !important; } .trusted-clients-carousel { padding: 0; margin-top: -0.2rem; margin-bottom: -0.45rem; } .trusted-clients-track { gap: 0.06rem; padding: 0; } .trusted-clients-group { min-height: 164px; } .trusted-clients-logo-link { padding: 0 0.02rem; } .trusted-clients-logo-img { height: clamp(150px, 32vw, 228px); } .trusted-clients-separator { height: 114px; margin: 0 0.06rem; } .trusted-clients-scrollbar { width: 84%; margin-top: 0; } .trusted-clients-scrollbar-thumb { width: 72px; } }"
    ].join("\n");
    document.head.appendChild(style);
  }

  function createLogoAnchor(logo) {
    var anchor = document.createElement("a");
    var image = document.createElement("img");

    anchor.className = "trusted-clients-logo-link";
    anchor.href = logo.website;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.setAttribute("aria-label", logo.name);

    image.className = "trusted-clients-logo-img";
    image.src = getAssetUrl("images/business-logos/" + logo.image);
    image.alt = logo.name + " logo";
    image.loading = "lazy";

    anchor.appendChild(image);
    return anchor;
  }

  function createLogoSlide(primaryLogo, logoLookup) {
    var slide = document.createElement("div");
    var group = document.createElement("div");
    var logoIds = [primaryLogo.id].concat(Array.isArray(primaryLogo.linkedLogos) ? primaryLogo.linkedLogos : []);

    slide.className = "trusted-clients-slide";
    slide.setAttribute("data-primary-logo-id", primaryLogo.id);
    group.className = "trusted-clients-group";

    logoIds.forEach(function (logoId, index) {
      var logo = logoLookup[logoId];
      if (!logo) return;
      if (index > 0) {
        var separator = document.createElement("span");
        separator.className = "trusted-clients-separator";
        separator.setAttribute("aria-hidden", "true");
        group.appendChild(separator);
      }
      group.appendChild(createLogoAnchor(logo));
    });

    slide.appendChild(group);
    return slide;
  }

  function isElementVisible(element) {
    if (!element) return false;
    var style = window.getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden" && parseFloat(style.opacity || "1") !== 0 && element.offsetParent !== null;
  }

  function isBackgroundAnimationPaused(section) {
    if (!section) return false;
    var video = section.querySelector(".sqs-video-background-native video");
    if (video) return video.paused;
    var controls = Array.prototype.slice.call(section.querySelectorAll(".background-pause-button"));
    if (!controls.length) return false;

    var visibleControls = controls.filter(isElementVisible);
    var pausedVisibleControl = visibleControls.find(function (control) {
      return control.classList && control.classList.contains("paused");
    });
    if (pausedVisibleControl) return true;

    var activeControl = visibleControls[0] || controls[0];
    var label = (activeControl.getAttribute("aria-label") || "").toLowerCase();
    if (label.indexOf("play") !== -1) return true;
    if (label.indexOf("pause") !== -1) return false;

    return !!(activeControl.classList && activeControl.classList.contains("paused"));
  }

  function startCarouselAutoscroll(wrapper, track, section) {
    var isDragging = false;
    var dragStartX = 0;
    var dragStartScrollLeft = 0;
    var suppressClickUntil = 0;
    var isPausedByBackgroundControl = false;
    var baseSlidesCount = track.children.length;
    var speedPixelsPerFrame = 0.35;

    if (!baseSlidesCount) return;

    var scrollbar = wrapper.querySelector(".trusted-clients-scrollbar");
    var thumb = wrapper.querySelector(".trusted-clients-scrollbar-thumb");
    var isScrollbarDragging = false;
    var scrollbarDragOffsetX = 0;

    function getLoopWidth() {
      return track.scrollWidth / 2;
    }

    function normalizeLoopPosition(rawPosition) {
      var loopWidth = getLoopWidth();
      if (!loopWidth) return 0;
      var normalized = rawPosition % loopWidth;
      if (normalized < 0) normalized += loopWidth;
      return normalized;
    }

    function setLoopScrollPosition(rawPosition) {
      track.scrollLeft = normalizeLoopPosition(rawPosition);
    }

    function getNormalizedProgressRatio() {
      var loopWidth = getLoopWidth();
      if (!loopWidth) return 0;
      var normalized = track.scrollLeft % loopWidth;
      return (normalized < 0 ? normalized + loopWidth : normalized) / loopWidth;
    }

    function setTrackFromProgressRatio(progressRatio) {
      var loopWidth = getLoopWidth();
      if (!loopWidth) return;
      var safeRatio = Math.max(0, Math.min(1, progressRatio));
      track.scrollLeft = safeRatio * loopWidth;
    }

    function updateScrollbarThumb() {
      if (!scrollbar || !thumb || isScrollbarDragging) return;
      var railWidth = scrollbar.clientWidth;
      var thumbWidth = thumb.clientWidth;
      var maxLeft = Math.max(0, railWidth - thumbWidth);
      var ratio = getNormalizedProgressRatio();
      thumb.style.left = (ratio * maxLeft) + "px";
    }

    function animate() {
      if (!isDragging && !isPausedByBackgroundControl) {
        setLoopScrollPosition(track.scrollLeft + speedPixelsPerFrame);
      }
      window.requestAnimationFrame(animate);
    }

    function syncWithBackgroundControls() {
      isPausedByBackgroundControl = isBackgroundAnimationPaused(section);
    }

    function startDrag(event) {
      if (event.button !== 0) return;
      isDragging = true;
      dragStartX = event.clientX;
      dragStartScrollLeft = track.scrollLeft;
      wrapper.classList.add("dragging");
      track.style.cursor = "grabbing";
      track.style.userSelect = "none";
      event.preventDefault();
    }

    function moveDrag(event) {
      if (!isDragging) return;
      var deltaX = event.clientX - dragStartX;
      setLoopScrollPosition(dragStartScrollLeft - deltaX);
      updateScrollbarThumb();
    }

    function endDrag() {
      if (!isDragging) return;
      var dragDistance = Math.abs(track.scrollLeft - dragStartScrollLeft);
      isDragging = false;
      wrapper.classList.remove("dragging");
      track.style.cursor = "";
      track.style.userSelect = "";

      if (dragDistance > 8) {
        suppressClickUntil = Date.now() + 250;
      }
    }

    track.addEventListener("mousedown", startDrag);
    window.addEventListener("mousemove", moveDrag);
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("mouseleave", endDrag);

    wrapper.addEventListener("click", function (event) {
      if (Date.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);

    track.addEventListener("dragstart", function (event) {
      event.preventDefault();
    });

    function updateTrackFromScrollbarClientX(clientX) {
      if (!scrollbar || !thumb) return;
      var rect = scrollbar.getBoundingClientRect();
      var railWidth = rect.width;
      var thumbWidth = thumb.clientWidth;
      var maxLeft = Math.max(0, railWidth - thumbWidth);
      var left = Math.max(0, Math.min(maxLeft, clientX - rect.left - scrollbarDragOffsetX));
      thumb.style.left = left + "px";
      var ratio = maxLeft ? left / maxLeft : 0;
      setTrackFromProgressRatio(ratio);
    }

    function startScrollbarDrag(event) {
      if (!scrollbar || !thumb || event.button !== 0) return;
      isScrollbarDragging = true;
      isDragging = true;
      scrollbar.classList.add("dragging");
      var thumbRect = thumb.getBoundingClientRect();
      scrollbarDragOffsetX = event.clientX - thumbRect.left;
      event.preventDefault();
    }

    function moveScrollbarDrag(event) {
      if (!isScrollbarDragging) return;
      updateTrackFromScrollbarClientX(event.clientX);
    }

    function endScrollbarDrag() {
      if (!isScrollbarDragging) return;
      isScrollbarDragging = false;
      isDragging = false;
      scrollbar.classList.remove("dragging");
    }

    if (scrollbar && thumb) {
      thumb.addEventListener("mousedown", startScrollbarDrag);
      scrollbar.addEventListener("mousedown", function (event) {
        if (event.target === thumb || event.button !== 0) return;
        var thumbRect = thumb.getBoundingClientRect();
        scrollbarDragOffsetX = thumbRect.width / 2;
        updateTrackFromScrollbarClientX(event.clientX);
      });
      window.addEventListener("mousemove", moveScrollbarDrag);
      window.addEventListener("mouseup", endScrollbarDrag);
      window.addEventListener("mouseleave", endScrollbarDrag);
      track.addEventListener("scroll", updateScrollbarThumb, { passive: true });
      window.addEventListener("resize", updateScrollbarThumb);
      setTimeout(updateScrollbarThumb, 0);
    }

    if (section) {
      var controls = section.querySelectorAll(".background-pause-button");
      controls.forEach(function (button) {
        button.addEventListener("click", function () {
          setTimeout(syncWithBackgroundControls, 0);
        });
      });

      var observer = new MutationObserver(syncWithBackgroundControls);
      controls.forEach(function (button) {
        observer.observe(button, { attributes: true, attributeFilter: ["class", "style", "aria-label"] });
      });
      syncWithBackgroundControls();
    }

    for (var i = 0; i < baseSlidesCount; i += 1) {
      track.appendChild(track.children[i].cloneNode(true));
    }

    window.requestAnimationFrame(animate);
  }

  function resolveBrandBackgroundUrl(rawPath) {
    if (!rawPath) return null;
    var normalizedPath = String(rawPath).trim();

    // Never allow legacy Instagram preview assets as brand backdrops.
    if (/image-asset(-\d+)?\.jpe?g/i.test(normalizedPath)) return null;

    if (/^(https?:)?\/\//i.test(normalizedPath) || normalizedPath.indexOf("data:") === 0) return normalizedPath;
    if (normalizedPath.indexOf("/") === 0 || normalizedPath.indexOf("images/") === 0) return getAssetUrl(normalizedPath);
    return getAssetUrl("images/business-logos/" + normalizedPath);
  }

  function ensureTrustedClientsBackdrop(section) {
    if (!section) return null;
    var existing = section.querySelector(".trusted-clients-brand-backdrop");
    if (existing) return existing;
    var backgroundHost = section.querySelector(".section-background");

    var backdrop = document.createElement("div");
    var layerA = document.createElement("div");
    var layerB = document.createElement("div");

    backdrop.className = "trusted-clients-brand-backdrop";
    layerA.className = "trusted-clients-brand-layer is-active";
    layerB.className = "trusted-clients-brand-layer";

    backdrop.appendChild(layerA);
    backdrop.appendChild(layerB);
    if (backgroundHost) {
      if (window.getComputedStyle(backgroundHost).position === "static") {
        backgroundHost.style.position = "relative";
      }
      backgroundHost.appendChild(backdrop);
    } else {
      section.insertBefore(backdrop, section.firstChild);
    }
    return backdrop;
  }

  function setupCarouselBrandBackdrop(wrapper, track, logos, section) {
    var backgroundByLogoId = {};
    var hasAnyBackground = false;
    var activeLogoId = null;
    var hoverLogoId = null;
    var isLayerAActive = true;
    var updatePending = false;
    var isPausedByBackgroundControl = false;
    var baseParallaxRangePercent = 4;
    var maxParallaxRangePercent = 30;
    var imageMetaByUrl = {};
    var lastRenderedProgress = -1;
    var panProgress = 0;
    var lastTrackScrollLeft = track.scrollLeft;
    var backdrop;
    var layerA;
    var layerB;

    logos.forEach(function (logo) {
      var resolved = resolveBrandBackgroundUrl(logo.backgroundImage || logo.brandBackgroundImage);
      backgroundByLogoId[logo.id] = resolved;
      if (resolved) hasAnyBackground = true;
    });

    if (!hasAnyBackground || !section) return;

    backdrop = ensureTrustedClientsBackdrop(section);
    if (!backdrop) return;
    layerA = backdrop.children[0];
    layerB = backdrop.children[1];

    function getNormalizedTrackProgress() {
      var normalized = panProgress % 1;
      if (normalized < 0) normalized += 1;
      return normalized;
    }

    function getLoopWidth() {
      return Math.max(1, track.scrollWidth / 2);
    }

    function getNormalizedScrollDelta(current, previous, loopWidth) {
      var delta = current - previous;
      if (delta > loopWidth / 2) return delta - loopWidth;
      if (delta < -loopWidth / 2) return delta + loopWidth;
      return delta;
    }

    function setLayerBackgroundPosition(layer, logoId, progress) {
      var imageUrl = backgroundByLogoId[logoId];
      var imageMeta = imageUrl && imageMetaByUrl[imageUrl];
      var phase = typeof progress === "number" ? progress : getNormalizedTrackProgress();
      var viewportRatio;
      var horizontalPressure;
      var verticalPressure;
      var horizontalRange;
      var verticalRange;
      var xPos;
      var yPos;

      if (!logoId || !imageUrl || !imageMeta) {
        layer.style.backgroundPosition = "center center";
        return;
      }

      viewportRatio = Math.max(0.35, window.innerWidth / Math.max(window.innerHeight, 1));

      // If image is wider than viewport crop, pan mostly on X. If taller, pan mostly on Y.
      horizontalPressure = Math.max(0, (imageMeta.ratio / viewportRatio) - 1);
      verticalPressure = Math.max(0, (viewportRatio / imageMeta.ratio) - 1);

      horizontalRange = Math.min(maxParallaxRangePercent, baseParallaxRangePercent + (horizontalPressure * 22));
      verticalRange = Math.min(maxParallaxRangePercent, baseParallaxRangePercent + (verticalPressure * 22));

      // Move opposite to leftward logo motion.
      xPos = 50 + ((phase * 2) - 1) * horizontalRange;
      yPos = 50 + ((phase * 2) - 1) * verticalRange;
      layer.style.backgroundPosition = xPos.toFixed(2) + "% " + yPos.toFixed(2) + "%";
    }

    function ensureImageMeta(imageUrl) {
      if (!imageUrl || imageMetaByUrl[imageUrl]) return;

      imageMetaByUrl[imageUrl] = { isWide: false, ready: false };
      var image = new Image();
      image.onload = function () {
        var ratio = image.naturalWidth && image.naturalHeight ? (image.naturalWidth / image.naturalHeight) : 1;
        imageMetaByUrl[imageUrl] = { ratio: ratio, ready: true };
      };
      image.onerror = function () {
        imageMetaByUrl[imageUrl] = { ratio: 1, ready: true };
      };
      image.src = imageUrl;
    }

    function syncWithBackgroundControls() {
      isPausedByBackgroundControl = isBackgroundAnimationPaused(section);
    }

    function applyBackgroundForLogo(logoId) {
      var imageUrl = backgroundByLogoId[logoId];
      var incomingLayer;
      var outgoingLayer;

      if (logoId === activeLogoId) return;
      activeLogoId = logoId;

      if (!imageUrl) {
        layerA.classList.remove("is-active");
        layerB.classList.remove("is-active");
        layerA.style.backgroundImage = "";
        layerB.style.backgroundImage = "";
        layerA.style.backgroundPosition = "center center";
        layerB.style.backgroundPosition = "center center";
        return;
      }

      ensureImageMeta(imageUrl);

      incomingLayer = isLayerAActive ? layerB : layerA;
      outgoingLayer = isLayerAActive ? layerA : layerB;
      incomingLayer.style.backgroundImage = "url('" + imageUrl + "')";
      incomingLayer.setAttribute("data-logo-id", logoId);
      setLayerBackgroundPosition(incomingLayer, logoId, getNormalizedTrackProgress());
      outgoingLayer.classList.remove("is-active");
      incomingLayer.classList.add("is-active");
      isLayerAActive = !isLayerAActive;
    }

    function pickCenteredLogoId() {
      var slides = track.querySelectorAll(".trusted-clients-slide");
      var trackRect = track.getBoundingClientRect();
      var centerX = trackRect.left + (trackRect.width / 2);
      var bestLogoId = null;
      var closestDistance = Infinity;

      slides.forEach(function (slide) {
        var rect = slide.getBoundingClientRect();
        var slideCenter = rect.left + (rect.width / 2);
        var distance = Math.abs(slideCenter - centerX);
        if (distance < closestDistance) {
          closestDistance = distance;
          bestLogoId = slide.getAttribute("data-primary-logo-id");
        }
      });

      return bestLogoId;
    }

    function scheduleBackdropUpdate() {
      if (updatePending) return;
      updatePending = true;
      window.requestAnimationFrame(function () {
        var centeredLogoId = hoverLogoId || pickCenteredLogoId();
        updatePending = false;
        if (centeredLogoId) applyBackgroundForLogo(centeredLogoId);
      });
    }

    wrapper.addEventListener("pointerover", function (event) {
      var logoLink = event.target && event.target.closest && event.target.closest(".trusted-clients-logo-link");
      var slide = logoLink && logoLink.closest(".trusted-clients-slide");
      var primaryLogoId = slide && slide.getAttribute("data-primary-logo-id");
      if (!primaryLogoId) return;
      hoverLogoId = primaryLogoId;
      scheduleBackdropUpdate();
    });

    wrapper.addEventListener("pointerout", function (event) {
      if (!event.relatedTarget || !wrapper.contains(event.relatedTarget)) {
        hoverLogoId = null;
        scheduleBackdropUpdate();
      }
    });

    function animateBackdropPan() {
      var visibleLogoIdA = layerA.getAttribute("data-logo-id");
      var visibleLogoIdB = layerB.getAttribute("data-logo-id");
      var loopWidth = getLoopWidth();
      var currentScrollLeft = track.scrollLeft;
      var scrollDelta = getNormalizedScrollDelta(currentScrollLeft, lastTrackScrollLeft, loopWidth);
      var progressDelta = scrollDelta / loopWidth;
      var progress;
      lastTrackScrollLeft = currentScrollLeft;

      if (!isPausedByBackgroundControl || Math.abs(progressDelta) > 0.000001) {
        panProgress += progressDelta;
      }

      progress = getNormalizedTrackProgress();

      if (!isPausedByBackgroundControl || progress !== lastRenderedProgress) {
        setLayerBackgroundPosition(layerA, visibleLogoIdA, progress);
        setLayerBackgroundPosition(layerB, visibleLogoIdB, progress);
        lastRenderedProgress = progress;
      }
      window.requestAnimationFrame(animateBackdropPan);
    }

    var controls = section.querySelectorAll(".background-pause-button");
    controls.forEach(function (button) {
      button.addEventListener("click", function () {
        setTimeout(syncWithBackgroundControls, 0);
      });
    });

    var pauseObserver = new MutationObserver(syncWithBackgroundControls);
    controls.forEach(function (button) {
      pauseObserver.observe(button, { attributes: true, attributeFilter: ["class", "style", "aria-label"] });
    });
    syncWithBackgroundControls();
    window.requestAnimationFrame(animateBackdropPan);

    track.addEventListener("scroll", scheduleBackdropUpdate, { passive: true });
    window.addEventListener("resize", scheduleBackdropUpdate);
    wrapper.addEventListener("pointerup", scheduleBackdropUpdate);
    scheduleBackdropUpdate();
  }

  function createTrustedClientsCarousel(logos, section) {
    var wrapper = document.createElement("div");
    var track = document.createElement("div");
    var scrollbar = document.createElement("div");
    var scrollbarThumb = document.createElement("div");
    var logoLookup = {};

    logos.forEach(function (logo) {
      logoLookup[logo.id] = logo;
    });

    wrapper.className = "trusted-clients-carousel";
    track.className = "trusted-clients-track";
    scrollbar.className = "trusted-clients-scrollbar";
    scrollbarThumb.className = "trusted-clients-scrollbar-thumb";

    logos.forEach(function (logo) {
      if (logo.hideFromCarousel) return;
      track.appendChild(createLogoSlide(logo, logoLookup));
    });

    scrollbar.appendChild(scrollbarThumb);
    wrapper.appendChild(track);
    wrapper.appendChild(scrollbar);
    startCarouselAutoscroll(wrapper, track, section);
    setupCarouselBrandBackdrop(wrapper, track, logos, section);

    return wrapper;
  }

  function renderTrustedClientsIntoBlock(carouselBlock, logos) {
    ensureLogosCarouselStyles();
    var blockContent = carouselBlock.querySelector(".sqs-block-content");
    if (!blockContent) return;
    var feBlock = carouselBlock.closest(".fe-block");
    var section = carouselBlock.closest(".page-section");
    var previousSection = section && section.previousElementSibling;
    var headingFeBlock = feBlock && feBlock.previousElementSibling;
    var followingFeBlock = feBlock && feBlock.nextElementSibling;

    isRenderingTrustedClientsCarousel = true;
    blockContent.innerHTML = "";
    blockContent.appendChild(createTrustedClientsCarousel(logos, section));
    updateTrustedClientsHeading(carouselBlock);
    carouselBlock.classList.remove("sqs-block-instagram", "instagram-block");
    carouselBlock.classList.add("trusted-clients-block");
    carouselBlock.removeAttribute("data-block-json");
    carouselBlock.removeAttribute("data-block-type");
    if (section) section.classList.add("trusted-clients-section");
    if (previousSection && previousSection.classList) previousSection.classList.add("trusted-clients-previous-section");
    if (feBlock) feBlock.classList.add("trusted-clients-fe-block");
    if (headingFeBlock) headingFeBlock.classList.add("trusted-clients-heading-fe-block");
    if (followingFeBlock) followingFeBlock.classList.add("trusted-clients-following-fe-block");
    carouselBlock.setAttribute("data-github-pages-logos", "ready");
    isRenderingTrustedClientsCarousel = false;
    hydrateSectionDividers();
  }

  function ensureTrustedClientsCarousel(logos) {
    var carouselBlock = findTrustedClientsBlock();
    if (!carouselBlock) return false;

    if (!carouselBlock.querySelector(".trusted-clients-carousel")) {
      renderTrustedClientsIntoBlock(carouselBlock, logos);
    }
    watchTrustedClientsBlock(carouselBlock, logos);
    return true;
  }

  function watchTrustedClientsBlock(carouselBlock, logos) {
    if (!carouselBlock || typeof MutationObserver === "undefined") return;

    if (trustedClientsCarouselObserver) trustedClientsCarouselObserver.disconnect();
    trustedClientsCarouselObserver = new MutationObserver(function () {
      if (isRenderingTrustedClientsCarousel || carouselBlock.querySelector(".trusted-clients-carousel")) return;
      renderTrustedClientsIntoBlock(carouselBlock, logos);
    });
    trustedClientsCarouselObserver.observe(carouselBlock, { childList: true, subtree: true });
  }

  function watchTrustedClientsPage(logos) {
    if (trustedClientsPageObserver || typeof MutationObserver === "undefined" || !document.body) return;

    trustedClientsPageObserver = new MutationObserver(function () {
      if (trustedClientsObserverTicking) return;
      trustedClientsObserverTicking = true;
      window.requestAnimationFrame(function () {
        trustedClientsObserverTicking = false;
        ensureTrustedClientsCarousel(logos);
      });
    });
    trustedClientsPageObserver.observe(document.body, { childList: true, subtree: true });

    clearTimeout(trustedClientsPageObserverTimer);
    trustedClientsPageObserverTimer = setTimeout(function () {
      if (trustedClientsPageObserver) trustedClientsPageObserver.disconnect();
      trustedClientsPageObserver = null;
    }, 8000);
  }

  function scheduleTrustedClientsHydration(logos) {
    ensureTrustedClientsCarousel(logos);
    scheduleRetries(function () {
      ensureTrustedClientsCarousel(logos);
    }, [500]);
    watchTrustedClientsPage(logos);
  }

  function updateTrustedClientsHeading(carouselBlock) {
    var textBlock = carouselBlock && carouselBlock.parentElement && carouselBlock.parentElement.previousElementSibling;
    if (!textBlock) return;

    var heading = textBlock.querySelector("h2");
    var paragraph = textBlock.querySelector("p");

    if (heading) heading.textContent = "Trusted by names you know";
    if (paragraph) {
      paragraph.textContent = "Professional clients and organisations we have worked with.";
    }
  }

  function findTrustedClientsBlock() {
    var sections = document.querySelectorAll(".page-section");
    var headingPattern = /trusted by names you know|what(?:'|’)s the latest\??/i;

    for (var i = 0; i < sections.length; i += 1) {
      var section = sections[i];
      var headingFeBlock = section.querySelector(".fe-block .sqs-block.html-block");
      var heading = headingFeBlock && headingFeBlock.querySelector("h2");
      var headingText = heading && heading.textContent ? heading.textContent.trim() : "";
      if (!headingText || !headingPattern.test(headingText)) continue;

      var blocks = section.querySelectorAll(".fe-block .sqs-block");
      for (var j = 0; j < blocks.length; j += 1) {
        var block = blocks[j];
        if (block.classList.contains("html-block")) continue;
        if (block.getAttribute("data-github-pages-logos") === "ready" && block.querySelector(".trusted-clients-carousel")) continue;
        if (!block.querySelector(".sqs-block-content")) continue;
        return block;
      }
    }

    return null;
  }

  function hydrateTrustedClientsCarousel() {
    var carouselBlock = findTrustedClientsBlock();
    if (!carouselBlock) return;

    fetch(getAssetUrl(logosManifestPath))
      .then(function (response) {
        if (!response.ok) throw new Error("Unable to load logos.json");
        return response.json();
      })
      .then(function (manifest) {
        var logos = manifest && Array.isArray(manifest.logos) && manifest.logos.length ? manifest.logos : fallbackLogos;
        renderTrustedClientsIntoBlock(carouselBlock, logos);
        scheduleTrustedClientsHydration(logos);
      })
      .catch(function (error) {
        console.warn(error);
        renderTrustedClientsIntoBlock(carouselBlock, fallbackLogos);
        scheduleTrustedClientsHydration(fallbackLogos);
      });
  }

  function playVideo(video) {
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  }

  function resetVideoPosterReveal(video, poster) {
    if (!video) return;
    video.classList.remove("is-playing");
    delete video.dataset.wbPosterRevealed;
    delete video.dataset.wbPosterReveal;
    if (poster) poster.classList.remove("is-hidden");
  }

  function videoHasRenderableFrame(video) {
    return video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0;
  }

  function attachVideoSource(video, source, poster) {
    if (!source || video.getAttribute("data-wb-video-src") === source) {
      playVideo(video);
      return;
    }

    resetVideoPosterReveal(video, poster);
    video.setAttribute("data-wb-video-src", source);
    video.removeAttribute("src");
    while (video.firstChild) video.removeChild(video.firstChild);

    var sourceEl = document.createElement("source");
    sourceEl.src = source;
    sourceEl.type = "video/mp4";
    video.appendChild(sourceEl);
    video.load();

    video.addEventListener(
      "loadeddata",
      function () {
        playVideo(video);
      },
      { once: true }
    );
    video.addEventListener(
      "error",
      function () {
        video.src = source;
        video.load();
        playVideo(video);
      },
      { once: true }
    );
  }

  function createHostedBackgroundVideo() {
    var video = document.createElement("video");
    video.autoplay = true;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.className = "github-pages-video-background";
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    video.addEventListener("ended", function () {
      video.currentTime = 0;
      playVideo(video);
    });
    return video;
  }

  function resolveHostedVideoConfig(background) {
    var config = decodeHtml(background.getAttribute("data-config-native-video"));
    if (!config) return null;

    var systemId = Object.keys(videoSourcesBySystemId).find(function (id) {
      return config.indexOf(id) !== -1;
    });
    if (!systemId) return null;

    return {
      systemId: systemId,
      source: getAssetUrl(videoSourcesBySystemId[systemId]),
      poster: getAssetUrl(videoPostersBySystemId[systemId])
    };
  }

  function ensureVideoPoster(player, posterUrl) {
    if (!player || !posterUrl) return null;

    var poster = player.querySelector(".wb-video-poster");
    if (!poster) {
      poster = document.createElement("div");
      poster.className = "wb-video-poster";
      poster.setAttribute("aria-hidden", "true");
      player.insertBefore(poster, player.firstChild);
    }

    poster.style.backgroundImage = 'url("' + posterUrl + '")';
    poster.classList.remove("is-hidden");
    return poster;
  }

  function markVideoPosterReady(video, poster) {
    if (!video || !poster) return;
    if (video.dataset.wbPosterReveal === "bound") return;
    video.dataset.wbPosterReveal = "bound";

    function hidePosterAfterVideoPainted() {
      if (video.dataset.wbPosterRevealed === "1") return;
      if (!videoHasRenderableFrame(video)) return false;

      video.dataset.wbPosterRevealed = "1";
      video.classList.add("is-playing");

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          poster.classList.add("is-hidden");
        });
      });
      return true;
    }

    function waitForPaintedFrame(attemptsLeft) {
      if (hidePosterAfterVideoPainted()) return;

      if (typeof video.requestVideoFrameCallback === "function") {
        video.requestVideoFrameCallback(function () {
          if (!hidePosterAfterVideoPainted()) waitForPaintedFrame(attemptsLeft - 1);
        });
        return;
      }

      if (attemptsLeft <= 0) {
        hidePosterAfterVideoPainted();
        return;
      }

      requestAnimationFrame(function () {
        waitForPaintedFrame(attemptsLeft - 1);
      });
    }

    function startReveal() {
      if (video.dataset.wbPosterRevealed === "1") return;
      waitForPaintedFrame(8);
    }

    video.addEventListener("playing", startReveal, { once: true });
    video.addEventListener(
      "loadeddata",
      function () {
        if (!video.paused) startReveal();
      },
      { once: true }
    );
  }

  function hydrateVideoBackgrounds() {
    document.querySelectorAll(".sqs-video-background-native").forEach(function (background) {
      var player = background.querySelector(".sqs-video-background-native__video-player");
      if (!player) return;

      var hosted = resolveHostedVideoConfig(background);
      if (!hosted) return;

      var poster = ensureVideoPoster(player, hosted.poster);
      var video = player.querySelector("video.github-pages-video-background");
      if (!video) {
        player.querySelectorAll("video, iframe").forEach(function (node) {
          node.remove();
        });
        video = createHostedBackgroundVideo();
        player.appendChild(video);
      }

      if (!video.classList.contains("is-playing")) {
        poster.classList.remove("is-hidden");
      }

      if (hosted.poster) {
        video.setAttribute("poster", hosted.poster);
      }

      attachVideoSource(video, hosted.source, poster);
      markVideoPosterReady(video, poster);
    });
  }

  var videoBackgroundObserver;

  function observeVideoBackgroundPlayers() {
    if (typeof MutationObserver === "undefined" || videoBackgroundObserver) return;

    videoBackgroundObserver = new MutationObserver(function (mutations) {
      var needsFix = mutations.some(function (mutation) {
        return Array.from(mutation.addedNodes).some(function (node) {
          if (node.nodeType !== 1) return false;
          if (node.nodeName === "IFRAME") return true;
          return node.nodeName === "VIDEO" && !node.classList.contains("github-pages-video-background");
        });
      });
      if (needsFix) hydrateVideoBackgrounds();
    });

    document.querySelectorAll(".sqs-video-background-native__video-player").forEach(function (player) {
      videoBackgroundObserver.observe(player, { childList: true, subtree: true });
    });
  }

  function isQuoteOrContactLink(anchor) {
    var href = (anchor.getAttribute("href") || "").trim();
    var text = (anchor.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
    if (!href && !text) return false;

    if (/contact\.html/i.test(href) || /jotform\.com/i.test(href)) return true;
    if (/free quote|get your free quote|get a free quote|contact us/i.test(text)) return true;

    return false;
  }

  function hydrateQuoteContactLinks() {
    document.querySelectorAll("a[href]").forEach(function (anchor) {
      if (!isQuoteOrContactLink(anchor)) return;
      if (anchor.classList.contains("fabform-contact-link")) return;

      anchor.setAttribute("href", jotformQuoteUrl);
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noopener noreferrer");
    });
  }

  function scheduleQuoteContactLinkHydration() {
    hydrateQuoteContactLinks();
    scheduleRetries(hydrateQuoteContactLinks, [500]);
  }

  function ensureLuciLogoStyles() {
    if (document.getElementById(luciLogoStyleId)) return;

    var style = document.createElement("style");
    style.id = luciLogoStyleId;
    style.textContent = [
      ".fe-block-yui_3_17_2_1_1748997156366_5445 {",
      "  z-index: 5 !important;",
      "}",
      "@media (min-width: 768px) {",
      "  .fe-block-yui_3_17_2_1_1748997156366_5445 {",
      "    grid-area: 2/2/4/7 !important;",
      "  }",
      "}",
      "#" + luciFooterBlockId + " .luci-footer-logo,",
      "#" + luciFooterBlockId + " .sqs-block-content {",
      "  display: flex !important;",
      "  flex-direction: column !important;",
      "  align-items: flex-start !important;",
      "  justify-content: center !important;",
      "  gap: 0.3rem !important;",
      "  min-height: 0 !important;",
      "  padding: 0.25rem 0 !important;",
      "}",
      "#" + luciFooterBlockId + " .luci-footer-strapline {",
      "  margin: 0 !important;",
      "  font-size: 0.7rem !important;",
      "  line-height: 1.25 !important;",
      "  font-weight: 400 !important;",
      "  letter-spacing: 0.02em !important;",
      "  color: rgba(0, 0, 0, 0.5) !important;",
      "}",
      "#" + luciFooterBlockId + " .luci-footer-logo-link {",
      "  display: block !important;",
      "  line-height: 0 !important;",
      "}",
      "#" + luciFooterBlockId + " img {",
      "  display: block !important;",
      "  width: min(" + luciLogoMaxWidth + "px, 72vw) !important;",
      "  max-width: " + luciLogoMaxWidth + "px !important;",
      "  height: auto !important;",
      "  opacity: 0.88 !important;",
      "  visibility: visible !important;",
      "}",
      "#" + luciFooterBlockId + " .fluid-image-container,",
      "#" + luciFooterBlockId + " .fluid-image-animation-wrapper {",
      "  min-height: 0 !important;",
      "  overflow: visible !important;",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function replaceLuciFooterBlock() {
    var block = document.getElementById(luciFooterBlockId);
    if (!block) return false;

    var needsReplace =
      block.querySelector(".fluid-image-component-root") ||
      block.querySelector("[data-loader='sqs']") ||
      !block.querySelector(".luci-footer-strapline") ||
      block.getAttribute("data-luci-block-ready") !== "true";

    if (!needsReplace) return true;

    var logoSrc = getAssetUrl(luciLogoAsset);
    var markup =
      '<motion.div class="luci-footer-logo">' +
      '<p class="luci-footer-strapline">Designed and hosted by</p>' +
      '<a class="luci-footer-logo-link" href="' +
      luciLogoUrl +
      '" target="_blank" rel="noopener noreferrer" aria-label="Visit Luci (designed and hosted by)">' +
      '<img src="' +
      logoSrc +
      '" alt="Luci" width="' +
      luciLogoMaxWidth +
      '" height="' +
      luciLogoHeight +
      '" loading="eager" decoding="async" data-luci-logo-ready="true">' +
      "</a></motion.div>";

    var content =
      block.querySelector(":scope > .sqs-block-content") ||
      block.querySelector(".sqs-block-content");
    if (content) {
      content.innerHTML = markup;
    }

    block.setAttribute("data-luci-block-ready", "true");
    return true;
  }

  function observeLuciFooterBlock() {
    var block = document.getElementById(luciFooterBlockId);
    if (!block || block.getAttribute("data-luci-observer-ready") === "true") return;

    block.setAttribute("data-luci-observer-ready", "true");
    var observer = new MutationObserver(function () {
      if (
        block.querySelector(".fluid-image-component-root") ||
        block.querySelector("[data-loader='sqs']")
      ) {
        block.removeAttribute("data-luci-block-ready");
        replaceLuciFooterBlock();
        hydrateLuciLogo();
      }
    });
    observer.observe(block, { childList: true, subtree: true });
  }

  function isDesignerFooterLogo(image) {
    if (image.closest("#" + luciFooterBlockId)) return true;

    var sources = [
      image.getAttribute("src"),
      image.getAttribute("data-src"),
      image.getAttribute("data-image")
    ];
    return sources.some(function (value) {
      return value && legacyDesignerLogoPattern.test(value);
    });
  }

  function hydrateLuciLogo() {
    ensureLuciLogoStyles();
    replaceLuciFooterBlock();

    document.querySelectorAll("img").forEach(function (image) {
      if (!isDesignerFooterLogo(image) || image.getAttribute("data-luci-logo-ready") === "true") return;

      var logoSrc = getAssetUrl(luciLogoAsset);
      image.removeAttribute("data-loader");
      image.removeAttribute("data-load");
      image.loading = "eager";
      image.decoding = "async";
      image.src = logoSrc;
      image.setAttribute("data-src", logoSrc);
      image.setAttribute("data-image", logoSrc);
      image.removeAttribute("srcset");
      image.removeAttribute("sizes");
      image.alt = "Luci";
      image.width = luciLogoMaxWidth;
      image.height = luciLogoHeight;
      image.style.display = "block";
      image.style.maxWidth = luciLogoMaxWidth + "px";
      image.style.width = "min(" + luciLogoMaxWidth + "px, 72vw)";
      image.style.height = "auto";
      image.style.opacity = "0.88";

      if (!image.closest("a")) {
        var link = document.createElement("a");
        link.href = luciLogoUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", "Visit Luci");
        image.parentNode.insertBefore(link, image);
        link.appendChild(image);
      } else {
        var existingLink = image.closest("a");
        existingLink.href = luciLogoUrl;
        existingLink.target = "_blank";
        existingLink.rel = "noopener noreferrer";
        existingLink.setAttribute("aria-label", "Visit Luci");
      }

      image.setAttribute("data-luci-logo-ready", "true");
    });
  }

  function scheduleLuciLogoHydration() {
    hydrateLuciLogo();
    scheduleRetries(hydrateLuciLogo, [500]);
  }

  function runFixes() {
    ensureBrandStyles();
    applyWheelerBowersBranding();
    normalizeInternalLinks();
    hydrateQuoteContactLinks();
    hydrateFabformContactForms();
    hydrateSectionDividers();
    hydrateVideoBackgrounds();
    hydrateSiteLogo();
    hydrateLuciLogo();
    scheduleSiteLogoHydration();
    scheduleFabformHydration();
    scheduleQuoteContactLinkHydration();
    scheduleSectionDividerHydration();
    scheduleVideoBackgroundHydration();
    scheduleLuciLogoHydration();
    hydrateTrustedClientsCarousel();
    observeLuciFooterBlock();
  }

  document.addEventListener("click", handleInternalLinkClick, true);

  ensureBrandStyles();
  applyWheelerBowersBranding();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runFixes, { once: true });
  } else {
    runFixes();
  }
})();
