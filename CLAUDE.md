# 🦒 ENKO Memecoin Website – Build Instructions

## Overview

Create a modern, animated website for a memecoin called **ENKO**, themed around a giraffe.
All giraffe-related assets (images, poses, hoodies, etc.) are already provided in folders with clear, descriptive names.

The design should feel **playful, meme-driven, and visually impressive**, with smooth and “cool” animations that stand out from typical memecoin sites.

There is a reference website inside the `example/` folder, but **DO NOT copy it** — instead, create **original animations and interactions that feel fresh and unique**.

---

## Core Pages / Sections

### 1. Landing Section

* Large hero section with giraffe visuals
* ENKO branding (fun, meme-style tone)
* Smooth entrance animations (parallax, floating elements, etc.)
* Animated giraffe elements (e.g., subtle movement, blinking, bouncing)

---

## Main Functionalities

### 🔗 1. Social Buttons

Add 3 prominent buttons (with icons and hover animations):

* **X (Twitter)** → https://x.com/enko
* **Discord** → https://discord.gg/enko
* **Profile Picture Maker** → opens the internal tool

Buttons should:

* Have animated hover effects (glow, scale, particles, etc.)
* Feel interactive and “alive”

---

### 🖼️ 2. Profile Picture Maker Tool

Create a dedicated section or modal for generating profile pictures.

#### Functionality:

##### A. Background Selector

* Load backgrounds from a folder (e.g., `/backgrounds/`)
* Display as selectable thumbnails
* User can pick one background

##### B. Giraffe + Hoodie Selector

* Load giraffe images (already wearing different hoodies) from another folder (e.g., `/giraffes/`)
* Display options as thumbnails
* User selects one giraffe variant

---

### 🧩 Composition Logic

* When user selects:

  * a background
  * a giraffe

➡️ You must **overlay the giraffe image on top of the background**

* Ensure proper:

  * Centering
  * Scaling
  * Transparency handling (PNG support)

---

### ⬇️ Download Feature

* Add a **Download button**
* Exports the final composed image (background + giraffe)
* Format: PNG
* Use canvas rendering to merge layers before download

---

## Animations & Style

### General Requirements:

* Use **modern web animations** (GSAP, Framer Motion, or CSS)
* Smooth transitions between sections
* Micro-interactions on hover/click
* Floating / parallax effects
* Optional enhancements:

  * Particle effects
  * Animated gradients
  * Subtle motion loops

### Important:

* The animations must feel **premium and unique**
* Avoid copying the example site
* Make ENKO feel like a **high-quality meme brand**

---

## Assets Structure (Assumed)

* `/giraffes/` → giraffe images (different hoodies/poses)
* `/backgrounds/` → background images
* `/icons/` → social icons
* `/example/` → reference site (DO NOT copy)

---

## Technical Suggestions

* Use:

  * HTML + CSS + JavaScript (or React / Next.js if preferred)
* For image composition:

  * HTML5 Canvas
* For animations:

  * GSAP / Framer Motion / CSS animations

---

## UX Notes

* Keep it simple and fun
* Make everything feel responsive and smooth
* Ensure mobile compatibility
* Fast loading (optimize images if needed)

---

## Goal

Build a **fun, animated, and interactive memecoin website** where:

* Users can explore ENKO
* Access social links easily
* Create and download custom giraffe profile pictures
