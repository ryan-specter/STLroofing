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
      ".trusted-clients-block, .trusted-clients-block .sqs-block-content { margin: 0 !important; padding: 0 !important; min-height: 0 !important; }",
      ".trusted-clients-block + .fe-block .sqs-html-content p { margin-bottom: 0.2rem !important; }",
      ".trusted-clients-block .trusted-clients-nav { display: none !important; }",
      ".trusted-clients-carousel { position: relative; width: 100%; overflow: hidden; padding: 0; }",
      ".trusted-clients-track { display: flex; gap: 0.45rem; overflow-x: auto; scroll-behavior: auto; padding: 0.02rem 0.3rem 0.05rem; -ms-overflow-style: none; scrollbar-width: none; }",
      ".trusted-clients-track::-webkit-scrollbar { display: none; }",
      ".trusted-clients-slide { flex: 0 0 auto; border: 0 !important; background: transparent !important; padding: 0 !important; box-shadow: none !important; }",
      ".trusted-clients-group { display: flex; align-items: center; justify-content: center; min-height: 176px; }",
      ".trusted-clients-logo-link { display: inline-flex; align-items: center; justify-content: center; padding: 0 0.28rem; transition: transform 0.25s ease, opacity 0.25s ease, filter 0.25s ease; opacity: 0.95; }",
      ".trusted-clients-logo-link:hover, .trusted-clients-logo-link:focus-visible { transform: translateY(-2px) scale(1.04); opacity: 1; filter: drop-shadow(0 0 14px rgba(255,255,255,0.22)); }",
      ".trusted-clients-logo-img { display: block; height: clamp(160px, 14vw, 230px); width: auto; max-width: none; object-fit: contain; }",
      ".trusted-clients-separator { display: inline-block; width: 2px; height: 116px; margin: 0 0.32rem; background: rgba(255,255,255,0.92); box-shadow: 0 0 10px rgba(255,255,255,0.28); }",
      "@media (max-width: 900px) { .trusted-clients-track { gap: 0.3rem; padding-left: 0.2rem; padding-right: 0.2rem; } .trusted-clients-group { min-height: 146px; } .trusted-clients-logo-img { height: clamp(120px, 16vw, 170px); } .trusted-clients-separator { height: 92px; margin: 0 0.24rem; } }",
      "@media (max-width: 640px) { .trusted-clients-carousel { padding: 0; } .trusted-clients-track { gap: 0.15rem; padding: 0.01rem 0.08rem; } .trusted-clients-group { min-height: 118px; } .trusted-clients-logo-link { padding: 0 0.06rem; } .trusted-clients-logo-img { height: clamp(95px, 20vw, 140px); } .trusted-clients-separator { height: 72px; margin: 0 0.12rem; } }"
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

  function createTrustedClientsCarousel(logos, section) {
    var wrapper = document.createElement("div");
    var track = document.createElement("div");
    var logoLookup = {};

    logos.forEach(function (logo) {
      logoLookup[logo.id] = logo;
    });

    wrapper.className = "trusted-clients-carousel";
    track.className = "trusted-clients-track";

    logos.forEach(function (logo) {
      if (logo.hideFromCarousel) return;
      track.appendChild(createLogoSlide(logo, logoLookup));
    });

    wrapper.appendChild(track);
    startCarouselAutoscroll(wrapper, track, section);

    return wrapper;
  }

  function renderTrustedClientsIntoBlock(instagramBlock, logos) {
    ensureLogosCarouselStyles();
    var blockContent = instagramBlock.querySelector(".sqs-block-content");
    if (!blockContent) return;

    blockContent.innerHTML = "";
    blockContent.appendChild(createTrustedClientsCarousel(logos, instagramBlock.closest(".page-section")));
    updateTrustedClientsHeading(instagramBlock);
    instagramBlock.classList.remove("sqs-block-instagram", "instagram-block");
    instagramBlock.classList.add("trusted-clients-block");
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
