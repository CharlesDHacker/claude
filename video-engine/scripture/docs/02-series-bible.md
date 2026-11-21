# TOBY & SELAH: series bible

*Short vertical Bible stories told the way the best myth shorts tell legends: a curious kid, a wise talking donkey, and the strange true stories of Scripture.*

## The duo
**Toby** (about 8): a shepherd boy with a huge round head, a mop of dark curls, a white headband with a blue stripe, an ochre striped tunic and sandals. He is loud, honest and dramatic, and asks what the viewer is thinking. He gets the big pop-word reactions and always the last (funny) line.
- Expressions in the rig: neutral, shout, worry, shock, sad, happy, sheepish, annoyed. Hands: down, up, mouth, hips, point, rope, hug, shrug, chin.

**Selah** (a donkey, ageless): grey with a dark cross down her back (the "donkey's cross"), a red halter with a small brass bell, and half-lidded eyes that have seen everything. She is calm, dry, a little smug and deeply kind. She narrates the flashbacks.
- *Why a donkey?* Scripture's most famous talking animal is Balaam's donkey (Numbers 22), and a donkey carried Jesus into Jerusalem. The pilot doubles as her origin hook: "I'm not the first donkey who talked."
- Her name is the pause word of the Psalms, so she is the one who makes you stop and listen.

**Dynamic:** Toby wants the action; Selah knows the ending. She never lectures. She drops one strange sentence and lets Toby (and the viewer) beg for the rest.

## Episode formula (≈ 90–120 s)
1. **Cold open in the story's own location**, mid-problem, with a shout (0–3 s).
2. **Title card:** gold spaced serif, with a subtitle that is itself a hook (first 4 s).
3. **Selah's cryptic line** → **Toby's pop-word echo** ("SITTING DOWN?!").
4. **Flashback** in captions of 3–8 words, one picture per caption.
5. **Toby interrupts** every 15–25 s with the viewer's question.
6. **Turn:** the hidden reason, the injustice or the surprising mercy.
7. **Payoff:** one line from Scripture itself (quoted or very closely paraphrased) in gold.
8. **Button:** back in the present, small and funny, ideally calling back to the opening line.

**House rules**
- Scripture accuracy first. Every flashback beat must be traceable to the text; put the reference in the post caption. Where tradition or interpretation is used, Selah says so ("Some say...").
- One moral, one line, never a sermon.
- God is never drawn. Divine presence is light, rays and gold. Angels are fine; the Angel of the LORD is drawn as a luminous figure.
- Violence is shown as silhouette, impact flash or cutaway, never gore (as in the references).
- The kid gets the last word.

## Look
- **Palette (ancient Near East instead of Greek pottery):** sand `#e3c48e`, ochre `#d98b3c`, terracotta `#9b2f22`, maroon `#6d2a3a`, olive `#6f7a4a`, lapis night `#141a3a`, divine gold `#f0c25e` / `#ffe08a`, ink outline `#2a1a12`.
- **Two drawing registers, like the references:** the duo are chunky cartoon (big white eyes, thick ink lines). Bible figures are taller and more stately, with profile-leaning faces and long robes.
- **Sets:** flat painted layers (sky gradient → hills → midground → ground), dust motes, fire flicker, light rays, slow camera pushes and pans, soft vignette and grain.
- **Signature shots:** white-flash silhouette for violence; extreme close-up on one eye; glowing mouth or hands when God acts; a night sky full of stars for promises.

## Type
- Captions: Nunito Black 50 px, white with soft shadow, 300 px from the top. Toby's lines are orange `#ffb65c`; Selah's present-day lines are pale gold `#ffe39a`; keywords are `{g:gold}`, `{r:red}` and `{o:orange}`.
- Title cards, name labels and pop words: EB Garamond, spaced caps, gold gradient with a dark outline; pop words type in letter by letter.

## TikTok safe area (1080×1920)
TikTok draws its own UI on top of the video, so nothing important goes under it:
- **Top 240 px:** "Following / For You" tabs, LIVE and search. The title card sits just below this (title baseline at y 300, subtitle at 356).
- **Right column, x > 900, y ≈ 640–1540:** profile, like, comment, save, share. Captions are centered at x 480 and capped at 800 px wide (60–900); pop words are clamped to the same zone.
- **Bottom ~450 px (y > 1470):** username, description, sound, nav bar. Name labels sit at y 1400; ground and feet can go below this line, faces cannot.
Captions start at y 330 (y 420 while the title is showing). Render review frames with the UI overlay: `node render.js build/X.timed.json /tmp/f --frames 3,10 --ui`.

## Voices
| Character | ElevenLabs (preferred) | Offline fallback (Kokoro) |
|---|---|---|
| Toby | Piku – Expressive Kid Character `EeQEodFZVtBkjtgK3HBc` | af_nicole +3 semitones |
| Selah | Imogen – Warm, Natural, Expressive `jv41DhCf464zw0TI7I1w` | af_heart, 0.92× |
| Old men (Balaam etc.) | AK – British Posh Old Man `y0SYydk17lMbUIUvSf3N` | bm_george −1.5 st |
| Old women / donkey | Nan – Warm Vintage Storyteller `jVMsZEw3hfmEAe9OUUtS` | bf_emma −1 st, 0.86× |
| Angel / voice from heaven | Atlas – The Epic Voice `zfWx5IjUaWGWTId9hv9t` (+ reverb) | am_onyx −3 st + reverb |

Delivery: Toby shouts and whispers (ElevenLabs v4 tags such as `[shouting]`, `[nervous]`, `[sheepishly]`); Selah stays low and warm; narration is slow, with ellipses for pauses.

## Music
A synthesised bed in a Hijaz-flavoured mode (D, E♭, F♯, G, A, B♭, C) with lyre plucks and a frame drum, sitting 13 dB under the voice. Moods switch per shot: `warm` (present day), `story`, `tense`, `wonder`, `glory` (choir swell). Low booms land on reveals.

## Pipeline (see README.md)
lines.json (script and voices) → voice_lines.py (clips) → timeline.py (timing, captions, lip sync) → mix.py (music and SFX) → render.js (1080×1920 MP4).

## Animation & staging standards (from the reference motion study, 24 fps)
Applied to every character rig from EP07 on (`art/figure.js`, `art/heroes.js`, `art/people.js`):
- **True profile.** Narrow torso; the near arm hangs along the side, the far arm stays behind the body; both feet point forward
  and, under long robes, only the toes peek from the hem. Seated pose (`sit`) folds the legs with the robe draped over the lap.
- **Natural gestures.** Speakers gesture from the chest (forearm forward, open palm, hand at chest height): `gesture`, `explain`,
  `shout`. Arms only go overhead to hold something up (`raise`). Seated hands rest on the lap or armrests.
- **Pose blending.** `pose` + `pose2` + animated `mix` blends hands smoothly; big moves (`raise`, `thrust`) ease out with a small
  overshoot instead of snapping.
- **Speech life.** Head nods with the syllables, brows lift on emphasis, mouth shape varies in width and height, hands make small beats.
- **Eyes.** Blinks plus glances every second or two; `look` points at whoever is speaking.
- **Idle life.** Breathing and a slow weight-shift sway around the hips; walking adds a step bob.
- **Cloth.** Folds fan from the waist gather with diagonal tension folds and lit edges; curved hems with beaded trim.
- **Staging.** Every set (`art/sets.js`, scene `set`) shares a floor line (y = 1880): feet always land on the floor, nothing stands
  in front of a structure's base. Each location is its own filled set (hall, street, chamber, banquet, home, gate) instead of
  reusing one backdrop; texture, wall-floor contact shadow and depth haze are added by the detail pass.
- **Walking.** A walk only happens while a character travels: a `stride` actor with animated `x` stands before it starts,
  eases into a stand when it arrives, and steps at a pace matched to the travel speed. Anything that moves must walk
  (`pose: "stride"`); to walk while gesturing use `arm` (e.g. `arm: "shout"`). Horses stop walking when they stop moving.
- **Kneeling/bowing in robes.** `kneel`, `pray`, `bow` fold the robe over the knees onto the ground with the soles behind;
  `pray` clasps the hands at the chest, `bow` lowers the head. No loose feet.
- **Raised arms** go up beside the head (drawn behind it) so the face is never covered.
- **Who is talking.** Only the speaker's mouth moves. When the narrator describes someone speaking, animate that person's
  mouth on the narrator's voice (`who: "selah"`); listeners keep closed mouths (shock is a small "o"). Never cut to a
  different character while another character's line is still playing.
- **Text.** Pop words end at their shot's cut; name labels sit above the heads (`labelY`), never across a body.
- **QA before every render.** Three frames per shot (entry, middle, exit) reviewed for: walking in place, sliding,
  floating or loose feet, limbs crossing faces, wrong speaker, text over faces/bodies, off-model sets, and props that
  don't match the scene.
