# MMGA Records — Website

> Make Munich Greate Again. Independent Label aus München.
> Statisches Site-Redesign mit Scroll-Storytelling.

## Lokal starten

Es ist eine reine HTML/CSS/JS-Site, **kein Build nötig**. Einfach einen statischen Server im Projekt-Root starten:

```bash
# Variante 1 — Python (vorinstalliert auf Mac/Linux)
python3 -m http.server 8000

# Variante 2 — Node
npx serve .

# Variante 3 — PHP
php -S localhost:8000
```

Dann im Browser öffnen: **http://localhost:8000**

## Struktur

```
.
├── index.html              ← Hauptseite (Hero, Manifest, Featured, Roster, Sound, Movement, Join, Kontakt)
├── artists/
│   ├── kira-nova.html
│   ├── vex.html
│   ├── 089-boy.html
│   ├── lira.html
│   └── blok.html
├── assets/
│   ├── css/main.css        ← Komplettes Design-System
│   ├── js/main.js          ← Lenis + GSAP Scroll-Storytelling
│   └── img/                ← Platz für Coverart, Artist-Fotos
└── README.md
```

## Features

- **Custom Cursor** mit Magnet-Effekt auf Links
- **Lenis Smooth-Scroll** + **GSAP ScrollTrigger**
  - Hero-Wörter sliden hoch beim Reveal
  - Manifest-Sektion: Sticky-Pin + Wort-für-Wort-Highlight beim Scrollen
  - Big-Text-Parallax in „The Movement"
  - Skyline-SVG zeichnet sich beim Laden
- **Animated Loader** beim ersten Page-Load
- **Featured Cover** mit 3D-Tilt auf Maus-Move
- **Artist-Hover-Preview** (floating Bild folgt der Maus)
- **Counter-Animation** für Stats
- **Marquee-Ticker** mit aktuellen News
- **Reduce-Motion-Support** (respektiert `prefers-reduced-motion`)
- **Mobile-Menü** mit Burger
- **5 Subpages** pro Artist mit Bio, Discography, Listen-Links

## Design-System

- Schriften: **Anton** (Display) + **Inter** (Body) + **Space Grotesk** (Mono/UI) — Google Fonts
- Farben: Schwarz (#0a0a0a), Off-White (#f5f1ea), Orange (#ff5b1f), München-Blau (#3aa0ff)
- Maxwidth 1440px, fluid spacing via `clamp()`

## Inhalte anpassen

Alle Texte sind direkt in den HTML-Dateien änderbar — kein CMS, kein Build.
Artist-Daten liegen in `artists/*.html`. Releases in `index.html` Sektion `.releases`.
