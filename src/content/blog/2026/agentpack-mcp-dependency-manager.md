---
title: "I Built a Package Manager for MCP Servers Because Nobody Else Did"
pubDatetime: 2026-06-26T05:00:00Z
description: "The MCP ecosystem has 10,000+ servers and zero dependency management. I built AgentPack — resolve, lock, and orchestrate dependencies between MCP servers and AI agents with one manifest file."
tags: ["mcp", "ai", "agents", "devtools", "rust", "open-source"]
featured: true
---

The MCP ecosystem is npm circa 2012. Thousands of packages. No lockfile. No version pinning. No way to say "this server needs that server." I got tired of hand-wiring JSON configs, so I built the thing that should already exist.

## The Problem Nobody's Solving

You're building an AI agent that needs a filesystem server, a web search server, a geocoding server, a weather server, and two sub-agents. Today, you:

- Hand-write each server into a JSON config file with no version constraints
- Discover at runtime that two servers expose a tool called `read_file`
- Copy-paste configs between Claude Desktop, VS Code, Kiro, and Cursor
- Have no idea that your travel-advisor MCP depends on weather which depends on geocoding
- Pull `latest` via unpinned `npx` every time your agent restarts

The existing registries — MCP Registry, GitHub MCP Registry, Smithery — solve **discovery**. They're the yellow pages. But they don't solve **composition**. There's no way to declare "my server needs these other servers to function."

That gap is real. A scan of 42,000+ MCP tools found 502 configurations using unpinned `npx`, 1,050 pointing to unauthenticated remote URLs, and a supply chain attack that BCC'd every outgoing email for fifteen versions before anyone noticed.

## AgentPack: One Manifest, One Lock File, One Command

```bash
agentpack init
agentpack add io.github.modelcontextprotocol/filesystem@^2.0.0
agentpack add io.github.modelcontextprotocol/fetch@^2.0.0
agentpack add --agent io.github.me/research-agent@^1.0.0
agentpack install
```

That's it. `install` resolves the dependency graph, detects tool name conflicts, generates SHA-256 integrity hashes, and writes a deterministic lock file. Then:

```bash
agentpack export --target claude-desktop  # → claude_desktop_config.json
agentpack export --target kiro            # → .kiro/mcp.json
agentpack export --target cursor          # → .cursor/mcp.json
```

Same lock file, any client. Your whole team gets identical configs.

## What the Graph Looks Like

```bash
$ agentpack graph

  MCP Servers:
    ⚙ io.github.agentpack-demo/geocoding @ 1.0.0
      └─ [stdio] node servers/geocoding/index.js
    ⚙ io.github.agentpack-demo/weather @ 1.0.0
      └─ [stdio] node servers/weather/index.js
      └─ needs mcp: geocoding @ ^1.0.0
    ⚙ io.github.agentpack-demo/travel-advisor @ 1.0.0
      └─ [stdio] node servers/travel-advisor/index.js
      └─ needs mcp: geocoding @ ^1.0.0
      └─ needs mcp: weather @ ^1.0.0

  Agents:
    🤖 io.github.me/research-agent @ 1.0.0
      └─ [stdio] python3 agents/research.py
      └─ needs mcp: fetch @ ^2.0.0
      provides: [web-research, data-extraction]
```

One command shows you the entire system topology. Which servers depend on which. What capabilities agents provide. Where conflicts exist.

## Agents and MCPs in One Graph

This is where it gets interesting. MCP servers are passive — they sit there and expose tools. Agents are active — they reason, delegate, and call other agents.

The dependency relationships are different but they belong in the same graph:

```json
{
  "name": "io.github.me/str-analyzer",
  "type": "composite",
  "dependencies": {
    "io.github.modelcontextprotocol/filesystem": "^2.0.0",
    "io.github.modelcontextprotocol/fetch": "^2.0.0"
  },
  "agents": {
    "io.github.me/research-agent": {
      "version": "^1.0.0",
      "capabilities": ["web-research", "data-extraction"]
    },
    "io.github.me/pricing-agent": {
      "version": "^1.0.0",
      "capabilities": ["property-valuation"]
    }
  }
}
```

Agents declare what they provide:

```json
{
  "name": "io.github.me/research-agent",
  "type": "agent",
  "provides": {
    "capabilities": ["web-research", "data-extraction"],
    "protocol": "a2a"
  },
  "dependencies": {
    "io.github.modelcontextprotocol/fetch": "^2.0.0"
  }
}
```

Then `agentpack validate` checks that required capabilities match what agents actually provide. If your research-agent claims it does "translation" but doesn't declare that capability — you know before runtime.

## Security Built In, Not Bolted On

```bash
$ agentpack audit

Audit results (2 issues):

  [CRITICAL] Integrity mismatch for 'io.github.x/server':
    lock says sha256-9add... but file hashes to sha256-eaa8...
  [WARN] Tool name conflict: 'read_file' provided by: filesystem, web-search

Summary: 1 critical, 0 high, 1 warnings
```

Every lock file entry has a SHA-256 hash. If a package changes after install — whether from a supply chain attack or an accidental update — `audit` catches it. It also flags unpinned npx calls, missing credentials files, and tool shadowing.

## `agentpack run` — Topological Startup

```bash
$ agentpack run

Starting 3 services in dependency order...

  ⚙ ▶ geocoding @ 1.0.0
  ⚙ ▶ weather @ 1.0.0
  🤖 ▶ research-agent @ 1.0.0

✓ 3 services running. Press Ctrl+C to stop all.
```

Servers start in the right order. Leaf nodes first, dependents after. Health monitoring kills and reports dead processes. Credentials are injected per-server from a scoped YAML file.

## How It Integrates with AI Tools

AgentPack doesn't replace your AI tool. It generates the config your tool already reads:

| Tool | Command | Output |
|------|---------|--------|
| Claude Desktop | `agentpack export --target claude-desktop` | `claude_desktop_config.json` |
| VS Code / Copilot | `agentpack export --target vscode` | `.vscode/mcp.json` |
| Kiro | `agentpack export --target kiro` | `.kiro/mcp.json` |
| Cursor | `agentpack export --target cursor` | `.cursor/mcp.json` |

Zero changes needed in any tool. You resolve once, export to whatever you use.

## Why Rust, Why a CLI

- Single binary, no runtime dependencies. `curl | bash` and you're running.
- 13 tests, strict clippy (no `unwrap`, no `panic`), CodeQL SAST, TruffleHog secrets scanning, cargo-audit, cargo-deny license compliance.
- CI builds for linux-amd64, linux-arm64, darwin-amd64, darwin-arm64.
- The whole thing is ~800 lines of Rust. No async runtime. No framework. Just a resolver and a file writer.

## What's Next

This is v0.1. The foundation. What comes next:

- **Hosted registry** — search and publish from the CLI, pull manifests from a central source
- **`agentpack run` with A2A wiring** — not just start processes, but wire agent-to-agent communication
- **VS Code extension** — visualize the dependency graph in your editor
- **MCP SEP proposal** — submit a spec enhancement to make dependency declaration part of the protocol

## Try It

```bash
cargo install --git https://github.com/ricardosalcedo/agentpack
agentpack init
agentpack add io.github.modelcontextprotocol/filesystem@^2.0.0
agentpack install
agentpack graph
```

Or clone the demo with real working MCP servers:

```bash
git clone https://github.com/ricardosalcedo/agentpack
cd agentpack/examples/mcp-dependency-demo
npm install && cd servers/geocoding && npm install && cd ../weather && npm install && cd ../travel-advisor && npm install && cd ../..
../../target/release/agentpack install
../../target/release/agentpack graph
node test-client.js
```

The repo: [github.com/ricardosalcedo/agentpack](https://github.com/ricardosalcedo/agentpack)

---

The MCP ecosystem will eventually need this. The question is whether it's a layer added to the protocol spec, a third-party tool like AgentPack, or something every client re-implements badly on their own. I'd rather build it once and share it.
