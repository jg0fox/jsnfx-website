# Run of Show
## AI in Content Design: Hands-On Building
### Total time: 3 hours

---

## Block 1 — Orient (30 min)
*Slides are primary. Only heavily slide-driven block.*

**0:00 — Welcome and framing (3 min)**
Title slide. Quick personal intro. One honest sentence about what this workshop is and isn't. No lengthy biography.

**0:03 — Setup check (2 min)**
Setup check slide. Walk through checklist: Claude Pro/Team account, VS Code, Claude Code CLI, Node.js, working terminal. Ask for hands or chat messages if anything's missing. Sort blockers now.

**0:05 — The reframe (5 min)**
The misconception, then the contrast. Let the quote sit. Move to the two-column split.

**0:10 — The environment (10 min)**
Three ways to build, one engine. Then switch to live screen. Show Claude web and VS Code side by side. First demo moment, low stakes, just orienting. Glossary slide: "these are the words you'll hear today. I'm giving you a PDF with all of them. don't worry about writing anything down." Move on quickly.

**0:20 — Context engineering (10 min)**
Before/after example, definition, five things. Teach it here so you don't have to interrupt the build to explain it later.

---

## Block 2 — Build Together (65 min)
*Live demo is primary. Slides are anchors and recaps only.*

**0:30 — Introduce the artifact (5 min)**
Say it out loud: "We're going to build a content testing protocol generator." Show the finished version running in a browser so students know where they're headed. Show the four inputs and the output. Close it.

**0:35 — Phase 0 live (15 min)**
Phase 0 slide as anchor, then switch to Claude web. Paste the seed prompt live. Claude generates three things: a CLAUDE.md, a system prompt, and a tech spec. Walk through what comes back. Narrate thinking while reading. Show what to look for, what to push back on, how to scope-check. Note the system prompt: "this one is for later, when we add the API. park it for now." Most teachable moment in the session.

*(Optional: voice dictation tip. Mention Wispr Flow verbally.)*

**0:50 — Open the editor (5 min)**
Create a project folder in Finder (or Explorer). Copy each output into its own file: `CLAUDE.md`, `system-prompt.txt`, `tech-spec.md`. Do this slowly on screen. Everyone follows along. Open the folder in VS Code.

**0:55 — First build loop (20 min)**
No slides. Pure demo. Type the first prompt into Claude Code. Put it on screen or in chat so students can see it:

> Review the CLAUDE.md and tech-spec.md in this directory, then build Version 1 of the tool as a single HTML file called index.html. No API, no external dependencies. Use conditional logic to pick the testing method and generate the protocol from templates.

Watch output generate. Narrate out loud: what's working, what's off, which kind of off. Open the file in a browser (right-click in VS Code, Reveal in Finder, double-click). Fill in the four fields, hit generate, read the output together. Iterate once or twice. Don't polish. Showing the loop.

**1:15 — Diagnostic moment (5 min)**
Something will go wrong during demo. Use it. Diagnostic slide as recap: name which kind of problem it was (context, instruction, scope). Show the fix.

**1:20 — API key safety (5 min)**
API key safety slide. Brief, practical. The API version has a key input field on the page. You paste your key, it goes to the API, it disappears when you close the tab. Never saved, never logged. Don't share the file with your key visible, and don't push it to a public repo. For production, the key would live in Vercel's environment config. That's out of scope today.

**1:25 — API layer (5 min)**
"Remember that third file from Phase 0? The system prompt? This is where it comes in." The system prompt lives inside the API version. It tells Claude how to generate protocols. Show how adding the API transforms the static version. Same UI, richer output.

*(If running long: cut deployment preview. Students don't need to see the Vercel flow in demo to attempt it themselves.)*

**1:30 — Deployment preview (optional, if time)**
Deployment slides briefly. Show localhost working. Show Vercel deploy path. This is the buffer if Block 1 or Phase 0 ran long.

---

## Block 3 — Student Build (55 min)
*Slides hold the room. Jason circulates and facilitates.*

**1:39 — Opening move (5 min)**
Show the build prompt on screen. Read it aloud. Walk through the flow: paste seed prompt into Claude web, save three files to a folder, open in VS Code, run the build prompt in Claude Code. Show what done looks like slide. "Done doesn't mean perfect. It means it does the one thing."

**1:44 — Build time (45 min)**
Timer slide up. Reference links shared in chat. Students build. Jason circulates.

Loose thirds:
- First 15 min: Phase 0 done, files in editor, first prompt run
- Second 15 min: build loop, first working output
- Third 15 min: iterate, stretch toward API version or deployment if ready

Call transitions verbally, not with slides.

**Stretch suggestion if students finish early:** "Ask Claude Code to write the review prompt from the Going Further slide."

---

## Block 4 — Close (25 min)

**2:29 — Educational facilitator (10 min)**
Show live: run the explainer prompt against what was built in the demo. Watch the explainer generate. Point out it's personalized to real architecture.

**2:39 — Share out (7 min)**
Three questions. Call on 3-4 people. One minute each. The point is showing something you made.

**2:46 — What to build next (3 min)**
Build menu slide, reframed as inspiration. "Now that you know the loop, here are more things you can make." Walk through five cards quickly: onboarding audit, error message tester, naming preference test, first-impression test, something else entirely. The point is range, not depth.

**2:49 — Close (5 min)**
"You're a builder now." Three next steps: keep building, share it, come back.
