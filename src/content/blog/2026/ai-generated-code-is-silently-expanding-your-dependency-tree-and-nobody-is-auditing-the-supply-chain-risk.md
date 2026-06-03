---
title: "Your AI Chose Your Dependencies. Who Audits the Machine?"
pubDatetime: 2026-05-14T12:00:00Z
description: "Last Monday, a worm called Mini Shai Hulud compromised 84 versions across 42 TanStack packages in six minutes flat. It stole CI/CD secrets, cloud credentials, and Kubernetes"
tags: ["security", "ai", "devops", "python", "supply-chain"]
featured: false
---

Last Monday, a worm called Mini Shai Hulud compromised 84 versions across 42 TanStack packages in six minutes flat. It stole CI/CD secrets, cloud credentials, and Kubernetes tokens from every build pipeline that pulled those packages. The attack vector wasn't novel. What was novel: researchers later found that several of the compromised downstream projects had added TanStack dependencies not because a developer chose them, but because an AI coding agent suggested them during a refactor three months earlier. Nobody remembered why those packages were there. Nobody had reviewed the decision. The lockfile said they belonged, so they stayed.

This is the new normal, and your security tooling wasn't built for it.

## Slopsquatting Is the Distraction

You've probably heard about slopsquatting by now. AI models hallucinate package names that don't exist. Attackers register those names and wait. A [study of 576,000 code samples](https://www.startupdefense.io/blog/slopsquatting-ai-supply-chain-threat-startups) across 16 models found roughly 205,000 unique hallucinated package names. One in five AI-recommended packages points to a phantom library. It's a real problem and it gets all the headlines.

But slopsquatting is the pickpocket. The real heist is happening in broad daylight.

The deeper issue isn't that AI invents fake packages. It's that AI coding agents are making architectural decisions about your dependency graph dozens of times per day, and your entire security apparatus assumes those decisions were made by a human with intent. Your SBOM documents what's in your tree. It can't tell you *why* it's there, or whether anyone ever meant for it to be.

## The Intentionality Gap

Every supply chain security tool we have was designed for a world where adding a dependency was a deliberate act. A developer evaluated options, checked maintenance status, maybe read the README. The lockfile recorded the outcome of that decision. The SBOM inventoried it. Scanners checked it against CVE databases. The whole pipeline assumes someone *chose* this.

AI coding agents don't choose. They pattern-match. Ask Claude or GPT to build a data pipeline and it'll pull in pandas, pyarrow, fsspec, and six transitive dependencies you could have avoided with a 15-line function using the standard library. It's not malicious. It's not even wrong. It's just... unexamined. And unexamined dependencies compound.

Here's what the data shows: AI-generated code contains [322% more privilege escalation paths](https://beyondscale.tech/blog/vibe-coding-security-risks-enterprise) than human-written code. Thirty-five CVEs were attributed to AI-generated code in March 2026 alone, up from six in January. Not because the AI writes exploits, but because it casually imports libraries with broad permissions that a security-conscious developer would have avoided or scoped down.

Your dependency tree isn't growing because your team is building more features. It's growing because your AI assistant treats `pip install` like punctuation.

## SBOMs Are Now Fiction

CISA and the G7 just released [new guidance on AI SBOMs](https://www.csoonline.com/article/4170694/cisas-ai-sbom-guidance-pushes-software-supply-chain-oversight-into-new-territory.html) this month, acknowledging that traditional software bills of materials can't capture the full picture when AI is in the loop. The industry is already coining a new term: AI-BOMs. But even these miss the point.

The problem isn't inventory. We can list every package in the tree. The problem is *provenance of intent*. Consider two identical `requirements.txt` files. In one, every line was added by a developer who evaluated alternatives and made a tradeoff. In the other, an AI agent added half the entries during autonomous coding sessions that nobody reviewed at the dependency level. These files are identical to every scanner, every audit, every compliance check. They are not the same.

What we actually need is dependency intent tracking. Not just "what's in the tree" but "who or what added it, why, and did a human ratify that decision." Think of it as `git blame` for your lockfile, but with a flag that says "this was an AI suggestion that was never explicitly approved."

## The Uncomfortable Question

Most teams can't answer a basic question about their own codebase: *What percentage of your current dependencies were chosen by a human?*

If you're using Copilot, Cursor, or any AI coding agent in your workflow, the honest answer is probably "I don't know." And if you don't know, your SBOM is a compliance artifact, not a security document. It tells auditors what's there. It doesn't tell you whether anyone is accountable for it being there.

The Mini Shai Hulud attack worked because it exploited trust in the dependency graph. But the deeper vulnerability isn't in npm or PyPI. It's in the assumption that your dependency graph reflects human decisions. That assumption died the moment you let an AI agent run `npm install` without a policy gate.

So here's the question worth sitting with: if your AI assistant added a dependency six months ago that nobody remembers approving, and that dependency gets compromised tomorrow, who owns that incident? The developer who accepted the PR? The AI vendor? Your security team that never flagged it?

Nobody. And that's exactly the problem.
