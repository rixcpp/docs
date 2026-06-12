<script setup>
import CodeBlock from "./CodeBlock.vue";

const heroCode = `#include <rix.hpp>

int main(){
  auto auth = rix.auth.memory();
  auto user = auth.register_user({"ada@example.com","password"});
  if (user.failed()){
    rix.debug.eprint("auth failed");
    return 1;
  }

  auto login = auth.login({"ada@example.com", "password"});
  if (login.ok()){
    rix.debug.print("signed in:", login.value().user.email());
  }

  return 0;
}`;

const features = [
  {
    title: "Unified facade",
    desc: "One clean rix.* entry point for the userland packages you install.",
    icon: "facade",
    href: "/guides/facade",
    tag: "API",
  },
  {
    title: "Independent packages",
    desc: "Use csv, debug, auth, pdf, and future packages without pulling the full layer.",
    icon: "packages",
    href: "/packages/",
    tag: "Packages",
  },
  {
    title: "Built on Vix.cpp",
    desc: "Rix does not replace Vix. It adds application-level libraries on top of it.",
    icon: "runtime",
    href: "/guides/rix-and-vix",
    tag: "Vix",
  },
  {
    title: "Stable naming",
    desc: "Every package follows the same model: @rix/name, <rix/name.hpp>, rix.name.",
    icon: "naming",
    href: "/guides/package-rules",
    tag: "Design",
  },
];

function iconPath(name) {
  if (name === "facade") {
    return "M5 7h14M5 12h14M5 17h14";
  }

  if (name === "packages") {
    return "M4 7l8-4 8 4-8 4-8-4zm0 5l8 4 8-4M4 17l8 4 8-4";
  }

  if (name === "runtime") {
    return "M12 3v4m0 10v4M3 12h4m10 0h4M6.3 6.3l2.8 2.8m5.8 5.8 2.8 2.8m0-11.4-2.8 2.8m-5.8 5.8-2.8 2.8";
  }

  return "M6 7h12M6 12h12M6 17h8";
}
</script>

<template>
  <div class="rdh">
    <div class="rdh-left">
      <div class="rdh-eyebrow">
        <span class="rdh-logo" aria-hidden="true">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="rdh-logo-bg" cx="50%" cy="42%" r="70%">
                <stop offset="0%" stop-color="#141922" />
                <stop offset="58%" stop-color="#080B10" />
                <stop offset="100%" stop-color="#030509" />
              </radialGradient>

              <linearGradient
                id="rdh-logo-white"
                x1="18"
                y1="17"
                x2="47"
                y2="48"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="100%" stop-color="#e9eef5" />
              </linearGradient>

              <linearGradient
                id="rdh-logo-blue"
                x1="28"
                y1="24"
                x2="37"
                y2="33"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stop-color="#1684ff" />
                <stop offset="100%" stop-color="#0061ff" />
              </linearGradient>
            </defs>

            <rect width="64" height="64" rx="16" fill="url(#rdh-logo-bg)" />

            <g
              stroke="url(#rdh-logo-white)"
              stroke-width="5.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M23 21H36.5C43 21 48 25.8 48 32.2C48 36.4 45.8 40 42.4 42.2"
              />
              <path d="M21.5 37L40.5 46.2" />
              <path d="M18 45L28.5 50" />
            </g>

            <circle cx="32.3" cy="30.8" r="4.2" fill="url(#rdh-logo-blue)" />
          </svg>
        </span>

        <span class="rdh-badge">Rix</span>
        <span class="rdh-sep">·</span>
        <span>Official Vix.cpp userland packages</span>
      </div>

      <h1 class="rdh-h1">
        The userland layer<br class="rdh-br" />
        for Vix.cpp projects.
      </h1>

      <p class="rdh-lead">
        Rix brings application-level packages to Vix.cpp: utilities,
        authentication, documents, data tools, developer helpers, and more. Vix
        stays focused on the runtime, CLI, build workflow, registry, and core
        foundations.
      </p>
      <div class="rdh-actions">
        <a class="rdh-btn rdh-btn--primary" href="/guides/getting-started">
          Start with Rix
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>

        <a
          class="rdh-btn rdh-btn--ghost"
          href="https://registry.vixcpp.com/browse"
          target="_blank"
          rel="noreferrer"
        >
          Browse packages
        </a>
      </div>

      <div class="rdh-model">
        <div class="rdh-model-item">
          <span class="rdh-model-k">Vix</span>
          <span class="rdh-model-v">runtime, CLI, build workflow</span>
        </div>

        <div class="rdh-model-arrow">→</div>

        <div class="rdh-model-item">
          <span class="rdh-model-k">Rix</span>
          <span class="rdh-model-v">userland libraries and facade</span>
        </div>

        <div class="rdh-model-arrow">→</div>

        <div class="rdh-model-item">
          <span class="rdh-model-k">Registry</span>
          <span class="rdh-model-v">package metadata and versions</span>
        </div>
      </div>
    </div>

    <div class="rdh-right">
      <CodeBlock
        title="main.cpp"
        lang="cpp"
        :chips="['rix', 'csv', 'debug', 'pdf']"
        :code="heroCode"
        :maxHeight="480"
      />

      <div class="rdh-terminal">
        <div class="rdh-terminal-line">
          <span class="rdh-run-prompt">$</span>
          <span class="rdh-run-cmd">vix add @rix/rix</span>
        </div>

        <div class="rdh-terminal-line">
          <span class="rdh-run-prompt">$</span>
          <span class="rdh-run-cmd">vix install</span>
        </div>

        <div class="rdh-terminal-line">
          <span class="rdh-run-prompt">$</span>
          <span class="rdh-run-cmd">vix run main.cpp</span>
        </div>
      </div>
    </div>
  </div>

  <div class="rdh-cards">
    <a v-for="f in features" :key="f.title" class="rdh-card" :href="f.href">
      <div class="rdh-card-top">
        <div class="rdh-card-icon">
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
            <path
              :d="iconPath(f.icon)"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <span class="rdh-card-tag">{{ f.tag }}</span>
      </div>

      <div class="rdh-card-title">{{ f.title }}</div>
      <div class="rdh-card-desc">{{ f.desc }}</div>

      <div class="rdh-card-arrow">
        <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </a>
  </div>
</template>

<style scoped>
.rdh {
  --accent: #0061ff;
  --accent-light: #1684ff;
  --accent-soft: rgba(0, 97, 255, 0.12);
  --accent-border: rgba(0, 97, 255, 0.28);

  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(380px, 0.92fr);
  gap: 56px;
  align-items: start;
  padding: 24px 0 42px;
}

.rdh-left {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.rdh-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  color: var(--vp-c-text-2);
  font-size: 12.5px;
  font-weight: 650;
}

.rdh-logo {
  display: inline-flex;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.rdh-logo svg {
  width: 24px;
  height: 24px;
  display: block;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.25));
}

.rdh-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 999px;
  color: var(--accent-light);
  background: var(--accent-soft);
  border: 1px solid var(--accent-border);
  font-size: 11.5px;
  font-weight: 800;
}

.rdh-sep {
  color: var(--vp-c-divider);
}

.rdh-h1 {
  margin: 0 0 18px;
  color: var(--vp-c-text-1);
  font-size: clamp(2.15rem, 4.2vw, 3.35rem);
  line-height: 1.02;
  letter-spacing: -0.045em;
  font-weight: 920;
}

.rdh-br {
  display: block;
}

.rdh-lead {
  max-width: 54ch;
  margin: 0 0 26px;
  color: var(--vp-c-text-2);
  font-size: 15.8px;
  line-height: 1.75;
}

.rdh-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.rdh-btn {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 9px 16px;
  border-radius: 11px;
  font-size: 13.5px;
  font-weight: 820;
  line-height: 1;
  text-decoration: none !important;
  transition:
    background 0.14s ease,
    color 0.14s ease,
    border-color 0.14s ease,
    transform 0.14s ease,
    box-shadow 0.14s ease;
}

.rdh-btn--primary {
  color: #ffffff !important;
  background: linear-gradient(180deg, var(--accent-light), var(--accent));
  border: 1px solid rgba(22, 132, 255, 0.45);
  box-shadow: 0 14px 34px rgba(0, 97, 255, 0.28);
}

.rdh-btn--primary:hover {
  color: #ffffff !important;
  transform: translateY(-1px);
  box-shadow: 0 18px 42px rgba(0, 97, 255, 0.36);
}

.rdh-btn--ghost {
  color: var(--vp-c-text-1) !important;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.rdh-btn--ghost:hover {
  color: var(--accent-light) !important;
  background: var(--accent-soft);
  border-color: var(--accent-border);
  transform: translateY(-1px);
}

.rdh-model {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: stretch;
  gap: 10px;
  max-width: 760px;
}

.rdh-model-item {
  min-width: 0;
  padding: 12px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent),
    var(--vp-c-bg-soft);
}

.rdh-model-k {
  display: block;
  margin-bottom: 4px;
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 860;
  letter-spacing: -0.02em;
}

.rdh-model-v {
  display: block;
  color: var(--vp-c-text-2);
  font-size: 11.5px;
  line-height: 1.45;
  font-weight: 560;
}

.rdh-model-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-light);
  font-weight: 900;
  opacity: 0.9;
}

.rdh-right {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.rdh-code-label {
  color: var(--vp-c-text-2);
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.rdh-run {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 10px 14px;
  border-radius: 11px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  font-family:
    "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    monospace;
  font-size: 13px;
}

.rdh-run-prompt {
  color: var(--accent-light);
  font-weight: 900;
}

.rdh-run-cmd {
  min-width: 0;
  color: var(--vp-c-text-1);
  font-weight: 760;
  white-space: nowrap;
}

.rdh-run-comment {
  margin-left: auto;
  color: var(--vp-c-text-2);
  font-size: 12px;
  white-space: nowrap;
}

.rdh-cards {
  --accent: #0061ff;
  --accent-light: #1684ff;
  --accent-soft: rgba(0, 97, 255, 0.12);
  --accent-border: rgba(0, 97, 255, 0.28);

  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  padding-bottom: 8px;
}

.rdh-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent), transparent;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition:
    border-color 0.14s ease,
    transform 0.14s ease,
    background 0.14s ease;
}

.rdh-card:hover {
  border-color: var(--accent-border);
  background: var(--accent-soft);
  transform: translateY(-2px);
  text-decoration: none;
}

.rdh-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.rdh-card-icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  transition:
    border-color 0.14s ease,
    color 0.14s ease,
    background 0.14s ease;
}

.rdh-card:hover .rdh-card-icon {
  color: var(--accent-light);
  border-color: var(--accent-border);
  background: rgba(0, 97, 255, 0.08);
}

.rdh-card-tag {
  padding: 2px 8px;
  border-radius: 999px;
  color: var(--accent-light);
  background: var(--accent-soft);
  border: 1px solid var(--accent-border);
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 0.14s ease;
}

.rdh-card:hover .rdh-card-tag {
  opacity: 1;
}

.rdh-card-title {
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 850;
  line-height: 1.25;
}

.rdh-card-desc {
  flex: 1;
  color: var(--vp-c-text-2);
  font-size: 12.5px;
  line-height: 1.6;
}

.rdh-card-arrow {
  display: flex;
  align-items: center;
  color: var(--vp-c-text-2);
  opacity: 0;
  transform: translateX(-4px);
  transition:
    opacity 0.14s ease,
    transform 0.14s ease,
    color 0.14s ease;
}

.rdh-card:hover .rdh-card-arrow {
  opacity: 1;
  transform: translateX(0);
  color: var(--accent-light);
}

@media (max-width: 1100px) {
  .rdh {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .rdh-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 960px) {
  .rdh {
    padding-top: 12px;
  }

  .rdh-h1 {
    font-size: 2.25rem;
  }

  .rdh-br {
    display: none;
  }

  .rdh-lead {
    max-width: 100%;
  }

  .rdh-run-comment {
    display: none;
  }
}

@media (max-width: 720px) {
  .rdh-model {
    grid-template-columns: 1fr;
  }

  .rdh-model-arrow {
    display: none;
  }
}

@media (max-width: 640px) {
  .rdh {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }

  .rdh-left,
  .rdh-right {
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }

  .rdh-h1 {
    font-size: 1.9rem;
  }

  .rdh-lead {
    font-size: 14.5px;
  }

  .rdh-cards {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .rdh-card-tag,
  .rdh-card-arrow {
    opacity: 1;
  }

  .rdh-card-arrow {
    transform: translateX(0);
  }

  .rdh-right :deep(.code-block),
  .rdh-right :deep(.vix-code-block),
  .rdh-right :deep(pre),
  .rdh-right :deep(code) {
    max-width: 100%;
    min-width: 0;
  }

  .rdh-right :deep(pre) {
    overflow-x: auto;
  }

  .rdh-run {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>
