# No Slop Grenade - Development Notes

Built with Claude (Sonnet 4.5) on December 8, 2025

## What We Built

A single-page website to combat the plague of AI-generated "slop grenades" - massive walls of text pasted into conversations where humans would write one sentence.

**Core Concept:** If they wanted an AI essay, they would have asked ChatGPT themselves. They asked **you** because they wanted your human judgment.

## Technical Stack

- **Pure HTML/CSS/JavaScript** - Single self-contained file
- **Cloudflare Pages** - Hosting and edge functions
- **GitHub** - Version control (stefanneubig/noslopgrenade)
- **Domain:** noslopgrenade.com (with www redirect)

## Design Philosophy

- Inspired by nohello.net - simple, direct, scannable
- Steve Jobs-level attention to typography and spacing
- Apple design language (colors: #1d1d1f, #6e6e73, #06c)
- System font stack, no external dependencies
- Zero build process, zero frameworks

## Key Features

### Chat Examples
- Slack-style chat windows showing bad vs. good responses
- Real example: "Should we use Redis or Memcached?"
- Bad: 800-word AI essay that nobody asked for
- Good: "Redis. We need pub/sub for the notifications feature."
- **Easter egg:** Avatars are Jean Baudrillard and Marshall McLuhan

### Content Structure
1. Examples first (show, don't tell)
2. Definition of slop grenade
3. Why it's wrong (medium destruction, time theft, conversation killer)
4. Our principle: "Use AI to make things clearer, not longer"
5. Baudrillard quote: "More information, less meaning"
6. Share functionality

### SEO & Discovery
- `robots.txt` - Full crawl access
- `sitemap.xml` - Single page sitemap
- `llms.txt` - AI crawler-friendly summary (llmstxt.org standard)
- Open Graph meta tags for social sharing
- OG image (1200x630) - Clean typography version

### Social Sharing
- Native share API on mobile
- Copy-to-clipboard fallback on desktop
- Visual feedback on copy ("Copied!")
- Share icon with clean design

## Design Details

### Typography
- Headlines: 4.5rem, weight 700, -0.04em tracking
- Body: 1.25rem, line-height 1.5
- Quote: 1.5rem italic, centered
- Footer: 0.75rem (super small for nohello.net reference)

### Colors
- Text: #000 (headlines), #1d1d1f (body)
- Gray: #6e6e73 (tagline, quote)
- Links: #06c (Apple blue)
- Dividers: #d2d2d7

### Spacing
- Vertical rhythm: 2rem, 4rem, 6rem, 8rem, 10rem
- Max width: 720px
- Mobile-first with breakpoint at 734px (Apple standard)

## Philosophical Foundation

### McLuhan's Medium Theory
The slop grenade destroys the medium itself. Chat is a hot medium - high definition, low participation. Pasting essays turns it into a cold medium (lecture) but abandons it. The form contradicts the function.

### Baudrillard's Hyperreality
More information, less meaning. AI slop is simulacra - copies without originals. The recipient could have generated the same text themselves if they wanted it. By pasting AI output, you're forcing them to consume a simulation they explicitly chose not to create.

### The Core Violation
When you ask a human, you're choosing human judgment over AI analysis. Responding with AI paste disrespects that choice.

## Files Structure

```
/
├── index.html           # Main page (self-contained)
├── baudrillard.png      # Avatar (150x150, cropped square)
├── mcluhan.png          # Avatar (150x150, cropped square)
├── og-image.png         # Social share image (1200x630)
├── og-image-clean.png   # Backup: clean version
├── og-image-slop.png    # Backup: ironic overflowing text version
├── robots.txt           # SEO
├── sitemap.xml          # SEO
├── llms.txt             # AI crawler summary
├── _redirects           # Empty (www redirect via DNS/Pages config)
└── CLAUDE.md            # This file
```

## Deployment

```bash
# GitHub
git push origin main

# Cloudflare Pages (automatic from GitHub)
wrangler pages deploy . --project-name=noslopgrenade
```

## Future Ideas (Not Implemented)

- Analytics to track slop grenade awareness
- Collection of real-world examples
- Browser extension to detect/flag AI slop
- Translation to other languages

## Credits

- Concept: Stefan Neubig
- Development: Claude (Anthropic)
- Inspiration: nohello.net
- Philosophy: Jean Baudrillard, Marshall McLuhan
- Design: Apple's design language

---

**Launch Date:** December 8, 2025
**URL:** https://noslopgrenade.com
**Mission:** Keep conversations human.
