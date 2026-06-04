# Background video assets

Squarespace hero background videos, exported as **1920×1080 MP4** (~8 seconds each, with audio).  
The homepage loads these MP4s via `github-pages-fixes.js` (paths resolved from the site root with `getAssetUrl`). The older HLS bundles (`playlist-1.m3u8`, `playlist.m3u8`) remain in the repo as a backup source only.

## MP4 files (in this folder)

| Use on homepage | File | Size (approx.) |
|-----------------|------|----------------|
| Top hero (black hats) | [Video_Ready_No_Logos_Black_Hats.mp4](./Video_Ready_No_Logos_Black_Hats.mp4) | ~3.0 MB |
| Second section (roofers) | [Video_Ready_Roofers_in_Anglia.mp4](./Video_Ready_Roofers_in_Anglia.mp4) | ~2.9 MB |

## Poster frames (first video frame)

Shown instantly while the MP4 loads (replaces black background + loader):

| Section | Poster |
|---------|--------|
| Hero | [Video_Ready_No_Logos_Black_Hats-poster.jpg](./Video_Ready_No_Logos_Black_Hats-poster.jpg) |
| Second section | [Video_Ready_Roofers_in_Anglia-poster.jpg](./Video_Ready_Roofers_in_Anglia-poster.jpg) |

Regenerate from MP4 with:

```bash
ffmpeg -y -ss 0 -i Video_Ready_No_Logos_Black_Hats.mp4 -frames:v 1 -update 1 -q:v 2 Video_Ready_No_Logos_Black_Hats-poster.jpg
ffmpeg -y -ss 0 -i Video_Ready_Roofers_in_Anglia.mp4 -frames:v 1 -update 1 -q:v 2 Video_Ready_Roofers_in_Anglia-poster.jpg
```

## Paths in the repo

```
site/images/Video_Ready_No_Logos_Black_Hats.mp4
site/images/Video_Ready_Roofers_in_Anglia.mp4
```

## Download URLs

Replace `{ORIGIN}` with your site root (no trailing slash).

### Local preview (`npm run dev`)

| Video | URL |
|-------|-----|
| Hero | http://127.0.0.1:4173/images/Video_Ready_No_Logos_Black_Hats.mp4 |
| Second section | http://127.0.0.1:4173/images/Video_Ready_Roofers_in_Anglia.mp4 |

### Deployed static site

| Video | URL |
|-------|-----|
| Hero | `{ORIGIN}/images/Video_Ready_No_Logos_Black_Hats.mp4` |
| Second section | `{ORIGIN}/images/Video_Ready_Roofers_in_Anglia.mp4` |

Filenames use underscores only (no spaces), so URLs work as-is in browsers and Git.

### GitHub Pages example

If `site/` is the published docroot at `https://<user>.github.io/<repo>/`:

| Video | URL |
|-------|-----|
| Hero | `https://<user>.github.io/<repo>/images/Video_Ready_No_Logos_Black_Hats.mp4` |
| Second section | `https://<user>.github.io/<repo>/images/Video_Ready_Roofers_in_Anglia.mp4` |

## HLS sources (what the live site uses today)

| Video | Master playlist | Squarespace `systemDataId` |
|-------|-----------------|----------------------------|
| Hero | [playlist-1.m3u8](./playlist-1.m3u8) | `8e483bad-8b98-4d57-8e39-1e6ca27624b4` |
| Second section | [playlist.m3u8](./playlist.m3u8) | `1dae9738-081d-40a4-8da3-02315be9f071` |

## Regenerating MP4 from HLS

From `site/images/`:

```bash
ffmpeg -allowed_extensions ALL -i playlist-1.m3u8 -c copy -bsf:a aac_adtstoasc Video_Ready_No_Logos_Black_Hats.mp4
ffmpeg -allowed_extensions ALL -i playlist.m3u8 -c copy -bsf:a aac_adtstoasc Video_Ready_Roofers_in_Anglia.mp4
```
