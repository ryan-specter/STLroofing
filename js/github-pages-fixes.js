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
  var instagramPostUrls = [
    "https://www.instagram.com/skysthelimit_roof_repoint/p/DUvbfiNjGjz/",
    "https://www.instagram.com/skysthelimit_roof_repoint/reel/DUGgZ3djKzn/",
    "https://www.instagram.com/skysthelimit_roof_repoint/p/DT-_sg1jJgN/",
    "https://www.instagram.com/skysthelimit_roof_repoint/reel/DT02bfljJoI/"
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

  function getInstagramEmbedUrl(postUrl) {
    return postUrl.replace(/\/?$/, "/embed/");
  }

  function createInstagramSlide(postUrl) {
    var slide = document.createElement("div");
    var marginWrapper = document.createElement("div");
    var contentWrapper = document.createElement("div");
    var videoWrapper = document.createElement("div");
    var iframeHtml = '<iframe frameborder="0" height="710" scrolling="no" width="612" allowtransparency="true" src="' + getInstagramEmbedUrl(postUrl) + '"></iframe>';

    slide.className = "slide";
    slide.setAttribute("data-type", "video");
    slide.setAttribute("data-animation-role", "image");
    marginWrapper.className = "margin-wrapper";
    contentWrapper.className = "content-wrapper content-fill";
    videoWrapper.className = "sqs-video-wrapper";
    videoWrapper.setAttribute("data-provider-name", "");
    videoWrapper.setAttribute("data-html", iframeHtml);

    contentWrapper.appendChild(videoWrapper);
    marginWrapper.appendChild(contentWrapper);
    slide.appendChild(marginWrapper);

    return slide;
  }

  function hydrateLatestInstagramPosts() {
    document.querySelectorAll(".sqs-block-instagram .sqs-gallery").forEach(function (gallery) {
      if (gallery.getAttribute("data-github-pages-instagram") === "latest") return;

      gallery.innerHTML = "";
      instagramPostUrls.forEach(function (postUrl) {
        gallery.appendChild(createInstagramSlide(postUrl));
      });
      gallery.setAttribute("data-github-pages-instagram", "latest");
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
    hydrateLatestInstagramPosts();
    hydrateInstagramEmbeds();
    hydrateVideoBackgrounds();
  }

  document.addEventListener("click", handleInternalLinkClick, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runFixes);
  } else {
    runFixes();
  }
})();
