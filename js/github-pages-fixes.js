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
      ".trusted-clients-carousel { position: relative; width: 100%; }",
      ".trusted-clients-track { display: flex; gap: 1rem; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; padding: 0.5rem 0.2rem 0.8rem; -ms-overflow-style: none; scrollbar-width: none; }",
      ".trusted-clients-track::-webkit-scrollbar { display: none; }",
      ".trusted-clients-slide { flex: 0 0 calc(33.333% - 0.75rem); min-width: 240px; max-width: 420px; border: 1px solid rgba(255,255,255,0.18); border-radius: 10px; background: rgba(255,255,255,0.04); padding: 1rem; scroll-snap-align: start; }",
      ".trusted-clients-group { display: flex; align-items: center; justify-content: center; min-height: 72px; }",
      ".trusted-clients-logo-link { display: inline-flex; align-items: center; justify-content: center; padding: 0.25rem 0.6rem; }",
      ".trusted-clients-logo-img { display: block; max-height: 56px; width: auto; max-width: 100%; object-fit: contain; }",
      ".trusted-clients-separator { display: inline-block; width: 1px; height: 40px; background: rgba(255,255,255,0.7); }",
      ".trusted-clients-nav { position: absolute; top: 50%; transform: translateY(-50%); width: 2rem; height: 2rem; border: 1px solid rgba(255,255,255,0.45); border-radius: 999px; background: rgba(0,0,0,0.45); color: #fff; cursor: pointer; z-index: 2; }",
      ".trusted-clients-nav[disabled] { opacity: 0.35; cursor: default; }",
      ".trusted-clients-nav.prev { left: -0.4rem; }",
      ".trusted-clients-nav.next { right: -0.4rem; }",
      "@media (max-width: 900px) { .trusted-clients-slide { flex-basis: calc(50% - 0.5rem); } }",
      "@media (max-width: 640px) { .trusted-clients-slide { flex-basis: 100%; min-width: 0; } .trusted-clients-nav { display: none; } }"
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

  function updateCarouselNavState(track, prevButton, nextButton) {
    var maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth - 2);
    prevButton.disabled = track.scrollLeft <= 1;
    nextButton.disabled = track.scrollLeft >= maxScrollLeft;
  }

  function createTrustedClientsCarousel(logos) {
    var wrapper = document.createElement("div");
    var prevButton = document.createElement("button");
    var nextButton = document.createElement("button");
    var track = document.createElement("div");
    var logoLookup = {};

    logos.forEach(function (logo) {
      logoLookup[logo.id] = logo;
    });

    wrapper.className = "trusted-clients-carousel";
    track.className = "trusted-clients-track";

    prevButton.className = "trusted-clients-nav prev";
    prevButton.type = "button";
    prevButton.setAttribute("aria-label", "Previous client logos");
    prevButton.innerHTML = "&#8249;";

    nextButton.className = "trusted-clients-nav next";
    nextButton.type = "button";
    nextButton.setAttribute("aria-label", "Next client logos");
    nextButton.innerHTML = "&#8250;";

    logos.forEach(function (logo) {
      if (logo.hideFromCarousel) return;
      track.appendChild(createLogoSlide(logo, logoLookup));
    });

    prevButton.addEventListener("click", function () {
      track.scrollBy({ left: -Math.max(track.clientWidth * 0.8, 260), behavior: "smooth" });
    });

    nextButton.addEventListener("click", function () {
      track.scrollBy({ left: Math.max(track.clientWidth * 0.8, 260), behavior: "smooth" });
    });

    track.addEventListener("scroll", function () {
      updateCarouselNavState(track, prevButton, nextButton);
    });

    window.addEventListener("resize", function () {
      updateCarouselNavState(track, prevButton, nextButton);
    });

    wrapper.appendChild(prevButton);
    wrapper.appendChild(track);
    wrapper.appendChild(nextButton);

    setTimeout(function () {
      updateCarouselNavState(track, prevButton, nextButton);
    }, 0);

    return wrapper;
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
        if (!manifest || !Array.isArray(manifest.logos) || !manifest.logos.length) return;

        ensureLogosCarouselStyles();

        var blockContent = instagramBlock.querySelector(".sqs-block-content");
        if (!blockContent) return;

        blockContent.innerHTML = "";
        blockContent.appendChild(createTrustedClientsCarousel(manifest.logos));
        updateTrustedClientsHeading(instagramBlock);
        instagramBlock.classList.remove("sqs-block-instagram", "instagram-block");
        instagramBlock.classList.add("trusted-clients-block");
        instagramBlock.setAttribute("data-github-pages-logos", "ready");
      })
      .catch(function (error) {
        console.warn(error);
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
