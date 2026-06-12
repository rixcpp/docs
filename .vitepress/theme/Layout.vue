<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import DefaultTheme from "vitepress/theme";
import { useRoute } from "vitepress";
import Breadcrumb from "./Breadcrumb.vue";

const { Layout } = DefaultTheme;
const route = useRoute();

const showBanner = ref(true);
const isDark = ref(true);

const navLinks = [
  { text: "Guides", href: "/guides/getting-started" },
  { text: "Packages", href: "/packages/" },
  { text: "API", href: "/api/" },
  { text: "Examples", href: "/examples/" },
  { text: "Registry", href: "https://registry.vixcpp.com/browse" },
];

const footerLinks = [
  { text: "Docs", href: "/" },
  { text: "Guides", href: "/guides/getting-started" },
  { text: "Packages", href: "/packages/" },
  { text: "API", href: "/api/" },
  { text: "Examples", href: "/examples/" },
  { text: "Registry", href: "https://registry.vixcpp.com/browse" },
  { text: "GitHub", href: "https://github.com/rixcpp/rix" },
];

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/rixcpp/rix",
    icon: `<path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.48 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.9-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.2 9.2 0 0 1 12 7.07c.85 0 1.71.12 2.51.35 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.64 1.03 2.76 0 3.93-2.34 4.79-4.57 5.05.36.32.68.95.68 1.92 0 1.38-.01 2.5-.01 2.84 0 .27.18.59.69.48A10.04 10.04 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"/>`,
  },
  {
    label: "X",
    href: "https://x.com/vix_cpp",
    icon: `<path d="M18.9 2H22l-6.8 7.8L23 22h-6.7l-5.2-6.8L5.3 22H2l7.3-8.4L1.7 2h6.9l4.7 6.1L18.9 2Zm-1.2 18h1.7L7.7 3.9H5.9L17.7 20Z"/>`,
  },
];

const normalizePath = (path) => {
  if (!path) return "/";

  const clean = path.split("#")[0].split("?")[0];

  if (clean.length > 1 && clean.endsWith("/")) {
    return clean.slice(0, -1);
  }

  return clean;
};

const isActiveLink = (href) => {
  if (!href || href.startsWith("http")) {
    return false;
  }

  const currentPath = normalizePath(route.path);
  const targetPath = normalizePath(href);

  if (targetPath === "/") {
    return currentPath === "/";
  }

  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
};

const openSearch = () => {
  const searchButton = document.querySelector(
    ".DocSearch-Button, .VPNavBarSearchButton, .VPLocalSearchBox button",
  );

  if (searchButton instanceof HTMLElement) {
    searchButton.click();
  }
};

const applyTheme = (dark) => {
  isDark.value = dark;

  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem("vitepress-theme-appearance", dark ? "dark" : "light");
};

const toggleTheme = () => {
  applyTheme(!isDark.value);
};

const syncHeaderState = async () => {
  await nextTick();

  document.body.classList.toggle("rix-banner-visible", showBanner.value);
  document.body.classList.toggle("rix-banner-hidden", !showBanner.value);
};

const closeBanner = () => {
  showBanner.value = false;
};

watch(showBanner, () => {
  syncHeaderState();
});

onMounted(() => {
  const savedTheme = localStorage.getItem("vitepress-theme-appearance");

  if (savedTheme === "dark") {
    applyTheme(true);
  } else if (savedTheme === "light") {
    applyTheme(false);
  } else {
    isDark.value = document.documentElement.classList.contains("dark");
  }

  syncHeaderState();
});

onBeforeUnmount(() => {
  document.body.classList.remove("rix-banner-visible", "rix-banner-hidden");
});
</script>

<template>
  <header class="rix-nav">
    <div v-if="showBanner" class="rix-nav__banner">
      <span class="rix-nav__banner-mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="rix-banner-bg" cx="50%" cy="42%" r="70%">
              <stop offset="0%" stop-color="#141922" />
              <stop offset="58%" stop-color="#080B10" />
              <stop offset="100%" stop-color="#030509" />
            </radialGradient>

            <linearGradient
              id="rix-banner-white"
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
              id="rix-banner-blue"
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

          <rect width="64" height="64" rx="16" fill="url(#rix-banner-bg)" />

          <g
            stroke="url(#rix-banner-white)"
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

          <circle cx="32.3" cy="30.8" r="4.2" fill="url(#rix-banner-blue)" />
        </svg>
      </span>

      <span>Rix is the official package layer for Vix.cpp</span>

      <a
        href="https://registry.vixcpp.com/ns/rix"
        target="_blank"
        rel="noreferrer"
        aria-label="Browse Rix packages in the Vix.cpp registry"
      >
        Browse packages
      </a>

      <button
        class="rix-nav__banner-close"
        type="button"
        aria-label="Close announcement"
        @click="closeBanner"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>

    <div class="rix-nav__bar">
      <div class="rix-nav__inner">
        <a class="rix-nav__brand" href="/" aria-label="Rix Documentation">
          <span class="rix-nav__brand-mark" aria-hidden="true">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="rix-brand-bg" cx="50%" cy="42%" r="70%">
                  <stop offset="0%" stop-color="#141922" />
                  <stop offset="58%" stop-color="#080B10" />
                  <stop offset="100%" stop-color="#030509" />
                </radialGradient>

                <linearGradient
                  id="rix-brand-white"
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
                  id="rix-brand-blue"
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

              <rect width="64" height="64" rx="16" fill="url(#rix-brand-bg)" />

              <g
                stroke="url(#rix-brand-white)"
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

              <circle cx="32.3" cy="30.8" r="4.2" fill="url(#rix-brand-blue)" />
            </svg>
          </span>

          <span class="rix-nav__brand-name">Rix</span>
          <span class="rix-nav__slash">/</span>
          <span class="rix-nav__docs">Docs</span>
        </a>

        <nav class="rix-nav__links" aria-label="Main navigation">
          <a
            v-for="link in navLinks"
            :key="link.text"
            :class="['rix-nav__link', { 'is-active': isActiveLink(link.href) }]"
            :href="link.href"
            :target="link.href.startsWith('http') ? '_blank' : undefined"
            :rel="link.href.startsWith('http') ? 'noreferrer' : undefined"
          >
            {{ link.text }}
          </a>
        </nav>

        <div class="rix-nav__right">
          <button
            class="rix-nav__theme"
            type="button"
            :aria-label="
              isDark ? 'Switch to light theme' : 'Switch to dark theme'
            "
            @click="toggleTheme"
          >
            <svg
              v-if="isDark"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path d="M12 4V2" />
              <path d="M12 22v-2" />
              <path d="m4.93 4.93-1.41-1.41" />
              <path d="m20.48 20.48-1.41-1.41" />
              <path d="M4 12H2" />
              <path d="M22 12h-2" />
              <path d="m4.93 19.07-1.41 1.41" />
              <path d="m20.48 3.52-1.41 1.41" />
              <circle cx="12" cy="12" r="4" />
            </svg>

            <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.8 6.8 0 0 0 9.8 9.8Z" />
            </svg>
          </button>

          <a
            v-for="item in socials"
            :key="item.label"
            class="rix-nav__icon"
            :href="item.href"
            target="_blank"
            rel="noreferrer"
            :aria-label="item.label"
          >
            <svg
              class="rix-nav__social-svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
              v-html="item.icon"
            ></svg>
          </a>

          <button
            class="rix-nav__search"
            type="button"
            aria-label="Search"
            @click="openSearch"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>

            <span>Search Docs</span>
            <kbd>Ctrl K</kbd>
          </button>
        </div>
      </div>
    </div>
  </header>

  <div class="rix-doc-shell">
    <Layout>
      <template #doc-before>
        <Breadcrumb />
      </template>

      <template #layout-bottom>
        <footer class="rix-footer" role="contentinfo">
          <div class="rix-footer-inner">
            <div class="rix-footer-brand">
              <span class="rix-footer-name">Rix</span>
              <span class="rix-footer-desc">
                Official package namespace for optional Vix.cpp libraries.
              </span>
            </div>

            <nav class="rix-footer-nav" aria-label="Footer navigation">
              <a
                v-for="link in footerLinks"
                :key="link.text"
                class="rix-footer-link"
                :href="link.href"
                :target="link.href.startsWith('http') ? '_blank' : undefined"
                :rel="link.href.startsWith('http') ? 'noreferrer' : undefined"
              >
                {{ link.text }}
              </a>
            </nav>
          </div>

          <div class="rix-footer-meta">
            <span>MIT License</span>
            <span>Copyright © 2026 Rix</span>
            <span>Built for the Vix.cpp ecosystem</span>
          </div>
        </footer>
      </template>
    </Layout>
  </div>
</template>

<style>
:root {
  --rix-doc-sidebar-width: 300px;
  --rix-accent: #0061ff;
  --rix-accent-soft: rgba(0, 97, 255, 0.16);
}

@media (min-width: 1440px) {
  :root {
    --rix-doc-sidebar-width: 320px;
  }
}

.VPNav {
  display: none !important;
}

.VPFooter {
  display: none !important;
}

.VPContent {
  padding-top: 0 !important;
}

/* ============================================================
   Rix custom docs header
   ============================================================ */

.rix-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  width: 100%;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg) !important;
  border-bottom: 1px solid var(--vp-c-divider);
}

.rix-nav__banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 42px;
  padding: 8px 56px;
  color: var(--vp-c-text-1);
  background:
    radial-gradient(circle at 50% 0%, rgba(0, 97, 255, 0.14), transparent 42%),
    var(--vp-c-bg) !important;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 13px;
  font-weight: 650;
  line-height: 1.2;
  text-align: center;
}

.rix-nav__banner a {
  color: #1684ff !important;
  font-weight: 760;
  text-decoration: underline !important;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 4px;
  white-space: nowrap;
}

.rix-nav__banner a:hover {
  color: #5ea8ff !important;
  text-decoration: underline !important;
}

.rix-nav__banner-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 3px;
  flex-shrink: 0;
}

.rix-nav__banner-mark svg {
  display: block;
  width: 24px;
  height: 24px;
  filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.28));
}

.rix-nav__banner-close {
  position: absolute;
  top: 50%;
  right: 16px;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  color: var(--vp-c-text-2);
  background: transparent;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  transform: translateY(-50%);
}

.rix-nav__banner-close:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.rix-nav__banner-close span {
  font-size: 24px;
  line-height: 1;
}

.rix-nav__bar {
  height: 60px;
  background: var(--vp-c-bg) !important;
}

.rix-nav__inner {
  display: grid;
  grid-template-columns: minmax(0, auto) minmax(0, 1fr) auto;
  align-items: center;
  gap: 26px;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  padding: 0 18px;
  background: var(--vp-c-bg) !important;
}

.rix-nav__brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
  color: var(--vp-c-text-1);
  text-decoration: none;
  white-space: nowrap;
}

.rix-nav__brand:hover {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.rix-nav__brand-mark {
  display: inline-flex;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
}

.rix-nav__brand-mark svg {
  display: block;
  width: 30px;
  height: 30px;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.24));
}

.rix-nav__brand-name {
  font-size: 17px;
  font-weight: 780;
  letter-spacing: -0.035em;
}

.rix-nav__slash {
  color: var(--vp-c-text-2);
  font-size: 18px;
  font-weight: 500;
}

.rix-nav__docs {
  color: var(--vp-c-text-1);
  font-size: 17px;
  font-weight: 720;
  letter-spacing: -0.03em;
}

.rix-nav__links {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 18px;
  min-width: 0;
  overflow: hidden;
}

.rix-nav__link {
  position: relative;
  display: inline-flex;
  align-items: center;
  color: var(--vp-c-text-2);
  font-size: 13.5px;
  font-weight: 620;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  transition:
    color 0.14s ease,
    background-color 0.14s ease;
}

.rix-nav__link:hover {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.rix-nav__link.is-active {
  color: var(--vp-c-text-1) !important;
  font-weight: 760 !important;
}

.rix-nav__link.is-active::after {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: -10px;
  height: 2px;
  border-radius: 999px;
  background: var(--rix-accent);
}

.rix-nav__right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  min-width: 0;
}

.rix-nav__theme,
.rix-nav__icon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  color: var(--vp-c-text-1) !important;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  opacity: 1 !important;
  flex-shrink: 0;
  transition:
    background 0.14s ease,
    border-color 0.14s ease,
    transform 0.14s ease;
}

.rix-nav__theme {
  border-radius: 999px;
}

.rix-nav__theme:hover,
.rix-nav__icon:hover {
  background: var(--vp-c-bg-alt);
  border-color: var(--rix-accent);
  transform: translateY(-1px);
}

.rix-nav__theme svg {
  width: 15px;
  height: 15px;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.rix-nav__social-svg {
  display: block;
  width: 17px;
  height: 17px;
  color: currentColor !important;
  fill: currentColor !important;
}

.rix-nav__social-svg path {
  fill: currentColor !important;
}

.rix-nav__search {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  height: 36px;
  padding: 0 12px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  flex-shrink: 0;
}

.rix-nav__search:hover {
  background: var(--vp-c-bg-alt);
  border-color: var(--rix-accent);
}

.rix-nav__search svg {
  width: 17px;
  height: 17px;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.rix-nav__search span {
  font-size: 13px;
  font-weight: 650;
  white-space: nowrap;
}

.rix-nav__search kbd {
  color: var(--vp-c-text-2);
  background: transparent;
  border: 0;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

/* ============================================================
   Rix docs footer
   ============================================================ */

.rix-footer {
  position: relative;
  flex-shrink: 0;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.rix-footer-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 18px 32px 14px;
  display: grid;
  grid-template-columns: minmax(220px, auto) 1fr;
  align-items: center;
  gap: 24px;
}

.rix-footer-brand {
  min-width: 0;
}

.rix-footer-name {
  display: block;
  font-size: 13px;
  line-height: 1.3;
  font-weight: 760;
  letter-spacing: -0.015em;
  color: var(--vp-c-text-1);
}

.rix-footer-desc {
  display: block;
  margin-top: 3px;
  font-size: 12px;
  line-height: 1.45;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.rix-footer-nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
  flex-wrap: wrap;
}

.rix-footer-link {
  font-size: 12px;
  line-height: 1.4;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.12s ease;
}

.rix-footer-link:hover {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.rix-footer-meta {
  position: relative;
  max-width: 1180px;
  margin: 0 auto;
  padding: 10px 32px 16px;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 18px;
  flex-wrap: wrap;
  font-size: 11.5px;
  line-height: 1.45;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.rix-footer-meta::before {
  content: "";
  position: absolute;
  top: 0;
  left: calc(-1 * var(--rix-doc-sidebar-width, 300px));
  right: 0;
  height: 1px;
  background: var(--vp-c-divider);
}

/* Medium screens */
@media (max-width: 1180px) {
  .rix-nav__inner {
    gap: 18px;
  }

  .rix-nav__links {
    gap: 14px;
  }

  .rix-nav__link {
    font-size: 13px;
  }

  .rix-nav__search span {
    display: none;
  }
}

/* Desktop footer alignment with VitePress sidebar */
@media (min-width: 960px) {
  .rix-footer {
    margin-left: 0 !important;
    padding-left: var(--rix-doc-sidebar-width, 300px);
    border-left: 0 !important;
  }

  .rix-footer-inner,
  .rix-footer-meta {
    max-width: none;
    margin-left: 0;
    margin-right: 0;
  }
}

@media (min-width: 1440px) {
  .rix-footer {
    padding-left: var(--rix-doc-sidebar-width, 320px);
  }

  .rix-footer-meta::before {
    left: calc(-1 * var(--rix-doc-sidebar-width, 320px));
  }
}

/* Tablet */
@media (max-width: 980px) {
  .rix-nav__bar {
    height: auto;
    min-height: 58px;
  }

  .rix-nav__inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 14px;
    padding: 12px 14px;
  }

  .rix-nav__brand {
    order: 1;
    flex: 1 1 auto;
  }

  .rix-nav__right {
    order: 2;
    flex: 0 0 auto;
  }

  .rix-nav__links {
    order: 3;
    flex: 1 1 100%;
    width: 100%;
    gap: 8px;
    overflow-x: auto;
    padding: 4px 0 2px;
    scrollbar-width: none;
  }

  .rix-nav__links::-webkit-scrollbar {
    display: none;
  }

  .rix-nav__link {
    padding: 8px 10px;
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    border-radius: 999px;
    font-size: 12.5px;
    flex-shrink: 0;
  }

  .rix-nav__link.is-active::after {
    display: none;
  }

  .rix-nav__link.is-active {
    border-color: var(--rix-accent);
    background: var(--rix-accent-soft);
  }

  .rix-nav__search {
    width: 32px;
    height: 32px;
    padding: 0;
    justify-content: center;
  }

  .rix-nav__search kbd {
    display: none;
  }
}

@media (max-width: 959px) {
  .rix-footer {
    margin-left: 0 !important;
    padding-left: 0 !important;
    border-left: 0;
  }

  .rix-footer-meta::before {
    left: 0;
  }
}

/* Mobile */
@media (max-width: 640px) {
  .rix-nav__banner {
    justify-content: flex-start;
    min-height: 38px;
    padding: 8px 44px 8px 12px;
    font-size: 11.5px;
    text-align: left;
  }

  .rix-nav__banner-mark {
    width: 22px;
    height: 22px;
  }

  .rix-nav__banner-mark svg {
    width: 22px;
    height: 22px;
  }

  .rix-nav__banner-close {
    right: 10px;
    width: 28px;
    height: 28px;
  }

  .rix-nav__inner {
    padding: 10px 12px;
  }

  .rix-nav__brand-mark {
    width: 28px;
    height: 28px;
  }

  .rix-nav__brand-mark svg {
    width: 28px;
    height: 28px;
  }

  .rix-nav__brand-name {
    font-size: 15.5px;
    font-weight: 780;
  }

  .rix-nav__slash,
  .rix-nav__docs {
    display: none;
  }

  .rix-nav__theme,
  .rix-nav__icon,
  .rix-nav__search {
    width: 30px;
    height: 30px;
  }

  .rix-nav__right {
    gap: 6px;
  }
}

@media (max-width: 760px) {
  .rix-footer-inner {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 16px 18px 12px;
  }

  .rix-footer-nav {
    justify-content: flex-start;
    gap: 14px;
  }

  .rix-footer-meta {
    padding: 10px 18px 14px;
    gap: 10px;
  }
}

/* Small mobile */
@media (max-width: 420px) {
  .rix-nav__banner {
    gap: 4px;
    font-size: 11px;
  }

  .rix-nav__banner a {
    max-width: 116px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rix-nav__inner {
    gap: 8px;
  }

  .rix-nav__link {
    padding: 7px 9px;
    font-size: 12px;
  }
}

@media (max-width: 460px) {
  .rix-footer-nav {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
  }

  .rix-footer-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}

.rix-doc-shell {
  padding-top: 118px;
}

body.rix-banner-hidden .rix-doc-shell {
  padding-top: 78px;
}

@media (max-width: 980px) {
  .rix-doc-shell {
    padding-top: 132px;
  }

  body.rix-banner-hidden .rix-doc-shell {
    padding-top: 92px;
  }
}

@media (max-width: 640px) {
  .rix-doc-shell {
    padding-top: 122px;
  }

  body.rix-banner-hidden .rix-doc-shell {
    padding-top: 84px;
  }
}
</style>
