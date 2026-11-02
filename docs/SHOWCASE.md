# Button Builder showcase and outreach kit

This is a practical guide for demonstrating Button Builder to the Home Assistant community. It uses existing product capabilities and avoids claims about download counts, compatibility guarantees, or unverified performance.

## The one-sentence pitch

**Button Builder lets you design and edit `custom:button-card` configurations visually, with live previews and YAML import/export.**

It runs as a Home Assistant sidebar integration and requires [`custom:button-card`](https://github.com/custom-cards/button-card) to render the generated controls.

## 30–45 second screen-recording plan

Record the actual application at 1080p or better. Use a test Home Assistant entity and remove private hostnames, account details, addresses, and API keys from the recording.

| Time | Show | On-screen caption |
| --- | --- | --- |
| 0–4 s | A basic dashboard button or plain starting preset | “Still writing button-card YAML by hand?” |
| 4–12 s | Open Button Builder, pick a real test entity, and choose a preset | “Design visually” |
| 12–24 s | Adjust colors, layout, and distinct on/off appearances; show the live preview | “See changes instantly” |
| 24–32 s | Open the generated YAML panel and copy the result | “Export button-card YAML” |
| 32–42 s | Paste into a Home Assistant Manual card and show the actual result | “Made with Button Builder” |

Use a continuous capture where possible. If cuts are necessary, don't imply that a step is automated when it was performed manually.

**Suggested exports:** a 16:9 video for YouTube/GitHub links and a vertical crop for short-form community posts. Add captions because many viewers watch muted. GitHub README images can remain static until an authentic GIF/video is available.

## Suggested project showcase post

**Title:** I built a visual editor for Home Assistant custom:button-card

I've been building Button Builder, a free and open-source Home Assistant integration that helps you design `custom:button-card` controls without writing the entire configuration by hand.

It supports live previews, on/off state styling, layout and animation controls, YAML import/export, reusable designs, and optional AI-assisted design using Home Assistant AI Tasks or Gemini.

Here's a short demonstration of creating a button and using the generated YAML in a real dashboard.

Repository and installation: https://github.com/aspenrt78/button-builder

If you already use button-card, I'd welcome feedback on which configurations are still difficult to edit visually.

**Before posting:** attach a real recording, check the community's self-promotion rules, and change wording to match exactly what the video demonstrates.

## Creator outreach draft

**Subject:** Home Assistant dashboard video idea: visual button-card editor

Hi,

I maintain Button Builder, a free open-source visual editor for Home Assistant's `custom:button-card`. It lets users preview state-dependent styling, customize layouts and effects, import existing YAML, and export designs for dashboards.

I thought it might make a useful hands-on dashboard tutorial. Here's the repository and installation guide:

https://github.com/aspenrt78/button-builder

No sponsorship or paid coverage is involved. If you take a look, I'd appreciate candid feedback, including limitations you find.

Thanks!

## Useful links

- [Repository](https://github.com/aspenrt78/button-builder)
- [Install](INSTALLATION.md)
- [Quick start](QUICKSTART.md)
- [Issues and feedback](https://github.com/aspenrt78/button-builder/issues)
- [Releases](https://github.com/aspenrt78/button-builder/releases)
- [Existing workbench screenshot](../wiki/images/button-builder-workbench.png)
- [Existing YAML screenshot](../wiki/images/generated-yaml-workspace.png)

## Measure the results

Before sharing, note GitHub repository views, unique visitors, clones, release downloads, stars, and new issues if GitHub exposes those metrics. Review again after 7 and 14 days. These are indicators, not verified active installations.

For each post, record the date, channel, link, and qualitative feedback. Avoid spamming the same announcement. Prioritize a new demonstration or useful tutorial when posting again.

## Assets still needed

- An authentic 30–45 second screen capture of the latest app
- A screenshot of the generated card in an actual Home Assistant dashboard
- Optional social-preview image uploaded through repository **Settings → General → Social preview** (requires repository settings access)

Avoid substitute mockups that might misrepresent the real interface.
