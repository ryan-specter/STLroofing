(function () {
  var videoSourcesBySystemId = {
    "8e483bad-8b98-4d57-8e39-1e6ca27624b4": "images/playlist-1.m3u8",
    "1dae9738-081d-40a4-8da3-02315be9f071": "images/playlist.m3u8"
  };
  var hlsScriptUrl = "https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js";
  var hlsLoaderPromise;
  var localPageTargets = {
    "": "index.html",
    "404": "404.html",
    cart: "cart.html",
    contact: "contact.html",
    home: "home.html",
    index: "index.html",
    privacy: "privacy.html"
  };
  var logosManifestPath = "images/business-logos/logos.json";
  var logosCarouselStyleId = "trusted-clients-carousel-styles";
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

  function ensureLogosCarouselStyles() {
    if (document.getElementById(logosCarouselStyleId)) return;

    var style = document.createElement("style");
    style.id = logosCarouselStyleId;
    style.textContent = [
      ".page-section.trusted-clients-section { padding-top: 0 !important; padding-bottom: 0 !important; }",
      ".page-section.trusted-clients-section { position: relative; overflow: hidden; }",
      ".page-section.trusted-clients-section .section-background-overlay { opacity: 0.2 !important; }",
      ".trusted-clients-brand-backdrop { position: absolute; inset: 0; pointer-events: none; z-index: 1; }",
      ".trusted-clients-brand-layer { position: absolute; inset: 0; background-position: center; background-repeat: no-repeat; background-size: cover; opacity: 0; transition: opacity 500ms ease-in-out; filter: saturate(1.05) contrast(1.02); }",
      ".trusted-clients-brand-layer.is-active { opacity: 0.58; }",
      ".trusted-clients-heading-fe-block, .trusted-clients-fe-block, .trusted-clients-following-fe-block { position: relative; z-index: 3; }",
      ".trusted-clients-fe-block, .trusted-clients-fe-block .sqs-block, .trusted-clients-fe-block .sqs-block-content { min-height: 0 !important; }",
      ".trusted-clients-heading-fe-block .sqs-html-content, .trusted-clients-heading-fe-block .sqs-block-content { padding-bottom: 0 !important; margin-bottom: 0 !important; }",
      ".trusted-clients-following-fe-block .sqs-html-content, .trusted-clients-following-fe-block .sqs-block-content { padding-top: 0 !important; margin-top: 0 !important; }",
      ".trusted-clients-block, .trusted-clients-block .sqs-block-content { margin: 0 !important; padding: 0 !important; min-height: 0 !important; }",
      ".trusted-clients-block { margin-top: -1.05rem !important; margin-bottom: -1.5rem !important; }",
      ".trusted-clients-block .sqs-block-content { line-height: 0; }",
      ".trusted-clients-block + .fe-block .sqs-html-content p { margin-bottom: 0.08rem !important; }",
      ".trusted-clients-block .trusted-clients-nav { display: none !important; }",
      ".trusted-clients-carousel { position: relative; width: 100%; overflow: hidden; padding: 0; margin-top: -0.5rem; margin-bottom: -0.95rem; }",
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
      "@media (max-width: 900px) { .trusted-clients-block { margin-top: -0.75rem !important; margin-bottom: -1.05rem !important; } .trusted-clients-carousel { margin-top: -0.35rem; margin-bottom: -0.7rem; } .trusted-clients-track { gap: 0.1rem; padding: 0 0.06rem; } .trusted-clients-group { min-height: 196px; } .trusted-clients-logo-img { height: clamp(178px, 24vw, 270px); } .trusted-clients-separator { height: 136px; margin: 0 0.12rem; } .trusted-clients-scrollbar { width: min(420px, 90%); margin-top: 0; } .trusted-clients-scrollbar-thumb { width: 96px; } }",
      "@media (max-width: 640px) { .trusted-clients-block { margin-top: -0.45rem !important; margin-bottom: -0.75rem !important; } .trusted-clients-carousel { padding: 0; margin-top: -0.2rem; margin-bottom: -0.45rem; } .trusted-clients-track { gap: 0.06rem; padding: 0 0.02rem; } .trusted-clients-group { min-height: 164px; } .trusted-clients-logo-link { padding: 0 0.02rem; } .trusted-clients-logo-img { height: clamp(150px, 32vw, 228px); } .trusted-clients-separator { height: 114px; margin: 0 0.06rem; } .trusted-clients-scrollbar { width: 84%; margin-top: 0; } .trusted-clients-scrollbar-thumb { width: 72px; } }"
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
    return style.display !== "none" && style.visibility !== "hidden" && parseFloat(style.opacity || "1") !== 0;
  }

  function isBackgroundAnimationPaused(section) {
    if (!section) return false;
    var controls = Array.prototype.slice.call(section.querySelectorAll(".background-pause-button"));
    if (!controls.length) return false;

    var visibleControl = controls.find(isElementVisible) || controls[0];
    var label = (visibleControl.getAttribute("aria-label") || "").toLowerCase();
    return label.indexOf("play") !== -1;
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

    function getNormalizedProgress() {
      var loopWidth = getLoopWidth();
      if (!loopWidth) return 0;
      var normalized = track.scrollLeft % loopWidth;
      return normalized < 0 ? normalized + loopWidth : normalized;
    }

    function setTrackFromProgress(progressRatio) {
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
      var loopWidth = getLoopWidth();
      var ratio = loopWidth ? getNormalizedProgress() / loopWidth : 0;
      thumb.style.left = (ratio * maxLeft) + "px";
    }

    function animate() {
      if (!isDragging && !isPausedByBackgroundControl) {
        track.scrollLeft += speedPixelsPerFrame;
        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft = 0;
        }
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
      track.scrollLeft = dragStartScrollLeft - deltaX;
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
      setTrackFromProgress(ratio);
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
    if (/^(https?:)?\/\//i.test(rawPath) || rawPath.indexOf("data:") === 0) return rawPath;
    if (rawPath.indexOf("/") === 0 || rawPath.indexOf("images/") === 0) return getAssetUrl(rawPath);
    return getAssetUrl("images/business-logos/" + rawPath);
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

    function applyBackgroundForLogo(logoId) {
      var imageUrl = backgroundByLogoId[logoId];
      var incomingLayer;
      var outgoingLayer;

      if (logoId === activeLogoId) return;
      activeLogoId = logoId;

      if (!imageUrl) {
        layerA.classList.remove("is-active");
        layerB.classList.remove("is-active");
        return;
      }

      incomingLayer = isLayerAActive ? layerB : layerA;
      outgoingLayer = isLayerAActive ? layerA : layerB;
      incomingLayer.style.backgroundImage = "url('" + imageUrl + "')";
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

  function renderTrustedClientsIntoBlock(instagramBlock, logos) {
    ensureLogosCarouselStyles();
    var blockContent = instagramBlock.querySelector(".sqs-block-content");
    if (!blockContent) return;
    var feBlock = instagramBlock.closest(".fe-block");
    var section = instagramBlock.closest(".page-section");
    var headingFeBlock = feBlock && feBlock.previousElementSibling;
    var followingFeBlock = feBlock && feBlock.nextElementSibling;

    blockContent.innerHTML = "";
    blockContent.appendChild(createTrustedClientsCarousel(logos, section));
    updateTrustedClientsHeading(instagramBlock);
    instagramBlock.classList.remove("sqs-block-instagram", "instagram-block");
    instagramBlock.classList.add("trusted-clients-block");
    if (section) section.classList.add("trusted-clients-section");
    if (feBlock) feBlock.classList.add("trusted-clients-fe-block");
    if (headingFeBlock) headingFeBlock.classList.add("trusted-clients-heading-fe-block");
    if (followingFeBlock) followingFeBlock.classList.add("trusted-clients-following-fe-block");
    instagramBlock.setAttribute("data-github-pages-logos", "ready");
  }

  function updateTrustedClientsHeading(instagramBlock) {
    var textBlock = instagramBlock && instagramBlock.parentElement && instagramBlock.parentElement.previousElementSibling;
    if (!textBlock) return;

    var heading = textBlock.querySelector("h2");
    var paragraph = textBlock.querySelector("p");

    if (heading) heading.textContent = "Trusted by names you know";
    if (paragraph) {
      paragraph.textContent = "Professional clients and organisations we have worked with.";
    }
  }

  function hydrateTrustedClientsCarousel() {
    var instagramBlock = document.querySelector(".sqs-block-instagram");
    if (!instagramBlock || instagramBlock.getAttribute("data-github-pages-logos") === "ready") return;

    fetch(getAssetUrl(logosManifestPath))
      .then(function (response) {
        if (!response.ok) throw new Error("Unable to load logos.json");
        return response.json();
      })
      .then(function (manifest) {
        var logos = manifest && Array.isArray(manifest.logos) && manifest.logos.length ? manifest.logos : fallbackLogos;
        renderTrustedClientsIntoBlock(instagramBlock, logos);
      })
      .catch(function (error) {
        console.warn(error);
        renderTrustedClientsIntoBlock(instagramBlock, fallbackLogos);
      });
  }

  function hydrateInstagramEmbeds() {
    document.querySelectorAll(".sqs-video-wrapper[data-html*='instagram.com']").forEach(function (wrapper) {
      if (wrapper.querySelector("iframe")) return;

      var container = document.createElement("div");
      container.innerHTML = decodeHtml(wrapper.getAttribute("data-html"));
      var iframe = container.querySelector("iframe");
      if (!iframe) return;

      iframe.setAttribute("loading", "lazy");
      iframe.setAttribute("allow", "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share");
      iframe.setAttribute("allowfullscreen", "");
      wrapper.appendChild(iframe);
    });
  }

  function loadHlsScript() {
    if (window.Hls) return Promise.resolve(window.Hls);
    if (hlsLoaderPromise) return hlsLoaderPromise;

    hlsLoaderPromise = new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = hlsScriptUrl;
      script.async = true;
      script.onload = function () {
        resolve(window.Hls);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return hlsLoaderPromise;
  }

  function playVideo(video) {
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  }

  function attachVideoSource(video, source) {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      video.addEventListener("loadedmetadata", function () {
        playVideo(video);
      }, { once: true });
      return;
    }

    loadHlsScript().then(function (Hls) {
      if (!Hls || !Hls.isSupported()) return;

      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        playVideo(video);
      });
    }).catch(function () {});
  }

  function hydrateVideoBackgrounds() {
    document.querySelectorAll(".sqs-video-background-native").forEach(function (background) {
      var player = background.querySelector(".sqs-video-background-native__video-player");
      if (!player || player.querySelector("video, iframe")) return;

      var config = decodeHtml(background.getAttribute("data-config-native-video"));
      var systemId = Object.keys(videoSourcesBySystemId).find(function (id) {
        return config.indexOf(id) !== -1;
      });
      if (!systemId) return;

      var video = document.createElement("video");
      video.autoplay = true;
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
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
      player.appendChild(video);
      attachVideoSource(video, videoSourcesBySystemId[systemId]);
    });
  }

  function runFixes() {
    normalizeInternalLinks();
    hydrateTrustedClientsCarousel();
    hydrateVideoBackgrounds();
  }

  document.addEventListener("click", handleInternalLinkClick, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runFixes);
  } else {
    runFixes();
  }
})();
