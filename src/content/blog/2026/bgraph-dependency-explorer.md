---
title: "I Built a Dependency Graph Explorer in a Week Without Writing Most of the Code"
pubDatetime: 2026-03-19T12:00:00Z
description: "Last week I had a problem. I needed to understand the blast radius of a package change across a large monorepo style build system. I found myself clicking through web UIs,"
tags: ["developer-tools", "ai", "python", "devops"]
featured: false
---

Last week I had a problem. I needed to understand the blast radius of a package change across a large monorepo style build system. I found myself clicking through web UIs, manually tracing dependency chains, and losing track of where I was three levels deep. So I did what any frustrated engineer would do. I built a CLI tool.

It went from zero to a fully functional interactive TUI in about a week. And the way it happened says something important about where developer tooling is headed.

## The Tool Nobody Asked For But Everyone Needed

The idea was simple. Type a package name, see its full dependency tree. But once you start pulling that thread, the scope explodes. What depends on this package? If I change it, what breaks? What is the shortest path between two packages in the graph? How does a change flow from source code to production?

By the end of the week, the tool had:

- Dependency trees with circular dependency detection
- Consumer graphs showing blast radius, meaning what breaks if you touch a package
- Shortest path queries between any two nodes in the graph
- Version diffing to see what changed between releases
- Fuzzy search across hundreds of packages
- JSON output for piping into scripts and dashboards

The part I did not expect was that rate limiting ate two full days. The package registry APIs have throttling, and a naive BFS through a consumer graph will hit those limits in seconds on any real world dependency graph. The solution was parallel BFS with an expansion cap per depth level, plus graceful fallbacks when the API returns unexpected response formats. Not glamorous, but it is the difference between a demo and a tool people actually use.

## I Did Not Write Most of This

Let me be upfront. I did not hand write this tool. AI generated the argument parsing, cache management, fuzzy search integration, test scaffolding, and most of the boilerplate. My job was different. I described what I wanted, reviewed every line that came back, tested it against real dependency graphs, and caught the places where the generated code did not understand the domain.

The shortest path algorithm? Trivial to generate. The edge cases around version resolution and major version discovery? That needed someone who understood the package ecosystem. The rate limiting heuristics? I had to test those against production APIs to find the right expansion caps. No amount of prompting gets you there without real world feedback.

This is a pattern I think we are going to see a lot more of. You spot a need, you describe a solution, you review and validate. The old cycle was spot a problem, research, write code, debug, iterate over days or weeks. Now it is spot a problem, describe what you want, review what you get, test against reality. The bottleneck moved from producing code to evaluating it.

And that shift changes what is worth building. A week long CLI tool? Under the old model, I would have filed that as "nice to have" and never started. The effort to value math did not work. But when the cost of generating a first draft drops to near zero, you start solving problems you would have lived with forever. The frustration threshold for "I should build something" just got dramatically lower.

## Why This Matters Beyond My Terminal

There is a broader pattern here. Every large scale build system, whether it is Bazel, Gradle, npm, or something proprietary, has the same problem. Dependency graphs are invisible until something breaks. Engineers make changes without understanding blast radius because the tooling to visualize it either does not exist or is buried in a web UI that requires six clicks to answer a simple question.

The tools that win are the ones that meet engineers where they already are, in the terminal. A CLI that answers "what breaks if I change this?" in two seconds will get used. A dashboard that requires navigating to a URL, logging in, and clicking through three pages will not.

But here is what is changing. The person who builds that CLI no longer needs to be a tooling specialist. They need to be the person who feels the pain, understands the domain, and can evaluate whether a generated solution actually works. The coding skill that matters most now is not typing speed. It is the ability to look at generated code and know whether it is right.

If you are sitting on a similar frustration, some manual process you repeat weekly, some question you keep asking that takes too long to answer, the barrier to building a tool has never been lower. Describe the problem. Let AI generate a first pass. Then do the part that only you can do. Test it against reality, catch the edge cases, and iterate until it actually works.

The best developer tools are not built by platform teams with quarterly roadmaps. They are built by frustrated engineers who decide they have clicked through that web UI for the last time. And now they can actually do something about it in a week instead of a quarter.
