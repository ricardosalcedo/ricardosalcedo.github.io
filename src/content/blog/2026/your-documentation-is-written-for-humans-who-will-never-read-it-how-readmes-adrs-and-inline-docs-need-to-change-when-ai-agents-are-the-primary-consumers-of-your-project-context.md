---
title: "Your README Is a Liability Now"
pubDatetime: 2026-05-20T12:00:00Z
description: "I watched an AI coding agent burn 40,000 tokens reading a README last week. Badges. A logo in ASCII art. A \"Philosophy\" section. A contributor covenant. A table of contents"
tags: ["devops", "ai", "python", "documentation", "developer-experience"]
featured: false
---

I watched an AI coding agent burn 40,000 tokens reading a README last week. Badges. A logo in ASCII art. A "Philosophy" section. A contributor covenant. A table of contents linking to a wiki that 404'd. The agent needed three things: the build command, the test runner, and which env vars to set. It got those answers on lines 847, 912, and 1,034 of a 1,200-line file. Everything above was noise. Expensive noise, at roughly $0.02 per wasted read, multiplied by every developer on the team, every session, every day.

We spent twenty years writing documentation for humans who never read it. Now machines are reading all of it, and they're choking on the parts we wrote to feel professional.

## Half Your Readers Are Already Machines

The numbers aren't speculative anymore. [Mintlify published traffic data in April 2026](https://www.mintlify.com/blog/state-of-ai) showing that AI coding agents now account for 45.3% of all requests to documentation sites they host. That's 357.6 million requests in 30 days. Claude Code alone generated 199.4 million of those, more than Chrome on Windows. Cursor added another 142.3 million.

Your documentation has a new primary audience, and that audience does not care about your project's origin story.

This isn't a future trend. This is March 2026 traffic data. If you maintain a public library, framework, or API, roughly half the entities reading your docs right now are language models trying to extract structured facts from your prose. They're paying per token for the privilege of parsing your marketing copy to find a function signature.

## The Token Tax on Traditional Docs

Here's the uncomfortable economics. Context windows aren't free. [Research shows](https://www.augmentcode.com/guides/why-smart-context-beats-big-context-windows) that million-token windows cost significantly more to run, degrade accuracy in middle sections, and create focus problems. A typical enterprise codebase averages 500 million tokens. A 128K context window captures 0.025% of that. Every token matters.

Your README's "Getting Started" narrative? Token tax. Your inline comments explaining what `i += 1` does? Token tax. Your ADR's three paragraphs of "Context" restating the ticket description? Token tax.

AI agents don't read linearly. They don't benefit from narrative arc. They need structured, scannable, information-dense text that answers: what does this do, how do I use it, what are the constraints, what breaks if I change it. Everything else is friction billed by the thousand tokens.

The [Columbia University research group](https://daplab.cs.columbia.edu/general/2026/03/31/your-ai-agent-doesnt-care-about-your-readme.html) put it bluntly in their March 2026 paper title: "Your AI Agent Doesn't Care About Your README." They found that agents perform better with terse, structured context files than with traditional documentation, even when the traditional docs contain more information. More is not better when your reader has a finite attention budget measured in tokens.

## Context Files Ate Documentation's Lunch

The industry already voted with its commits. Over 60,000 open-source projects now ship an `AGENTS.md` file, a standard [governed by the Linux Foundation's Agentic AI Foundation](https://vibecoding.app/blog/agents-md-guide) and read natively by Codex CLI, GitHub Copilot, Cursor, Windsurf, Amp, and Devin. Claude Code reads `CLAUDE.md`. Gemini CLI reads `GEMINI.md`. Every major AI coding tool now looks for a dedicated machine-context file before it ever opens your README.

Think about what that means. The industry built a parallel documentation layer specifically because the existing one was failing its fastest-growing audience. These context files aren't documentation in any traditional sense. They're terse, imperative, structured. No narrative. No philosophy. No badges. Just: here's how this project works, here are the constraints, here's what you must not do.

```markdown
# AGENTS.md
## Build
- `make build` requires Go 1.22+
- Tests: `make test` (unit), `make integration` (requires Docker)

## Architecture
- /cmd: entrypoints, one per service
- /internal: business logic, never import from outside
- /pkg: shared libraries, stable API

## Constraints
- No ORM. Raw SQL with sqlc.
- Errors wrap with fmt.Errorf("op: %w", err)
- No global state. Inject dependencies.
```

Forty lines. Zero ambiguity. An AI agent reads this and immediately knows how to operate in your codebase. Compare that to the average README: 800 lines, half of which is installation instructions for three operating systems the agent will never run on.

## Write for the Reader That Actually Shows Up

The point isn't "stop writing READMEs." It's this: the documentation you write for humans is a nice-to-have. The context you provide for machines is infrastructure. Treat it accordingly.

This means:

**Separate the layers.** Keep your README for humans who browse GitHub. But ship a context file (`AGENTS.md`, `CLAUDE.md`, or whatever your toolchain reads) that gives machines the structured facts they need. Don't make one file serve both audiences.

**Kill the narrative in technical docs.** Inline comments should state constraints and invariants, not narrate the obvious. ADRs should lead with the decision and constraints, not three paragraphs of scene-setting. API docs should be structured data, not prose with code examples buried in paragraphs.

**Budget your tokens like you budget your cloud spend.** If an AI agent reads your project context 50 times a day across your team, and each read burns 30,000 tokens of noise, you're paying real money for documentation that actively degrades the agent's performance. Measure it. Cut it.

The teams that figure this out will have AI agents that understand their codebases on the first try. Everyone else will keep wondering why their agent hallucinates a build system that doesn't exist, because it filled its context window with your contributor guidelines instead of your architecture.

Your documentation was always a contract with your reader. The reader changed. Update the contract.
