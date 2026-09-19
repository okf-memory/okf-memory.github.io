// ==========================================================================
// OKF Agent Memory — Landing Page Interactions
// Terminal Tabs, Quick Copy, Install Switcher, MCP Configs, FAQ, Brevo Waitlist
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. Quick Copy Helpers
  // ------------------------------------------------------------------------
  function attachCopyHandlers() {
    const copyButtons = document.querySelectorAll('[data-copy]');
    copyButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const textToCopy = btn.getAttribute('data-copy');
        try {
          await navigator.clipboard.writeText(textToCopy);
          const originalHtml = btn.innerHTML;
          btn.innerHTML = `<span style="color: var(--accent-emerald);">✓ Copied to clipboard</span>`;
          setTimeout(() => {
            btn.innerHTML = originalHtml;
          }, 2000);
        } catch (err) {
          console.error('Failed to copy text: ', err);
        }
      });
    });
  }
  attachCopyHandlers();

  // ------------------------------------------------------------------------
  // 2. Hero Install Switcher Tabs
  // ------------------------------------------------------------------------
  const installCommands = {
    curl: 'curl -fsSL https://okf-memory.dev/install.sh | sh',
    go: 'go install github.com/okf-memory/okf-agent-memory/cmd/okf@v0.4.1',
    source: 'git clone https://github.com/okf-memory/okf-agent-memory.git && cd okf-agent-memory && make build',
    brew: 'brew install okf-memory/tap/okf'
  };

  const installTabBtns = document.querySelectorAll('.install-tab-btn');
  const heroInstallPill = document.getElementById('hero-install-pill');
  const heroInstallCmd = document.getElementById('hero-install-cmd');

  installTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      installTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const installKey = btn.getAttribute('data-install');
      const cmd = installCommands[installKey] || installCommands.curl;

      if (heroInstallCmd && heroInstallPill) {
        heroInstallCmd.textContent = `$ ${cmd}`;
        heroInstallPill.setAttribute('data-copy', cmd);
      }
    });
  });

  // ------------------------------------------------------------------------
  // 3. Interactive Terminal Command Runner
  // ------------------------------------------------------------------------
  const terminalCommands = {
    search: `<span class="term-cmd">$ okf search "jwt auth flow" knowledge</span>\n\nFound 1 matching concept(s) in 'knowledge':\n\n 1. <span class="term-purple">[4.82]</span> <span class="term-green">architecture/auth-decision</span> (<span class="term-yellow">Decision</span>)\n    <span class="term-dim">Standardized RSA-256 JWTs with 15m expiration & sliding refresh tokens.</span>\n    Matches: <span class="term-green">title, description, tags</span>\n\n<span class="term-stat">⚡ In-Memory BM25 search completed in 268.4µs (&lt;0.3ms)</span>`,
    bootstrap: `<span class="term-cmd">$ okf bootstrap .</span>\n\n<span class="term-green">Successfully bootstrapped OKF Agent Memory in '.'!</span>\nCreated:\n  <span class="term-green">✔</span> knowledge/ (index.md, log.md)\n  <span class="term-green">✔</span> .agents/skills/okf-memory/ (SKILL.md)\n  <span class="term-green">✔</span> AGENTS.md (progressive disclosure directives)\n  <span class="term-green">✔</span> Makefile (shortcuts: validate, search, mcp)\n\n<span class="term-stat">⚡ Zero external dependencies • Instant startup (&lt;4ms)</span>`,
    validate: `<span class="term-cmd">$ okf validate knowledge --strict --drift</span>\n\nOKF v0.2 check of "knowledge" (v0.2): 8 concept(s), 0 error(s), 0 warning(s); 0 broken link(s), 0 orphan(s), 0 stale [--strict].\n\n<span class="term-green">✔ Conformant: 100% OKF v0.2 Strict Validated (4.2ms)</span>`,
    concept: `<span class="term-dim"># File: knowledge/architecture/auth-decision.md</span>\n---\nokf_version: <span class="term-yellow">"0.2"</span>\ntype: <span class="term-yellow">Decision</span>\ntitle: JWT Authentication & Refresh Token Strategy\ndescription: Standardized RSA-256 JWTs with 15m expiration & sliding refresh tokens.\ntags: [<span class="term-purple">auth</span>, <span class="term-purple">security</span>, <span class="term-purple">adr</span>]\nverified: { by: <span class="term-green">"human:lead@okf-memory.dev"</span>, at: <span class="term-dim">"2026-09-01T10:00:00Z"</span> }\nstatus: <span class="term-green">stable</span>\n---\n\n# JWT Authentication & Refresh Token Strategy\n\nWe standardized on RSA-256 JWTs stored in secure httpOnly cookies.\nSliding refresh token rotation prevents token theft.\n\n## Related Concepts\n* <span class="term-green">[Tooling & Architecture Layers](layers.md)</span> — Tooling architecture\n* <span class="term-green">[Trust Tiers & Principles](../convention/principles.md)</span> — Verification tiers`
  };

  const termTabs = document.querySelectorAll('.term-tab');
  const termContent = document.getElementById('terminal-code-output');

  termTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      termTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cmdKey = tab.getAttribute('data-cmd');
      if (termContent && terminalCommands[cmdKey]) {
        termContent.innerHTML = terminalCommands[cmdKey];
      }
    });
  });

  // ------------------------------------------------------------------------
  // 4. Interactive MCP Config Tabs & Copy
  // ------------------------------------------------------------------------
  const mcpConfigs = {
    claude: `{\n  "mcpServers": {\n    "okf-memory": {\n      "command": "okf",\n      "args": ["mcp", "knowledge"]\n    }\n  }\n}`,
    cursor: `// .cursor/mcp.json\n{\n  "mcpServers": {\n    "okf-memory": {\n      "command": "okf",\n      "args": ["mcp", "knowledge"]\n    }\n  }\n}`,
    windsurf: `// mcp_config.json\n{\n  "mcpServers": {\n    "okf-memory": {\n      "command": "okf",\n      "args": ["mcp", "knowledge"]\n    }\n  }\n}`,
    cli: `# AGENTS.md Direct Operating Directives\n- Always search memory before writing: \`okf search "<query>"\`\n- Fetch full concept details: \`okf show <concept-id>\`\n- Author verified architectural decisions: \`okf create <id> --type Decision --title "<Title>" --desc "<Desc>"\`\n- Conformance and link-drift validation: \`okf validate --strict --drift\``
  };

  const mcpTabBtns = document.querySelectorAll('.mcp-tab-btn');
  const mcpCodeDisplay = document.getElementById('mcp-code-display');
  const mcpCopyTrigger = document.getElementById('mcp-copy-trigger');

  let currentMcpKey = 'claude';

  mcpTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      mcpTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMcpKey = btn.getAttribute('data-mcp');
      if (mcpCodeDisplay && mcpConfigs[currentMcpKey]) {
        mcpCodeDisplay.textContent = mcpConfigs[currentMcpKey];
      }
    });
  });

  if (mcpCopyTrigger) {
    mcpCopyTrigger.addEventListener('click', async () => {
      const codeToCopy = mcpConfigs[currentMcpKey] || mcpConfigs.claude;
      try {
        await navigator.clipboard.writeText(codeToCopy);
        const originalText = mcpCopyTrigger.innerHTML;
        mcpCopyTrigger.innerHTML = `✓ Copied`;
        setTimeout(() => {
          mcpCopyTrigger.innerHTML = originalText;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy MCP config: ', err);
      }
    });
  }

  // ------------------------------------------------------------------------
  // 5. FAQ Accordion Toggle
  // ------------------------------------------------------------------------
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const content = item ? item.querySelector('.faq-content') : null;
      const wasActive = item.classList.contains('active');

      // Close any other open items and reset their max-height
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherContent = other.querySelector('.faq-content');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (!wasActive) {
        item.classList.add('active');
        if (content) {
          content.style.maxHeight = (content.scrollHeight + 40) + 'px';
        }
      } else {
        item.classList.remove('active');
        if (content) {
          content.style.maxHeight = null;
        }
      }
    });
  });

  // Recompute active FAQ height on window resize (e.g. mobile orientation change)
  window.addEventListener('resize', () => {
    const activeItem = document.querySelector('.faq-item.active');
    if (activeItem) {
      const activeContent = activeItem.querySelector('.faq-content');
      if (activeContent) {
        activeContent.style.maxHeight = (activeContent.scrollHeight + 40) + 'px';
      }
    }
  });

  // ------------------------------------------------------------------------
  // 6. Brevo Waitlist Form Submission
  // ------------------------------------------------------------------------
  const waitlistForm = document.getElementById('waitlist-form');
  const waitlistFeedback = document.getElementById('waitlist-feedback');

  if (waitlistForm) {
    waitlistForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('waitlist-email');
      const consentCheckbox = document.getElementById('waitlist-consent');
      const email = emailInput ? emailInput.value.trim() : '';

      if (!email || !email.includes('@')) {
        showFeedback('Please enter a valid work email address.', 'error');
        return;
      }

      if (consentCheckbox && !consentCheckbox.checked) {
        showFeedback('Please accept the email consent to join the waitlist.', 'error');
        return;
      }

      // Check for optional configured Brevo Form endpoint
      const brevoAction = waitlistForm.getAttribute('data-brevo-action');

      if (brevoAction) {
        try {
          const formData = new FormData();
          formData.append('EMAIL', email);
          formData.append('email_address_check', '');
          formData.append('locale', 'en');

          await fetch(brevoAction, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
          });
        } catch (err) {
          console.warn('Brevo remote sync failed, keeping local fallback: ', err);
        }
      }

      // Store in local backup so leads are never lost
      const existingLeads = JSON.parse(localStorage.getItem('okf_waitlist_leads') || '[]');
      existingLeads.push({
        email,
        consent: true,
        provider: 'brevo',
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('okf_waitlist_leads', JSON.stringify(existingLeads));

      if (emailInput) emailInput.value = '';
      showFeedback('🎉 You are on the VIP waitlist! We will notify you when OKF Cloud Private Beta launches.', 'success');

      // Trigger GA4 conversion event
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'Waitlist',
          event_label: 'OKF Cloud Beta',
          method: 'Brevo'
        });
      }
    });
  }

  function showFeedback(message, type) {
    if (!waitlistFeedback) return;
    waitlistFeedback.textContent = message;
    waitlistFeedback.style.display = 'block';
    waitlistFeedback.style.color = type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-rose)';
    waitlistFeedback.style.marginTop = '14px';
    waitlistFeedback.style.fontSize = '0.95rem';
    waitlistFeedback.style.fontWeight = '500';
  }

  // ------------------------------------------------------------------------
  // 7. DSGVO / GDPR Cookie Consent Manager (Google Consent Mode v2)
  // ------------------------------------------------------------------------
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieBtnAccept = document.getElementById('cookie-btn-accept');
  const cookieBtnReject = document.getElementById('cookie-btn-reject');
  const cookieSettingsBtn = document.getElementById('cookie-settings-btn');

  function openCookieBanner() {
    if (!cookieBanner) return;
    cookieBanner.style.display = 'block';
    // Trigger transition next tick
    requestAnimationFrame(() => {
      cookieBanner.classList.add('show');
    });
  }

  function closeCookieBanner() {
    if (!cookieBanner) return;
    cookieBanner.classList.remove('show');
    setTimeout(() => {
      if (!cookieBanner.classList.contains('show')) {
        cookieBanner.style.display = 'none';
      }
    }, 350);
  }

  // Show banner if no consent preference is stored
  const existingConsent = localStorage.getItem('okf_cookie_consent');
  if (!existingConsent) {
    setTimeout(openCookieBanner, 600);
  }

  if (cookieBtnAccept) {
    cookieBtnAccept.addEventListener('click', () => {
      localStorage.setItem('okf_cookie_consent', 'granted');
      if (typeof gtag === 'function') {
        gtag('consent', 'update', {
          'analytics_storage': 'granted'
        });
        gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href
        });
      }
      closeCookieBanner();
    });
  }

  if (cookieBtnReject) {
    cookieBtnReject.addEventListener('click', () => {
      localStorage.setItem('okf_cookie_consent', 'denied');
      if (typeof gtag === 'function') {
        gtag('consent', 'update', {
          'analytics_storage': 'denied'
        });
      }
      closeCookieBanner();
    });
  }

  if (cookieSettingsBtn) {
    cookieSettingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCookieBanner();
    });
  }

  // ------------------------------------------------------------------------
  // 8. Empirical Benchmark Model Switcher
  // ------------------------------------------------------------------------
  const benchmarkRuns = {
    openai: {
      envType: 'cloud',
      hwIcon: '☁️',
      hwPillText: 'REMOTE MODEL • Official OpenAI Cloud API',
      hwTitle: 'OpenAI Production Cloud • api.openai.com',
      hwDetails: '<strong>Deployment:</strong> Remote Cloud SaaS • <strong>Model:</strong> <code>gpt-5.6-sol</code> • <strong>Primary Benefit:</strong> 2.4x Faster TTFT &amp; -75.7% Prompt Context Overhead (3,771 → 917 tokens)',
      reportUrl: 'https://github.com/okf-memory/okf-agent-memory/blob/main/benchmarks/results/BENCHMARK_RESULTS_DMAA_openai_gpt-5.6-sol.md',
      tokensVal: '917',
      tokensSub: 'vs. 3,771 tokens in Monolith Dump (-75.7% prompt context tax)',
      tokensDelta: '-75.7%',
      tokensPct: '24.3%',
      ttftVal: '11,565',
      ttftSub: 'vs. 27,213 ms remote cloud TTFT prefill latency',
      ttftDelta: '2.4x Faster',
      ttftPct: '42.5%',
      timeVal: '43.0',
      timeSub: 'vs. 84.9 sec full monolith turn (2.0x faster completion)',
      timeDelta: '-41.9s',
      timePct: '50.7%',
      complianceVal: '9/9',
      complianceSub: 'AES-256-GCM • 96-bit Nonce • AAG Directives • Provenance',
      complianceDelta: '100% PASS',
      monoTokens: '3,771 Tokens',
      monoTtft: '27,213 ms',
      okfTokens: '917 Tokens',
      okfTtft: '11,565 ms',
      okfSpeedup: '2.4x faster'
    },
    claude: {
      envType: 'cloud',
      hwIcon: '☁️',
      hwPillText: 'REMOTE MODEL • Official Anthropic API',
      hwTitle: 'Anthropic Production API • api.anthropic.com',
      hwDetails: '<strong>Deployment:</strong> Remote Cloud SaaS • <strong>Model:</strong> <code>claude-opus-5</code> • <strong>Primary Benefit:</strong> +44.4% Reliability (9/9 vs. 5/9 Monolith Failure / Lost-in-the-Middle prevented)',
      reportUrl: 'https://github.com/okf-memory/okf-agent-memory/blob/main/benchmarks/results/BENCHMARK_RESULTS_DMAA_anthropic_claude-opus-5.md',
      tokensVal: '917',
      tokensSub: 'vs. 3,771 tokens in Monolith Dump (-75.7% prompt context tax)',
      tokensDelta: '-75.7%',
      tokensPct: '24.3%',
      ttftVal: '7,876',
      ttftSub: 'vs. 7,318 ms remote cloud TTFT latency',
      ttftDelta: '0.9x (Parity)',
      ttftPct: '100%',
      timeVal: '84.8',
      timeSub: 'vs. 65.1 sec full turn duration (exhaustive implementation)',
      timeDelta: '+19.7s',
      timePct: '100%',
      complianceVal: '9/9',
      complianceSub: '9/9 (100%) vs. 5/9 (55.6%) Monolith Failure (Lost-in-the-Middle eliminated)',
      complianceDelta: '+44.4% RELIABILITY',
      monoTokens: '3,771 Tokens',
      monoTtft: '7,318 ms',
      okfTokens: '917 Tokens',
      okfTtft: '7,876 ms',
      okfSpeedup: '0.9x (Parity)'
    },
    qwen14b: {
      envType: 'local',
      hwIcon: '🖥️',
      hwPillText: 'LOCAL MODEL • Apple Silicon Metal GPU',
      hwTitle: 'Apple MacBook Pro • Apple M2 Pro (32 GB Unified Memory)',
      hwDetails: '<strong>Deployment:</strong> Local On-Device (LM Studio Metal Engine) • <strong>Model:</strong> <code>qwen/qwen2.5-coder-14b</code> • <strong>Primary Benefit:</strong> 3.7x Faster TTFT / Eliminates 7.8s Prefill Wait Time &amp; 100% Deterministic',
      reportUrl: 'https://github.com/okf-memory/okf-agent-memory/blob/main/benchmarks/results/BENCHMARK_RESULTS_DMAA_lmstudio_qwen_qwen2.5-coder-14b.md',
      tokensVal: '917',
      tokensSub: 'vs. 3,771 tokens in Monolith Dump (-75.7% prompt context tax)',
      tokensDelta: '-75.7%',
      tokensPct: '24.3%',
      ttftVal: '2,882',
      ttftSub: 'vs. 10,647 ms local Metal GPU prefill wait time',
      ttftDelta: '3.7x Faster',
      ttftPct: '27.1%',
      timeVal: '55.8',
      timeSub: 'vs. 78.6 sec full monolith turn (local on-device processing)',
      timeDelta: '-22.8s',
      timePct: '71.0%',
      complianceVal: '9/9',
      complianceSub: '9/9 (100%) vs. 8/9 (88.9%) Monolith Failure • AES-256-GCM • Nonce • AAG',
      complianceDelta: '+11.1% RELIABILITY',
      monoTokens: '3,771 Tokens',
      monoTtft: '10,647 ms',
      okfTokens: '917 Tokens',
      okfTtft: '2,882 ms',
      okfSpeedup: '3.7x faster'
    },
    gemma26b: {
      envType: 'local',
      hwIcon: '🖥️',
      hwPillText: 'LOCAL MODEL • Apple Silicon Metal GPU',
      hwTitle: 'Apple MacBook Pro • Apple M2 Pro (32 GB Unified Memory)',
      hwDetails: '<strong>Deployment:</strong> Local On-Device (LM Studio Metal Engine) • <strong>Model:</strong> <code>google/gemma-4-26b-a4b-qat</code> • <strong>Primary Benefit:</strong> 3.1x Faster TTFT on 26B MoE Architecture',
      reportUrl: 'https://github.com/okf-memory/okf-agent-memory/blob/main/benchmarks/results/BENCHMARK_RESULTS_DMAA_lmstudio_google_gemma-4-26b-a4b-qat.md',
      tokensVal: '917',
      tokensSub: 'vs. 3,771 tokens in Monolith Dump (-75.7% local KV cache overhead)',
      tokensDelta: '-75.7%',
      tokensPct: '24.3%',
      ttftVal: '2,396',
      ttftSub: 'vs. 7,514 ms local Metal GPU prefill wait time',
      ttftDelta: '3.1x Faster',
      ttftPct: '31.9%',
      timeVal: '125.9',
      timeSub: 'vs. 156.3 sec full monolith turn (local on-device processing)',
      timeDelta: '-30.4s',
      timePct: '80.6%',
      complianceVal: '9/9',
      complianceSub: 'AES-256-GCM • 96-bit Nonce • AAG Directives • Provenance',
      complianceDelta: '100% PASS',
      monoTokens: '3,771 Tokens',
      monoTtft: '7,514 ms',
      okfTokens: '917 Tokens',
      okfTtft: '2,396 ms',
      okfSpeedup: '3.1x faster'
    },
    qwen30b: {
      envType: 'local',
      hwIcon: '🖥️',
      hwPillText: 'LOCAL MODEL • Apple Silicon Metal GPU',
      hwTitle: 'Apple MacBook Pro • Apple M2 Pro (32 GB Unified Memory)',
      hwDetails: '<strong>Deployment:</strong> Local On-Device (LM Studio Metal Engine) • <strong>Model:</strong> <code>qwen/qwen3-coder-30b</code> • <strong>Primary Benefit:</strong> 3.1x Faster TTFT &amp; 1.6x Faster Turn Completion on 30B Dense Model',
      reportUrl: 'https://github.com/okf-memory/okf-agent-memory/blob/main/benchmarks/results/BENCHMARK_RESULTS_DMAA_lmstudio_qwen_qwen3-coder-30b.md',
      tokensVal: '917',
      tokensSub: 'vs. 3,771 tokens in Monolith Dump (-75.7% local KV cache overhead)',
      tokensDelta: '-75.7%',
      tokensPct: '24.3%',
      ttftVal: '1,961',
      ttftSub: 'vs. 6,151 ms local Metal GPU prefill wait time',
      ttftDelta: '3.1x Faster',
      ttftPct: '31.9%',
      timeVal: '34.5',
      timeSub: 'vs. 56.5 sec full monolith turn (1.6x faster completion)',
      timeDelta: '-22.0s',
      timePct: '61.0%',
      complianceVal: '9/9',
      complianceSub: 'AES-256-GCM • 96-bit Nonce • AAG Directives • Provenance',
      complianceDelta: '100% PASS',
      monoTokens: '3,771 Tokens',
      monoTtft: '6,151 ms',
      okfTokens: '917 Tokens',
      okfTtft: '1,961 ms',
      okfSpeedup: '3.1x faster'
    }
  };

  const modelTabBtns = document.querySelectorAll('.model-tab-btn');
  const metricTokensVal = document.getElementById('metric-tokens-val');
  const metricTokensSub = document.getElementById('metric-tokens-sub');
  const metricDeltaTokens = document.getElementById('metric-delta-tokens');
  const tokensFill = document.querySelector('.tokens-fill');

  const metricTtftVal = document.getElementById('metric-ttft-val');
  const metricTtftSub = document.getElementById('metric-ttft-sub');
  const metricDeltaTtft = document.getElementById('metric-delta-ttft');
  const ttftFill = document.querySelector('.ttft-fill');

  const metricTimeVal = document.getElementById('metric-time-val');
  const metricTimeSub = document.getElementById('metric-time-sub');
  const metricDeltaTime = document.getElementById('metric-delta-time');
  const timeFill = document.querySelector('.time-fill');

  const metricComplianceVal = document.getElementById('metric-compliance-val');
  const metricComplianceSub = document.getElementById('metric-compliance-sub');
  const metricDeltaCompliance = document.getElementById('metric-delta-compliance');

  const h2hMonoTokens = document.getElementById('h2h-mono-tokens');
  const h2hMonoTtft = document.getElementById('h2h-mono-ttft');
  const h2hOkfTokens = document.getElementById('h2h-okf-tokens');
  const h2hOkfTtft = document.getElementById('h2h-okf-ttft');
  const h2hOkfSpeedup = document.getElementById('h2h-okf-speedup');

  const hwPill = document.getElementById('hw-pill');
  const hwDot = document.getElementById('hw-dot');
  const hwIcon = document.getElementById('hw-icon');
  const hwPillText = document.getElementById('hw-pill-text');
  const hwMachineTitle = document.getElementById('hw-machine-title');
  const hwMachineDetails = document.getElementById('hw-machine-details');
  const hwReportLink = document.getElementById('hw-report-link');

  modelTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modelTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const modelKey = btn.getAttribute('data-model');
      const data = benchmarkRuns[modelKey];
      if (!data) return;

      if (hwIcon && data.hwIcon) hwIcon.textContent = data.hwIcon;
      if (hwPillText && data.hwPillText) hwPillText.textContent = data.hwPillText;
      if (hwMachineTitle && data.hwTitle) hwMachineTitle.textContent = data.hwTitle;
      if (hwMachineDetails && data.hwDetails) hwMachineDetails.innerHTML = data.hwDetails;
      if (hwReportLink && data.reportUrl) hwReportLink.href = data.reportUrl;

      if (hwPill && data.envType) {
        if (data.envType === 'cloud') {
          hwPill.classList.add('hw-pill-cloud');
          hwPill.classList.remove('hw-pill-local');
          if (hwDot) {
            hwDot.classList.add('cloud-dot');
            hwDot.classList.remove('local-dot');
          }
        } else {
          hwPill.classList.add('hw-pill-local');
          hwPill.classList.remove('hw-pill-cloud');
          if (hwDot) {
            hwDot.classList.add('local-dot');
            hwDot.classList.remove('cloud-dot');
          }
        }
      }

      if (metricTokensVal) metricTokensVal.innerHTML = `${data.tokensVal} <span class="unit">tokens</span>`;
      if (metricTokensSub) metricTokensSub.textContent = data.tokensSub;
      if (metricDeltaTokens) metricDeltaTokens.textContent = data.tokensDelta;
      if (tokensFill) tokensFill.style.width = data.tokensPct;

      if (metricTtftVal) metricTtftVal.innerHTML = `${data.ttftVal} <span class="unit">ms</span>`;
      if (metricTtftSub) metricTtftSub.textContent = data.ttftSub;
      if (metricDeltaTtft) metricDeltaTtft.textContent = data.ttftDelta;
      if (ttftFill) ttftFill.style.width = data.ttftPct;

      if (metricTimeVal) metricTimeVal.innerHTML = `${data.timeVal} <span class="unit">sec</span>`;
      if (metricTimeSub) metricTimeSub.textContent = data.timeSub;
      if (metricDeltaTime) metricDeltaTime.textContent = data.timeDelta;
      if (timeFill) timeFill.style.width = data.timePct;

      if (metricComplianceVal && data.complianceVal) metricComplianceVal.innerHTML = `${data.complianceVal} <span class="unit">checks</span>`;
      if (metricComplianceSub && data.complianceSub) metricComplianceSub.textContent = data.complianceSub;
      if (metricDeltaCompliance && data.complianceDelta) metricDeltaCompliance.textContent = data.complianceDelta;


      if (h2hMonoTokens) h2hMonoTokens.textContent = data.monoTokens;
      if (h2hMonoTtft) h2hMonoTtft.textContent = data.monoTtft;
      if (h2hOkfTokens) h2hOkfTokens.textContent = data.okfTokens;
      if (h2hOkfTtft) h2hOkfTtft.textContent = data.okfTtft;
      if (h2hOkfSpeedup) h2hOkfSpeedup.textContent = data.okfSpeedup;
    });
  });
});

