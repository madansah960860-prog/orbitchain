# Display ad creative — Orbit Chain Co.

Two Responsive Display Ad concepts plus 30 image prompts.

Character counts in the tables are verified by `npm run check:ads`, which fails
if any field exceeds Google's limit or if a stated count is wrong.

**Field limits (Google Responsive Display Ads):** short headline 30 · long
headline 90 · description 90 · business name 25. You may upload up to 5 short
headlines, 1 long headline and 5 descriptions per ad; Google assembles the
combinations.

Every claim below is already true on the site (free shipping over $49, 30-day
returns, 12-month warranty). **If you change the site's terms, change these
too** — a mismatch between ad and landing page is the most common cause of
disapproval.

---

## Ad 1 — "It fits, or we told you it wouldn't"

**Angle:** compatibility anxiety. The buyer knows what they need but not
whether it fits their exact model. This is the store's actual differentiator,
so it is the strongest thing to lead with.

**Audience:** in-market for phone/laptop accessories; remarketing to product
page viewers who didn't add to cart.
**Landing page:** `/shop` — or the matching category for a themed ad group.

| Field | Text | Chars |
|---|---|---|
| Short headline | Fits Your Exact Model | 21 |
| Short headline | Accessories That Fit | 20 |
| Short headline | Checked Before It Ships | 23 |
| Short headline | Free Shipping Over $49 | 22 |
| Short headline | 30-Day Returns, Always | 22 |
| Long headline | Accessories checked against your exact device model before we ship | 66 |
| Description | Every listing shows the exact models we tested. Ask us if yours isn't there. | 76 |
| Description | Free US shipping over $49, 30-day returns and a 12-month warranty. | 66 |
| Description | Cables, chargers, cases and bands for the gear you already own. | 63 |
| Business name | Orbit Chain Co. | 15 |

**Long description** (for Performance Max asset groups, Meta primary text, or
the landing-page hero — not a Google Display field):

> Most accessory returns aren't faults. They're a band that fits a 41 mm case
> when you own a 45 mm, or a stylus that needs an iPad two generations newer.
> So every listing on Orbit Chain states the exact device models we have
> physically tested — and nothing else. If your model isn't on the list, we're
> not claiming it fits. Tell us what you own and we'll check the part number
> before you spend anything. We would rather lose the sale than process a
> return. Free US shipping over $49, 30 days to change your mind, and a
> 12-month warranty on everything we sell. Orbit Chain Co. is an independent
> reseller and is not affiliated with or endorsed by Apple Inc.

---

## Ad 2 — "Sourced, not scraped"

**Angle:** counterfeit anxiety. The accessory aisle is where fakes
concentrate; the promise is provenance and a warranty that means something.

**Audience:** cold prospecting on tech/productivity placements; anyone who has
been burned by a cable that died in a month.
**Landing page:** `/about` or `/shop`.

| Field | Text | Chars |
|---|---|---|
| Short headline | Sourced, Never Scraped | 22 |
| Short headline | Real Parts, Real Warranty | 25 |
| Short headline | 12-Month Warranty | 17 |
| Short headline | Independent Reseller | 20 |
| Short headline | No Fakes. No Surprises. | 23 |
| Long headline | Bought through authorised distribution, with a warranty that means it | 69 |
| Description | Every item is labelled genuine or third-party. We never blur the two. | 69 |
| Description | 12-month warranty, 30-day returns, and the price you saw at checkout. | 69 |
| Description | Independent reseller. Not affiliated with or endorsed by Apple Inc. | 67 |
| Business name | Orbit Chain Co. | 15 |

**Long description:**

> The accessory aisle is where counterfeits concentrate. A cable that claims
> 240 W and delivers 60. A "genuine" band with a lug that wears through in a
> month. A case that blocks the magnet array it advertises. Orbit Chain buys
> through authorised distribution only, labels every product as either genuine
> manufacturer stock or third-party, and backs all of it with a 12-month
> warranty and 30-day returns. The price on the product page is the price at
> checkout — tax is shown before you pay and nothing is added after. We are an
> independent reseller and are not affiliated with, authorised by, or endorsed
> by Apple Inc. All product names are used for compatibility identification
> only.

---

## Before you run either ad

- **Trademark use.** Both ads avoid implying Apple authorisation. Don't add
  "Official", "Authorised", or "Apple Store" to any headline. Descriptive use
  ("accessories compatible with iPhone") is permitted for resellers; implied
  endorsement is not.
- **Claim parity.** `$49` free-shipping threshold, `30`-day returns and
  `12`-month warranty all come from `src/data/site.js`. Change one, change
  both.
- **No countdowns or invented urgency** — none of this copy uses them, and the
  site has none to back them up.

---

## Ad 3 — "Click here" variant set (⚠ see warning)

> **Warning — this set will likely be disapproved.** Google Ads editorial
> policy rejects calls-to-action that aren't relevant to the ad format;
> "Click here" is the canonical example, because assets render in positions
> and on devices where clicking is not the action. Microsoft Advertising
> prohibits it outright. It also consumes 11 of the 30 headline characters,
> leaving 19 for anything informative.
>
> Supplied as requested. The compliant swap-in set directly below carries the
> same messages with openers Google accepts — same character budget, more room
> for substance.

### 5 headlines + long headline

| Field | Text | Chars |
|---|---|---|
| Short headline | Click here for cables | 21 |
| Short headline | Click here to check fitment | 27 |
| Short headline | Click here to shop bands | 24 |
| Short headline | Click here for free shipping | 28 |
| Short headline | Click here to compare cases | 27 |
| Long headline | Click here to shop accessories checked against your exact device model before they ship | 87 |

### 5 descriptions

| Field | Text | Chars |
|---|---|---|
| Description | Click here to see the exact device models we tested before anything ships. | 74 |
| Description | Click here for free US shipping over $49 and a full 12-month warranty. | 70 |
| Description | Click here to browse 79 accessories for the Apple gear you already own. | 71 |
| Description | Click here to check a part fits your model before you spend anything. | 69 |
| Description | Click here for genuine and third-party parts, each labelled as one. | 67 |

### 1 long description

> Click here to shop accessories that are checked against your exact device
> model before they ship. Orbit Chain Co. stocks 79 cables, chargers, cases,
> bands and audio accessories, and every listing names the precise models we
> have physically tested — nothing implied, nothing padded. Items are labelled
> genuine or third-party, never blurred together, and all of it is bought
> through authorised distribution. Free US shipping over $49, 30 days to change
> your mind, and a 12-month warranty on everything we sell. If your model is
> not on a listing, tell us and we will check the part number before you order.
> Orbit Chain Co. is an independent reseller and is not affiliated with or
> endorsed by Apple Inc.

---

## Ad 3b — compliant swap-in (same messages, approvable openers)

Identical intent, openers Google accepts. Note how much more each line says
once "Click here" is not eating a third of the budget.

### 5 headlines + long headline

| Field | Text | Chars |
|---|---|---|
| Short headline | Shop cables built to last | 25 |
| Short headline | Check fitment before you buy | 28 |
| Short headline | Watch bands from $34 | 20 |
| Short headline | Free US shipping over $49 | 25 |
| Short headline | Compare cases side by side | 26 |
| Long headline | Every listing names the exact models we tested, so you never order the wrong part | 81 |

### 5 descriptions

| Field | Text | Chars |
|---|---|---|
| Description | See the exact device models we tested before anything ships to you. | 67 |
| Description | Free US shipping over $49, 30-day returns and a full 12-month warranty. | 71 |
| Description | Browse 79 accessories for the Apple gear you already own, from $9. | 66 |
| Description | Check a part fits your exact model before you spend anything on it. | 67 |
| Description | Genuine and third-party parts, each labelled as one. We never blur them. | 72 |

### 1 long description

> Accessories checked against your exact device model before they ship. Orbit
> Chain Co. stocks 79 cables, chargers, cases, bands and audio accessories, and
> every listing names the precise models we have physically tested — nothing
> implied, nothing padded. Items are labelled genuine or third-party, never
> blurred together, and all of it is bought through authorised distribution.
> Free US shipping over $49, 30 days to change your mind, and a 12-month
> warranty on everything we sell. If your model is not on a listing, tell us
> and we will check the part number before you order. Orbit Chain Co. is an
> independent reseller and is not affiliated with or endorsed by Apple Inc.

---

## Long headline alternates — using the full 90

The long headlines in Ads 1 and 2 sit at 66 and 69 characters, leaving roughly
a quarter of the field unused. Google shows the long headline on its own in
larger placements, so it is the one asset worth filling. Swap any of these in.

| Field | Text | Chars |
|---|---|---|
| Long headline | Accessories checked against your exact device model before they ship, from $9 | 77 |
| Long headline | Every listing names the exact device models we tested, so you never order wrong | 79 |
| Long headline | 79 accessories for Apple devices, each checked against the models it claims | 75 |
| Long headline | Bought through authorised distribution and backed by a real 12-month warranty | 77 |
| Long headline | Genuine or third-party, always labelled, always covered for twelve full months | 78 |
| Long headline | The price you saw is the price you pay, with free US shipping over $49 | 70 |

---

# 30 image prompts

## How to use these

Paste the **style block** first, then one numbered prompt. Every prompt ends
with the exact aspect ratio and pixel size.

### Style block — prepend to every prompt

> Brand: Orbit Chain Co., an independent accessory shop. Visual world: a
> precision parts counter under cold morning light — anodised aluminium, matte
> silicone, machined edges. Palette: a true-neutral near-black background
> (#0F0F10), a cobalt light source (#1F5FBF), and a signal amber used sparingly
> for highlights (#F0B23C). Off-white text (#F7F8F9). Typeface: a variable
> grotesque with tight tracking, similar to Archivo; spec labels in a mono
> face. Surfaces are lit from above with a thin bright bevel along the top
> edge, the way a chamfered aluminium lip catches light. Photographic realism,
> shallow depth of field, soft directional key from upper left, deep falloff.
>
> **Hard constraints — apply to every image:** no Apple logo, no bitten-apple
> mark, no recognisable Apple product silhouettes or trade dress. No visible
> logos or brand marks of any manufacturer. No fake buttons, cursors, browser
> chrome or "click here" elements. No watermarks. No countdown timers, no
> starbursts, no "SALE" explosions. Generic, unbranded hardware only.

### A note on text in the image

Google's display guidance asks for **minimal or no text** on Responsive
Display Ad images (groups A and B below) — text-heavy uploads get filtered out
of the best placements. So groups A and B are photographic with clear space for
Google to lay its own text over.

Groups C and D are **fixed-size banners** you upload as finished creative. Text
belongs in those, and each prompt specifies the exact wording.

Where a prompt says "safe zone", keep that area free of subject detail so
overlaid text stays readable.

---

## Group A — Responsive Display Ad images (no text in image)

**1 — Landscape hero, charging · 1.91:1 · 1200 × 628**
A single unbranded magnetic charging puck resting on a dark brushed-aluminium
surface, its woven cable curling once to the right. Cobalt rim light along the
puck's chamfer, warm amber bounce from far right. Subject sits in the left
third; keep the right 45% as a soft near-black gradient safe zone. Macro
texture on the anodised finish, faint dust in the light beam. 1.91:1, 1200×628.

**2 — Landscape hero, cables · 1.91:1 · 1200 × 628**
Three braided USB-C cables in charcoal, sand and cobalt, coiled into loose
concentric arcs on matte black stone. Overhead camera, soft top-left key,
strong shadow falloff. Composition weighted bottom-left; top-right 40% left as
clean negative space. Visible braid weave and moulded strain relief. 1.91:1,
1200×628.

**3 — Landscape hero, workspace · 1.91:1 · 1200 × 628**
A dark desk at dawn: unbranded low-profile keyboard, a coiled cable, a matte
case, an anodised stand — arranged in a loose diagonal from lower left. Cool
window light from the left, one small amber lamp glow far right. Shallow depth
of field, foreground objects sharp. Upper-right third kept dark and empty.
1.91:1, 1200×628.

**4 — Square, audio · 1:1 · 1200 × 1200**
An unbranded pair of matte-black wireless earbuds resting beside an open
charging case on dark slate. Three-quarter camera, cobalt key from upper left
skimming the silicone tips, deep shadow right. Centred subject with generous
breathing room on all sides. Visible micro-texture on the silicone. 1:1,
1200×1200.

**5 — Square, watch bands · 1:1 · 1200 × 1200**
Four unbranded watch straps — woven nylon, milanese steel mesh, tan leather,
matte silicone — fanned in a quarter-circle on charcoal linen. Overhead
camera, raking light from upper left to pick out weave and mesh links. Warm
amber highlight on the leather only. Centred, even margins. 1:1, 1200×1200.

**6 — Square, cases · 1:1 · 1200 × 1200**
Three slim unbranded phone cases stacked at slight offsets — clear, matte
charcoal, deep cobalt — on black stone. Side-lit so the chamfered edges catch a
bright thin highlight. Camera slightly above, subject centred. Visible
soft-touch texture and the machined button detail. 1:1, 1200×1200.

**7 — Portrait, hero object · 4:5 · 960 × 1200**
A single unbranded magnetic power bank standing upright on a dark surface, one
short cable trailing forward out of focus. Cobalt edge light down the left
face, amber rim on the right. Subject in the lower two-thirds; top third a
clean dark gradient safe zone. Anodised grain visible. 4:5, 960×1200.

**8 — Portrait, in-use · 4:5 · 960 × 1200**
Close crop of a wrist wearing an unbranded woven watch strap, arm resting on a
dark wooden desk beside a coiled cable. Cool directional light from the left,
skin tone natural and warm against the cool set. Strap fills the lower half;
upper third dark and uncluttered. Fabric weave sharp at macro range. 4:5,
960×1200.

## Group B — Logo assets (no photographic subject)

**9 — Logo, square · 1:1 · 1200 × 1200**
A minimal logo mark centred on a flat near-black field: a thin cobalt circle
enclosing a stylised amber lightning bolt with squared, machined terminals.
Generous even padding, roughly 60% of the frame is background. Flat vector,
crisp edges, no bevel, no gloss, no drop shadow. 1:1, 1200×1200.

**10 — Logo, landscape lockup · 4:1 · 1200 × 300**
The same circle-and-bolt mark at left, followed by the wordmark "AMPERE
SUPPLY" set in a tight condensed grotesque, off-white, with "SUPPLY" in a
lighter weight. Flat near-black background, vertically centred, comfortable
padding at both ends. Flat vector, no effects. 4:1, 1200×300.

## Group C — Fixed-size banners with offer text

Each of these carries real copy. Keep it exactly as written.

**11 — Medium rectangle · 300 × 250**
Dark banner. Upper 60%: an unbranded braided cable coiled on black stone, lit
cobalt from the left. Lower 40%: a solid near-black block carrying
"FREE US SHIPPING OVER $49" in condensed off-white caps, with "30-day returns ·
12-month warranty" beneath in small mono. A slim amber underline separates the
two. Bottom-right: a small pill outline reading "Shop now". 300×250.

**12 — Large rectangle · 336 × 280**
Same construction as #11 but with a matte charcoal phone case as the subject,
photographed at a three-quarter angle with a bright bevel highlight along the
top edge. Headline "ACCESSORIES THAT ACTUALLY FIT", sub-line "Checked against
your exact model". Amber "Shop now" pill lower right. 336×280.

**13 — Leaderboard · 728 × 90**
Horizontal strip. Left 30%: an unbranded magnetic charging puck on dark
aluminium, cobalt rim light. Centre: "FITS YOUR EXACT MODEL" in condensed
off-white caps with "Free US shipping over $49" in small mono beneath. Right
15%: an amber pill button reading "Shop now". Keep the whole strip dark and
low-contrast behind the text. 728×90.

**14 — Half page · 300 × 600**
Vertical banner in three bands. Top 45%: overhead shot of four unbranded watch
straps fanned on charcoal linen. Middle: "30-DAY RETURNS" in large condensed
caps, "12-month warranty on everything" beneath in mono. Bottom: an amber pill
reading "Shop bands". A thin cobalt hairline divides each band. 300×600.

**15 — Large mobile banner · 320 × 100**
Compact strip. Left 35%: three coiled braided cables, tightly cropped, lit from
above. Right: "FREE SHIPPING OVER $49" in two condensed lines, off-white, with
a small amber "Shop now" pill beneath. Dark background throughout, high
contrast on the type. 320×100.

**16 — Wide skyscraper · 160 × 600**
Tall narrow banner. Top third: an unbranded power bank standing upright, cobalt
edge light. Middle: stacked condensed caps reading "SOURCED / NOT / SCRAPED",
one word per line, with an amber rule under the last. Lower third:
"12-month warranty" in mono and a full-width amber "Shop now" pill. 160×600.

**17 — Billboard · 970 × 250**
Wide cinematic banner. Left 55%: a dark desk scene — unbranded keyboard, coiled
cable, anodised stand — in shallow focus with cool dawn light. Right 45%: near-
black block with "ACCESSORIES THAT ACTUALLY FIT" in large condensed caps,
"Every listing shows the exact models we tested" beneath in mono, and an amber
"Shop now" pill. 970×250.

**18 — Mobile banner · 320 × 50**
Minimal strip. Left: tiny circle-and-bolt logo mark in amber. Centre:
"FREE US SHIPPING OVER $49" in one condensed off-white line. Right: small amber
"Shop" pill. Flat near-black background, no photographic subject — at this size
imagery only muddies it. 320×50.

**19 — Square banner · 250 × 250**
Centred composition. An unbranded pair of earbuds beside their open case, top-
lit, filling the upper two-thirds. Beneath: "30-DAY RETURNS" in condensed caps
and a small amber "Shop audio" pill. Even dark margins all round. 250×250.

**20 — Small square · 200 × 200**
Tight crop of a single unbranded charging puck, cobalt rim light, centred in
the upper half. Lower half: "FREE SHIPPING $49+" in two short condensed lines
with an amber underline. Near-black background. 200×200.

**21 — Banner · 468 × 60**
Slim horizontal. Left 25%: tightly cropped braided cable texture. Centre:
"FITS YOUR EXACT MODEL" in one condensed line. Right: amber "Shop now" pill.
Dark, quiet, no clutter. 468×60.

**22 — Large leaderboard · 970 × 90**
Extra-wide strip. Left 20%: an unbranded watch strap laid flat, raking light on
the weave. Centre: "SOURCED, NEVER SCRAPED" in condensed caps with
"12-month warranty · 30-day returns" in mono beneath. Right: amber "Shop now"
pill. 970×90.

## Group D — Category and offer banners

**23 — Audio category · 1:1 · 1200 × 1200**
Overhead flat lay on charcoal slate: unbranded earbuds with case, a set of foam
tips in a small dish, a coiled fabric audio cable. Cool key from upper left,
amber accent on the tips only. Centre band left clear for the overlay
"AUDIO — FROM $9". Macro texture on the foam. 1:1, 1200×1200.

**24 — Charging category · 1:1 · 1200 × 1200**
Overhead flat lay: an unbranded wall adapter, two coiled braided cables, a
magnetic puck and a slim power bank, arranged on a loose grid over black stone.
Cobalt key light, hard shadows. Clear centre band for "CHARGING & POWER — FROM
$9". 1:1, 1200×1200.

**25 — Cases category · 1:1 · 1200 × 1200**
Three unbranded phone cases standing on edge in a row — clear, charcoal,
cobalt — casting long shadows to the right on dark stone. Low side key from the
left picking out each chamfered edge. Upper third clear for "CASES &
PROTECTION". 1:1, 1200×1200.

**26 — Bands category · 1:1 · 1200 × 1200**
Four unbranded watch straps coiled into neat spirals on charcoal linen, evenly
spaced in a two-by-two grid. Overhead, raking light to raise the weave and mesh
texture. Centre gap left clear for "BANDS & INPUT". 1:1, 1200×1200.

**27 — Free shipping offer · 1.91:1 · 1200 × 628**
A plain corrugated shipping box, unbranded, sitting slightly open on a dark
concrete floor with a coiled cable and a small case just visible inside. Cool
overhead light, long soft shadow to the right. Left 45% kept dark and empty for
"FREE US SHIPPING OVER $49". Visible card texture and tape grain. 1.91:1,
1200×628.

**28 — Returns offer · 1.91:1 · 1200 × 628**
The same unbranded box, taped and addressed with a blank label, held at a
slight angle against a dark background by hands in a charcoal sleeve. Cool key
from the left, warm amber rim from behind. Right 40% clear for "30 DAYS TO
CHANGE YOUR MIND". 1.91:1, 1200×628.

**29 — Warranty offer · 1:1 · 1200 × 1200**
A single unbranded braided cable coiled into a perfect flat spiral, centred on
black stone, lit so the braid weave reads sharply across the whole coil. A thin
amber ring of light traces the outer edge of the spiral. Generous even margins
for "12-MONTH WARRANTY" to sit above or below. 1:1, 1200×1200.

**30 — Compatibility offer · 4:5 · 960 × 1200**
A dark surface with a neat row of unbranded connector ends — USB-C, a magnetic
puck, a watch strap lug — laid in a precise line like parts on a workbench mat,
photographed from directly above. Cool even light, faint measurement-grid
texture in the mat. Lower third kept dark for "CHECKED AGAINST YOUR EXACT
MODEL". 4:5, 960×1200.

---

## Asset checklist per Google Display

| Asset | Ratio | Size | Required | Prompts |
|---|---|---|---|---|
| Landscape image | 1.91:1 | 1200×628 | Yes | 1, 2, 3, 27, 28 |
| Square image | 1:1 | 1200×1200 | Yes | 4, 5, 6, 23–26, 29 |
| Portrait image | 4:5 | 960×1200 | Optional | 7, 8, 30 |
| Logo, square | 1:1 | 1200×1200 | Yes | 9 |
| Logo, landscape | 4:1 | 1200×300 | Optional | 10 |
| Fixed banners | various | see prompts | Uploaded ads | 11–22 |

Upload at least 3 landscape, 3 square and 1 logo for a Responsive Display Ad;
Google needs a spread to assemble placements.

## Before publishing any of these

- Regenerate anything where the model has produced a logo, a bitten-apple
  shape, or a recognisable product silhouette. Check every frame — this is the
  same failure that put competitor logos on house-brand product listings during
  the site build (see `ADS-COMPLIANCE.md` §1.4).
- Confirm the offer text matches `src/data/site.js`.
- Keep text under roughly 20% of the frame on groups A and B.
