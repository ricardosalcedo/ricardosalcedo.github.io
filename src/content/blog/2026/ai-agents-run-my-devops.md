---
title: "I Let AI Agents Run My Dev Operations. Production Still Requires a Human."
pubDatetime: 2026-06-04T12:00:00Z
description: "How I built a system where autonomous agents handle observability, code quality, compliance, and bug fixes — all reporting to a single Slack channel — while production remains gated behind hardened CI/CD."
tags: ["devops", "ai", "automation", "security", "observability"]
featured: true
---

I have agents running 24/7 that track my repos, file bug fixes, monitor production health, answer questions in app channels, and enforce compliance policies. They move fast. They're opinionated. And none of them can touch production without going through CI/CD.

This isn't aspirational. It's how I work today. Here's the system.

## One Channel to Rule Them All

Every signal in my development operation routes to a single Slack channel. Not ten channels. Not email. One stream of decisions.

- Observability alerts — anomaly detection, error rate spikes, latency regressions
- Code quality scans — lint violations, security findings, dependency vulnerabilities
- Compliance checks — policy drift, access control changes, audit failures
- Deployment status — pipeline progress, approval gates, rollback triggers
- Agent activity — PRs filed, issues triaged, user questions answered

The channel isn't a firehose. Each message is actionable or informational. I don't go looking for problems — problems come to me, already triaged, with context attached.

This changes the job. Instead of monitoring dashboards and checking tools, I make decisions. The system gathers. I decide.

## Agents That Work While I Sleep

Here's what runs autonomously across my projects:

**Code health agents** scan repos continuously. They detect stale dependencies, flag unused code, identify patterns that drift from project conventions. When they find something fixable, they don't file a ticket — they submit a PR with the fix, tests included. I review in the morning.

**Observability agents** watch production metrics and logs. They correlate anomalies across services, identify probable root causes, and surface them before users notice. A spike in p99 latency at 2 AM doesn't wait for standup — it's in my channel with a hypothesis and relevant log snippets.

**Compliance agents** enforce security policies continuously. Not just at PR time — they scan running infrastructure for drift, check IAM policies for over-permissioning, verify encryption settings, audit access logs. Violations surface immediately with remediation suggestions.

**App channel agents** staff interest channels for my open source projects. Users ask questions, agents answer from docs and code context. Issues get triaged, duplicates get linked, simple bugs get fix PRs opened. The agent handles the 80% that's routine; I handle the 20% that requires judgment.

## The Sacred Line: Production Is Gated

Here's where I break from the "let AI do everything" crowd. AI proposes. CI/CD disposes. The line is non-negotiable.

**No AI-generated change reaches production without:**

1. **Full build and test suite passing.** Unit tests, integration tests, contract tests. If it doesn't pass the same pipeline a human's code goes through, it doesn't ship.

2. **Security scanning.** SAST, DAST, dependency vulnerability checks, container image scanning. Every artifact is scanned before it's deployable.

3. **Provenance verification.** Every artifact is signed. Every deployment is traceable to a specific commit, a specific pipeline run, a specific set of approvals. You can audit any production change back to its origin.

4. **Access controls.** Agents operate with least-privilege tokens scoped to dev/staging. Production deployment requires elevated credentials that agents don't hold. The pipeline holds the keys, not the agent.

5. **Human approval for production.** Agents can deploy to dev freely. Staging requires pipeline gates. Production requires explicit human approval after reviewing what changed and what was tested.

This isn't paranoia. It's engineering discipline applied to a new paradigm. The same rigor we apply to human-written code applies to agent-written code. More rigor, actually — because agents can generate changes at a volume that makes rubber-stamping tempting.

## Why This Matters

The industry is bifurcating. On one side: teams giving AI unrestricted production access because "it's faster." On the other: teams refusing to use AI at all because "it's risky."

Both are wrong.

The winning strategy is simple: **let AI move fast everywhere it's safe, lock it down everywhere it's not.**

Dev environments? Agents can create, destroy, experiment freely. That's what dev is for. Staging? Agents can deploy, but through pipelines with automated gates. Production? Full CI/CD, security scans, provenance, human approval. No exceptions.

The velocity comes from removing human bottlenecks in the 90% of work that doesn't require human judgment. The safety comes from keeping human oversight in the 10% that does.

## The Stack

For anyone building something similar:

- **Orchestration:** Custom agents running on scheduled and event-driven triggers
- **Communication:** Slack as the single pane — structured messages with action buttons
- **Code operations:** Agents with repo access scoped to PRs (not direct commits to main)
- **Observability:** Metrics, logs, and traces piped through anomaly detection before alerting
- **CI/CD:** Standard pipeline with additional gates for agent-authored changes
- **Access control:** Separate credential scopes for dev/staging/production, agents never hold prod keys
- **Audit:** Every agent action logged, every PR traceable, every deployment signed

## The Result

One engineer. Dozens of repos. Production systems running with less operational noise than most teams of five produce. Not because I work more hours — because the hours I work are spent on decisions, not on gathering information or performing routine maintenance.

The agents handle the grind. The pipeline enforces the standards. I handle the judgment calls.

That's the job now. Not typing code faster. Not monitoring dashboards. Making better decisions, faster, with better information, while machines handle everything that doesn't require a human brain.
