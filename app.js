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
    go: 'go install github.com/okf-memory/okf-agent-memory/cmd/okf@v0.1.0',
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
      const wasActive = item.classList.contains('active');

      // Close any other open items
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) other.classList.remove('active');
      });

      // Toggle current item
      if (!wasActive) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
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
      hwDetails: '<strong>Deployment:</strong> Remote Cloud SaaS • <strong>Model:</strong> <code>gpt-5.6-sol</code> • <strong>Primary Benefit:</strong> -80.1% Token Billing &amp; Context Savings (3,034 → 603 tokens)',
      reportUrl: 'https://github.com/okf-memory/okf-agent-memory/blob/main/benchmarks/results/BENCHMARK_RESULTS_openai_gpt-5.6-sol.md',
      tokensVal: '603',
      tokensSub: 'vs. 3,034 tokens (-80.1% cloud token billing reduction)',
      tokensDelta: '-80.1%',
      tokensPct: '19.9%',
      ttftVal: '8,682',
      ttftSub: 'vs. 9,227 ms remote API network & prefill TTFT',
      ttftDelta: '1.1x Faster',
      ttftPct: '94.1%',
      timeVal: '14.9',
      timeSub: 'vs. 15.9 sec full monolith turn (cloud processing)',
      timeDelta: '-1.0s',
      timePct: '93.7%',
      complianceVal: '4/4',
      complianceSub: 'AES-256-GCM • 96-bit Nonce • Headers',
      monoTokens: '3,034 Tokens',
      monoTtft: '9,227 ms',
      okfTokens: '603 Tokens',
      okfTtft: '8,682 ms',
      okfSpeedup: '1.1x faster'
    },
    ministral: {
      envType: 'local',
      hwIcon: '🖥️',
      hwPillText: 'LOCAL MODEL • Apple Silicon Metal GPU',
      hwTitle: 'Apple MacBook Pro • Apple M2 Pro (32 GB Unified Memory)',
      hwDetails: '<strong>Deployment:</strong> Local On-Device (LM Studio Metal Engine) • <strong>Model:</strong> <code>mistralai/ministral-3-14b-reasoning</code> • <strong>Primary Benefit:</strong> 5.2x Faster TTFT / Eliminates 18.3s Prefill Wait Time',
      reportUrl: 'https://github.com/okf-memory/okf-agent-memory/blob/main/benchmarks/results/BENCHMARK_RESULTS_lmstudio_mistralai_ministral-3-14b-reasoning.md',
      tokensVal: '603',
      tokensSub: 'vs. 3,034 tokens in Monolith Dump (-80.1% local KV cache overhead)',
      tokensDelta: '-80.1%',
      tokensPct: '19.9%',
      ttftVal: '3,510',
      ttftSub: 'vs. 18,311 ms local Metal GPU prefill wait time',
      ttftDelta: '5.2x Faster',
      ttftPct: '19.2%',
      timeVal: '73.3',
      timeSub: 'vs. 114.3 sec full monolith turn (local on-device processing)',
      timeDelta: '-41.0s',
      timePct: '64.1%',
      complianceVal: '4/4',
      complianceSub: 'AES-256-GCM • 96-bit Nonce • Headers',
      monoTokens: '3,034 Tokens',
      monoTtft: '18,311 ms',
      okfTokens: '603 Tokens',
      okfTtft: '3,510 ms',
      okfSpeedup: '5.2x faster'
    },
    gemma26b: {
      envType: 'local',
      hwIcon: '🖥️',
      hwPillText: 'LOCAL MODEL • Apple Silicon Metal GPU',
      hwTitle: 'Apple MacBook Pro • Apple M2 Pro (32 GB Unified Memory)',
      hwDetails: '<strong>Deployment:</strong> Local On-Device (LM Studio Metal Engine) • <strong>Model:</strong> <code>google/gemma-4-26b-a4b-qat</code> • <strong>Primary Benefit:</strong> 1.7x Faster TTFT on 26B MoE Architecture',
      reportUrl: 'https://github.com/okf-memory/okf-agent-memory/blob/main/benchmarks/results/BENCHMARK_RESULTS_lmstudio_google_gemma-4-26b-a4b-qat.md',
      tokensVal: '603',
      tokensSub: 'vs. 3,034 tokens in Monolith Dump (-80.1% local KV cache overhead)',
      tokensDelta: '-80.1%',
      tokensPct: '19.9%',
      ttftVal: '20,886',
      ttftSub: 'vs. 36,099 ms local Metal GPU prefill wait time',
      ttftDelta: '1.7x Faster',
      ttftPct: '57.9%',
      timeVal: '53.5',
      timeSub: 'vs. 72.5 sec full monolith turn (local on-device processing)',
      timeDelta: '-19.0s',
      timePct: '73.8%',
      complianceVal: '4/4',
      complianceSub: 'AES-256-GCM • 96-bit Nonce • Headers',
      monoTokens: '3,034 Tokens',
      monoTtft: '36,099 ms',
      okfTokens: '603 Tokens',
      okfTtft: '20,886 ms',
      okfSpeedup: '1.7x faster'
    },
    gemma12b: {
      envType: 'local',
      hwIcon: '🖥️',
      hwPillText: 'LOCAL MODEL • Apple Silicon Metal GPU',
      hwTitle: 'Apple MacBook Pro • Apple M2 Pro (32 GB Unified Memory)',
      hwDetails: '<strong>Deployment:</strong> Local On-Device (LM Studio Metal Engine) • <strong>Model:</strong> <code>google/gemma-4-12b-qat</code> • <strong>Primary Benefit:</strong> 1.4x Faster TTFT on Dense Local Model',
      reportUrl: 'https://github.com/okf-memory/okf-agent-memory/blob/main/benchmarks/results/BENCHMARK_RESULTS_lmstudio_google_gemma-4-12b-qat.md',
      tokensVal: '603',
      tokensSub: 'vs. 3,034 tokens in Monolith Dump (-80.1% local KV cache overhead)',
      tokensDelta: '-80.1%',
      tokensPct: '19.9%',
      ttftVal: '43,938',
      ttftSub: 'vs. 60,254 ms local Metal GPU prefill wait time',
      ttftDelta: '1.4x Faster',
      ttftPct: '72.9%',
      timeVal: '105.9',
      timeSub: 'vs. 120.9 sec full monolith turn (local on-device processing)',
      timeDelta: '-15.0s',
      timePct: '87.6%',
      complianceVal: '4/4',
      complianceSub: 'AES-256-GCM • 96-bit Nonce • Headers',
      monoTokens: '3,034 Tokens',
      monoTtft: '60,254 ms',
      okfTokens: '603 Tokens',
      okfTtft: '43,938 ms',
      okfSpeedup: '1.4x faster'
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

      if (h2hMonoTokens) h2hMonoTokens.textContent = data.monoTokens;
      if (h2hMonoTtft) h2hMonoTtft.textContent = data.monoTtft;
      if (h2hOkfTokens) h2hOkfTokens.textContent = data.okfTokens;
      if (h2hOkfTtft) h2hOkfTtft.textContent = data.okfTtft;
      if (h2hOkfSpeedup) h2hOkfSpeedup.textContent = data.okfSpeedup;
    });
  });
});

