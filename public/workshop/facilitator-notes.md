# Facilitator Notes: AI in Content Design: Hands-On Building
**Jason Fox, Lead Content Designer at Atlassian**
**UX Content Collective Workshop**
**Duration: 3 hours**

---

## Overview
This is a building workshop, not a theory workshop. Students leave with a working tool they made themselves. The goal is to model the build loop, normalize iteration, and prove that content designers can ship.

---

## BLOCK 1: ORIENT (32 minutes)

### 0:00 — Welcome and Framing (5 min)
**Slide: Title slide**

**Facilitator actions:**
- Stand. Make eye contact. Don't apologize for anything.
- Keep this quick. You have 5 minutes to set the entire tone.

**Talking points:**
- quick personal intro: "I'm Jason. Lead content designer at Atlassian. I've been building AI tools for content for about three years. I made a few missteps. I'm here to save you those missteps."
- what this workshop is: "this is a building workshop. we're going to build an actual working tool in the next three hours."
- what this workshop isn't: "this is not theory. we're not talking about when you should use AI. we're not talking about ethics, though that matters. we're building something that works."
- set expectations for building: "you're going to watch me build something. you're going to build your own version. by the end, you'll have something you can actually use. probably in your next sprint."

**Key line to land:**
"You leave here with something that works. that's the bar."

**Transition:**
Point to the next slide. "first, let's make sure everyone's set up."

---

### 0:05 — Setup Check (2 min)
**Slide: Setup Check**

**Facilitator actions:**
- Walk through the checklist on screen: Claude Pro/Team account, VS Code, Claude Code CLI, Node.js, terminal working.
- Ask people to raise hands or drop a message if anything's missing.
- Sort out blockers now, not during the build.

**Talking points:**
- "before we go any further, let's make sure your machine is ready. we're going to need these five things. if you're missing any of them, raise your hand now. we'll get you unblocked."

**Transition:**
"good. now let's talk about the thing everyone gets wrong."

---

### 0:07 — The Reframe (5 min)
**Slides: 3-4**

**Slide 3: The misconception quote**

**Facilitator actions:**
- READ the quote aloud. Don't paraphrase.
- Let it sit for 3 seconds. Count it mentally if you need to.
- DO NOT explain it yet. Do not soften it. Let students sit with the discomfort.

**Talking points:**
- (pause)
- "so that's what people think. and it's wrong."

**Slide 4: The two-column contrast**

**Facilitator actions:**
- Point to the left column first. "this is the version where AI writes your content for you. it's seductive. it doesn't scale. it doesn't give you control."
- Point to the right column. "this is the version that actually works. you build the system. AI does the work. you stay in charge."
- Let them see the difference for 5 seconds.

**Talking points:**
- Left column: "you hand the prompt to AI and hope. you can't scale this. you can't ship it. you're stuck in a loop of QA."
- Right column: "you and AI build a tool. you define the inputs. you shape the output. the tool runs the same way every time. you stay in charge."

**Key line to land:**
"The thesis is right side. everything we build today assumes you're in charge."

**Transition:**
"so how do you actually build? let me show you the three environments."

---

### 0:12 — The Environment (10 min)
**Slides: 5-6**

**Facilitator actions:**
- Introduce the three environments briefly. Don't dwell on comparisons.
- Move quickly to the live screen demo.

**Talking points (slide 5):**
- Claude web: "fastest way to start. you're in a browser. you're talking to Claude. useful for thinking out loud and Phase 0."
- Code editor (VS Code): "this is where you live when you're building. you can see your files. you can run commands. you can iterate fast."
- Terminal (command line): "some people build here. you talk to Claude via CLI. useful if you're already in the terminal. we're not doing this today."

**Live screen demo:**

**Facilitator actions:**
- Switch to desktop. Show Claude web in a browser window.
- Show VS Code in a second window. Position them side by side if possible.
- Don't explain the UI. Just show it.

**Talking points:**
- "these are all the same model. the interface changes. the engine stays the same. which one you pick depends on what's fastest for your brain."

**Slide 6: Chip row**

**Talking points:**
- "there are other tools too. Cursor is popular. Replit is good if you want a full environment. Lovable is built for design. none of these are required. we're using Claude because it's what I know best."
- "don't get attached to the tool. the pattern is what matters."

**Transition:**
"now let's talk about the skill that makes everything else work: context engineering."

---

### 0:22 — Context Engineering (10 min)
**Slides: 7-10**

**Slide 7: Before/after comparison**

**Facilitator actions:**
- Show the "without context" example. Read it.
- Point out the problem. "this is deliberately bad. shallow. the kind of output that makes people say 'AI doesn't understand my domain.' what's missing?"
- Show the "with context" example. Read it.
- Pause for 3 seconds. Let them see the difference.

**Talking points:**
- "when you give Claude nothing, you get generic output. when you give it your actual constraints, your actual audience, your actual product language, you get something specific. something that sounds like you."
- "the difference is context. not a better prompt. context."

**Slide 8: Definition**

**Facilitator actions:**
- Read the definition aloud. Pause.

**Talking points:**
- "this is the skill that makes everything else work. it's not magic. it's discipline. you have to be specific about what the model needs to know."

**Slide 9: Five things**

**Facilitator actions:**
- Go through each briefly. Don't lecture.

**Talking points:**
- Role: "who is Claude? not Claude, but who is Claude in your system? a product copywriter? an internal tool? a customer-facing agent? define it."
- Constraints: "what are the rules? no exclamation points? three words max? only accessible language? most people skip this. don't. constraints shape output more than anything else."
- Audience: "who is reading this? internal team? new users? power users? someone reading at 3am when something broke? audience changes everything."
- Format: "is it a list? a paragraph? a menu? JSON? the structure matters. the model responds to structure."
- Example: "show, don't tell. one real example is worth a thousand rules."

**Key line to land:**
"Role and constraints. those are the two things students always skip. they're the two things that matter most."

**Slide 10: Glossary**

**Facilitator actions:**
- Display the glossary slide.
- Don't read every term.

**Talking points:**
- "these are the words you'll hear today. I'm giving you a PDF with all of them so don't worry about writing anything down."
- Move on quickly. It's a reference, not a teaching moment.

**Slide 11: Bridge to demo**

**Talking points:**
- "the same model that writes your error messages can build the tool that generates them. you just have to tell it how."

**Transition:**
"let me show you what I mean."

---

## BLOCK 2: BUILD TOGETHER (65 minutes)

### 0:32 — Introduce the Artifact (5 min)
**Slide: 12**

**Facilitator actions:**
- Open the finished tool in a browser. Students need to see where they're headed.
- Let them click around for 30 seconds. Show the four inputs and output sections in action.
- Close the demo. Move on.

**Talking points:**
- "this is what we're building. it's a [tool name]. you give it [input one], [input two], [input three], [input four]. it gives you [output sections]. we're going to build this from scratch in the next hour."

**Transition:**
"we start here: Phase 0."

---

### 0:37 — Phase 0 Live (15 min)
**Slides: 13, and Claude web**

**THIS IS THE MOST TEACHABLE MOMENT IN THE ENTIRE WORKSHOP. Slow down here.**

**Facilitator actions:**
- Open Claude web.
- Paste the seed prompt. Run it. Read the output aloud.
- This takes 2-3 minutes. Let it be slow.

**Narration (reading output aloud):**
- "does this sound like a content person? check. is the voice consistent? check. are the rules specific or generic? let me look. (pause) these are specific. good. does the tech spec make sense to someone who's never coded? (read a section aloud). yeah. it's accessible."
- "we got three files back. the CLAUDE.md tells our build agent how to behave. the tech spec describes what we're building. and the system prompt is for later, when we add the API layer. park that one for now."

**Talking points:**
- "what I'm doing right now is asking: does this pass the sniff test? is it what I asked for? is it what I need? if the answer is no, I push back. I adjust. I iterate. Phase 0 is messy. it should be."

**Show what to push back on:**
- "if Claude gives you something that's not quite right, don't save it and move on. show Claude what's wrong. say 'that's not quite right, let me adjust.' you're training it. you're iterating. this is the build loop."

**Optional mention (Wispr Flow):**
- "if you want to do this via voice dictation, Wispr Flow is solid. I won't show it today. but if you're someone who thinks out loud, it's worth trying."

**Transition:**
"now let's move this into an actual project."

---

### 0:52 — Open the Editor (5 min)
**Slide: 14, then VS Code**

**Facilitator actions:**
- Create a new folder in Finder (or Explorer). Name it `content-testing-tool`.
- Do this on screen, slowly.
- Copy each of the three outputs from Claude into its own file and save to that folder: `CLAUDE.md`, `system-prompt.txt`, `tech-spec.md`.
- Do this slowly, on screen. Everyone follows along. It's copy, paste, save three times.
- Show the file structure. Point to each file. Don't explain line by line.

**Talking points:**
- "three files. that's the project so far. the CLAUDE.md is our agent's instructions. the tech spec is our blueprint. the system prompt we'll use later."
- "here's the file structure. this is all we need. not a lot. the work is in the rules, not the files."

**Facilitator actions:**
- Open that folder in VS Code.
- Open a terminal. Run a quick command to open the HTML in a browser (or just open it manually).
- Show it working. "it works. let's make it better."

**Transition:**
"now we iterate."

---

### 0:57 — First Build Loop (20 min)
**No slides. Pure demo.**

**Facilitator actions:**
- Open Claude Code (or Claude web, depending on setup).
- Show the first prompt on screen or paste it into chat so students can copy it.

**The first prompt (put on screen or paste in chat so students can copy it):**
> Review the CLAUDE.md and tech-spec.md in this directory, then build Version 1 of the tool as a single HTML file called index.html. No API, no external dependencies. Use conditional logic to pick the testing method and generate the protocol from templates.

- Write and run the first prompt. Watch the output generate.
- **NARRATE OUT LOUD as things happen.**

**Narration (example language):**
- "okay so that's generating. I can see Claude Code reading the spec files first. it's loading both files. the component structure is coming through. that's working. the styling is... it's there. the logic is... hold on. the input handling is off. let me check what I asked for. (look at prompt) yeah, I didn't specify that part. Claude filled it in. some of that's good. some of that I need to adjust."

**After the file is generated:**
- Open index.html in a browser: right-click in VS Code → Reveal in Finder → double-click. Or use Live Server extension.
- Fill in the four fields. Hit generate. Read the output together.

**Talking points:**
- "this is the moment where you notice what's working and what's off. not broken. just off. the difference matters."
- "you can see three kinds of off: the thing I asked for that didn't work, the thing I didn't ask for but Claude assumed, and the thing I asked for but the wording was unclear."

**Build loop actions:**
- Make one or two adjustments. Don't polish.
- The point is showing the loop, not shipping a perfect version.
- "I'm going to adjust [this part]. run it again. check it. it's better. not perfect. better. that's enough for now."

**Key principle:**
"Do not polish. the point is showing the loop, not a perfect result."

**When the agent is generating (expect 30-90 seconds of wait time):**
- Don't fill the silence with filler. Narrate what's on screen: "it's reading the spec first. now it's writing the HTML structure. the CSS is coming through."
- Ask evaluative questions while output streams: "what do you notice about the order it's building in?" or "see how it handled the input validation? what would you change?"
- Model the skill of reading output as it arrives. Point at specific lines. React in real time. "that's interesting, it chose a grid layout. I would have done flexbox. let's see how it turns out."
- This is a teaching moment. The skill isn't waiting. The skill is reading and evaluating what's coming back.

**Transition:**
"watch what happens when something goes wrong."

---

### 1:17 — Diagnostic Moment (5 min)
**Slide: 16**

**Facilitator actions:**
- Something will go wrong during the demo. Lean into it.
- Point at the problem. Name it. "that's a context problem" or "that's an instruction problem" or "that's a scope problem."
- Show the fix. This is where students learn the diagnostic framework.

**Talking points:**
- "when something's wrong, there are three kinds of wrong. context: Claude doesn't know something it needs to know. instruction: Claude understood you differently than you meant. scope: you asked for too much at once."
- "that problem we just saw was [type]. here's how I'm fixing it: [show the fix]. the pattern is always the same. name the kind of wrong. give Claude what's missing."

**Slide 17 (optional flash):**
- If time, show recovery moves: fresh conversation, ask Claude to explain itself, shrink scope.
- If running short, skip this slide.

**Transition:**
"now let me show you something about shipping."

---

### 1:22 — Two Versions and API Key Safety (10 min)
**Slides: 18-19**

**Slide 18: Static first, API second**

**Talking points:**
- "everyone builds the static version. everyone. it's faster. it teaches you the pattern. API is stretch. do the static version first. prove it works. then layer in the API if you want."

**Facilitator actions:**
- Show the static version running.
- Briefly show the API version running. "same UI, richer output."

**Slide 19: API key safety**

**Talking points:**
- "the API version of the tool has a key input field on the page. the user pastes their key each time they use it."
- "the key lives in memory for that browser session. it's never saved, never logged, never stored."
- "this is fine for a local tool running on your own machine."
- "the key IS visible in dev tools if someone opened the page. so don't share the HTML file with your key in it, and don't push it to a public repo."

**Key talking point to land:**
- "you paste your key in, it goes straight to the API, and it disappears when you close the tab. that's it. the rule is: don't share the file with your key in it, and don't push it to GitHub."

**For production (out of scope today):**
- "the key would live in an environment variable on a server. Vercel supports this."

**Transition:**
"if you finish your build early, you can layer in an API. here's how."

---

### 1:32 — API Layer Transition and System Prompt Callback (2 min)
**Slides: 20**

**Talking points:**
- "remember that third file from Phase 0? the system prompt? this is where it comes in. the system prompt lives inside the API version of the tool. it tells Claude how to generate protocols. you already wrote it. now it's working."

**Transition:**
"this is your starting point for the next phase if you want to go there."

---

### 1:34 — Deployment Preview (optional)
**Slides: 21-23**

**Facilitator actions:**
- Only do this if running ahead of schedule.
- If behind, skip entirely.

**Brief talking points:**
- Show localhost working. "this is your computer. it works."
- Show the Vercel deploy path. "this is live. one command. it's deployed."
- Don't go deep. Just show the arc.

**Transition:**
"now it's your turn to build."

---

## BLOCK 3: STUDENT BUILD (55 minutes)

### 1:39 — Opening Move (5 min)
**Slides: 23, 26**

**Slide 23: Your opening move**

**Facilitator actions:**
- Show the build prompt on screen. Read it aloud.
- "this is your starting point. same prompt I just used. paste the seed prompt into Claude web, save the three files to a folder, open it in VS Code, and run this prompt in Claude Code."

**Talking points:**
- "your first prompt sets the ceiling. be specific about what you want and what format it should be in."
- "if you want to customize, change the product context in the seed prompt. swap in your own product. your own users. your own content decisions."

**Slide 26: What done looks like**

**Talking points:**
- "done doesn't mean perfect. it means it does the one thing. you can use it. that's done. if you have time, iterate. if you don't, that's fine. you shipped."

**Transition:**
"you have 45 minutes. let's go."

---

### 1:44 — Build Time (45 min)
**Slides: 27-29 (timer visible)**

**Facilitator actions:**
- Put slide 28 (timer) on screen. Leave it there for the entire block.
- Post reference links to chat (slide 29).
- **This is facilitation time. You are not presenting. You are circulating.**

**Circulate and support:**
- Walk to each student.
- Ask: "what are you building?" Listen to the answer.
- Ask: "what's stuck?" Listen.
- Don't code for them. Point them to the right prompt. Ask them to show Claude their problem.
- Celebrate specifics. "that's a really specific output rule. Claude will hear that."

**Call transitions verbally:**

**15 min in:**
"you should have Phase 0 done and your first prompt running. if you're not there, grab me. we'll get you unblocked in one minute. keep building."

**30 min in:**
"you should have a working first version. time to iterate. add a constraint. adjust the output. push it further if you want."

**40 min in:**
"five more minutes. get to a stopping point. save your work. test it one more time."

**Early finishers:**
- "you're done? ask Claude Code to write the review prompt from the going further slide. it's a fun challenge."

---

## BLOCK 4: CLOSE (25 minutes)

### 2:29 — Educational Facilitator (10 min)
**Slides: 30-31**

**Facilitator actions:**
- Run the explainer prompt live against the demo project.
- This is a meta-moment. You're asking Claude to document what Claude built.

**Narration:**
- "watch what Claude does here. it's looking at the actual files. it's reading the architecture. it's explaining what it did. why is this useful? because now you have documentation. because Claude understands what it built. because your team can read this tomorrow."

**Talking points:**
- "this is personalized to the actual architecture. not generic docs. specific to what we built."

**Slide 31: Agent reviews**

**Talking points:**
- "you can go further. you can ask Claude Code to write tests. you can ask it to optimize. you can ask it to add a new feature. the build loop doesn't stop. you stop when you want to stop."

**Key line to land:**
"the skill isn't prompt writing. the skill is knowing what to ask next."

**Transition:**
"let me hear what you built."

---

### 2:39 — Share Out (7 min)
**Slide: 32**

**Facilitator actions:**
- Call on 3-4 people. Aim for diverse work. (onboarding, error messages, something wild, etc.)
- One minute each. Keep it moving.

**Your role:**
- Listen. Make eye contact. Nod.
- Ask one follow-up. "what's something you'd iterate on next?"
- Celebrate specifics, not generalities.
- Don't celebrate effort. Celebrate the choice. "you built a version that handles edge cases. that's the move."

---

### 2:46 — What to Build Next (3 min)
**Slide: 33**

**Talking points:**
- "now that you know the loop, here's what you can do with it. these are all things you could build with the same approach we used today."
- Walk through the five cards quickly. Don't linger. The point is range, not depth.
- "onboarding audit, error message tester, naming preference test, first-impression test. or something completely different. style guide checker. tone analyzer. you have the loop. use it."

**Key line to land:**
"the tool we built today was the excuse. the skill you learned is the thing."

---

### 2:49 — Close (5 min)
**Slide: 34**

**Talking points:**
- "you're a builder now." (Pause. Let it land.)
- "here are three things to do with this."
- "keep building. you have a template. you have a loop. apply it to the next thing."
- "share it. slack it to your team. show them what you made. get feedback."
- "come back. if you get stuck, if you want to go deeper, there's a community for this."

**Final note:**
- "thank you to UXCC for hosting this. this was good. go build."

---

## Timing Checkpoints

| Time | Action | Duration |
|------|--------|----------|
| 0:00 | Welcome and framing | 5 min |
| 0:05 | Setup check | 2 min |
| 0:07 | The reframe | 5 min |
| 0:12 | The environment | 10 min |
| 0:22 | Context engineering | 10 min |
| **0:32** | **Introduce the artifact** | **5 min** |
| 0:37 | Phase 0 live | 15 min |
| 0:52 | Open the editor | 5 min |
| 0:57 | First build loop | 20 min |
| 1:17 | Diagnostic moment | 5 min |
| 1:22 | Two versions and API key safety | 10 min |
| 1:32 | API layer transition and system prompt callback | 2 min |
| 1:34 | Deployment preview (optional) | — |
| **1:39** | **Opening move** | **5 min** |
| 1:44 | Build time | 45 min |
| **2:29** | **Educational facilitator** | **10 min** |
| 2:39 | Share out | 7 min |
| 2:46 | What to build next | 3 min |
| 2:49 | Close | 5 min |
| 3:00 | End |  |

---

## Notes for Jason

- **Energy management:** The live demo (0:37-0:57) is your highest-energy moment. You're teaching. Slow down. Narrate. Let students see your thinking. After 1:17, you shift to facilitator mode. That's a different energy. You're supporting, not presenting.

- **Timing is flexible, but protect build time:** If you're running over, cut deployment preview (1:34). Do not cut build time. That's where learning happens.

- **Something will go wrong during demo:** Use it. It's the most useful teaching moment of the workshop. Name the kind of wrong. Show the fix. Move on.

- **During build time, circulate.** Don't sit at the front. Don't answer from the podium. Walk to the student. Listen to their problem. Point them to the right next move. One minute. Done. Next student.

- **Celebrate specifics:** Don't say "that's good." Say "you defined the exact output format. that's why Claude nailed it." Specificity is currency.

- **The closing line:** "you're a builder now." Let that sit. Three seconds. Don't over-explain it.

- **Reference materials:** Make sure students have the prompt template (slide 26) and the reference links (slide 29) available. Post them to chat. Slack them. Make them easy to find.

- **Keep your laptop open during build time.** If someone's stuck, you can jump in and show them the prompt structure or open Claude Code to model a move. But do this at their machine, not yours. You're coaching, not presenting.

---

## Backup Plans

**If Phase 0 demo goes long (> 8 min):**
- Shorten the live editor section (0:52). Just show the files. Don't run the terminal command.

**If first build loop goes long (> 25 min):**
- Skip deployment preview (1:34) entirely.

**If build time is running short (< 30 min left at 1:44):**
- Call transitions at 10 min and 20 min instead of 15, 30, 40.
- Reduce to 2 share-outs instead of 3-4.

**If someone's completely stuck:**
- Pair them with a neighbor who's further along.
- Ask: "what's the one thing blocking you?" Solve that. Move on.
- If it's a tool issue (can't open Claude, can't save files), handle it offline. Keep the group moving.

---

## Voice Checklist

Before you present, remember:
- All lowercase in talking points (unless it's a proper noun or start of sentence)
- No em dashes
- No semicolons
- No "not X / Y" contrast constructions
- Short declarative statements. "it works. let's make it better." not "the tool is functional, which allows us to proceed to the iteration phase."
- Dry, precise, quietly confident
- No evangelical framing ("this is the future of content" gets cut. "this is a tool that works" stays.)
- You're talking to peers. You have three years in. They have experience. You're sharing what you learned, not preaching.
