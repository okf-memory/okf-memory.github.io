<div align="center">

# 🧠 OKF Agent Memory

**The Git-Native Persistent Memory for Autonomous AI Coding Agents**

[![Live Website](https://img.shields.io/badge/Website-okf--memory.dev-8b5cf6?style=flat-square)](https://okf-memory.dev)
[![Main Engine](https://img.shields.io/badge/GitHub-okf--agent--memory-00ADD8?style=flat-square&logo=github)](https://github.com/okf-memory/okf-agent-memory)
[![Specification](https://img.shields.io/badge/Specification-Google_OKF_v0.2-blue?style=flat-square)](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

<p align="center">
  This repository contains the source code for the official website, interactive documentation, and installer hub for the <b>OKF Agent Memory</b> project, deployed globally at <a href="https://okf-memory.dev"><b>okf-memory.dev</b></a>.
</p>

</div>

---

## 🌟 About the Project

Conversations with AI coding agents reset whenever context windows close. Architectural decisions, conventions, and operational insights are frequently lost or dumped into unmaintainable, 20k-token monolith files (`CLAUDE.md`, `AGENTS.md`) that degrade model attention and bloat API bills.

**OKF Agent Memory** solves this by providing a standardized, vendor-neutral memory layer that lives directly inside your repository as plain, version-controlled Markdown:

* **⚡ Sub-300µs In-Memory Search**: Lexical BM25 retrieval implemented in pure Go with zero database dependencies and zero embedding API costs.
* **🗂️ Progressive Disclosure**: Slashes context window consumption by up to **80%** (empirically benchmarked from 3,034 down to 603 tokens) by pulling only atomic, relevant concepts.
* **🔌 Embedded Stdio MCP Server**: Plug-and-play Model Context Protocol server inside the single binary (`okf mcp knowledge`) for Claude Code, Cursor, Windsurf, and custom IDEs.
* **🛡️ 100% Git-Native & Auditable**: Auditable via `git diff`, `git blame`, and standard pull request code reviews.
* **🔒 Trust & Provenance Tiers**: Enforces strict boundaries between authoritative human architectural decisions (`verified: human`) and agent drafts (`generated: agent`).
* **🚀 Instant Bootstrapping**: Scaffolds full project memory in 1 command (`okf bootstrap .`).

---

## 🌐 Ecosystem & Quick Links

| Resource | Description | Link |
| :--- | :--- | :--- |
| **Official Website** | Interactive landing page, benchmarks, and interactive terminal | [okf-memory.dev](https://okf-memory.dev) |
| **Core Engine** | Go implementation, CLI, and embedded MCP server | [okf-memory/okf-agent-memory](https://github.com/okf-memory/okf-agent-memory) |
| **Homebrew Tap** | Official macOS & Linux Homebrew Formula | [okf-memory/homebrew-tap](https://github.com/okf-memory/homebrew-tap) |
| **Latest Release** | Standalone releases, changelog, and tags | [v0.1.0 Release](https://github.com/okf-memory/okf-agent-memory/releases/tag/v0.1.0) |
| **OKF Specification** | Google Cloud Open Knowledge Format v0.2 standard | [Google OKF v0.2 Spec](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md) |
| **Agent Convention** | Behavioral rules, Search-Before-Write, and lifecycle tiers | [Convention v0.1](https://github.com/okf-memory/okf-agent-memory/blob/main/docs/CONVENTION.md) |
| **CLI & MCP Reference** | Command-line interface and tool calling reference | [CLI Documentation](https://github.com/okf-memory/okf-agent-memory/blob/main/docs/CLI.md) |
| **Installation Guide** | Universal setup instructions for macOS and Linux | [Getting Started](https://github.com/okf-memory/okf-agent-memory/blob/main/docs/GETTING_STARTED.md) |

---

## 📦 What’s in this Repository?

This site is built as a zero-build, ultra-fast static web experience optimized for performance, accessibility, and GDPR/DSGVO compliance:

* **`index.html`**: Semantic landing page featuring the interactive terminal simulator, live empirical benchmark comparisons, the 5-layer architectural model, and MCP configurations.
* **`style.css`**: Vanilla CSS design system with custom CSS variables, dark neon glassmorphism aesthetics, responsive grids, and micro-animations without heavy runtime frameworks.
* **`app.js`**: Client-side interactivity including terminal tab switching, syntax highlighting, MCP config copy helpers, model benchmark metrics switcher, and consent management.
* **`install.sh`**: The universal cURL 1-liner installer script served at `https://okf-memory.dev/install.sh`.
* **`assets/`**: Vector brand assets, SVG logo, and high-resolution OpenGraph social preview images.

---

## 📄 License

The website and documentation are licensed under the [MIT License](LICENSE).  
Copyright © 2026 [OKF Agent Memory Contributors](https://github.com/okf-memory).
