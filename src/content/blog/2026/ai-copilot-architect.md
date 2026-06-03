---
title: "Your AI Copilot Is an Architect Now. It Just Never Writes Anything Down."
pubDatetime: 2026-05-16T12:00:00Z
description: "Last month I opened a pull request to refactor a data pipeline and found three services communicating through an event bus that didn't exist six weeks earlier. Nobody on the team"
tags: ["devops", "ai", "architecture", "python", "documentation"]
featured: false
---

Last month I opened a pull request to refactor a data pipeline and found three services communicating through an event bus that didn't exist six weeks earlier. Nobody on the team had designed it. Nobody had proposed it in a design review. Nobody had written an ADR. The AI coding agent a teammate was using had decided, across a series of incremental PRs, that event-driven was the right pattern for this particular data flow. It was probably correct. But nobody could tell me *why*, and nobody could tell me what would break if we changed it.

This isn't a tooling failure. It's an institutional memory failure happening at scale, and it's going to get worse before anyone figures out how to stop it.

## The Ghost Architect Problem

Here's the math: [over 75% of professional developers now use AI coding tools daily](https://www.aimagicx.com/blog/ai-coding-security-risks-agentic-development-2026). These tools don't just autocomplete variable names. They choose patterns. They select libraries. They decide how services communicate, how errors propagate, how state is managed. Every prompt-to-code interaction is an implicit architecture decision.

The problem is that these decisions are invisible to every governance mechanism we've built. Design reviews catch proposals. Code reviews catch implementations. ADRs catch rationale. But when an AI agent incrementally introduces a pattern across five PRs over two weeks, none of these mechanisms fire. The architecture changes without anyone deciding to change it.

[Kognitos identified this as "zero institutional knowledge capture"](https://www.kognitos.com/blog/why-vibe-coding-breaks-in-production/) and called it one of five critical failure modes of AI-assisted development. They're right, but they're underselling the severity. This isn't just a knowledge capture problem. It's a *decision authority* problem. Who approved the event bus? Who evaluated the tradeoffs against request-response? Who considered the operational cost of debugging async failures at 3 AM? The answer is: a language model that optimized for the immediate context window and forgot everything the moment the session ended.

## ADRs Were Designed for a World Where Humans Made Decisions

Traditional ADRs assume a simple model: a human identifies a decision point, evaluates options, picks one, and writes down why. The record exists because someone consciously chose. But AI-generated architecture violates this model completely. There's no conscious choice. There's no moment of deliberation. The pattern emerges from a thousand micro-completions, each one locally reasonable, collectively forming an architecture nobody designed.

This is why the standard response of "just write more ADRs" misses the point entirely. You can't document a decision that nobody made. You can't capture rationale that doesn't exist. The AI didn't choose event-driven because it evaluated your team's operational maturity, your monitoring stack, your on-call rotation's comfort with async debugging. It chose event-driven because the training data said event-driven was appropriate for that shape of problem.

[Research from early 2026](https://arxiv.org/html/2602.04445) has explored using AI agents to extract architectural knowledge from code repositories and generate ADRs retroactively. This is useful but backwards. Generating documentation after the fact is archaeology. What we actually need is architecture as a constraint that operates *before* code generation, not a record that follows it.

## The Flip: ADRs as Machine-Readable Constraints

Here's where it gets interesting. What if ADRs stopped being documents humans write for other humans to read, and became executable specifications that AI agents consume before generating code?

[Shing Lyu demonstrated this pattern](https://shinglyu.com/blog/2026/03/01/ai-adr-code-review.html) with a bookstore API where GitHub Copilot Code Review was configured to enforce architectural decisions on every PR. Three ADRs, written in structured markdown, fed directly to the AI reviewer as instructions. The reviewer flags violations automatically. The architecture becomes a guardrail, not a historical record.

This inverts the entire ADR workflow. Instead of:

1. Human makes decision
2. Human writes ADR
3. ADR sits in Confluence until it rots

You get:

1. Team writes ADR as a constraint
2. AI agents read the constraint before generating code
3. AI reviewers enforce the constraint on every PR
4. Violations surface immediately, not six months later during an incident

In practice, your `architecture/decisions/` directory becomes part of your AI agent's system prompt:

```yaml
# decisions/003-error-propagation.yaml
id: ADR-003
status: accepted
context: |
  Services in the data pipeline must handle partial failures
  without cascading. Team has limited async debugging experience.
decision: |
  Use synchronous request-response with circuit breakers (resilience4j pattern).
  Do NOT introduce event buses or async messaging without explicit team review.
consequences:
  - Higher latency tolerance required at API gateway
  - Circuit breaker thresholds must be tuned per-service
enforcement:
  - Block PRs introducing message queue dependencies
  - Flag any new async/await patterns in pipeline services
```

This isn't hypothetical. Teams running Claude Code and Cursor are already feeding project-level instructions through `.cursorrules` and `CLAUDE.md` files. The missing piece is treating those instructions as formal architectural decisions with the same rigor we'd apply to an ADR, including status, context, consequences, and supersession rules.

## The Uncomfortable Question

The real tension here isn't technical. It's organizational. If AI agents are making architecture decisions, and we respond by encoding constraints that AI agents must follow, then we've built a system where machines propose and machines enforce, with humans writing the rules in between. That middle layer, the constraint-authoring layer, becomes the actual locus of architectural authority.

This means the architect's job is no longer "design systems." It's "write constraints that prevent AI from designing the wrong systems." That's a fundamentally different skill. It requires thinking in boundaries and invariants rather than blueprints. It requires anticipating what an AI will do wrong, not just what a human should do right.

[AI-generated PRs already carry 1.7x more issues than human-written ones](https://www.tech-stack.com/blog/state-of-ai-report-2026/). The issues aren't syntax errors. They're logic errors, error handling gaps, and security findings. These are architectural failures at the micro level, compounding into macro drift that nobody notices until production breaks.

So here's the question I can't stop thinking about: if your architecture is only as good as the constraints you feed your AI agents, and those constraints are only as good as your ability to anticipate failure modes you've never seen before, then who is actually the architect? The human writing the rules, or the machine finding the gaps between them?

Start writing your ADRs in YAML. Make them machine-readable. Feed them to your agents. Enforce them in CI. Because the alternative is waking up in six months to an architecture nobody designed, nobody approved, and nobody can explain. And by then, the cost of changing it will be measured in quarters, not sprints.
